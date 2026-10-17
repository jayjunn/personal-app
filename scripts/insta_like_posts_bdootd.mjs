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

// 모달 또는 페이지 내에서 '게시물 본체' 좋아요 누르기
async function likeCurrentPost(page) {
  // 모달 내부의 24x24 본체 하트 SVG 찾기
  const likeBtnInfo = await page.evaluate(() => {
    const svgs = Array.from(document.querySelectorAll("svg"));
    
    // 이미 좋아요가 눌려있는지 확인 (Unlike / 좋아요 취소)
    const unlikeSvg = svgs.find(s => {
      const label = s.getAttribute("aria-label");
      const rect = s.getBoundingClientRect();
      const isUnlike = label && (label === "Unlike" || label === "좋아요 취소");
      return isUnlike && rect.width >= 20;
    });

    if (unlikeSvg) {
      return { status: 'already_liked' };
    }

    // 아직 안 눌린 Like 찾기 (width >= 20)
    const likeSvg = svgs.find(s => {
      const label = s.getAttribute("aria-label");
      const rect = s.getBoundingClientRect();
      const isLike = label && (label === "Like" || label === "좋아요");
      return isLike && rect.width >= 20;
    });

    if (likeSvg) {
      const rect = likeSvg.getBoundingClientRect();
      return {
        status: 'need_like',
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2
      };
    }

    return { status: 'not_found' };
  });

  if (likeBtnInfo.status === 'already_liked') {
    return 'already_liked';
  }

  if (likeBtnInfo.status === 'need_like') {
    await page.mouse.move(likeBtnInfo.x, likeBtnInfo.y);
    await sleep(50);
    await page.mouse.click(likeBtnInfo.x, likeBtnInfo.y);
    await sleep(600);
    return 'liked';
  }

  return 'not_found';
}

async function main() {
  console.log('='.repeat(65));
  console.log(`📸 [@${TARGET_USERNAME} 프로필 게시물 최신순 전체 좋아요 자동화]`);
  console.log(`  - 대상: 프로필 페이지(${PROFILE_URL})의 모든 게시물`);
  console.log(`  - 방식: 상단 최신 게시물부터 하나하나 모달 열고 게시물 좋아요 누르기`);
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

  const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

  console.log(`🌐 @${TARGET_USERNAME} 프로필로 이동: ${PROFILE_URL}`);
  await page.goto(PROFILE_URL, { waitUntil: 'domcontentloaded' });
  await sleep(2500);

  // 알림 팝업 닫기
  const notNowBtns = page.locator("button:has-text('Not Now'), button:has-text('나중에 하기'), button:has-text('지금 안 함')");
  if (await notNowBtns.count() > 0) {
    await notNowBtns.first().click().catch(() => {});
    await sleep(800);
  }

  let totalLikedPosts = 0;
  let totalProcessedPosts = 0;
  const processedPostKeys = new Set();
  const startTime = Date.now();
  const maxDuration = 45 * 60 * 1000; // 45분

  while (Date.now() - startTime < maxDuration) {
    // 1. 프로필 피드에서 게시물 링크들 수집
    const postElements = await page.locator("main a[href*='/p/'], main a[href*='/reel/']").all();

    let targetElement = null;
    let targetHref = '';

    for (const el of postElements) {
      const href = await el.getAttribute('href').catch(() => null);
      if (href) {
        const match = href.match(/\/(p|reel)\/([A-Za-z0-9_-]+)/);
        if (match) {
          const key = `/${match[1]}/${match[2]}/`;
          if (!processedPostKeys.has(key)) {
            processedPostKeys.add(key);
            targetElement = el;
            targetHref = key;
            break;
          }
        }
      }
    }

    // 보이는 화면에 새로운 게시물이 없으면 피드 스크롤
    if (!targetElement) {
      console.log('⬇️ 피드를 아래로 스크롤하여 다음 게시물들을 로드합니다...');
      const prevScrollY = await page.evaluate(() => window.scrollY);
      await page.mouse.wheel(0, 1000);
      await sleep(1500);
      const currScrollY = await page.evaluate(() => window.scrollY);

      if (Math.abs(currScrollY - prevScrollY) < 10) {
        console.log('🏁 피드 끝에 도달했습니다. 잠시 대기 후 상단부터 새 게시물 확인...');
        await page.evaluate(() => window.scrollTo(0, 0));
        await sleep(5000);
        processedPostKeys.clear(); // 45분 동안 새 게시물이 올라올 수 있으므로 리셋
      }
      continue;
    }

    totalProcessedPosts++;
    console.log(`\n[게시물 #${totalProcessedPosts}] 열기: ${targetHref}`);

    try {
      await targetElement.scrollIntoViewIfNeeded().catch(() => {});
      await sleep(250);
      await targetElement.click({ timeout: 4000 }).catch(() => {});
      await sleep(1200);

      const dialog = page.locator("div[role='dialog']");
      if (!await dialog.isVisible({ timeout: 3000 }).catch(() => false)) {
        console.log('⚠️ 모달이 열리지 않아 직접 URL로 방문합니다.');
        await page.goto(`https://www.instagram.com${targetHref}`, { waitUntil: 'domcontentloaded' });
        await sleep(2000);
      }

      // 게시물 본체 좋아요 클릭
      const result = await likeCurrentPost(page);
      if (result === 'liked') {
        totalLikedPosts++;
        console.log(`  ❤️ [게시물 좋아요 완료] #${totalLikedPosts} (누적: ${totalLikedPosts}개)`);
      } else if (result === 'already_liked') {
        console.log(`  ✨ [이미 좋아요 완료된 게시물] 스킵`);
      } else {
        console.log(`  ⚠️ 좋아요 버튼을 찾지 못했습니다.`);
      }

      // 인간적인 딜레이 (1.2 ~ 2.2초)
      await sleep(randomRange(1200, 2200));

      // 모달 닫기
      await closeDialog(page);
      await sleep(500);

      // URL 복귀 확인
      if (!page.url().includes(TARGET_USERNAME)) {
        await page.goto(PROFILE_URL, { waitUntil: 'domcontentloaded' });
        await sleep(1500);
      }

    } catch (err) {
      console.log(`⚠️ 처리 중 오류 발생:`, err.message);
      await closeDialog(page);
      await sleep(1000);
    }
  }

  console.log(`\n🎉 45분 작업 완료! 총 ${totalProcessedPosts}개 게시물 확인, ${totalLikedPosts}개 게시물 좋아요 완료.`);
  await context.close();
}

main().catch(err => {
  console.error('실행 중 에러:', err);
  process.exit(1);
});
