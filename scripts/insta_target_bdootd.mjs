import { chromium } from 'playwright-core';
import path from 'path';

const USER_DATA_DIR = path.resolve(process.cwd(), '.insta_chrome_profile');
const TARGET_USERNAME = 'b_d_ootd';
const PROFILE_URL = 'https://www.instagram.com/b_d_ootd/';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

// 모달 내부 또는 단일 페이지에서 '댓글' 좋아요 처리 (본체 좋아요 절대 금지)
async function processComments(page, targetAuthor) {
  let totalLikedInPost = 0;
  const clickedSignatures = new Set();
  let noNewCommentsLoop = 0;

  while (noNewCommentsLoop < 2) {
    // 1. "댓글 더 보기" 또는 "+" 아이콘/버튼이 있으면 클릭
    const loadMore = await page.locator("svg[aria-label='댓글 더 읽어보기'], svg[aria-label='Load more comments'], span:has-text('댓글 더 보기'), span:has-text('View more comments'), button:has-text('댓글 더 읽어보기')").all();
    for (const btn of loadMore) {
      if (await btn.isVisible().catch(() => false)) {
        await btn.click({ force: true }).catch(() => {});
        await sleep(1000);
      }
    }

    // 2. 현재 가시 영역의 댓글 하트들 추출 (본체 24x24 제외, 16x16만)
    const commentLikeInfo = await page.evaluate((authorToExclude) => {
      const svgs = Array.from(document.querySelectorAll("svg[aria-label='Like'], svg[aria-label='좋아요']"));
      const targets = [];

      for (let i = 0; i < svgs.length; i++) {
        const svg = svgs[i];
        const rect = svg.getBoundingClientRect();
        // 댓글 하트는 16x16, 게시물 본체 하트는 24x24 이상이므로 20 이하만 엄격 필터
        if (rect.width > 20 || rect.height > 20 || rect.width === 0) continue;

        // 댓글 행 탐색
        let row = svg;
        for (let j = 0; j < 8; j++) {
          if (row.parentElement) row = row.parentElement;
        }

        const rowText = (row ? row.innerText : '').trim();
        const firstLine = rowText.split('\n')[0].trim();
        const commenter = firstLine.toLowerCase();

        // 글쓴이 본인 제외 조건
        if (
          commenter === authorToExclude.toLowerCase() ||
          commenter.includes(authorToExclude.toLowerCase()) ||
          rowText.includes('Author') ||
          rowText.includes('작성자')
        ) {
          continue;
        }

        const sig = `${commenter}_${rowText.slice(0, 30)}`;

        targets.push({
          sig,
          commenter,
          sampleText: rowText.slice(0, 35).replace(/\n/g, ' '),
          x: rect.x + rect.width / 2,
          y: rect.y + rect.height / 2
        });
      }

      return targets;
    }, targetAuthor);

    let batchLiked = 0;

    for (const item of commentLikeInfo) {
      if (clickedSignatures.has(item.sig)) continue;

      try {
        await page.mouse.move(item.x, item.y);
        await sleep(40);
        await page.mouse.click(item.x, item.y);

        clickedSignatures.add(item.sig);
        totalLikedInPost++;
        batchLiked++;
        console.log(`    ❤️ [이 글 댓글 ${totalLikedInPost}개째] @${item.commenter || '유저'}: "${item.sampleText}"`);

        // 적절한 빠른 속도 (0.7 ~ 1.2초)
        await sleep(randomRange(700, 1200));
      } catch (e) {
        // 무시하고 진행
      }
    }

    if (batchLiked === 0) {
      noNewCommentsLoop++;
    } else {
      noNewCommentsLoop = 0;
    }

    // 3. 댓글 스크롤 영역 아래로 살짝 스크롤
    await page.evaluate(() => {
      const allDivs = Array.from(document.querySelectorAll('div'));
      const scrollable = allDivs.find(d => d.scrollHeight > d.clientHeight && d.clientHeight >= 250 && d.clientHeight <= 700);
      if (scrollable) {
        scrollable.scrollTop += 500;
        return;
      }
      window.scrollBy(0, 500);
    });

    await sleep(800);
  }

  return totalLikedInPost;
}

// 모달 닫기
async function closeDialog(page) {
  const dialog = page.locator("div[role='dialog']");
  if (!await dialog.isVisible().catch(() => false)) return;

  await page.keyboard.press('Escape').catch(() => {});
  await sleep(400);

  if (await dialog.isVisible().catch(() => false)) {
    const closeBtn = dialog.locator("svg[aria-label='Close'], svg[aria-label='닫기']").first();
    if (await closeBtn.isVisible().catch(() => false)) {
      await closeBtn.click().catch(() => {});
      await sleep(400);
    }
  }
}

async function main() {
  console.log('='.repeat(65));
  console.log(`📸 [@${TARGET_USERNAME} 프로필 게시물 최신순 순회 '댓글' 좋아요 45분 실행]`);
  console.log(`  - 대상: 프로필 페이지(${PROFILE_URL})의 모든 게시물`);
  console.log(`  - 규칙: 본체 좋아요 절대 금지, 작성자 제외 일반 댓글 전체 고속 좋아요`);
  console.log(`  - 기간: 45분 동안 연속 실행`);
  console.log('='.repeat(65));

  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1280, height: 900 },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--start-maximized'
    ],
  });

  // 팝업 등으로 새 페이지가 열리면 닫고 메인 페이지만 유지
  context.on('page', async (newPage) => {
    if (newPage !== page) {
      await sleep(500);
      await newPage.close().catch(() => {});
    }
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  console.log(`🌐 @${TARGET_USERNAME} 프로필로 이동: ${PROFILE_URL}`);
  await page.goto(PROFILE_URL, { waitUntil: 'domcontentloaded' });
  await sleep(2500);

  // 팝업 닫기
  const notNowBtns = page.locator("button:has-text('Not Now'), button:has-text('나중에 하기'), button:has-text('지금 안 함')");
  if (await notNowBtns.count() > 0) {
    await notNowBtns.first().click().catch(() => {});
    await sleep(1000);
  }

  let totalLikesAll = 0;
  let postIdx = 0;
  const processedPosts = new Set();
  const startTime = Date.now();
  const maxDuration = 45 * 60 * 1000; // 45분

  while (Date.now() - startTime < maxDuration) {
    // 프로필 피드 그리드에서 상단부터 순서대로 모든 게시물 링크 수집
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

    // 화면에 보이는 것 중 처리 안 된 게 없으면 스크롤
    if (!targetElement) {
      console.log('⬇️ 피드를 아래로 스크롤하여 다음 게시물들을 불러옵니다...');
      const prevScrollY = await page.evaluate(() => window.scrollY);
      await page.mouse.wheel(0, 1000);
      await sleep(1500);
      const currScrollY = await page.evaluate(() => window.scrollY);

      if (Math.abs(currScrollY - prevScrollY) < 10) {
        console.log('🏁 피드의 끝에 도달했습니다. 잠시 대기 후 상단부터 새 댓글 확인...');
        await page.evaluate(() => window.scrollTo(0, 0));
        await sleep(5000);
        processedPosts.clear();
      }
      continue;
    }

    postIdx++;
    console.log(`\n============================================================`);
    console.log(`[게시물 ${postIdx}] 열기: ${targetHref}`);

    try {
      await targetElement.scrollIntoViewIfNeeded().catch(() => {});
      await sleep(250);
      await targetElement.click({ timeout: 4000 }).catch(() => {});
      await sleep(1500);

      const dialog = page.locator("div[role='dialog']");
      if (!await dialog.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('⚠️ 모달이 열리지 않아 직접 URL로 방문합니다.');
        await page.goto(`https://www.instagram.com${targetHref}`, { waitUntil: 'domcontentloaded' });
        await sleep(2000);
      }

      // 댓글 고속 좋아요 실행 (본체 제외, 작성자 제외 일반 댓글 전체)
      const likedInPost = await processComments(page, TARGET_USERNAME);
      totalLikesAll += likedInPost;

      console.log(`✨ [게시물 ${postIdx}] 완료 (새로 누른 댓글 좋아요 ${likedInPost}개) | 누적: ${totalLikesAll}개`);

      // 모달 닫기
      await closeDialog(page);
      await sleep(600);

      // URL 확인 및 프로필 복귀
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

  console.log(`\n🎉 45분 작업 완료! 총 ${totalLikesAll}개의 댓글에 좋아요를 눌렀습니다.`);
  await context.close();
}

main().catch(err => {
  console.error('실행 중 에러:', err);
  process.exit(1);
});
