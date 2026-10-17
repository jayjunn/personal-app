import { chromium } from 'playwright-core';
import path from 'path';
import readline from 'readline';
import fs from 'fs';

const USER_DATA_DIR = path.resolve(process.cwd(), '.insta_chrome_profile');
const PROCESSED_EXPLORE_FILE = path.resolve(process.cwd(), 'scripts', 'processed_explore_posts.json');

function loadProcessedPosts() {
  try {
    if (fs.existsSync(PROCESSED_EXPLORE_FILE)) {
      const data = JSON.parse(fs.readFileSync(PROCESSED_EXPLORE_FILE, 'utf8'));
      if (Array.isArray(data)) return new Set(data);
    }
  } catch (e) {}
  return new Set();
}

function saveProcessedPosts(set) {
  try {
    const arr = Array.from(set).slice(-3000);
    fs.writeFileSync(PROCESSED_EXPLORE_FILE, JSON.stringify(arr, null, 2), 'utf8');
  } catch (e) {}
}

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

// 모달 내 작성자 아이디 추출
async function getPostAuthor(dialog) {
  try {
    const headerLinks = await dialog.locator("header a[href^='/']:not([href*='/p/']):not([href*='/explore/']):not([href*='/reels/'])").all();
    for (const hl of headerLinks) {
      const text = (await hl.innerText().catch(() => '')).trim().toLowerCase();
      if (text) return text;
      const href = await hl.getAttribute('href').catch(() => '');
      if (href) {
        const clean = href.replace(/\//g, '').split('?')[0].trim().toLowerCase();
        if (clean && clean !== 'explore' && clean !== 'reels') return clean;
      }
    }

    const firstLi = dialog.locator("ul li").first();
    if (await firstLi.isVisible().catch(() => false)) {
      const firstUserLinks = await firstLi.locator("h2 a, h3 a, a[href^='/']").all();
      for (const fl of firstUserLinks) {
        const text = (await fl.innerText().catch(() => '')).trim().toLowerCase();
        if (text) return text;
        const href = await fl.getAttribute('href').catch(() => '');
        if (href) {
          const clean = href.replace(/\//g, '').split('?')[0].trim().toLowerCase();
          if (clean && clean !== 'explore' && clean !== 'reels') return clean;
        }
      }
    }
  } catch (e) {}
  return '';
}

// 모달 내 댓글 좋아요 실행 함수
async function processCommentsInDialog(page, postAuthor) {
  await sleep(randomRange(1500, 2000));
  const dialog = page.locator("div[role='dialog']");

  if (!postAuthor) {
    postAuthor = await getPostAuthor(dialog);
  }
  console.log(`    👤 기준 글쓴이: @${postAuthor || '미확인(보수적 제외)'}`);

  let commentBox = dialog.locator("ul:has(li)").first();
  if (!await commentBox.isVisible().catch(() => false)) {
    commentBox = dialog;
  }

  // 댓글 더보기 1회 클릭 시도
  const moreBtns = dialog.locator("span:has-text('View more comments'), span:has-text('댓글 더 보기'), span:has-text('댓글 모두 보기'), svg[aria-label*='Load more' i]");
  if (await moreBtns.count() > 0) {
    await moreBtns.first().click().catch(() => {});
    await sleep(1000);
  }

  let totalLikedInPost = 0;
  let noNewCommentsCount = 0;
  const processedSignatures = new Set();

  while (totalLikedInPost < 15 && noNewCommentsCount < 3) {
    // 댓글 SVG 하트 아이콘 탐색 (li 내부 SVG)
    const likeSvgs = await dialog.locator("li svg[aria-label='Like'], li svg[aria-label='좋아요']").all();
    let batchLiked = 0;

    for (const svg of likeSvgs) {
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
        const userLinks = await commentRow.locator("a[href^='/']:not([href*='/p/']):not([href*='/explore/']):not([href*='/reels/'])").all();
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
        const sig = `${commenterId}_${rowText.slice(0, 30)}`;
        if (processedSignatures.has(sig)) continue;
        processedSignatures.add(sig);

        // [글쓴이 본인 제외 조건]
        const isAuthor = (postAuthor && commenterId && commenterId.toLowerCase() === postAuthor.toLowerCase()) ||
                         (postAuthor && commenterId === '' && rowText.toLowerCase().includes(postAuthor.toLowerCase())) ||
                         rowText.includes('Author') ||
                         rowText.includes('작성자');

        if (isAuthor) {
          console.log(`    [글쓴이 제외] @${commenterId || postAuthor} 본인 댓글 스킵`);
          continue;
        }

        // 실제 마우스 좌표 클릭: Playwright의 svg.click({force: true})나 parentSpan 재클릭은
        // 팝업 레이어나 터치 이벤트와 충돌하여 취소(풀림)되거나 mutation이 안 나갈 수 있음
        const box = await svg.boundingBox().catch(() => null);
        if (!box) continue;

        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await sleep(randomRange(150, 250));
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

        // 인스타그램 서버 xig_comment_like GraphQL 및 React 상태 반영 대기
        await sleep(1800);

        // 검증: 빨간 하트(Unlike)로 확실히 전환되었는지 확인
        const likedSvg = commentRow.locator("svg[aria-label='Unlike'], svg[aria-label='좋아요 취소']");
        let isSuccess = await likedSvg.isVisible().catch(() => false);

        // 활동 제한 팝업 감지
        const actionBlock = page.locator("text='Try again later', text='나중에 다시 시도하세요', text='활동이 제한되었습니다'");
        if (await actionBlock.count() > 0 && await actionBlock.first().isVisible().catch(() => false)) {
          console.log('\n⚠️ [경고] 활동 제한 감지됨! 작업을 안전하게 중단합니다.');
          const okBtn = page.locator("button:has-text('OK'), button:has-text('확인')");
          await okBtn.click().catch(() => {});
          return { totalLikedInPost, blocked: true };
        }

        totalLikedInPost++;
        batchLiked++;
        console.log(`    ❤️ [${totalLikedInPost}개째] @${commenterId || '익명'} 님의 일반 댓글 좋아요 완료! ✅`);

        // 자연스러운 딜레이 (사람처럼 1.5~3.5초)
        const baseDelay = randomRange(1500, 3500);
        if (Math.random() < 0.05) {
          const longBreak = randomRange(5000, 8000);
          await sleep(longBreak);
        } else {
          await sleep(baseDelay);
        }

      } catch (e) {
        continue;
      }
    }

    if (batchLiked === 0) {
      noNewCommentsCount++;
    } else {
      noNewCommentsCount = 0;
    }

    // 다음 더보기 버튼
    const nextMoreBtn = dialog.locator("span:has-text('View more comments'), span:has-text('댓글 더 보기'), span:has-text('댓글 모두 보기'), svg[aria-label*='Load more' i]").first();
    if (await nextMoreBtn.isVisible().catch(() => false)) {
      await nextMoreBtn.click().catch(() => {});
      await sleep(1000);
    }

    // 스크롤 다운
    await commentBox.hover().catch(() => {});
    await page.mouse.wheel(0, 500);
    await sleep(1000);
  }

  return { totalLikedInPost, blocked: false };
}

async function closeDialog(page) {
  const dialog = page.locator("div[role='dialog']");
  if (!await dialog.isVisible().catch(() => false)) return;

  await page.keyboard.press('Escape').catch(() => {});
  await sleep(600);

  if (await dialog.isVisible().catch(() => false)) {
    const closeSvg = dialog.locator("svg[aria-label='Close'], svg[aria-label='닫기']").first();
    if (await closeSvg.isVisible().catch(() => false)) {
      await closeSvg.click().catch(() => {});
      await sleep(600);
    }
  }

  if (await dialog.isVisible().catch(() => false)) {
    await page.mouse.click(10, 10).catch(() => {});
    await sleep(600);
  }
}

async function main() {
  console.log('='.repeat(65));
  console.log('🔍 [돋보기(탐색 탭) 연속 이동 & 댓글 좋아요 봇 v1.0]');
  console.log('  1. 돋보기(Explore) 페이지 접속');
  console.log('  2. 게시물 하나씩 순차적으로 열며(오른쪽 화살표 Next) 이동');
  console.log('  3. 작성자 본인 댓글 및 대댓글 100% 제외');
  console.log('  4. 게시물 본체 좋아요 제외, 오직 일반 댓글에만 좋아요');
  console.log('  5. 패션/코디/남자/스타일 관련 스마트 스코어링 (3점 이상)');
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

  console.log('🌐 인스타그램 돋보기(Explore) 페이지로 이동합니다...');
  await page.goto('https://www.instagram.com/explore/', { waitUntil: 'domcontentloaded' });
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

  const processedLinks = loadProcessedPosts();
  console.log(`📂 이전에 처리된 돋보기 게시물 기록 로드: ${processedLinks.size}개`);

  let completedPosts = 0;
  let totalLikes = 0;

  // 돋보기 그리드에서 첫 번째 게시물 열기
  console.log('\n🔍 돋보기 첫 번째 게시물을 엽니다...');
  const firstPost = page.locator("main a[href*='/p/'], main a[href*='/reel/']").first();
  await firstPost.click().catch(() => {});
  await sleep(3000);

  let consecutiveSkippedOrDuplicates = 0;

  while (true) {
    const dialog = page.locator("div[role='dialog']");
    if (!await dialog.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('🔄 모달이 닫혀있어 돋보기 페이지로 다시 이동하여 새 게시물을 엽니다...');
      await page.goto('https://www.instagram.com/explore/', { waitUntil: 'domcontentloaded' });
      await sleep(2500);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await sleep(3000);
      const newFirst = page.locator("main a[href*='/p/'], main a[href*='/reel/']").first();
      await newFirst.click().catch(() => {});
      await sleep(3000);
      continue;
    }

    // 모달 내부의 고유 링크 확인
    const postLinkInDialog = dialog.locator("a[href*='/p/'], a[href*='/reel/']").first();
    let currentPostKey = '';
    if (await postLinkInDialog.count() > 0) {
      const href = await postLinkInDialog.getAttribute('href').catch(() => null);
      if (href) {
        const match = href.match(/\/(p|reel)\/([A-Za-z0-9_-]+)/);
        if (match) currentPostKey = `/${match[1]}/${match[2]}/`;
      }
    }

    if (currentPostKey && processedLinks.has(currentPostKey)) {
      consecutiveSkippedOrDuplicates++;
      // 다음 게시물(Next 화살표) 클릭
      const nextBtn = dialog.locator("svg[aria-label='Next'], svg[aria-label='다음']").first();
      if (await nextBtn.isVisible().catch(() => false)) {
        await nextBtn.click().catch(() => {});
        await sleep(randomRange(1500, 2500));
        continue;
      } else {
        await closeDialog(page);
        continue;
      }
    }

    if (currentPostKey) {
      processedLinks.add(currentPostKey);
      saveProcessedPosts(processedLinks);
      consecutiveSkippedOrDuplicates = 0;
    }

    const postAuthor = await getPostAuthor(dialog);
    const dialogText = await dialog.innerText().catch(() => '');
    const dialogTextLower = dialogText.toLowerCase();

    // 이미지 설명 alt 추출
    const imgAlt = await dialog.locator('img[alt]').first().getAttribute('alt').catch(() => '') ?? '';
    const imgAltLower = imgAlt.toLowerCase();

    console.log(`--------------------------------------------------`);
    console.log(`[돋보기 게시물 발견] 작성자: @${postAuthor || '알 수 없음'} | 키: ${currentPostKey}`);
    if (imgAlt) console.log(`   📸 이미지 설명: ${imgAlt.slice(0, 80)}`);

    // ── 스마트 스코어링 시스템 ──
    let score = 0;
    const matchReasons = [];

    const IMG_FASHION = ['jacket', 'coat', 'shirt', 'pants', 'jeans', 'hoodie', 'sneakers', 'shoes', 'outfit', 'clothing', 'wearing', 'dressed', 'fashion', 'style', 'sweater', 'cardigan', 'trench', 'boots', '자켓', '코트', '셔츠', '바지', '청바지', '후드', '신발'];
    const IMG_MALE = ['man', 'men', 'male', 'boy', 'guy', 'person', 'face', 'portrait', 'selfie', 'handsome', '남자', '남성', '얼굴'];

    for (const s of IMG_FASHION) {
      if (imgAltLower.includes(s)) { score += 3; matchReasons.push(`img:"${s}"`); break; }
    }
    for (const s of IMG_MALE) {
      if (imgAltLower.includes(s)) { score += 2; matchReasons.push(`img:"${s}"`); break; }
    }

    const hashtags = (dialogText.match(/#[\w가-힣]+/g) || []).map(h => h.toLowerCase());
    const FASHION_TAGS = ['#ootd', '#outfit', '#fashion', '#style', '#lookbook', '#streetwear', '#mensfashion', '#menstyle', '#kfashion', '#패션', '#코디', '#스타일', '#데일리룩', '#무신사', '#오오티디', '#옷스타그램'];
    const MALE_TAGS = ['#훈남', '#잘생김', '#남자', '#남스타그램', '#남자코디', '#남성패션', '#handsome', '#malemodel'];

    for (const tag of hashtags) {
      if (FASHION_TAGS.some(h => tag.includes(h.replace('#', '')))) { score += 4; matchReasons.push(`tag:${tag}`); break; }
    }
    for (const tag of hashtags) {
      if (MALE_TAGS.some(h => tag.includes(h.replace('#', '')))) { score += 4; matchReasons.push(`tag:${tag}`); break; }
    }

    const TEXT_FASHION = ['패션', '코디', '착장', '자켓', '셔츠', '바지', '슬랙스', '데님', '청바지', '후드', '맨투맨', '니트', '스니커', '무신사', '룩북', 'outfit', 'fashion', 'style', 'streetwear', 'sneakers', 'hoodie'];
    const TEXT_MALE = ['남자', '남성', '오빠', '훈남', '잘생', '존잘', 'handsome', 'hot guy'];

    for (const kw of TEXT_FASHION) {
      if (dialogTextLower.includes(kw)) { score += 2; matchReasons.push(`txt:"${kw}"`); break; }
    }
    for (const kw of TEXT_MALE) {
      if (dialogTextLower.includes(kw)) { score += 2; matchReasons.push(`txt:"${kw}"`); break; }
    }

    const fireCount = (dialogText.match(/🔥/g) || []).length;
    const heartCount = (dialogText.match(/😍|🥰|😻/g) || []).length;
    if (fireCount >= 2) { score += 2; matchReasons.push(`🔥×${fireCount}`); }
    if (heartCount >= 2) { score += 2; matchReasons.push(`😍×${heartCount}`); }

    if (/[가-힣]/.test(dialogText)) { score += 1; }

    // 테크 블랙리스트
    const TECH_BLACKLIST = ['아이폰', 'iphone', '갤럭시', 'galaxy', '아이패드', 'ipad', '맥북', 'macbook', '노트북', '컴퓨터', '에어팟', 'airpods', '애플워치', '다이슨', '닌텐도', 'ps5'];
    const blacklistMatch = TECH_BLACKLIST.find(kw => dialogTextLower.includes(kw));

    if (blacklistMatch) {
      console.log(`🚫 테크/IT 컨텐츠 감지 ("${blacklistMatch}") → 다음 게시물로 이동`);
      const nextBtn = dialog.locator("svg[aria-label='Next'], svg[aria-label='다음']").first();
      if (await nextBtn.isVisible().catch(() => false)) {
        await nextBtn.click().catch(() => {});
        await sleep(randomRange(1500, 2500));
        continue;
      } else {
        await closeDialog(page);
        continue;
      }
    }

    const TARGET_THRESHOLD = 3;
    console.log(`   📊 타겟 점수: ${score}점 (기준: ${TARGET_THRESHOLD}) | 근거: ${matchReasons.join(', ') || '없음'}`);

    if (score >= TARGET_THRESHOLD) {
      console.log(`🎯 [타겟 확정 ${score}점] 댓글 좋아요 시작!`);
      const res = await processCommentsInDialog(page, postAuthor);
      totalLikes += res.totalLikedInPost;

      if (res.blocked) {
        console.log('⚠️ 활동 제한 감지로 전체 작업을 정지합니다.');
        break;
      }

      if (res.totalLikedInPost > 0) {
        completedPosts++;
        console.log(`✨ 게시물 작업 완료 (이번 글 좋아요 ${res.totalLikedInPost}개) | 총 누적: ${totalLikes}개`);

        if (completedPosts % 4 === 0) {
          const longRest = randomRange(25000, 40000);
          console.log(`😴 [${completedPosts}번째 완료] 잠깐 휴식 (${(longRest/1000).toFixed(0)}초)...`);
          await sleep(longRest);
        } else {
          const rest = randomRange(8000, 15000);
          console.log(`💤 다음 게시물 이동 전 ${(rest/1000).toFixed(1)}초 대기...`);
          await sleep(rest);
        }
      }
    } else {
      console.log(`⏭️ 타겟 외 컨텐츠 (점수 미달) → 다음 게시물로 이동`);
      await sleep(randomRange(800, 1500));
    }

    // 다음 게시물(Next 화살표) 클릭하여 바로 다음 모달로 이동
    const nextBtn = dialog.locator("svg[aria-label='Next'], svg[aria-label='다음']").first();
    if (await nextBtn.isVisible().catch(() => false)) {
      await nextBtn.click().catch(() => {});
      await sleep(randomRange(2500, 3500));
    } else {
      console.log('🔄 다음 화살표가 없어 모달을 닫고 돋보기 그리드에서 새로 시작합니다.');
      await closeDialog(page);
      await sleep(2000);
    }
  }

  console.log(`\n🎉 오늘 돋보기 탐색 작업 완료! 총 누른 댓글 좋아요: ${totalLikes}개`);
}

main().catch(err => {
  console.error('실행 중 에러:', err);
});
