import { chromium } from 'playwright-core';
import path from 'path';
import readline from 'readline';

const USER_DATA_DIR = path.resolve(process.cwd(), '.insta_chrome_profile');
const TARGET_USERNAME = process.argv[2] || 'seoooojinnn';

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

// 모달 안에서 글쓴이(targetUser) 제외하고 모든 댓글 좋아요
async function processCommentsInDialog(page, targetAuthor) {
  await sleep(randomRange(1500, 2000));
  const dialog = page.locator("div[role='dialog']");

  console.log(`    👤 기준 글쓴이 아이디: @${targetAuthor} (글쓴이 댓글 제외)`);

  let commentBox = dialog.locator("ul:has(li)").first();
  if (!await commentBox.isVisible().catch(() => false)) {
    commentBox = dialog;
  }

  // 댓글 더보기 버튼을 클릭하여 가능한 많은 댓글 로드
  let moreClickCount = 0;
  while (moreClickCount < 10) {
    const moreBtn = dialog.locator("span:has-text('View more comments'), span:has-text('댓글 더 보기'), span:has-text('댓글 모두 보기'), svg[aria-label*='Load more' i], button:has-text('더 보기')").first();
    if (await moreBtn.isVisible().catch(() => false)) {
      await moreBtn.click().catch(() => {});
      moreClickCount++;
      await sleep(randomRange(1000, 1500));
    } else {
      break;
    }
  }

  let totalLikedInPost = 0;
  let noNewCommentsCount = 0;
  const processedSignatures = new Set();

  while (noNewCommentsCount < 4) {
    // 오직 댓글(li) 내부의 '좋아요(Like)' SVG만 탐색 (게시물 자체 좋아요 section 절대 제외)
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

        // 중복 클릭 방지용 시그니처
        const sig = `${commenterId}_${rowText.slice(0, 30)}`;
        if (processedSignatures.has(sig)) continue;
        processedSignatures.add(sig);

        // [글쓴이 본인 제외 조건]
        const isAuthor = (targetAuthor && commenterId && commenterId.toLowerCase() === targetAuthor.toLowerCase()) ||
                         (targetAuthor && commenterId === '' && rowText.toLowerCase().includes(targetAuthor.toLowerCase())) ||
                         rowText.includes('Author') ||
                         rowText.includes('작성자');

        if (isAuthor) {
          console.log(`    [글쓴이 제외] @${commenterId || targetAuthor} 님의 댓글/답글은 건너뜁니다.`);
          continue;
        }

        // 좋아요 버튼 클릭: span > svg 아이콘 클릭
        await svg.scrollIntoViewIfNeeded().catch(() => {});
        await svg.hover().catch(() => {});
        await sleep(randomRange(200, 350));
        await svg.click({ force: true }).catch(() => {});

        // 인스타그램 서버 응답 대기
        await sleep(1500);

        // 검증
        const likedSvg = commentRow.locator("svg[aria-label='Unlike'], svg[aria-label='좋아요 취소']");
        let isSuccess = await likedSvg.isVisible().catch(() => false);

        if (!isSuccess) {
          const parentSpan = svg.locator("xpath=..");
          await parentSpan.click({ force: true }).catch(() => {});
          await sleep(1200);
          isSuccess = await likedSvg.isVisible().catch(() => false);
        }

        // 활동 제한 팝업 감지
        const actionBlock = page.locator("text='Try again later', text='나중에 다시 시도하세요', text='활동이 제한되었습니다'");
        if (await actionBlock.count() > 0 && await actionBlock.first().isVisible().catch(() => false)) {
          console.log('\n⚠️ [경고] 인스타그램 활동 제한(Action Block) 감지됨! 안전을 위해 작업을 정지합니다.');
          const okBtn = page.locator("button:has-text('OK'), button:has-text('확인')");
          await okBtn.click().catch(() => {});
          return totalLikedInPost;
        }

        totalLikedInPost++;
        batchLiked++;
        console.log(`    ❤️ [${totalLikedInPost}개째] @${commenterId || '익명'} 님의 일반 댓글 좋아요 완료! ${isSuccess ? '✅' : ''}`);

        // 댓글 간 딜레이 (사람처럼 1.5~3초)
        const baseDelay = randomRange(1500, 3000);
        await sleep(baseDelay);
      } catch (e) {
        continue;
      }
    }

    if (batchLiked === 0) {
      noNewCommentsCount++;
    } else {
      noNewCommentsCount = 0;
    }

    // 추가 더보기 버튼 시도
    const nextMoreBtn = dialog.locator("span:has-text('View more comments'), span:has-text('댓글 더 보기'), span:has-text('댓글 모두 보기'), svg[aria-label*='Load more' i], button:has-text('더 보기')").first();
    if (await nextMoreBtn.isVisible().catch(() => false)) {
      await nextMoreBtn.click().catch(() => {});
      await sleep(1200);
    }

    // 댓글 목록 아래로 스크롤
    await commentBox.hover().catch(() => {});
    await page.mouse.wheel(0, 600);
    await sleep(1000);
  }

  console.log(`    -> 이 게시물에서 총 [${totalLikedInPost}개] 일반 댓글 좋아요 처리!`);
  return totalLikedInPost;
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
  console.log(`📸 [타겟 프로필 (@${TARGET_USERNAME}) 게시물 댓글 전체 좋아요 봇]`);
  console.log('  1. 타겟 유저 프로필 페이지 접속');
  console.log('  2. 각 게시물을 순차적으로 열어서 댓글 확인');
  console.log('  3. 작성자 본인(@' + TARGET_USERNAME + ') 댓글은 무조건 제외');
  console.log('  4. 일반 댓글들에 안전 딜레이를 지켜가며 좋아요 클릭');
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

  const profileUrl = `https://www.instagram.com/${TARGET_USERNAME}/`;
  console.log(`🌐 @${TARGET_USERNAME} 프로필로 이동: ${profileUrl}`);
  await page.goto(profileUrl, { waitUntil: 'domcontentloaded' });
  await sleep(3000);

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

  // 팝업 닫기
  const notNowBtns = page.locator("button:has-text('Not Now'), button:has-text('나중에 하기'), button:has-text('지금 안 함')");
  if (await notNowBtns.count() > 0) {
    await notNowBtns.first().click().catch(() => {});
    await sleep(1500);
  }

  // 프로필 내 모든 게시물 링크 수집
  console.log(`\n🔍 @${TARGET_USERNAME} 의 게시물 목록을 스캔합니다...`);

  // 피드 아래로 천천히 스크롤하며 게시물 링크들 수집
  const postUrls = new Set();
  let scrollAttempts = 0;
  const maxScrollAttempts = 6; // 게시물이 많은 경우 적절히 스크롤

  while (scrollAttempts < maxScrollAttempts) {
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

    await page.mouse.wheel(0, 1000);
    await sleep(1500);
    scrollAttempts++;
  }

  const postList = Array.from(postUrls);
  console.log(`\n📌 총 ${postList.length}개의 게시물(피드/릴스)을 발견했습니다!`);

  if (postList.length === 0) {
    console.log('⚠️ 게시물을 찾을 수 없습니다. 비공개 계정이거나 게시물이 없을 수 있습니다.');
    return;
  }

  let totalLikedAcrossAllPosts = 0;
  let postIdx = 0;

  for (const postUrl of postList) {
    postIdx++;
    console.log(`\n==================================================`);
    console.log(`[게시물 ${postIdx}/${postList.length}] 열기: ${postUrl}`);

    try {
      await page.goto(postUrl, { waitUntil: 'domcontentloaded' });
      await sleep(randomRange(2500, 3500));

      // 모달/게시물 페이지 내 댓글 처리
      // 단독 게시물 페이지는 dialog 형태일 수도 있고 일반 메인 컨텐츠 영역일 수도 있음
      let dialog = page.locator("div[role='dialog']");
      let isDialog = await dialog.isVisible({ timeout: 2000 }).catch(() => false);

      let targetContainer = isDialog ? dialog : page.locator("main");

      // 댓글 박스 탐색
      let commentBox = targetContainer.locator("ul:has(li)").first();

      // 댓글 더보기 버튼 탐색 & 클릭
      for (let m = 0; m < 10; m++) {
        const moreBtn = targetContainer.locator("span:has-text('View more comments'), span:has-text('댓글 더 보기'), span:has-text('댓글 모두 보기'), svg[aria-label*='Load more' i], button:has-text('더 보기')").first();
        if (await moreBtn.isVisible().catch(() => false)) {
          await moreBtn.click().catch(() => {});
          await sleep(randomRange(1200, 1800));
        } else {
          break;
        }
      }

      let totalLikedInPost = 0;
      let noNewCommentsCount = 0;
      const processedSignatures = new Set();

      while (noNewCommentsCount < 3) {
        const likeSvgs = await targetContainer.locator("li svg[aria-label='Like'], li svg[aria-label='좋아요']").all();
        let batchLiked = 0;

        for (const svg of likeSvgs) {
          try {
            if (!await svg.isVisible().catch(() => false)) continue;

            const liCount = await svg.locator("xpath=./ancestor::li[1]").count();
            if (liCount === 0) continue;
            const commentRow = svg.locator("xpath=./ancestor::li[1]");

            // 대댓글 제외 체크
            const isReply = await svg.locator("xpath=./ancestor::li[1]/parent::ul/parent::li").count() > 0;
            if (isReply) continue;

            // 댓글 작성자 아이디 추출
            let commenterId = '';
            const userLinks = await commentRow.locator("a[href^='/']:not([href*='/p/']):not([href*='/explore/']):not([href*='/reel/'])").all();
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
            const isAuthor = (commenterId && commenterId.toLowerCase() === TARGET_USERNAME.toLowerCase()) ||
                             (commenterId === '' && rowText.toLowerCase().includes(TARGET_USERNAME.toLowerCase())) ||
                             rowText.includes('Author') ||
                             rowText.includes('작성자');

            if (isAuthor) {
              console.log(`    [글쓴이 제외] @${commenterId || TARGET_USERNAME} 본인 댓글/답글 스킵`);
              continue;
            }

            // 클릭
            await svg.scrollIntoViewIfNeeded().catch(() => {});
            await svg.hover().catch(() => {});
            await sleep(randomRange(200, 350));
            await svg.click({ force: true }).catch(() => {});

            await sleep(1500);

            const likedSvg = commentRow.locator("svg[aria-label='Unlike'], svg[aria-label='좋아요 취소']");
            let isSuccess = await likedSvg.isVisible().catch(() => false);

            if (!isSuccess) {
              const parentSpan = svg.locator("xpath=..");
              await parentSpan.click({ force: true }).catch(() => {});
              await sleep(1200);
              isSuccess = await likedSvg.isVisible().catch(() => false);
            }

            // 활동 제한 팝업 감지
            const actionBlock = page.locator("text='Try again later', text='나중에 다시 시도하세요', text='활동이 제한되었습니다'");
            if (await actionBlock.count() > 0 && await actionBlock.first().isVisible().catch(() => false)) {
              console.log('\n⚠️ [경고] 인스타그램 활동 제한(Action Block) 감지됨! 정지합니다.');
              return;
            }

            totalLikedInPost++;
            batchLiked++;
            totalLikedAcrossAllPosts++;
            console.log(`    ❤️ [${totalLikedInPost}개째 / 누적 ${totalLikedAcrossAllPosts}개] @${commenterId || '익명'} 님의 일반 댓글 좋아요 완료! ${isSuccess ? '✅' : ''}`);

            const baseDelay = randomRange(1800, 3200);
            await sleep(baseDelay);
          } catch (e) {
            continue;
          }
        }

        if (batchLiked === 0) {
          noNewCommentsCount++;
        } else {
          noNewCommentsCount = 0;
        }

        const nextMoreBtn = targetContainer.locator("span:has-text('View more comments'), span:has-text('댓글 더 보기'), span:has-text('댓글 모두 보기'), svg[aria-label*='Load more' i], button:has-text('더 보기')").first();
        if (await nextMoreBtn.isVisible().catch(() => false)) {
          await nextMoreBtn.click().catch(() => {});
          await sleep(1200);
        }

        // 스크롤 다운
        await commentBox.hover().catch(() => {});
        await page.mouse.wheel(0, 600);
        await sleep(1000);
      }

      console.log(`✨ [게시물 ${postIdx}] 완료 (이번 글 좋아요 ${totalLikedInPost}개) | 총 누적: ${totalLikedAcrossAllPosts}개`);

      // 게시물 간 휴식 (사람처럼 7~15초)
      const rest = randomRange(7000, 15000);
      console.log(`💤 다음 게시물로 넘어가기 전 ${(rest/1000).toFixed(1)}초 대기...`);
      await sleep(rest);

    } catch (err) {
      console.log(`⚠️ 게시물 처리 중 에러:`, err.message);
      continue;
    }
  }

  console.log(`\n🎉 @${TARGET_USERNAME} 프로필 모든 게시물 댓글 좋아요 작업 완료! 총 누적: ${totalLikedAcrossAllPosts}개`);
}

main().catch(err => {
  console.error('실행 중 에러:', err);
});
