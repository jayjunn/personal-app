import { chromium } from 'playwright-core';
import path from 'path';
import readline from 'readline';

const USER_DATA_DIR = path.resolve(process.cwd(), '.insta_chrome_profile');
const TARGET_USERNAME = 'pau.liine._';
const PROFILE_URL = 'https://www.instagram.com/pau.liine._';

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

// 모달 내부에서 댓글 좋아요 처리 (빠르게 상단부터 하트 클릭)
async function processCommentsInDialog(page, targetAuthor) {
  const dialog = page.locator("div[role='dialog']");
  let totalLikedInPost = 0;
  const clickedSignatures = new Set();

  let commentBox = dialog.locator("ul:has(li)").first();
  if (!await commentBox.isVisible().catch(() => false)) {
    commentBox = dialog;
  }

  let noNewCommentsLoop = 0;

  while (noNewCommentsLoop < 2) {
    // 모달 내 댓글 하트 SVG 수집
    const svgs = await dialog.locator("li svg[aria-label='Like'], li svg[aria-label='좋아요']").all();
    let batchLiked = 0;

    for (const svg of svgs) {
      try {
        if (!await svg.isVisible().catch(() => false)) continue;

        const liCount = await svg.locator("xpath=./ancestor::li[1]").count();
        if (liCount === 0) continue;
        const commentRow = svg.locator("xpath=./ancestor::li[1]");

        // [대댓글 제외 체크]
        const isReply = await svg.locator("xpath=./ancestor::li[1]/parent::ul/parent::li").count() > 0;
        if (isReply) continue;

        // 댓글 작성자 아이디 추출
        let commenterId = '';
        const userLinks = await commentRow.locator("a[href^='/']:not([href*='/p/']):not([href*='/reel/']):not([href*='/explore/'])").all();
        for (const link of userLinks) {
          const href = await link.getAttribute('href').catch(() => '');
          if (href) {
            const clean = href.replace(/\//g, '').split('?')[0].trim().toLowerCase();
            if (clean && clean.length > 1 && clean !== 'explore' && clean !== 'reels') {
              commenterId = clean;
              break;
            }
          }
          const text = (await link.innerText().catch(() => '')).trim().toLowerCase();
          if (text && text.length > 1) {
            commenterId = text;
            break;
          }
        }

        const rowText = (await commentRow.innerText().catch(() => '')).trim();

        // [글쓴이 본인 제외 조건]
        if (commenterId === targetAuthor.toLowerCase() ||
            (targetAuthor && commenterId.includes(targetAuthor.toLowerCase())) ||
            rowText.includes('Author') ||
            rowText.includes('작성자')) {
          continue;
        }

        // 중복 방지 시그니처
        const sig = `${commenterId}_${rowText.slice(0, 25)}`;
        if (clickedSignatures.has(sig)) continue;
        clickedSignatures.add(sig);

        // 마우스 좌표 클릭으로 즉시 좋아요
        const box = await svg.boundingBox().catch(() => null);
        if (!box) continue;

        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await sleep(50);
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

        totalLikedInPost++;
        batchLiked++;
        console.log(`    ❤️ [이 글 ${totalLikedInPost}개째] @${commenterId || '익명'} 님의 일반 댓글 좋아요 완료! ✅`);

        // 바로바로 빠른 딜레이 (0.8 ~ 1.3초)
        await sleep(randomRange(800, 1300));

      } catch (e) {
        continue;
      }
    }

    if (batchLiked === 0) {
      noNewCommentsLoop++;
    } else {
      noNewCommentsLoop = 0;
    }

    // 추가 댓글 더보기 클릭
    const nextMore = dialog.locator("span:has-text('View more comments'), span:has-text('댓글 더 보기'), span:has-text('댓글 모두 보기'), svg[aria-label*='Load more' i], button:has-text('더 보기')").first();
    if (await nextMore.isVisible().catch(() => false)) {
      await nextMore.click().catch(() => {});
      await sleep(800);
    }

    // 아래로 스크롤하여 더 많은 댓글 로딩
    await commentBox.hover().catch(() => {});
    await page.mouse.wheel(0, 600);
    await sleep(600);
  }

  return totalLikedInPost;
}

// 모달 닫기
async function closeDialog(page) {
  const dialog = page.locator("div[role='dialog']");
  if (!await dialog.isVisible().catch(() => false)) return;

  await page.keyboard.press('Escape').catch(() => {});
  await sleep(500);

  if (await dialog.isVisible().catch(() => false)) {
    const closeBtn = dialog.locator("svg[aria-label='Close'], svg[aria-label='닫기']").first();
    if (await closeBtn.isVisible().catch(() => false)) {
      await closeBtn.click().catch(() => {});
      await sleep(500);
    }
  }
}

async function main() {
  console.log('='.repeat(65));
  console.log(`📸 [@${TARGET_USERNAME} 프로필 피드 전체 탐색 & 고속 댓글 좋아요]`);
  console.log(`  1. 프로필 페이지(${PROFILE_URL}) 접속`);
  console.log(`  2. 그리드의 게시물을 상단 최신순부터 1번씩 바로바로 클릭하여 모달 열기`);
  console.log(`  3. 모달 열리자마자 작성자 본인 제외 일반 댓글 전체 고속(0.8~1.3초) 좋아요`);
  console.log(`  4. 완료 즉시 ESC로 닫고 다음 그리드 게시물로 번개처럼 이동`);
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

  console.log(`🌐 @${TARGET_USERNAME} 프로필로 이동: ${PROFILE_URL}`);
  await page.goto(PROFILE_URL, { waitUntil: 'domcontentloaded' });
  await sleep(2500);

  // 로그인 상태 확인
  if (page.url().includes('accounts/login') || await page.locator("input[name='username']").isVisible().catch(() => false)) {
    console.log('\n🔑 [로그인 필요] 크롬 창에서 로그인 후 엔터를 눌러주세요.');
    await askQuestion('로그인 완료 후 Enter: ');
    await sleep(2000);
  } else {
    console.log('✅ 로그인 세션 확인 완료!');
  }

  // 팝업 닫기
  const notNowBtns = page.locator("button:has-text('Not Now'), button:has-text('나중에 하기'), button:has-text('지금 안 함')");
  if (await notNowBtns.count() > 0) {
    await notNowBtns.first().click().catch(() => {});
    await sleep(1000);
  }

  let totalLikesAll = 0;
  let postIdx = 0;
  const processedPosts = new Set();

  while (true) {
    // 프로필 피드 그리드에서 게시물 링크들 수집 (위에서부터 순서대로)
    const postElements = await page.locator("main a[href*='/p/'], main a[href*='/reel/']").all();

    let targetElement = null;
    let targetHref = '';

    for (const el of postElements) {
      const href = await el.getAttribute('href').catch(() => null);
      if (href) {
        const match = href.match(/\/(p|reel)\/([A-Za-z0-9_-]+)/);
        if (match) {
          const key = `/${match[1]}/${match[2]}/`;
          if (!processedPosts.has(key)) {
            processedPosts.add(key);
            targetElement = el;
            targetHref = key;
            break;
          }
        }
      }
    }

    // 만약 화면에 보이는 게시물 중 새로운 게 없으면 피드 아래로 스크롤하여 더 많은 게시물 로드
    if (!targetElement) {
      console.log('⬇️ 피드를 아래로 스크롤하여 다음 게시물들을 불러옵니다...');
      const prevScrollY = await page.evaluate(() => window.scrollY);
      await page.mouse.wheel(0, 1000);
      await sleep(1500);
      const currScrollY = await page.evaluate(() => window.scrollY);

      // 더 이상 스크롤되지 않으면 모든 게시물 완료
      if (Math.abs(currScrollY - prevScrollY) < 10) {
        console.log('🏁 프로필 피드의 끝에 도달했습니다! 모든 게시물 작업 완료.');
        break;
      }
      continue;
    }

    postIdx++;
    console.log(`\n============================================================`);
    console.log(`[게시물 ${postIdx}] 열기: ${targetHref}`);

    try {
      // 해당 그리드 게시물 위치로 스크롤 및 클릭하여 모달 열기
      await targetElement.scrollIntoViewIfNeeded().catch(() => {});
      await sleep(300);
      await targetElement.click({ timeout: 4000 }).catch(() => {});
      await sleep(1500);

      // 모달이 열렸는지 확인
      const dialog = page.locator("div[role='dialog']");
      if (!await dialog.isVisible({ timeout: 4000 }).catch(() => false)) {
        console.log('⚠️ 모달이 열리지 않아 직접 URL로 접속합니다.');
        await page.goto(`https://www.instagram.com${targetHref}`, { waitUntil: 'domcontentloaded' });
        await sleep(2000);
      }

      // 모달 내 댓글 고속 좋아요 실행
      const likedInPost = await processCommentsInDialog(page, TARGET_USERNAME);
      totalLikesAll += likedInPost;

      console.log(`✨ [게시물 ${postIdx}] 완료 (좋아요 ${likedInPost}개) | 총 누적: ${totalLikesAll}개`);

      // 즉시 ESC로 모달 닫기 (그리드로 즉시 복귀)
      await closeDialog(page);
      await sleep(800);

      // 페이지 URL이 다시 프로필이 아니면 프로필로 복귀
      if (!page.url().includes(TARGET_USERNAME)) {
        await page.goto(PROFILE_URL, { waitUntil: 'domcontentloaded' });
        await sleep(1500);
      }

    } catch (err) {
      console.log(`⚠️ 에러 발생:`, err.message);
      await closeDialog(page);
      await sleep(1000);
    }
  }

  console.log(`\n🎉 @${TARGET_USERNAME} 전체 피드 순회 댓글 좋아요 완료! 총 누적: ${totalLikesAll}개`);
}

main().catch(err => {
  console.error('실행 중 에러:', err);
});
