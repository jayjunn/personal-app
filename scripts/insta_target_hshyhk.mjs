import { chromium } from 'playwright-core';
import path from 'path';
import readline from 'readline';

const USER_DATA_DIR = path.resolve(process.cwd(), '.insta_chrome_profile');
const TARGET_PROFILE = 'hshyhk._.y';
const PROFILE_URL = 'https://www.instagram.com/hshyhk._.y?stkn=NjQ1eTlveGRnbmM=';

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

async function main() {
  console.log('='.repeat(65));
  console.log(`📸 [@${TARGET_PROFILE} 게시물 댓글 전체 좋아요 자동화]`);
  console.log(`  1. 대상 프로필: ${PROFILE_URL}`);
  console.log(`  2. 글쓴이 본인(@${TARGET_PROFILE}) 댓글 100% 제외`);
  console.log(`  3. 대댓글 및 게시물 본체 좋아요 100% 제외 (height: 12~16px 댓글 하트만 정확 타겟)`);
  console.log(`  4. 안전 딜레이 유지하며 모든 게시물의 일반 댓글에 좋아요 누르기`);
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

  console.log(`\n🌐 프로필 페이지로 이동합니다: ${PROFILE_URL}`);
  await page.goto(PROFILE_URL, { waitUntil: 'domcontentloaded' });
  await sleep(3000);

  // 로그인 상태 확인
  if (page.url().includes('accounts/login') || await page.locator("input[name='username']").isVisible().catch(() => false)) {
    console.log('\n🔑 [로그인 필요] 크롬 창에서 로그인 후 엔터를 눌러주세요.');
    await askQuestion('로그인 완료 후 Enter: ');
    await sleep(2500);
  } else {
    console.log('✅ 로그인 세션 확인 완료!');
  }

  // 팝업 닫기
  const notNowBtns = page.locator("button:has-text('Not Now'), button:has-text('나중에 하기'), button:has-text('지금 안 함')");
  if (await notNowBtns.count() > 0) {
    await notNowBtns.first().click().catch(() => {});
    await sleep(1000);
  }

  // 피드 아래로 스크롤하며 모든 게시물 수집
  console.log(`\n🔍 @${TARGET_PROFILE} 의 게시물 목록을 스캔합니다...`);
  const postUrls = new Set();
  let prevCount = 0;
  let noNewPostsCount = 0;

  for (let s = 0; s < 12; s++) {
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
      noNewPostsCount++;
      if (noNewPostsCount >= 3) break;
    } else {
      noNewPostsCount = 0;
      prevCount = postUrls.size;
    }

    await page.mouse.wheel(0, 1200);
    await sleep(1500);
  }

  const postList = Array.from(postUrls);
  console.log(`\n📌 총 ${postList.length}개의 게시물을 발견했습니다! 순차적으로 댓글 작업을 시작합니다.\n`);

  let totalLikesAll = 0;
  let postIndex = 0;

  for (const postUrl of postList) {
    postIndex++;
    console.log(`\n============================================================`);
    console.log(`[게시물 ${postIndex}/${postList.length}] 접속: ${postUrl}`);

    try {
      await page.goto(postUrl, { waitUntil: 'domcontentloaded' });
      await sleep(randomRange(2500, 3500));

      // 본문 영역 로드 대기
      await page.waitForSelector("main", { timeout: 10000 }).catch(() => {});

      // 댓글 "더 보기" 버튼이 있으면 클릭해서 추가 댓글 로드
      for (let m = 0; m < 10; m++) {
        const moreBtn = page.locator("main span:has-text('View more comments'), main span:has-text('댓글 더 보기'), main span:has-text('댓글 모두 보기'), main svg[aria-label*='Load more' i], main button:has-text('더 보기')").first();
        if (await moreBtn.isVisible().catch(() => false)) {
          await moreBtn.click().catch(() => {});
          await sleep(randomRange(1000, 1500));
        } else {
          break;
        }
      }

      let totalLikedInThisPost = 0;
      let noNewCommentsLoop = 0;
      const clickedSignatures = new Set();

      while (noNewCommentsLoop < 3) {
        // 댓글 하트 SVG만 정확 타겟:
        // 인스타그램 댓글 하트는 height가 12~16px (본체 하트는 24px)
        const commentSvgs = await page.locator("main svg[aria-label='Like'], main svg[aria-label='좋아요']").all();
        let batchLikedCount = 0;

        for (const svgLocator of commentSvgs) {
          try {
            if (!await svgLocator.isVisible().catch(() => false)) continue;

            // 크기 및 작성자/대댓글 정보 검사
            const info = await svgLocator.evaluate(el => {
              const h = parseInt(el.getAttribute('height') || '0', 10);
              const w = parseInt(el.getAttribute('width') || '0', 10);
              // 본체 하트는 24px이므로 12~16px만 댓글 하트로 인정
              if (h > 18 || w > 18) {
                return { isCommentHeart: false };
              }

              // 댓글 래퍼 탐색
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
                // 대댓글 구조 확인 (ul > li > ul > li)
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

            // 글쓴이 본인 제외 조건
            if (cleanAuthor === TARGET_PROFILE.toLowerCase() || 
                cleanAuthor.includes('hshyhk') ||
                info.text.toLowerCase().includes('author') ||
                info.text.toLowerCase().includes('작성자')) {
              console.log(`    [글쓴이 제외] @${info.author || TARGET_PROFILE} 본인 댓글 스킵`);
              continue;
            }

            // 고유 시그니처 체크 (중복 클릭 방지)
            const signature = `${cleanAuthor}_${info.text.slice(0, 25)}`;
            if (clickedSignatures.has(signature)) continue;
            clickedSignatures.add(signature);

            // 스크롤 및 클릭
            await svgLocator.scrollIntoViewIfNeeded().catch(() => {});
            await svgLocator.hover().catch(() => {});
            await sleep(randomRange(200, 400));
            await svgLocator.click({ force: true }).catch(() => {});

            // 인스타그램 GraphQL 응답 및 렌더링 대기
            await sleep(1500);

            // 활동 제한 팝업 감지
            const actionBlock = page.locator("text='Try again later', text='나중에 다시 시도하세요', text='활동이 제한되었습니다'");
            if (await actionBlock.count() > 0 && await actionBlock.first().isVisible().catch(() => false)) {
              console.log('\n⚠️ [경고] 인스타그램 활동 제한(Action Block) 감지됨! 작업을 안전하게 종료합니다.');
              return;
            }

            totalLikedInThisPost++;
            totalLikesAll++;
            batchLikedCount++;

            console.log(`    ❤️ [이 글 ${totalLikedInThisPost}개 / 총 누적 ${totalLikesAll}개] @${info.author || '익명'} 님의 일반 댓글 좋아요 완료! ✅`);

            // 사람과 유사한 딜레이 (1.8 ~ 3.5초)
            const delay = randomRange(1800, 3500);
            await sleep(delay);

          } catch (e) {
            continue;
          }
        }

        if (batchLikedCount === 0) {
          noNewCommentsLoop++;
        } else {
          noNewCommentsLoop = 0;
        }

        // 추가 댓글 더보기 클릭
        const nextMore = page.locator("main span:has-text('View more comments'), main span:has-text('댓글 더 보기'), main span:has-text('댓글 모두 보기'), main svg[aria-label*='Load more' i], main button:has-text('더 보기')").first();
        if (await nextMore.isVisible().catch(() => false)) {
          await nextMore.click().catch(() => {});
          await sleep(1500);
        }

        // 스크롤 다운
        await page.mouse.wheel(0, 600);
        await sleep(1000);
      }

      console.log(`✨ [게시물 ${postIndex}] 완료 (좋아요 ${totalLikedInThisPost}개) | 총 누적: ${totalLikesAll}개`);

      // 게시물 간 자연스러운 휴식 (6 ~ 12초)
      const postRest = randomRange(6000, 12000);
      console.log(`💤 다음 게시물로 넘어가기 전 ${(postRest/1000).toFixed(1)}초 대기...`);
      await sleep(postRest);

    } catch (err) {
      console.log(`⚠️ 게시물 에러:`, err.message);
      continue;
    }
  }

  console.log(`\n🎉 @${TARGET_PROFILE} 의 모든 게시물 댓글 좋아요 작업 완료! 총 누적: ${totalLikesAll}개`);
}

main().catch(err => {
  console.error('실행 중 에러:', err);
});
