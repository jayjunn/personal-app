#!/usr/bin/env node
import { chromium } from 'playwright-core';
import path from 'path';

// CLI 인자 파싱: node insta_like_target_post.mjs <post_url_or_id> [author_to_exclude]
const rawUrl = process.argv[2] || 'https://www.instagram.com/reel/DVBcgOOCWAt/';
let authorArg = (process.argv[3] || '').trim().toLowerCase();

// 게시물 ID 및 URL 정규화
let postId = '';
const match = rawUrl.match(/\/(p|reel|reels)\/([A-Za-z0-9_-]+)/);
if (match) {
  postId = match[2];
} else if (/^[A-Za-z0-9_-]+$/.test(rawUrl)) {
  postId = rawUrl;
}

if (!postId) {
  console.error('❌ 유효한 인스타그램 게시물 URL이나 ID를 지정해주세요.');
  process.exit(1);
}

// /p/ 경로가 데스크탑 웹에서 댓글 패널이 가장 안정적으로 렌더링됨
const TARGET_URL = `https://www.instagram.com/p/${postId}/`;
const USER_DATA_DIR = path.resolve(process.cwd(), '.insta_chrome_profile');

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

async function main() {
  console.log('='.repeat(65));
  console.log(`📸 [인스타그램 단일 게시물 댓글 '전부' 자동 좋아요]`);
  console.log(`  - 대상 게시물: ${TARGET_URL}`);
  console.log(`  - 본체 좋아요 제외 (오직 댓글 하트만 정확히 클릭)`);
  console.log(`  - 작성자 댓글 제외`);
  console.log(`  - 모든 댓글 끝까지 스크롤하며 전부 누를 때까지 실행`);
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

  console.log(`🌐 게시물 방문: ${TARGET_URL}`);
  await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded' });
  await sleep(3000);

  // 알림 팝업 닫기
  const notNowBtns = page.locator("button:has-text('Not Now'), button:has-text('나중에 하기'), button:has-text('지금 안 함')");
  if (await notNowBtns.count() > 0) {
    await notNowBtns.first().click().catch(() => {});
    await sleep(1000);
  }

  // 작성자 정보 자동 추출 (인자로 안 넘겨졌을 경우)
  if (!authorArg) {
    authorArg = await page.evaluate(() => {
      const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';
      const m = ogTitle.match(/^([A-Za-z0-9_.-]+)\s+on\s+Instagram/i);
      if (m) return m[1].toLowerCase();

      const ogDesc = document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
      const m2 = ogDesc.match(/-\s*([A-Za-z0-9_.-]+)\s+on\s+/i);
      if (m2) return m2[1].toLowerCase();

      return '';
    });
  }
  console.log(`👤 게시물 작성자: @${authorArg || '미지정 (작성자 링크로 자동 감지)'}`);

  let totalLiked = 0;
  let consecutiveNoAction = 0;
  const authorLower = authorArg.toLowerCase();

  // 댓글 전체 처리 루프 (댓글 다 누를 때까지 지속, 최대 300회)
  for (let loop = 0; loop < 300; loop++) {
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
        if (authorToExclude && username.toLowerCase() === authorToExclude) continue;

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
      totalLiked++;
      consecutiveNoAction = 0;
      console.log(`    ❤️ [댓글 ${totalLiked}개째] @${res.username}: "${res.text}"`);
      await sleep(randomRange(800, 1300));
      continue;
    }

    // 2. 현재 보이는 하트가 없으면 '댓글 더 읽어보기' 버튼 클릭 시도
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
    await sleep(1000);

    // 스크롤 6번 연속으로 새 하트가 전혀 안 나오면 이 글의 모든 댓글 완료!
    if (consecutiveNoAction >= 6) {
      console.log('🏁 모든 댓글을 끝까지 확인했습니다. 작업 완료!');
      break;
    }
  }

  console.log(`\n🎉 완료! 총 ${totalLiked}개의 댓글에 좋아요를 눌렀습니다.`);
  await context.close();
}

main().catch(err => {
  console.error('실행 중 에러:', err);
  process.exit(1);
});
