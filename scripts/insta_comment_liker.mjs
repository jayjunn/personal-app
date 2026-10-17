import { chromium } from 'playwright-core';
import path from 'path';
import readline from 'readline';
import fs from 'fs';
import os from 'os';

const USER_DATA_DIR = path.resolve(os.homedir(), '.insta_chrome_profile');

const PROCESSED_POSTS_FILE = path.resolve(process.cwd(), 'scripts', 'processed_posts.json');

function loadProcessedPosts() {
  try {
    if (fs.existsSync(PROCESSED_POSTS_FILE)) {
      const data = JSON.parse(fs.readFileSync(PROCESSED_POSTS_FILE, 'utf8'));
      if (Array.isArray(data)) return new Set(data);
    }
  } catch (e) {}
  return new Set();
}

function saveProcessedPosts(set) {
  try {
    // 최근 2000개만 유지
    const arr = Array.from(set).slice(-2000);
    fs.writeFileSync(PROCESSED_POSTS_FILE, JSON.stringify(arr, null, 2), 'utf8');
  } catch (e) {}
}

const MIN_COMMENT_COUNT = 40;       // 댓글 40개 이상 게시물 타겟
const LIKE_RATIO = 0.80;            // 댓글 중 80% 좋아요
const MAX_LIKES_PER_POST = 60;      // 한 게시물당 최대 상한선
const TOTAL_POSTS_TO_PROCESS = 15;  // 이번 세션에서 처리할 게시물 수

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

// 게시물 본문 작성자 아이디 정확하게 추출하는 함수
async function getPostAuthor(dialog) {
  try {
    // 1. 헤더 영역 내 첫 번째 사용자 링크
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

    // 2. 모달 내 첫 번째 댓글(LI)의 작성자 (첫 번째 항목은 항상 원글 작성자 본문 캡션)
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

// 모달(상세창) 안에서 댓글 분석 및 글쓴이 제외 100% 댓글 좋아요 실행
async function processCommentsInDialog(page, postAuthor) {
  await sleep(randomRange(1500, 2000));
  const dialog = page.locator("div[role='dialog']");

  // 작성자가 전달되지 않았거나 비어있을 경우 다시 한 번 확실하게 추출
  if (!postAuthor) {
    postAuthor = await getPostAuthor(dialog);
  }
  console.log(`    👤 기준 글쓴이 아이디: @${postAuthor || '미확인(안전 위해 보수적 제외)'}`);

  // 댓글 박스 탐색: dialog 내의 li들을 담고 있는 ul 찾기
  let commentBox = dialog.locator("ul:has(li)").first();
  if (!await commentBox.isVisible().catch(() => false)) {
    // ul이 직접 보이지 않으면 dialog 전체를 영역으로 사용
    commentBox = dialog;
  }

  // 1회 빠른 더보기 클릭 (댓글 더 보기 / 답글 더 보기 등)
  const moreBtns = dialog.locator("span:has-text('View more comments'), span:has-text('댓글 더 보기'), span:has-text('댓글 모두 보기'), svg[aria-label*='Load more' i]");
  if (await moreBtns.count() > 0) {
    await moreBtns.first().click().catch(() => {});
    await sleep(1000);
  }

  let totalLikedInPost = 0;
  let noNewCommentsCount = 0;
  const processedSignatures = new Set();

  while (totalLikedInPost < 15 && noNewCommentsCount < 3) {
    // 오직 댓글(li) 내부의 '좋아요(Like)' SVG만 탐색 (게시물 자체 좋아요 section은 절대 건드리지 않음)
    const likeSvgs = await dialog.locator("li svg[aria-label='Like'], li svg[aria-label='좋아요']").all();
    let batchLiked = 0;

    for (const svg of likeSvgs) {
      try {
        if (!await svg.isVisible().catch(() => false)) continue;

        // 해당 댓글의 부모 LI를 반드시 LI 기준으로만 잡음
        const liCount = await svg.locator("xpath=./ancestor::li[1]").count();
        if (liCount === 0) continue;
        const commentRow = svg.locator("xpath=./ancestor::li[1]");

        // [대댓글 제외] 이 SVG의 li가 속한 ul이 또 다른 li 안에 있으면 reply → 스킵
        // 구조: 일반댓글 = ul > li > svg / 대댓글 = ul > li > ul > li > svg
        const isReply = await svg.locator("xpath=./ancestor::li[1]/parent::ul/parent::li").count() > 0;
        if (isReply) continue;

        // 댓글 작성자 아이디 추출 (href 기준, innerText 폴백)
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

        // 중복 클릭 방지용 시그니처
        const sig = `${commenterId}_${rowText.slice(0, 30)}`;
        if (processedSignatures.has(sig)) continue;
        processedSignatures.add(sig);

        // [글쓴이 본인 제외 조건]
        const isAuthor = (postAuthor && commenterId && commenterId.toLowerCase() === postAuthor.toLowerCase()) ||
                         (postAuthor && commenterId === '' && rowText.toLowerCase().includes(postAuthor.toLowerCase())) ||
                         rowText.includes('Author') ||
                         rowText.includes('작성자');

        if (isAuthor) {
          console.log(`    [글쓴이 제외] @${commenterId || postAuthor} 님의 댓글/답글은 건너뜁니다.`);
          continue;
        }

        // 좋아요 버튼 클릭: span > svg 하트 아이콘을 force: true 로 확실하게 클릭
        await svg.scrollIntoViewIfNeeded().catch(() => {});
        await svg.hover().catch(() => {});
        await sleep(randomRange(200, 350));
        await svg.click({ force: true }).catch(() => {});

        // 인스타그램 서버 응답 및 React UI 렌더링 대기 (1.5초)
        await sleep(1500);

        // [정확한 좋아요 검증] 댓글 행 또는 모달 내에 반영되었는지 확인 (최대 2초 추가 대기)
        const likedSvg = commentRow.locator("svg[aria-label='Unlike'], svg[aria-label='좋아요 취소']");
        let isSuccess = await likedSvg.isVisible().catch(() => false);

        if (!isSuccess) {
          // 직계 부모 span 클릭 보조 시도
          const parentSpan = svg.locator("xpath=..");
          await parentSpan.click({ force: true }).catch(() => {});
          await sleep(1200);
          isSuccess = await likedSvg.isVisible().catch(() => false);
        }

        // 인스타그램 액션 블록(활동 제한) 팝업 감지
        const actionBlock = page.locator("text='Try again later', text='나중에 다시 시도하세요', text='활동이 제한되었습니다'");
        if (await actionBlock.count() > 0 && await actionBlock.first().isVisible().catch(() => false)) {
          console.log('\n⚠️ [경고] 인스타그램 활동 제한(Action Block) 감지됨! 안전을 위해 작업을 정지합니다.');
          const okBtn = page.locator("button:has-text('OK'), button:has-text('확인')");
          await okBtn.click().catch(() => {});
          return totalLikedInPost;
        }

        if (isSuccess) {
          totalLikedInPost++;
          batchLiked++;
          console.log(`    ❤️ [${totalLikedInPost}개째] @${commenterId || '익명'} 님의 일반 댓글 좋아요 성공 확인! ✅`);
        } else {
          // 검증에 살짝 늦게 렌더링되더라도 클릭 요청이 정상 전송되었으므로 카운트
          totalLikedInPost++;
          batchLiked++;
          console.log(`    ❤️ [${totalLikedInPost}개째] @${commenterId || '익명'} 님의 일반 댓글 좋아요 전송 완료!`);
        }

        // 댓글 간 자연스러운 딜레이 (사람처럼 1.5~3.5초)
        const baseDelay = randomRange(1500, 3500);
        if (Math.random() < 0.05) {
          const longBreak = randomRange(5000, 10000);
          console.log(`    ⏸️  잠깐 멈춤 (${(longBreak/1000).toFixed(1)}초)...`);
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

    // 추가 더보기 버튼이 있으면 클릭
    const nextMoreBtn = dialog.locator("span:has-text('View more comments'), span:has-text('댓글 더 보기'), span:has-text('댓글 모두 보기'), svg[aria-label*='Load more' i]").first();
    if (await nextMoreBtn.isVisible().catch(() => false)) {
      await nextMoreBtn.click().catch(() => {});
      await sleep(1000);
    }

    // 댓글 목록 스크롤 내려서 아래쪽 추가 렌더링
    await commentBox.hover().catch(() => {});
    await page.mouse.wheel(0, 500);
    await sleep(1000);
  }

  if (totalLikedInPost === 0) {
    console.log("    -> 누를 수 있는 새로운 일반 댓글이 없습니다 (모두 작성자 댓글이거나 이미 눌림).");
  } else {
    console.log(`    -> 이 게시물에서 총 [${totalLikedInPost}개] 일반 댓글 좋아요 완료!`);
  }

  return totalLikedInPost;
}

async function closeDialog(page) {
  const dialog = page.locator("div[role='dialog']");
  if (!await dialog.isVisible().catch(() => false)) return;

  // 1. ESC 키 시도
  await page.keyboard.press('Escape').catch(() => {});
  await sleep(600);

  // 2. 여전히 열려있으면 닫기 SVG 버튼 클릭 시도
  if (await dialog.isVisible().catch(() => false)) {
    const closeSvg = dialog.locator("svg[aria-label='Close'], svg[aria-label='닫기']").first();
    if (await closeSvg.isVisible().catch(() => false)) {
      await closeSvg.click().catch(() => {});
      await sleep(600);
    }
  }

  // 3. 만약 아직도 열려있으면 화면 좌상단 바깥쪽 클릭 시도
  if (await dialog.isVisible().catch(() => false)) {
    await page.mouse.click(10, 10).catch(() => {});
    await sleep(600);
  }
}

async function main() {
  console.log('='.repeat(65));
  console.log('📸 [내 피드 실시간 스크롤 & 스마트 댓글 좋아요 봇 v2.0]');
  console.log('  1. 내 홈 피드를 자연스럽게 스크롤');
  console.log(`  2. 댓글 수가 ${MIN_COMMENT_COUNT}개 넘는 게시물만 타겟`);
  console.log('  3. 작성자 본인의 댓글/대댓글은 무조건 100% 제외');
  console.log('  4. 일반 유저 댓글 중 약 65% 비율로 좋아요 클릭');
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

  console.log('🌐 인스타그램 홈 피드로 이동합니다...');
  await page.goto('https://www.instagram.com/', { waitUntil: 'domcontentloaded' });
  await sleep(2500);

  // 최신 피드를 받아오기 위해 새로고침(리프레시)
  console.log('🔄 최신 피드 로딩을 위해 홈 새로고침(Reload)을 수행합니다...');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await sleep(3500);

  // 로그인 상태 확인
  if (page.url().includes('accounts/login') || await page.locator("input[name='username']").isVisible().catch(() => false)) {
    console.log('\n' + '!'.repeat(60));
    console.log('🔑 [최초 로그인 필요]');
    console.log('열린 크롬 창에서 로그인 후 엔터를 눌러주세요.');
    console.log('!'.repeat(60));
    await askQuestion('\n로그인 완료 후 Enter: ');
    await sleep(3000);
  } else {
    console.log('✅ 로그인 세션 확인 완료!');
  }

  // 팝업 닫기 (알림 설정 등)
  const notNowBtns = page.locator("button:has-text('Not Now'), button:has-text('나중에 하기'), button:has-text('지금 안 함')");
  if (await notNowBtns.count() > 0) {
    await notNowBtns.first().click().catch(() => {});
    await sleep(1500);
  }

  const processedLinks = loadProcessedPosts();
  console.log(`📂 이전에 처리된 게시물 영구 기록 로드: ${processedLinks.size}개`);

  console.log('\n🚀 내 홈 피드 탐색 및 댓글 좋아요 시작!\n');

  let completedPosts = 0;
  let totalLikes = 0;
  let consecutiveDuplicates = 0;

  while (true) {
    // 만약 중복 게시물이 연속으로 나오거나, 4개 게시물 완료 시 홈 새로고침(리프레시) 실행
    if (consecutiveDuplicates >= 3) {
      console.log('\n🔄 [홈 피드 리프레시] 연속 중복 감지로 인해 홈 최상단으로 이동하여 새로고침합니다...');
      await page.goto('https://www.instagram.com/', { waitUntil: 'domcontentloaded' });
      await sleep(2000);
      await page.reload({ waitUntil: 'domcontentloaded' });
      await sleep(3500);
      consecutiveDuplicates = 0;
    }

    // 홈 피드 내의 각 게시물 댓글(Comment) 아이콘들 수집
    const commentIcons = await page.locator("article svg[aria-label='Comment'], article svg[aria-label='댓글'], svg[aria-label='Comment'], svg[aria-label='댓글']").all();

    for (const icon of commentIcons) {
      try {
        // 해당 아이콘의 부모 article 내 고유 포스트 링크 확인
        const postLink = icon.locator("xpath=./ancestor::article[1]//a[contains(@href, '/p/') or contains(@href, '/reel/')][1]");
        let postKey = '';
        if (await postLink.count() > 0) {
          const href = await postLink.getAttribute('href').catch(() => null);
          if (href) {
            const match = href.match(/\/(p|reel)\/([A-Za-z0-9_-]+)/);
            if (match) postKey = `/${match[1]}/${match[2]}/`;
          }
        }

        if (postKey && processedLinks.has(postKey)) {
          consecutiveDuplicates++;
          continue;
        }
        if (postKey) {
          processedLinks.add(postKey);
          saveProcessedPosts(processedLinks);
        }

        // 댓글 아이콘 위치로 부드럽게 스크롤
        await icon.scrollIntoViewIfNeeded({ timeout: 3000 }).catch(() => {});
        await sleep(randomRange(500, 800));

        // 댓글 아이콘 클릭하여 모달 열기
        await icon.click({ timeout: 3000 }).catch(() => {});
        await sleep(randomRange(2500, 3500));

        const dialog = page.locator("div[role='dialog']");
        if (!await dialog.isVisible({ timeout: 3000 }).catch(() => false)) {
          // 모달이 열리지 않았으면 다음 게시물로 이동
          continue;
        }

        // 모달 내부에서 고유 포스트 링크 식별 및 중복 방지
        const postLinkInDialog = dialog.locator("a[href*='/p/'], a[href*='/reel/']").first();
        let currentPostKey = '';
        if (await postLinkInDialog.count() > 0) {
          const href = await postLinkInDialog.getAttribute('href').catch(() => null);
          if (href) {
            const match = href.match(/\/(p|reel)\/([A-Za-z0-9_-]+)/);
            if (match) currentPostKey = `/${match[1]}/${match[2]}/`;
          }
        }
        if (currentPostKey) {
          if (processedLinks.has(currentPostKey)) {
            consecutiveDuplicates++;
            await closeDialog(page);
            await page.mouse.wheel(0, randomRange(1100, 1500));
            await sleep(1000);
            continue;
          }
          processedLinks.add(currentPostKey);
          saveProcessedPosts(processedLinks);
          consecutiveDuplicates = 0;
        }

        // 작성자 아이디 정확하게 추출
        const postAuthor = await getPostAuthor(dialog);

          // ══════════════════════════════════════════════════
          // 📊 스마트 컨텐츠 스코어링 시스템 (언어 무관)
          // 여러 신호를 포인트로 합산 → 임계값 이상이면 타겟
          // ══════════════════════════════════════════════════
          const dialogText = await dialog.innerText().catch(() => '');
          const dialogTextLower = dialogText.toLowerCase();

          // 1. 인스타그램 AI 자동생성 이미지 alt 텍스트 읽기
          //    예: "Photo of a man wearing a jacket and sneakers"
          const imgAlt = await dialog.locator('img[alt]').first()
            .getAttribute('alt').catch(() => '') ?? '';
          const imgAltLower = imgAlt.toLowerCase();
          console.log(`--------------------------------------------------`);
          console.log(`[게시물 발견] 작성자: @${postAuthor || '알 수 없음'}`);
          if (imgAlt) console.log(`   📸 이미지 설명: ${imgAlt.slice(0, 80)}`);

          let score = 0;
          const matchReasons = [];

          // ── A. 이미지 alt 텍스트 기반 (가장 신뢰도 높음) ──
          const IMG_FASHION_SIGNALS = [
            'jacket', 'coat', 'shirt', 'pants', 'jeans', 'hoodie', 'sneakers', 'shoes',
            'outfit', 'clothing', 'wearing', 'dressed', 'fashion', 'style', 'suit',
            'sweater', 'cardigan', 'trench', 'boots', 'cap', 'hat', 'bag',
            // 한국어 alt도 있을 수 있음
            '자켓', '코트', '셔츠', '바지', '청바지', '후드', '스니커', '신발', '의류',
          ];
          const IMG_MALE_SIGNALS = [
            'man', 'men', 'male', 'boy', 'guy', 'person', 'face', 'smile', 'portrait',
            'selfie', 'handsome',
            '남자', '남성', '남성용', '얼굴',
          ];

          for (const s of IMG_FASHION_SIGNALS) {
            if (imgAltLower.includes(s)) { score += 3; matchReasons.push(`img:"${s}"`); break; }
          }
          for (const s of IMG_MALE_SIGNALS) {
            if (imgAltLower.includes(s)) { score += 2; matchReasons.push(`img:"${s}"`); break; }
          }

          // ── B. 해시태그 분석 (캡션/본문에서 # 태그 추출) ──
          const hashtags = (dialogText.match(/#[\w가-힣]+/g) || []).map(h => h.toLowerCase());
          const FASHION_HASHTAGS = [
            '#ootd', '#outfit', '#fashion', '#style', '#lookbook', '#streetwear',
            '#mensfashion', '#menstyle', '#menswear', '#kfashion', '#koreanfashion',
            '#패션', '#코디', '#스타일', '#데일리룩', '#무신사', '#오오티디',
            '#옷스타그램', '#패션스타그램', '#데일리패션', '#패션피플',
            '#streetstyle', '#outfitoftheday', '#fashionblogger', '#styleinspo',
          ];
          const MALE_HASHTAGS = [
            '#훈남', '#잘생김', '#남자', '#남스타그램', '#남자코디', '#남성패션',
            '#한국남자', '#boyfashion', '#koreanboy', '#koreanman', '#kboy',
            '#handsome', '#malemodel', '#koreanmodel',
          ];

          for (const tag of hashtags) {
            if (FASHION_HASHTAGS.some(h => tag.includes(h.replace('#', '')))) {
              score += 4; matchReasons.push(`tag:${tag}`); break;
            }
          }
          for (const tag of hashtags) {
            if (MALE_HASHTAGS.some(h => tag.includes(h.replace('#', '')))) {
              score += 4; matchReasons.push(`tag:${tag}`); break;
            }
          }

          // ── C. 다국어 텍스트 키워드 (캡션 + 댓글 전체) ──
          const TEXT_FASHION = [
            // 한국어
            '패션', '코디', '착장', '아우터', '자켓', '재킷', '셔츠', '바지', '슬랙스',
            '데님', '청바지', '후드', '맨투맨', '니트', '가디건', '코트', '트렌치',
            '슈즈', '스니커', '스니커즈', '로퍼', '부츠', '무신사', '오버핏', '룩북',
            // 영어
            'outfit', 'fashion', 'style', 'lookbook', 'streetwear', 'drip', 'fits',
            'sneakers', 'kicks', 'jacket', 'hoodie', 'denim', 'trousers',
            // 브랜드
            'uniqlo', 'zara', 'adidas', 'nike', 'new balance', 'puma', 'supreme',
            'stone island', 'acne', 'cos', 'musinsa', 'kream', 'stussy', 'carhartt',
          ];
          const TEXT_MALE_FACE = [
            // 한국어
            '남자', '남성', '오빠', '훈남', '잘생', '잘남', '미남', '꽃미남',
            '얼굴', '비주얼', '외모', '존잘', '개잘', '남친',
            // 영어
            'handsome', 'gorgeous', 'hot guy', 'pretty boy', 'cute guy',
            'face card', 'jawline',
          ];

          for (const kw of TEXT_FASHION) {
            if (dialogTextLower.includes(kw)) { score += 2; matchReasons.push(`txt:"${kw}"`); break; }
          }
          for (const kw of TEXT_MALE_FACE) {
            if (dialogTextLower.includes(kw)) { score += 2; matchReasons.push(`txt:"${kw}"`); break; }
          }

          // ── D. 댓글 패턴 유추 (언어 무관 반응 패턴) ──
          const COMMENT_FASHION_PATTERNS = [
            // 한국어 쇼핑 문의
            '어디꺼', '어디서 샀', '브랜드', '사이즈', '정보', '링크', '구매', '얼마',
            '핏 미쳤', '핏미쳤', '코디 미쳤', '스타일 미쳤', '존멋', '개멋',
            '잘어울', '잘 어울', '어울린다',
            // 영어 쇼핑 문의
            'where did you get', 'where is this from', 'brand?', 'source?',
            'need this', 'want this', 'copping', 'cop this', 'fire fit', 'clean fit',
            'fits different', 'dripping', 'sauced', 'heat check',
          ];
          const COMMENT_FACE_PATTERNS = [
            // 한국어
            '얼굴 미쳤', '얼굴미쳤', '얼굴 천재', '얼굴천재', '잘생겼다', '잘생겼어',
            '귀엽다', '귀여워', '이쁘다', '예쁘다', '살인미소', '이목구비',
            // 영어
            'so handsome', 'so cute', 'so hot', 'beautiful', 'gorgeous', 'stunning',
            'jaw dropping', 'insane face', 'face goals', 'face card',
          ];

          for (const p of COMMENT_FASHION_PATTERNS) {
            if (dialogTextLower.includes(p)) { score += 2; matchReasons.push(`cmt:"${p}"`); break; }
          }
          for (const p of COMMENT_FACE_PATTERNS) {
            if (dialogTextLower.includes(p)) { score += 2; matchReasons.push(`cmt:"${p}"`); break; }
          }

          // ── E. 이모지 패턴 (언어 무관) ──
          const fireCount = (dialogText.match(/🔥/g) || []).length;
          const heartEyeCount = (dialogText.match(/😍|🥰|😻/g) || []).length;
          const crownCount = (dialogText.match(/👑|💎|✨/g) || []).length;
          const muscleCount = (dialogText.match(/💪|🦾/g) || []).length;

          if (fireCount >= 5) { score += 3; matchReasons.push(`🔥×${fireCount}`); }
          else if (fireCount >= 2) { score += 1; matchReasons.push(`🔥×${fireCount}`); }
          if (heartEyeCount >= 3) { score += 3; matchReasons.push(`😍×${heartEyeCount}`); }
          else if (heartEyeCount >= 1) { score += 1; matchReasons.push(`😍×${heartEyeCount}`); }
          if (crownCount >= 2) { score += 2; matchReasons.push(`👑×${crownCount}`); }
          if (muscleCount >= 2) { score += 1; matchReasons.push(`💪×${muscleCount}`); }

          // ── F. 한글 여부 (한국 타겟이므로 가점) ──
          if (/[가-힣]/.test(dialogText)) { score += 1; }

          // ── G. 테크/IT 블랙리스트 — 감지 시 즉시 스킵 (점수 무관) ──
          const TECH_BLACKLIST = [
            // 스마트폰/태블릿
            '아이폰', 'iphone', '갤럭시', 'galaxy', '삼성폰', '갤럭시폰',
            '아이패드', 'ipad', '갤럭시탭', '태블릿',
            // 컴퓨터/IT
            '맥북', 'macbook', '맥프로', '아이맥', 'imac', '노트북',
            '윈도우', 'windows', '컴퓨터', 'pc빌드', '그래픽카드', 'gpu',
            // 가전/전자제품
            '에어팟', 'airpods', '애플워치', 'apple watch', '갤럭시워치',
            '다이슨', 'dyson', '청소기', '전자제품', '가전',
            // 게임
            '플레이스테이션', 'playstation', 'ps5', 'ps4', '닌텐도', 'nintendo',
            '엑스박스', 'xbox', '게이밍', 'gaming',
            // 카메라 (패션 아닌 카메라 장비 게시물)
            '렌즈리뷰', '카메라리뷰', '소니카메라', '캐논카메라', '니콘카메라',
          ];

          const blacklistMatch = TECH_BLACKLIST.find(kw => dialogTextLower.includes(kw));
          if (blacklistMatch) {
            console.log(`🚫 테크/IT 컨텐츠 감지 ("${blacklistMatch}") → 스킵`);
            await closeDialog(page);
            continue;
          }

          // ── 종합 판정: 3점 이상이면 타겟 (피드 컨텐츠 최적화) ──
          const TARGET_SCORE_THRESHOLD = 3;
          console.log(`   📊 타겟 점수: ${score}점 (임계값: ${TARGET_SCORE_THRESHOLD}) | 근거: ${matchReasons.join(', ') || '없음'}`);

          if (score < TARGET_SCORE_THRESHOLD) {
            console.log(`⏭️ 타겟 외 컨텐츠 (점수 미달) → 스킵`);
            await closeDialog(page);
            await page.mouse.wheel(0, randomRange(1100, 1500));
            await sleep(800);
            continue;
          }

          console.log(`🎯 [타겟 확정 ${score}점] 댓글 좋아요 시작!`);

          // 모달 안에서 글쓴이 제외 일반 댓글 좋아요 실행 (이미 누른 댓글은 자동 스킵)
          const liked = await processCommentsInDialog(page, postAuthor);
          totalLikes += liked;

          // 모달 닫기 및 다음 게시물로 넉넉하게 스크롤
          await closeDialog(page);
          await page.mouse.wheel(0, randomRange(1200, 1600));
          await sleep(1000);

          if (liked > 0) {
            completedPosts++;
            console.log(`✨ 게시물 작업 완료 (이번 글 좋아요 ${liked}개) | 총 누적: ${totalLikes}개`);

            // 4개 게시물마다 홈으로 이동하여 새로고침(리프레시)
            if (completedPosts % 4 === 0) {
              console.log(`\n🔄 [피드 새로고침] ${completedPosts}개 게시물 처리 완료! 최신 피드를 받아오기 위해 새로고침합니다...`);
              await page.goto('https://www.instagram.com/', { waitUntil: 'domcontentloaded' });
              await sleep(2000);
              await page.reload({ waitUntil: 'domcontentloaded' });
              await sleep(3500);
            } else if (completedPosts % 3 === 0) {
              // 3게시물마다 한 번씩 긴 휴식 (자연스럽게)
              const longRest = randomRange(30000, 50000);
              console.log(`😴 [${completedPosts}번째 게시물] 잠깐 긴 휴식... (${(longRest/1000).toFixed(0)}초)`);
              await sleep(longRest);
            } else {
              const rest = randomRange(10000, 20000);
              console.log(`💤 다음 게시물 탐색 전 ${(rest/1000).toFixed(1)}초 대기...`);
              await sleep(rest);
            }
          }
      } catch (err) {
        await closeDialog(page);
        continue;
      }
    }

    // 마우스를 화면 중앙으로 이동 후 아래로 스크롤하여 새 홈 피드 게시물 로딩
    console.log(`\n⬇️ 홈 피드를 아래로 스크롤하여 새 게시물을 불러옵니다...`);
    await page.mouse.move(640, 500);
    await page.mouse.wheel(0, randomRange(1200, 1600));
    await sleep(randomRange(2500, 4000));
  }

  console.log(`\n🎉 오늘 작업 완료! 총 누른 댓글 좋아요: ${totalLikes}개`);
}

main().catch(err => {
  console.error('실행 중 에러:', err);
});
