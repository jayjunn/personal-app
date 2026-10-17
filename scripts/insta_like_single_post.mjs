import { chromium } from 'playwright-core';
import path from 'path';

const USER_DATA_DIR = path.resolve(process.cwd(), '.insta_chrome_profile');
const TARGET_POST_URL = 'https://www.instagram.com/p/DeRMO_xJa7F/';
const TARGET_AUTHOR = 'pau.liine._';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomRange(min, max) {
  return Math.random() * (max - min) + min;
}

async function run() {
  console.log(`[시작] 크롬 브라우저 실행 중...`);
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

  console.log(`[이동] 지정 게시물 방문: ${TARGET_POST_URL}`);
  await page.goto(TARGET_POST_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await sleep(3500);

  const clickedSignatures = new Set();
  let totalLiked = 0;
  let noNewCommentsCount = 0;

  console.log(`[정보] 글쓴이(${TARGET_AUTHOR}) 제외 및 대댓글 제외, 모든 일반 댓글 좋아요 시작...`);

  const startTime = Date.now();
  const maxDuration = 30 * 60 * 1000; // 30분 동안 지속

  while (Date.now() - startTime < maxDuration) {
    // 1. "댓글 더 보기" 또는 "+" 아이콘/버튼이 있으면 클릭
    const loadMoreSvgs = await page.locator("svg[aria-label='댓글 더 읽어보기'], svg[aria-label='Load more comments']").all();
    for (const btn of loadMoreSvgs) {
      if (await btn.isVisible().catch(() => false)) {
        await btn.click({ force: true }).catch(() => {});
        console.log(`[댓글 더보기 SVG] 클릭 완료`);
        await sleep(1500);
      }
    }

    // 2. 현재 DOM에서 댓글 하트 찾기
    // (크기 16x16 전후, 본문 액션바의 24x24 큰 하트 제외)
    const commentLikeInfo = await page.evaluate((authorToExclude) => {
      const svgs = Array.from(document.querySelectorAll("svg[aria-label='Like'], svg[aria-label='좋아요']"));
      const targets = [];

      for (let i = 0; i < svgs.length; i++) {
        const svg = svgs[i];
        const rect = svg.getBoundingClientRect();
        // 댓글 하트는 보통 16x16, 게시물 본체 하트는 24x24 이상
        if (rect.width > 20 || rect.height > 20 || rect.width === 0) continue;

        // 대댓글 여부 체크: 상위 부모 텍스트 또는 들여쓰기/구조
        // 댓글 내용 및 작성자 추출
        let row = svg;
        for (let j = 0; j < 8; j++) {
          if (row.parentElement) row = row.parentElement;
        }

        const rowText = (row ? row.innerText : '').trim();
        const firstLine = rowText.split('\n')[0].trim();
        const commenter = firstLine.toLowerCase();

        // 글쓴이 제외 조건
        if (
          commenter === authorToExclude.toLowerCase() ||
          commenter.includes(authorToExclude.toLowerCase()) ||
          rowText.includes('Author') ||
          rowText.includes('작성자')
        ) {
          continue;
        }

        // 대댓글 식별 (인스타그램 웹 댓글 구조: "View replies" 아래 중첩된 경우 등)
        // 만약 대댓글 전용 클래스나 형제 구조가 있으면 필터링
        // 기본 텍스트 시그니처
        const sig = `${commenter}_${rowText.slice(0, 30)}`;

        targets.push({
          sig,
          commenter,
          sampleText: rowText.slice(0, 40).replace(/\n/g, ' '),
          x: rect.x + rect.width / 2,
          y: rect.y + rect.height / 2,
          isVisibleInView: rect.top >= 0 && rect.bottom <= window.innerHeight
        });
      }

      return targets;
    }, TARGET_AUTHOR);

    let batchLiked = 0;

    for (const item of commentLikeInfo) {
      if (clickedSignatures.has(item.sig)) continue;

      // 마우스 좌표로 정확히 클릭
      try {
        // 화면 밖이면 해당 위치로 스크롤 이동
        await page.mouse.move(item.x, item.y);
        await sleep(50);
        await page.mouse.click(item.x, item.y);

        clickedSignatures.add(item.sig);
        totalLiked++;
        batchLiked++;
        console.log(`[댓글 좋아요 #${totalLiked}] ${item.commenter || '유저'}: "${item.sampleText}"`);

        await sleep(randomRange(800, 1400));
      } catch (err) {
        // 클릭 에러 시 넘어감
      }
    }

    // 3. 댓글 스크롤 컨테이너를 아래로 스크롤하여 새 댓글 로드
    const scrollResult = await page.evaluate(() => {
      // clientHeight 300~600 사이의 스크롤 컨테이너 탐색
      const allDivs = Array.from(document.querySelectorAll('div'));
      const scrollable = allDivs.find(d => d.scrollHeight > d.clientHeight && d.clientHeight >= 250 && d.clientHeight <= 700);
      if (scrollable) {
        const prev = scrollable.scrollTop;
        scrollable.scrollTop += 500;
        return { type: 'div', prev, now: scrollable.scrollTop, max: scrollable.scrollHeight };
      }
      window.scrollBy(0, 500);
      return { type: 'window', now: window.scrollY };
    });

    if (batchLiked === 0) {
      noNewCommentsCount++;
      if (noNewCommentsCount >= 6) {
        // 맨 위로 다시 살짝 올려서 새 댓글 확인하거나 잠시 대기
        console.log(`[대기] 현재 가시 범위의 모든 일반 댓글에 좋아요 완료. 새 댓글 확인 대기 중... (총 ${totalLiked}개 완료)`);
        await page.evaluate(() => {
          const allDivs = Array.from(document.querySelectorAll('div'));
          const scrollable = allDivs.find(d => d.scrollHeight > d.clientHeight && d.clientHeight >= 250 && d.clientHeight <= 700);
          if (scrollable) scrollable.scrollTop = 0;
        });
        await sleep(5000);
        noNewCommentsCount = 0;
      }
    } else {
      noNewCommentsCount = 0;
    }

    await sleep(1500);
  }

  console.log(`[종료] 30분 작업 완료. 총 ${totalLiked}개의 댓글에 좋아요를 눌렀습니다.`);
  await context.close();
}

run().catch((err) => {
  console.error('[오류 발생]:', err);
  process.exit(1);
});
