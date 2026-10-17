#!/usr/bin/env node
import { chromium } from 'playwright-core';
import path from 'path';

// CLI 인자 파싱: node insta_like_comments.mjs <username_or_url> [duration_in_minutes] [--reels]
const rawTarget = process.argv[2] || 'seungjuuuuuuu';
const durationMinutes = parseInt(process.argv[3] || '60', 10);
const isReels = process.argv.includes('--reels') || 
                process.argv.slice(2).some(arg => arg.toLowerCase() === 'reels') || 
                rawTarget.includes('/reels');

// 타겟 유저네임 정규화
let targetUsername = rawTarget.trim();
if (targetUsername.startsWith('http://') || targetUsername.startsWith('https://')) {
  const match = targetUsername.match(/instagram\.com\/([A-Za-z0-9_.-]+)/);
  if (match) {
    targetUsername = match[1];
  }
}
targetUsername = targetUsername.replace(/[@/]/g, '').trim();

if (!targetUsername) {
  console.error('❌ 유효한 인스타그램 사용자 이름이나 프로필 URL을 지정해주세요.');
  process.exit(1);
}

const USER_DATA_DIR = path.resolve(process.cwd(), '.insta_chrome_profile');
const PROFILE_URL = isReels 
  ? `https://www.instagram.com/${targetUsername}/reels/` 
  : `https://www.instagram.com/${targetUsername}/`;

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

  // 릴스 등에서 댓글창이 닫혀있는 경우 댓글 아이콘 클릭하여 열기
  await page.evaluate(() => {
    const smallHearts = Array.from(document.querySelectorAll("svg[aria-label='Like'], svg[aria-label='좋아요']"))
      .filter(s => {
        const r = s.getBoundingClientRect();
        return r.width > 0 && r.width <= 20;
      });
    if (smallHearts.length > 0) return;

    const commentInput = document.querySelector("textarea[aria-label*='댓글'], textarea[placeholder*='댓글'], textarea[placeholder*='comment'], form textarea");
    if (commentInput) return;

    const commentIcon = document.querySelector("svg[aria-label='Comment'], svg[aria-label='댓글']");
    if (commentIcon) {
      const btn = commentIcon.closest("[role='button']") || commentIcon.closest("button");
      if (btn) btn.click();
    }
  });
  await sleep(1500);

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
        if (btn.dataset.alreadyLiked === 'true') continue;

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

        // 직접 DOM 클릭 실행 및 중복 방지 마킹
        btn.dataset.alreadyLiked = 'true';
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
  console.log(`📸 [@${targetUsername} 프로필 ${isReels ? '릴스 탭 ' : ''}게시물 순회 '댓글' 자동 좋아요]`);
  console.log(`  - 대상 프로필: ${PROFILE_URL}`);
  console.log(`  - 작업 시간: ${durationMinutes}분`);
  console.log(`  - 검증 완료된 DOM 직접 클릭으로 댓글 하트만 정확하게 클릭`);
  console.log(`  - 작성자(@${targetUsername}) 본인 댓글 제외`);
  console.log(`  - 게시물 본체 좋아요 절대 금지 (오직 댓글만)`);
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

  console.log(`🌐 @${targetUsername} ${isReels ? '릴스 탭' : '프로필'}으로 이동: ${PROFILE_URL}`);
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
  const maxDuration = durationMinutes * 60 * 1000;

  while (Date.now() - startTime < maxDuration) {
    // 프로필/릴스 탭 페이지에서 게시물 링크 수집
    const isPostPage = /\/(p|reel)\/[A-Za-z0-9_-]+/.test(page.url());
    const isTargetProfile = page.url().includes(targetUsername);
    const isOnReelsTab = isReels ? page.url().includes('/reels') : true;

    if (!isTargetProfile || isPostPage || (isReels && !isOnReelsTab)) {
      try {
        await page.goto(PROFILE_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
      } catch (e) {
        console.log(`⚠️ 프로필 이동 재시도 중: ${e.message?.slice(0, 80)}`);
        await sleep(3000);
        await page.goto(PROFILE_URL, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch(() => {});
      }
      await sleep(2500);
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
      // 직접 게시물 URL로 이동
      await page.goto(targetHref, { waitUntil: 'domcontentloaded' });

      // 이 글의 댓글을 스크롤하면서 전부 다 누를 때까지 유지
      const likedInPost = await processAllCommentsInPost(page, targetUsername);
      totalLikesAll += likedInPost;

      console.log(`✨ [게시물 ${postIdx}] 댓글 완료 (누른 좋아요: ${likedInPost}개) | 총 누적: ${totalLikesAll}개`);
      await sleep(1000);

    } catch (err) {
      console.log(`⚠️ 에러:`, err.message?.slice(0, 100));
      await sleep(1000);
    }
  }

  console.log(`\n🎉 ${durationMinutes}분 작업 완료! 총 ${totalLikesAll}개의 댓글에 좋아요를 눌렀습니다.`);
  await context.close();
}

main().catch(err => {
  console.error('실행 중 에러:', err);
  process.exit(1);
});
