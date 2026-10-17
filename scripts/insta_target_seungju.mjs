import { chromium } from 'playwright-core';
import path from 'path';

const USER_DATA_DIR = path.resolve(process.cwd(), '.insta_chrome_profile');
const TARGET_USERNAME = 'seungjuuuuuuu';
const PROFILE_URL = 'https://www.instagram.com/seungjuuuuuuu/';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

// 팝업(신고/공유/옵션) 자동 닫기
async function dismissAnyPopups(page) {
  const popups = page.locator("div[role='dialog']:has-text('Report'), div[role='dialog']:has-text('신고'), div[role='dialog']:has-text('Share'), div[role='dialog']:has-text('공유')");
  if (await popups.isVisible().catch(() => false)) {
    await page.keyboard.press('Escape').catch(() => {});
    await sleep(200);
  }
}

// 한 게시물 내 모든 댓글 좋아요 완전 처리
async function processAllCommentsInPost(page, targetAuthor) {
  let totalLikedInPost = 0;
  let consecutiveNoAction = 0;
  const authorLower = targetAuthor.toLowerCase();

  // 댓글 로딩 대기
  await sleep(2500);

  // 이 글의 댓글을 끝까지 다 누를 때까지 반복 (최대 120회)
  for (let loop = 0; loop < 120; loop++) {
    await dismissAnyPopups(page);

    // 1. 현재 화면에서 안 누른 댓글 하트 하나 찾아서 클릭
    const res = await page.evaluate((authorToExclude) => {
      const svgs = Array.from(document.querySelectorAll("svg[aria-label='Like'], svg[aria-label='좋아요']"));

      for (const svg of svgs) {
        const r = svg.getBoundingClientRect();
        // 본체 24x24 제외, 댓글 하트(20 이하)만 대상
        if (r.width > 20 || r.height > 20 || r.width === 0) continue;

        const btn = svg.closest("[role='button']");
        if (!btn) continue;

        // 댓글 작성자 확인: 게시물 링크(/p/...) 제외하고 순수 프로필 링크만 탐색
        let p = btn;
        let username = '';
        let fullText = '';
        for (let step = 0; step < 8; step++) {
          if (!p) break;
          const link = p.querySelector("a[href^='/']:not([href*='/p/']):not([href*='/reel/'])");
          if (link) {
            username = (link.getAttribute('href') || '').split('/').filter(Boolean)[0] || '';
            fullText = (p.innerText || '').replace(/\s+/g, ' ').trim();
            break;
          }
          p = p.parentElement;
        }

        // 글쓴이 본인 제외
        if (username.toLowerCase() === authorToExclude) continue;

        // 직접 DOM 클릭 실행
        btn.click();

        return {
          clicked: true,
          username,
          text: fullText.slice(0, 35)
        };
      }

      return { clicked: false };
    }, authorLower);

    if (res.clicked) {
      totalLikedInPost++;
      consecutiveNoAction = 0;
      console.log(`    ❤️ [이 글 댓글 ${totalLikedInPost}개째] @${res.username}: "${res.text}"`);
      await sleep(randomRange(800, 1300));
      continue;
    }

    // 2. 현재 보이는 하트가 없으면 '댓글 더 읽어보기' 클릭 시도
    const clickedMore = await page.evaluate(() => {
      const loadMoreSvg = document.querySelector("svg[aria-label='댓글 더 읽어보기'], svg[aria-label='Load more comments']");
      if (loadMoreSvg) {
        const btn = loadMoreSvg.closest("[role='button']") || loadMoreSvg;
        btn.click();
        return true;
      }
      return false;
    });

    if (clickedMore) {
      console.log('    ➕ 댓글 더 읽어보기 클릭');
      await sleep(1500);
      continue;
    }

    // 3. 댓글 영역 스크롤 내리기
    const scrolled = await page.evaluate(() => {
      // 댓글 하트들의 스크롤 컨테이너 탐색
      const anyHeart = document.querySelector("svg[aria-label='Like'], svg[aria-label='좋아요'], svg[aria-label='Unlike'], svg[aria-label='좋아요 취소']");
      let p = anyHeart ? anyHeart.parentElement : null;
      while (p && p !== document.body) {
        const style = window.getComputedStyle(p);
        if ((style.overflowY === 'auto' || style.overflowY === 'scroll') && p.scrollHeight > p.clientHeight) {
          p.scrollTop += 450;
          return true;
        }
        p = p.parentElement;
      }

      const scrollable = Array.from(document.querySelectorAll("*")).find(el => {
        const s = window.getComputedStyle(el);
        return (s.overflowY === 'auto' || s.overflowY === 'scroll') && el.scrollHeight > el.clientHeight && el.clientHeight > 200;
      });
      if (scrollable) {
        scrollable.scrollTop += 450;
        return true;
      }

      window.scrollBy(0, 450);
      return false;
    });

    consecutiveNoAction++;
    await sleep(900);

    // 스크롤 5번 연속으로 새 하트가 안 나오면 이 글 댓글 완료!
    if (consecutiveNoAction >= 5) {
      break;
    }
  }

  return totalLikedInPost;
}

async function main() {
  console.log('='.repeat(65));
  console.log(`📸 [@${TARGET_USERNAME} 댓글 좋아요 정밀 실행 (1시간)]`);
  console.log(`  - 게시물 직접 이동 방식 (모달 열림 오류 원천 차단)`);
  console.log(`  - 검증 완료된 DOM 직접 클릭으로 댓글 하트만 정확하게 클릭`);
  console.log(`  - 한 게시물 열면 스크롤하면서 모든 댓글 다 누를 때까지 절대 이동 안 함`);
  console.log(`  - 작성자(@${TARGET_USERNAME}) 댓글 제외`);
  console.log(`  - 1시간(60분) 동안 연속 실행`);
  console.log('='.repeat(65));

  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    channel: 'chrome',
    headless: false,
    viewport: { width: 1280, height: 900 },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
    ],
  });

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  context.on('page', async (newPage) => {
    await sleep(300);
    if (newPage !== page) {
      await newPage.close().catch(() => {});
    }
  });

  console.log(`🌐 @${TARGET_USERNAME} 프로필로 이동: ${PROFILE_URL}`);
  await page.goto(PROFILE_URL, { waitUntil: 'domcontentloaded' });
  await sleep(2500);

  // 알림 팝업 닫기
  const notNowBtns = page.locator("button:has-text('Not Now'), button:has-text('나중에 하기'), button:has-text('지금 안 함')");
  if (await notNowBtns.count() > 0) {
    await notNowBtns.first().click().catch(() => {});
    await sleep(1000);
  }

  let totalLikesAll = 0;
  let postIdx = 0;
  const processedPostIds = new Set();
  const startTime = Date.now();
  const maxDuration = 60 * 60 * 1000;

  while (Date.now() - startTime < maxDuration) {
    // 프로필 페이지에서 게시물 링크 수집
    if (!page.url().includes(TARGET_USERNAME) || page.url().includes('/p/') || page.url().includes('/reel/')) {
      await page.goto(PROFILE_URL, { waitUntil: 'domcontentloaded' });
      await sleep(2000);
    }

    const postHrefs = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll("main a[href*='/p/'], main a[href*='/reel/']"));
      return anchors.map(a => a.getAttribute('href')).filter(Boolean);
    });

    let targetHref = '';
    let targetPostId = '';

    for (const href of postHrefs) {
      const match = href.match(/\/(p|reel)\/([A-Za-z0-9_-]+)/);
      if (match) {
        const id = match[2];
        if (!processedPostIds.has(id)) {
          processedPostIds.add(id);
          targetHref = `https://www.instagram.com/p/${id}/`;
          targetPostId = id;
          break;
        }
      }
    }

    if (!targetHref) {
      console.log('⬇️ 피드를 아래로 스크롤하여 새 게시물들을 불러옵니다...');
      const prevY = await page.evaluate(() => window.scrollY);
      await page.mouse.wheel(0, 1000);
      await sleep(1500);
      const curY = await page.evaluate(() => window.scrollY);

      if (Math.abs(curY - prevY) < 10) {
        console.log('🏁 피드 끝에 도달했습니다. 상단부터 다시 확인...');
        await page.evaluate(() => window.scrollTo(0, 0));
        await sleep(5000);
        processedPostIds.clear();
      }
      continue;
    }

    postIdx++;
    console.log(`\n============================================================`);
    console.log(`[게시물 ${postIdx}] 이동: ${targetHref}`);

    try {
      // 직접 게시물 URL로 이동!
      await page.goto(targetHref, { waitUntil: 'domcontentloaded' });

      // 이 글의 댓글을 스크롤하면서 전부 다 누를 때까지 유지
      const likedInPost = await processAllCommentsInPost(page, TARGET_USERNAME);
      totalLikesAll += likedInPost;

      console.log(`✨ [게시물 ${postIdx}] 댓글 완료 (누른 좋아요: ${likedInPost}개) | 총 누적: ${totalLikesAll}개`);
      await sleep(1000);

    } catch (err) {
      console.log(`⚠️ 에러:`, err.message?.slice(0, 100));
      await sleep(1000);
    }
  }

  console.log(`\n🎉 1시간 작업 완료! 총 ${totalLikesAll}개의 댓글에 좋아요를 눌렀습니다.`);
  await context.close();
}

main().catch(err => {
  console.error('실행 중 에러:', err);
  process.exit(1);
});
