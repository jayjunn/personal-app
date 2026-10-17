import { chromium } from 'playwright-core';
import path from 'path';
import readline from 'readline';

const USER_DATA_DIR = path.resolve(process.cwd(), '.insta_chrome_profile');

// 작업 대상 프로필 순서
const PROFILES = [
  { username: 'seoooojinnn', url: 'https://www.instagram.com/seoooojinnn/' },
  { username: 'hshyhk._.y', url: 'https://www.instagram.com/hshyhk._.y?stkn=NjQ1eTlveGRnbmM=' }
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) =>
    rl.question(query, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}

// 특정 게시물 페이지 내에서 댓글 좋아요 실행 함수
async function processCommentsInPostPage(page, targetAuthor) {
  let totalLikedInPost = 0;
  const clickedSignatures = new Set();

  // 댓글 "더 보기" 버튼 클릭하여 최대한 펼치기
  for (let m = 0; m < 10; m++) {
    const moreBtn = page.locator("main span:has-text('View more comments'), main span:has-text('댓글 더 보기'), main span:has-text('댓글 모두 보기'), main svg[aria-label*='Load more' i], main button:has-text('더 보기')").first();
    if (await moreBtn.isVisible().catch(() => false)) {
      await moreBtn.click().catch(() => {});
      await sleep(randomRange(1000, 1500));
    } else {
      break;
    }
  }

  let noNewCommentsLoop = 0;

  while (noNewCommentsLoop < 3) {
    // 댓글 하트 SVG는 height가 12~16px (본체 하트는 24px)
    const svgs = await page.locator("main svg[aria-label='Like'], main svg[aria-label='좋아요']").all();
    let batchLiked = 0;

    for (const svg of svgs) {
      try {
        if (!await svg.isVisible().catch(() => false)) continue;

        // 크기 및 작성자/대댓글 정보 검사
        const info = await svg.evaluate(el => {
          const h = parseInt(el.getAttribute('height') || '0', 10);
          const w = parseInt(el.getAttribute('width') || '0', 10);
          // 12~16px만 댓글 하트
          if (h > 18 || w > 18) {
            return { isCommentHeart: false };
          }

          let curr = el.parentElement;
          let author = "";
          let text = "";
          let isReply = false;

          while (curr && curr.tagName !== "MAIN") {
            const userLink = curr.querySelector("h3 a, h2 a, a[href^='/']:not([href*='/p/']):not([href*='/reel/'])");
            if (userLink && !author) {
              author = (userLink.innerText || userLink.getAttribute('href') || '').trim();
            }
            if (curr.innerText && curr.innerText.length > 5 && !text) {
              text = curr.innerText.trim();
            }
            if (curr.tagName === 'LI' && curr.parentElement && curr.parentElement.parentElement && curr.parentElement.parentElement.tagName === 'LI') {
              isReply = true;
            }
            curr = curr.parentElement;
          }
          return { isCommentHeart: true, author, text: text.slice(0, 100), isReply };
        }).catch(() => null);

        if (!info || !info.isCommentHeart) continue;
        if (info.isReply) continue; // 대댓글 스킵

        const cleanAuthor = (info.author || '').replace(/[\/@\s]/g, '').toLowerCase();

        // [글쓴이 본인 제외 조건]
        if (cleanAuthor === targetAuthor.toLowerCase() ||
            (targetAuthor && cleanAuthor.includes(targetAuthor.toLowerCase())) ||
            info.text.toLowerCase().includes('author') ||
            info.text.toLowerCase().includes('작성자')) {
          console.log(`    [글쓴이 제외] @${info.author || targetAuthor} 본인 댓글 건너뜁니다.`);
          continue;
        }

        // 중복 방지 시그니처
        const sig = `${cleanAuthor}_${info.text.slice(0, 25)}`;
        if (clickedSignatures.has(sig)) continue;
        clickedSignatures.add(sig);

        // 클릭
        await svg.scrollIntoViewIfNeeded().catch(() => {});
        await svg.hover().catch(() => {});
        await sleep(randomRange(200, 350));
        await svg.click({ force: true }).catch(() => {});

        // 응답 대기
        await sleep(1500);

        // 활동 제한 팝업 감지
        const actionBlock = page.locator("text='Try again later', text='나중에 다시 시도하세요', text='활동이 제한되었습니다'");
        if (await actionBlock.count() > 0 && await actionBlock.first().isVisible().catch(() => false)) {
          console.log('\n⚠️ [경고] 인스타그램 활동 제한(Action Block) 감지됨! 정지합니다.');
          return { totalLikedInPost, blocked: true };
        }

        totalLikedInPost++;
        batchLiked++;
        console.log(`    ❤️ [${totalLikedInPost}개째] @${info.author || '익명'} 님의 일반 댓글 좋아요 성공! ✅`);

        // 자연스러운 딜레이 (사람처럼 1.8~3.2초)
        const delay = randomRange(1800, 3200);
        await sleep(delay);

      } catch (e) {
        continue;
      }
    }

    if (batchLiked === 0) {
      noNewCommentsLoop++;
    } else {
      noNewCommentsLoop = 0;
    }

    // 추가 더보기 버튼 시도
    const nextMore = page.locator("main span:has-text('View more comments'), main span:has-text('댓글 더 보기'), main span:has-text('댓글 모두 보기'), main svg[aria-label*='Load more' i], main button:has-text('더 보기')").first();
    if (await nextMore.isVisible().catch(() => false)) {
      await nextMore.click().catch(() => {});
      await sleep(1500);
    }

    await page.mouse.wheel(0, 600);
    await sleep(1000);
  }

  return { totalLikedInPost, blocked: false };
}

async function runProfile(page, profile) {
  console.log(`\n============================================================`);
  console.log(`🎯 [타겟 프로필 시작] @${profile.username}`);
  console.log(`🌐 URL: ${profile.url}`);
  console.log(`============================================================`);

  await page.goto(profile.url, { waitUntil: 'domcontentloaded' });
  await sleep(3000);

  // 팝업 닫기
  const notNowBtns = page.locator("button:has-text('Not Now'), button:has-text('나중에 하기'), button:has-text('지금 안 함')");
  if (await notNowBtns.count() > 0) {
    await notNowBtns.first().click().catch(() => {});
    await sleep(1000);
  }

  // 모든 게시물 수집
  console.log(`🔍 @${profile.username} 의 게시물을 스캔 중...`);
  const postUrls = new Set();
  let prevCount = 0;
  let noNewCount = 0;

  for (let s = 0; s < 10; s++) {
    const postLinks = await page.locator("a[href*='/p/'], a[href*='/reel/']").all();
    for (const link of postLinks) {
      const href = await link.getAttribute('href').catch(() => null);
      if (href) {
        const match = href.match(/\/(p|reel)\/([A-Za-z0-9_-]+)/);
        if (match) {
          postUrls.add(`https://www.instagram.com/${match[1]}/${match[2]}/`);
        }
      }
    }

    if (postUrls.size === prevCount) {
      noNewCount++;
      if (noNewCount >= 3) break;
    } else {
      noNewCount = 0;
      prevCount = postUrls.size;
    }

    await page.mouse.wheel(0, 1200);
    await sleep(1500);
  }

  const postList = Array.from(postUrls);
  console.log(`📌 발견된 게시물 수: ${postList.length}개`);

  if (postList.length === 0) {
    console.log(`⚠️ 게시물을 찾을 수 없습니다.`);
    return 0;
  }

  let totalLikesForThisProfile = 0;
  let pIdx = 0;

  for (const postUrl of postList) {
    pIdx++;
    console.log(`\n------------------------------------------------------------`);
    console.log(`[@${profile.username} 게시물 ${pIdx}/${postList.length}] ${postUrl}`);

    try {
      await page.goto(postUrl, { waitUntil: 'domcontentloaded' });
      await sleep(randomRange(2500, 3500));
      await page.waitForSelector("main", { timeout: 10000 }).catch(() => {});

      const result = await processCommentsInPostPage(page, profile.username);
      totalLikesForThisProfile += result.totalLikedInPost;

      console.log(`✨ [게시물 ${pIdx}] 완료 (좋아요 ${result.totalLikedInPost}개) | @${profile.username} 누적: ${totalLikesForThisProfile}개`);

      if (result.blocked) {
        console.log(`⚠️ 활동 제한 감지로 프로필 작업을 중단합니다.`);
        return totalLikesForThisProfile;
      }

      // 게시물 간 딜레이 (6~12초)
      const rest = randomRange(6000, 12000);
      console.log(`💤 다음 게시물로 넘어가기 전 ${(rest/1000).toFixed(1)}초 대기...`);
      await sleep(rest);

    } catch (err) {
      console.log(`⚠️ 게시물 에러:`, err.message);
      continue;
    }
  }

  console.log(`\n🎉 @${profile.username} 완료! 총 좋아요: ${totalLikesForThisProfile}개`);
  return totalLikesForThisProfile;
}

async function main() {
  console.log('='.repeat(65));
  console.log('📸 [인스타그램 타겟 프로필 순차 댓글 좋아요 봇]');
  console.log(`  1. 첫 번째: @${PROFILES[0].username} (게시물 댓글 전체 좋아요 후 완료)`);
  console.log(`  2. 두 번째: @${PROFILES[1].username} (첫 번째 완료 후 바로 자동 진행)`);
  console.log('  3. 원글 작성자 본인 댓글은 100% 제외');
  console.log('  4. 대댓글 및 게시물 본체 제외, 오직 일반 댓글에만 좋아요');
  console.log('='.repeat(65));

  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1280, height: 900 },
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-default-browser-check'
    ]
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  // 로그인 상태 확인
  await page.goto('https://www.instagram.com/', { waitUntil: 'domcontentloaded' });
  await sleep(2500);

  if (page.url().includes('accounts/login') || await page.locator("input[name='username']").isVisible().catch(() => false)) {
    console.log('\n🔑 [로그인 필요] 크롬 창에서 로그인 후 엔터를 눌러주세요.');
    await askQuestion('로그인 완료 후 Enter: ');
    await sleep(2500);
  } else {
    console.log('✅ 로그인 세션 확인 완료!');
  }

  let grandTotal = 0;

  // 순차 실행: 첫 번째 seoooojinnn -> 끝나면 두 번째 hshyhk._.y
  for (const profile of PROFILES) {
    const likes = await runProfile(page, profile);
    grandTotal += likes;

    console.log(`\n☕ 프로필 전환 중... 10초 휴식 후 다음 프로필로 이동합니다.`);
    await sleep(10000);
  }

  console.log(`\n🎊 [모든 타겟 완료] 총 누적 댓글 좋아요: ${grandTotal}개`);
}

main().catch(err => {
  console.error('실행 중 에러:', err);
});
