import { chromium } from 'playwright-core';
import path from 'path';
import fs from 'fs';

const USER_DATA_DIR = path.resolve(process.cwd(), '.knou_chrome_profile');
const START_URL = 'https://ucampus.knou.ac.kr/ekp/user/study/retrieveUMYStudy.sdo';

console.log('='.repeat(65));
console.log('🚀 [KNOU U-Campus 스마트 자동 연속 수강 봇] v2.0');
console.log('='.repeat(65));
console.log('📌 자동화 프로세스 설계:');
console.log('  1. 메인 과목/강의 목록에서 [미완료 강의] 자동 탐색');
console.log('  2. [강의보기] 클릭하여 새 창/탭으로 플레이어 오픈');
console.log('  3. 플레이어 창: 영상 자동 재생 + 실시간 진도율 추적');
console.log('  4. 플레이어 창: 객관식/OX 퀴즈 자동 선택 및 정답 제출');
console.log('  5. 차시 완료 시 [다음 차시] 자동 클릭 (모든 차시 끝날 때까지)');
console.log('  6. 한 과목/강의 완료 시 다시 목록에서 다음 미완료 강의로 이동');
console.log('='.repeat(65));

async function main() {
  const context = await chromium.launchPersistentContext(USER_DATA_DIR, {
    channel: 'chrome',
    headless: false,
    viewport: null,
    args: [
      '--autoplay-policy=no-user-gesture-required',
      '--disable-blink-features=AutomationControlled',
      '--disable-popup-blocking',
      '--no-default-browser-check',
      '--start-maximized'
    ]
  });

  context.on('page', (newPage) => {
    console.log(`[새 창 감지] ${newPage.url()}`);
    setupDialogHandler(newPage);
    newPage.on('close', async () => {
      console.log(`[팝업 창 닫힘 감지] 메인 화면 새로고침하여 진도율 갱신`);
      try {
        const pages = context.pages().filter(p => !p.isClosed());
        if (pages.length > 0) {
          await pages[0].reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
        }
      } catch (e) {}
    });
  });

  const pages = context.pages();
  const mainPage = pages.length > 0 ? pages[0] : await context.newPage();
  setupDialogHandler(mainPage);

  console.log(`\n🔗 KNOU 페이지로 이동합니다: ${START_URL}`);
  console.log('👉 [안내] 로그인 창이 뜨면 로그인해 주세요. 이후 모든 과정은 봇이 자동으로 처리합니다.\n');

  try {
    await mainPage.goto(START_URL, { waitUntil: 'domcontentloaded' });
  } catch (err) {
    console.log(`페이지 로딩: ${err.message}`);
  }

  // 메인 모니터링 루프 (1.5초 주기 - 고속 반응)
  setInterval(async () => {
    try {
      const activePages = context.pages().filter(p => !p.isClosed());
      await processAutomationCycle(context, activePages);
    } catch (e) {
      // 페이지 전환 도중 에러 무시
    }
  }, 1500);
}

// 오늘 1일 학습량(7강) 초과로 수강 불가인 과목 및 제작중/완료 과목 동적 추적
const globalExhaustedCourses = new Set();
let currentPlayingCourseTitle = '';

async function closePlayerAndAdvanceToNextCourse(playerPage, mainPage, courseTitle) {
  try {
    if (playerPage && !playerPage.isClosed()) {
      await playerPage.close().catch(() => {});
    }
  } catch (e) {}

  const target = courseTitle || currentPlayingCourseTitle;
  if (target) {
    globalExhaustedCourses.add(target);
  }

  if (mainPage && !mainPage.isClosed()) {
    await mainPage.evaluate((cTitle) => {
      let saved = [];
      try {
        saved = JSON.parse(sessionStorage.getItem('__knou_exhausted_courses') || '[]');
      } catch (e) {}

      const activeCourse = document.querySelector('.lecture-progress-item:not(.inactive)');
      const activeTitle = activeCourse ? (activeCourse.querySelector('.lecture-title')?.innerText || '').trim() : '';
      const t = cTitle || activeTitle;
      if (t && !saved.includes(t)) {
        saved.push(t);
      }
      sessionStorage.setItem('__knou_exhausted_courses', JSON.stringify(saved));
      if (window.__knou_exhausted_courses && t) {
        window.__knou_exhausted_courses.add(t);
      }
    }, target).catch(() => {});

    await mainPage.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
  }
}

function setupDialogHandler(page) {
  page.on('dialog', async (dialog) => {
    const msg = dialog.message() || '';
    console.log(`\n📢 [팝업 감지 -> 자동 확인 후 재시도] "${msg}"`);
    try {
      await dialog.accept();
    } catch (e) {}

    if (msg.includes('제작중') || msg.includes('준비중')) {
      console.log(`\n⚠️ [제작중 알림 감지] "${msg}" -> 강의 제작중 확인되어 팝업을 닫고 다음 과목으로 넘어갑니다.`);
      try {
        if (!page.url().includes('retrieveUMYStudy')) {
          await page.close().catch(() => {});
        }
      } catch (e) {}
    }

    if (msg.includes('최대 학습량') || msg.includes('최대학습량') || msg.includes('초과하였습니다') || msg.includes('진도율이 저장되지 않습니다')) {
      console.log(`\n⚠️ [1일 최대 학습량(7강) 초과 감지] "${msg}" -> 오늘 이 과목은 더 이상 진도율이 저장되지 않으므로 플레이어를 닫고 다음 과목으로 넘어갑니다.`);
      try {
        if (!page.url().includes('retrieveUMYStudy')) {
          await page.close().catch(() => {});
        }
        const pages = page.context().pages();
        const mainPage = pages.find(p => p.url().includes('retrieveUMYStudy')) || pages[0];
        if (mainPage && !mainPage.isClosed()) {
          await closePlayerAndAdvanceToNextCourse(page, mainPage, currentPlayingCourseTitle);
        }
      } catch (e) {}
    }
  });
}

let lastProgressLogTime = 0;
let lastActionTime = 0;
let choiceIndex = 0;

let currentLectureStudiedMinutes = 0;
let currentLectureTotalMinutes = 0;
let currentSessionPlayedSeconds = 0;
let lastSessionCheckTime = 0;
let hasReachedVideoEndOnce = false;

async function processAutomationCycle(context, activePages) {
  const now = Date.now();

  // 1. 메인 포털 창과 새 창으로 열린 '강의 플레이어 팝업 창' 명확히 분리
  const mainPage = activePages.find(p => p.url().includes('retrieveUMYStudy')) || activePages[0];

  // 불필요한 크롬 기본 빈 탭(chrome://new-tab-page/ 등) 자동 정리
  for (const p of activePages) {
    if (p !== mainPage && (p.url().includes('chrome://') || p.url().includes('chrome-untrusted://'))) {
      await p.close().catch(() => {});
    }
  }

  const lecturePopupPage = activePages.find(p => p !== mainPage && !p.isClosed() && !p.url().includes('chrome://') && !p.url().includes('about:blank') && p.url().includes('knou.ac.kr')) || null;

  // -------------------------------------------------------------
  // [우선순위 1] '강의 플레이어 팝업 창'이 열려있는 경우 -> 팝업 비디오/퀴즈 창에서만 작업 수행!
  // -------------------------------------------------------------
  if (lecturePopupPage && !lecturePopupPage.isClosed()) {
    // A. 현재 열려있는 팝업 플레이어가 '제작중입니다' 상태인지 실시간 감지
    const isWaitingPage = await lecturePopupPage.evaluate(() => {
      const bText = document.body ? (document.body.innerText || '') : '';
      const hasWaitingBadge = document.querySelector('.con-waiting, [class*="waiting"]') !== null;
      const hasWaitingTxt = bText.includes('제작중입니다') || bText.includes('강의가 준비중입니다') || bText.includes('콘텐츠 준비중');
      const hasVideo = document.querySelectorAll('video').length > 0;
      return hasWaitingBadge || hasWaitingTxt || (!hasVideo && (bText.includes('제작중') || bText.includes('준비중')));
    }).catch(() => false);

    if (isWaitingPage) {
      console.log(`\n⚠️ [제작중 강의 감지] 현재 강의가 '제작중입니다'. 플레이어를 닫고 다음 과목으로 넘어갑니다.`);
      await closePlayerAndAdvanceToNextCourse(lecturePopupPage, mainPage, currentPlayingCourseTitle);
      return;
    }

    // B. 1일 최대 학습량(7강) 초과 팝업/텍스트 실시간 감지
    const isLimitExceeded = await lecturePopupPage.evaluate(() => {
      const bText = document.body ? (document.body.innerText || '') : '';
      return bText.includes('최대 학습량') || bText.includes('최대학습량') || bText.includes('초과하였습니다') || bText.includes('진도율이 저장되지 않습니다');
    }).catch(() => false);

    if (isLimitExceeded) {
      console.log(`\n⚠️ [1일 최대 학습량 초과 감지] 오늘 이 과목(${currentPlayingCourseTitle || '현재 과목'})은 학습량(7강) 초과로 진도율이 저장되지 않습니다. 플레이어를 닫고 다음 과목으로 이동합니다.`);
      await closePlayerAndAdvanceToNextCourse(lecturePopupPage, mainPage, currentPlayingCourseTitle);
      return;
    }

    let examAllDone = false;
    let hasExamOnPage = false;

    // [퀴즈 처리] 네이티브 Playwright 및 DOM 연동으로 정확한 상태 판정 및 순차 풀이
    for (const p of [lecturePopupPage, mainPage].filter(Boolean)) {
      try {
        const hasExam = await p.evaluate(() => {
          // 일반적인 폼(frm_)을 제외하고, 실제 퀴즈 UI 요소가 DOM에 렌더링되어 있는지 정확히 검사
          const examEls = document.querySelectorAll('.exam-content-box, .exam-number-btn, .exam-checkmark, .exam-body');
          return examEls.length > 0;
        }).catch(() => false);

        if (hasExam) {
          hasExamOnPage = true;
          const qState = await p.evaluate(() => {
            const allTabs = Array.from(document.querySelectorAll('.exam-number-btn'));
            const markList = Array.from(document.querySelectorAll('.exam-checkmark li'));
            const activeTabIdx = allTabs.findIndex(t => t.classList.contains('active'));
            
            // 오직 현재 활성화된 탭의 checkmark가 active인지 확인
            const isCurrentMarkActive = activeTabIdx >= 0 && markList[activeTabIdx] ? markList[activeTabIdx].classList.contains('active') : false;

            // 현재 표시된 문항 영역 내부의 채점 결과 확인 (반드시 '정답'이어야 하고 '오답'이 아니어야 함!)
            const visibleBody = document.querySelector('.exam-body:not(.exam-body-hidden)');
            const cansYnText = visibleBody ? (visibleBody.querySelector('.cansYn')?.innerText?.trim() || '') : '';
            const isCansYnDone = cansYnText.includes('정답') && !cansYnText.includes('오답');

            // 현재 문항이 완료되었는지는 오직 해당 문항의 체크마크 active 또는 채점 결과(정답)로만 판단!
            const isCurrentDone = isCurrentMarkActive || isCansYnDone;

            // 모든 문항이 완료되었는지 판정
            const allDone = markList.length > 0 && markList.every(m => m.classList.contains('active'));

            return {
              activeTabIdx,
              totalTabs: allTabs.length,
              isCurrentDone,
              allDone
            };
          }).catch(() => null);

          if (qState) {
            if (qState.allDone) {
              examAllDone = true;
            }

            if (qState.isCurrentDone) {
              // 1. 현재 문제가 완료(active)되었으므로 [다음] 버튼이 있으면 클릭!
              const nextBtnClicked = await p.evaluate(() => {
                const nextBtn = document.querySelector('.exam-desc-btn-group button.btnNext, button.btnNext, .btnNext');
                if (nextBtn && nextBtn.offsetParent !== null && window.getComputedStyle(nextBtn).display !== 'none') {
                  nextBtn.click();
                  return true;
                }
                return false;
              }).catch(() => false);

              if (nextBtnClicked) {
                console.log('⚡ [퀴즈] [다음] 버튼 클릭 -> 다음 문항으로 이동!');
                choiceIndex = 0;
                await p.waitForTimeout(1200);
              } else if (!qState.allDone) {
                // 2. [다음] 버튼이 없으면 아직 active 되지 않은 첫 번째 미완료 문항 탭으로 이동
                const switched = await p.evaluate(() => {
                  const allTabs = Array.from(document.querySelectorAll('.exam-number-btn'));
                  const markList = Array.from(document.querySelectorAll('.exam-checkmark li'));

                  for (let i = 0; i < allTabs.length; i++) {
                    const isMarkActive = markList[i] ? markList[i].classList.contains('active') : false;
                    if (!isMarkActive) {
                      const link = allTabs[i].querySelector('a');
                      if (link) {
                        link.click();
                        return { switched: true, target: `Q${i + 1}` };
                      }
                    }
                  }
                  return { switched: false };
                }).catch(() => ({ switched: false }));

                if (switched && switched.switched) {
                  console.log(`⚡ [퀴즈] 미완료 문항(${switched.target}) 탭 클릭 -> 이동 완료!`);
                  choiceIndex = 0;
                  await p.waitForTimeout(1200);
                }
              }
            } else {
              // 현재 미완료 문항 제대로 풀기!
              const activeExam = p.locator('form[id^="frm_"]:has(.exam-body:not(.exam-body-hidden)), .exam-body:not(.exam-body-hidden)').first();
              const radios = activeExam.locator('input.answerCh, input[type="radio"]');
              const radioCount = await radios.count();

              if (radioCount > 0) {
                const pickIdx = choiceIndex % radioCount;

                // 1) JavaScript 레벨 radio 체크
                await activeExam.evaluate((el, idx) => {
                  const rList = Array.from(el.querySelectorAll('input.answerCh, input[type="radio"]'));
                  if (rList.length > 0) {
                    const r = rList[idx % rList.length];
                    r.checked = true;
                    r.setAttribute('checked', 'checked');
                    if (typeof window.$ === 'function') {
                      window.$(r).prop('checked', true).trigger('click').trigger('change');
                    }
                    r.dispatchEvent(new Event('change', { bubbles: true }));
                  }
                }, pickIdx);

                // 2) 실제 UI 라벨 클릭
                const labelLoc = activeExam.locator('.lists label').nth(pickIdx);
                if (await labelLoc.count() > 0) {
                  await labelLoc.scrollIntoViewIfNeeded().catch(() => {});
                  await labelLoc.click({ force: true });
                }

                console.log(`⚡ [퀴즈] 객관식 보기 ${pickIdx + 1}번 선택 확인`);
                await p.waitForTimeout(1000);

                // 3) [확인] 클릭 및 다음 시도를 위해 choiceIndex 증가
                const confirmBtn = activeExam.locator('button.confirmAnswer, .confirmAnswer, input[value="확인"]').first();
                if (await confirmBtn.count() > 0) {
                  await confirmBtn.scrollIntoViewIfNeeded().catch(() => {});
                  await confirmBtn.click({ force: true });
                  console.log('⚡ [퀴즈] [확인] 제출 완료!');
                  choiceIndex = (choiceIndex + 1) % radioCount;
                  await p.waitForTimeout(1500);
                }
              } else {
                // 주관식 문항
                const txtInput = activeExam.locator('input.answerTxt, input[placeholder*="정답"]').first();
                if (await txtInput.count() > 0) {
                  await txtInput.scrollIntoViewIfNeeded().catch(() => {});
                  await txtInput.click({ force: true });
                  await txtInput.fill('트리플바텀라인');
                  console.log('⚡ [퀴즈] 주관식 정답 입력 완료!');
                  await p.waitForTimeout(1000);

                  const confirmBtn = activeExam.locator('button.confirmAnswer, .confirmAnswer, input[value="확인"]').first();
                  if (await confirmBtn.count() > 0) {
                    await confirmBtn.scrollIntoViewIfNeeded().catch(() => {});
                    await confirmBtn.click({ force: true });
                    console.log('⚡ [퀴즈] [확인] 제출 완료!');
                    await p.waitForTimeout(1500);
                  }
                }
              }
            }
          }
        }
      } catch (e) {}
    }

    // 팝업 창 및 플레이어의 비디오 진행률 체크 및 다음 강의 이동
    try {
      const playerPage = lecturePopupPage || mainPage;
      const vInfo = await inspectPlayerState([lecturePopupPage, mainPage]);

      // 실제 플레이어에서 재생된 현실 시간(초) 누적
      if (vInfo && vInfo.hasVideo && !vInfo.paused && vInfo.duration > 0) {
        const checkNow = Date.now();
        if (lastSessionCheckTime > 0) {
          const deltaSec = (checkNow - lastSessionCheckTime) / 1000;
          if (deltaSec > 0 && deltaSec < 5) {
            currentSessionPlayedSeconds += deltaSec;
          }
        }
        lastSessionCheckTime = checkNow;
      } else {
        lastSessionCheckTime = Date.now();
      }

      // 시작 시 totalMinutes를 못 가져왔다면 vInfo.duration으로 보정
      if (currentLectureTotalMinutes === 0 && vInfo && vInfo.duration > 0) {
        currentLectureTotalMinutes = Math.ceil(vInfo.duration / 60);
      }

      const totalStudiedMinutes = currentLectureStudiedMinutes + (currentSessionPlayedSeconds / 60);
      const targetDurationMinutes = currentLectureTotalMinutes > 0 ? currentLectureTotalMinutes : (vInfo.duration / 60);
      // 방송대 출석 인정 기준: 전체 강의 시간의 75% 이상 수강. 
      // 시간이 과도하게 초과(881분, 5665분 등)되지 않도록 75% 기준에 안전마진을 더한 딱 76%로 목표 설정!
      const requiredStudyMinutes = targetDurationMinutes * 0.76;

      if (vInfo && vInfo.hasVideo && vInfo.duration > 0 && (now - lastProgressLogTime > 5000)) {
        lastProgressLogTime = now;
        const curM = Math.floor(vInfo.currentTime / 60);
        const curS = Math.floor(vInfo.currentTime % 60);
        const totM = Math.floor(vInfo.duration / 60);
        const totS = Math.floor(vInfo.duration % 60);
        console.log(`[영상 진행 (2배속)] 영상: ${String(curM).padStart(2, '0')}:${String(curS).padStart(2, '0')} / ${String(totM).padStart(2, '0')}:${String(totS).padStart(2, '0')} (${vInfo.progress.toFixed(1)}%) | ⏱ 누적 학습시간: ${totalStudiedMinutes.toFixed(1)}분 / 출석인정 목표: ${requiredStudyMinutes.toFixed(1)}분 (76%) | 상태: ${vInfo.paused ? '일시정지' : '재생중'}`);
      }

      // 영상이 1회 완독(>= 98% 또는 ended)되었는지 확인
      if (vInfo && vInfo.hasVideo && (vInfo.ended || (vInfo.duration > 0 && (vInfo.currentTime / vInfo.duration) >= 0.98))) {
        hasReachedVideoEndOnce = true;
      }

      // 영상 1회 완독 후에도 누적 학습시간이 출석 인정 기준(76%)에 미달하면 -> 처음부터 다시 재생하여 딱 76%까지 시간 채우기!
      if (vInfo && vInfo.hasVideo && hasReachedVideoEndOnce && (totalStudiedMinutes < requiredStudyMinutes)) {
        if (vInfo.ended || (vInfo.duration > 0 && (vInfo.currentTime / vInfo.duration) >= 0.98)) {
          console.log(`\n🔄 [출석 인정 76% 시간 채우기] 영상 1회 완독 완료! 현재 누적 시간(${totalStudiedMinutes.toFixed(1)}분)이 출석 인정 기준(${requiredStudyMinutes.toFixed(1)}분)에 미달하여 2배속으로 다시 재생합니다.`);
          await playerPage.evaluate(() => {
            function findVideos(root) {
              let found = [];
              try {
                found = Array.from(root.querySelectorAll('video'));
                const all = Array.from(root.querySelectorAll('*'));
                for (const el of all) {
                  if (el.shadowRoot) found = found.concat(findVideos(el.shadowRoot));
                  if (el.tagName === 'IFRAME') {
                    try {
                      const doc = el.contentDocument || el.contentWindow?.document;
                      if (doc) found = found.concat(findVideos(doc));
                    } catch (e) {}
                  }
                }
              } catch (e) {}
              return found;
            }
            const vids = findVideos(document);
            for (const v of vids) {
              v.currentTime = 0;
              v.playbackRate = 2.0;
              v.play().catch(() => {});
            }
          }).catch(() => {});
          await playerPage.waitForTimeout(2000);
        }
      }

      // 영상이 완료되었으나 아직 퀴즈가 풀리지 않은 경우 -> 연습문제 탭/버튼 클릭 시도
      if (vInfo && vInfo.hasVideo && hasReachedVideoEndOnce && !examAllDone) {
        await playerPage.evaluate(() => {
          const quizTab = Array.from(document.querySelectorAll('a, button, li, span')).find(el => {
            const txt = (el.innerText || el.textContent || '').trim();
            return (txt.includes('연습문제') || txt.includes('형성평가') || txt.includes('평가하기')) && el.offsetParent !== null;
          });
          if (quizTab) quizTab.click();
        }).catch(() => {});
      }

      // 다음 강의로 이동 조건:
      // A) 영상이 감지된 경우: 출석 인정 기준(76%) 달성 시 지체 없이 즉시 완료 처리!
      //    (더 이상 881분, 5665분 등으로 초과 재생되지 않도록 목표 달성 즉시 종료)
      // B) 영상이 없는 퀴즈 전용 페이지인 경우: 모든 퀴즈 완료(examAllDone) 필수!
      const isVideoPlaying = vInfo && vInfo.hasVideo;
      const isVideoDone = isVideoPlaying && (totalStudiedMinutes >= requiredStudyMinutes);
      const isComplete = isVideoPlaying ? isVideoDone : (hasExamOnPage && examAllDone);

      if (isComplete && (now - lastActionTime > 3000)) {
        console.log(`\n🎉 [강의 출석 인정 완료] 누적 학습시간 달성(${totalStudiedMinutes.toFixed(1)}분/${requiredStudyMinutes.toFixed(1)}분 - 딱 맞춤 완료!), 진도 저장 중...`);
        console.log(`💾 학습 진도 저장을 위해 플레이어를 정상 종료하고 메인 목록으로 복귀합니다...`);
        lastActionTime = now;

        // 1. 학습종료(fnStudyEnd) 호출하여 학습 진도 저장
        await playerPage.evaluate(() => {
          const studyEndBtn = document.querySelector('button.studyend, button[onclick*="fnStudyEnd"], .btn-close-popup');
          if (studyEndBtn) {
            studyEndBtn.click();
          } else if (typeof window.fnStudyEnd === 'function') {
            window.fnStudyEnd();
          }
        }).catch(() => {});

        await playerPage.waitForTimeout(1500);

        // 2. 플레이어 팝업 닫기
        if (lecturePopupPage && !lecturePopupPage.isClosed()) {
          await lecturePopupPage.close().catch(() => {});
        }

        // 3. 변수 완전 초기화 (다음 강의가 이전 강의의 학습시간을 이어받아 즉시 스킵되는 현상 방지)
        hasReachedVideoEndOnce = false;
        currentSessionPlayedSeconds = 0;
        currentLectureStudiedMinutes = 0;
        currentLectureTotalMinutes = 0;
        lastSessionCheckTime = 0;
        choiceIndex = 0;
        lastProgressLogTime = 0;

        // 4. 메인 화면 새로고침하여 출석 인정 반영 확인 및 다음 강의 자동 탐색 준비
        if (mainPage && !mainPage.isClosed()) {
          console.log(`🔄 [메인 화면 갱신] 진도율 업데이트 확인을 위해 새로고침합니다.`);
          await mainPage.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
        }

        await playerPage.waitForTimeout(3000);
        return;
      }
    } catch (e) {}

    return; // 팝업 창이 열려있는 동안은 메인 창 탐색 중단
  }

  // -------------------------------------------------------------
  // [우선순위 2] 로그인 페이지 감지 시 자동 로그인
  // -------------------------------------------------------------
  for (const page of activePages) {
    const url = page.url();
    if ((url.includes('/login') || url.includes('/sso') || url.includes('epAuth') || url.includes('retrieveULogin')) && !url.includes('retrieveUMYStudy')) {
      try {
        const diag = await page.evaluate(() => {
          const forms = Array.from(document.querySelectorAll('form')).map(f => ({ name: f.name, id: f.id, action: f.action }));
          const inputs = Array.from(document.querySelectorAll('input')).filter(i => i.offsetParent !== null).map(i => ({ id: i.id, name: i.name, type: i.type, value: i.value }));
          const buttons = Array.from(document.querySelectorAll('button, a, input[type="submit"], input[type="button"], .btn'))
            .filter(b => b.offsetParent !== null)
            .map(b => ({ tag: b.tagName, text: (b.innerText || b.textContent || b.value || '').trim(), id: b.id, class: b.className, onclick: b.getAttribute('onclick') }))
            .filter(b => b.text || b.id || b.onclick);
          return { url: window.location.href, forms, inputs, buttons };
        }).catch(() => null);

        if (diag) {
          if (now - lastActionTime > 5000) {
            lastActionTime = now;
            console.log('\n🔍 [로그인 페이지 DOM 진단]');
            console.log(`  - URL: ${diag.url}`);
            console.log(`  - 입력란 목록:`, JSON.stringify(diag.inputs));
            console.log(`  - 버튼 목록:`, JSON.stringify(diag.buttons.slice(0, 10)));

            // 1. ID란 및 PW란 정확한 셀렉터 지정 (#username_legacy, #password_legacy 직접 타겟팅)
            let idLoc = page.locator('#username_legacy');
            let pwdLoc = page.locator('#password_legacy');

            if (await idLoc.count() === 0) {
              idLoc = page.locator('input[type="text"][placeholder*="아이디"]').first();
            }
            if (await pwdLoc.count() === 0) {
              pwdLoc = page.locator('input[type="password"]').first();
            }

            if (await idLoc.count() > 0 && await pwdLoc.count() > 0) {
              try {
                await idLoc.fill('wjsgngn');
                await pwdLoc.fill('London6078!');
                console.log('🔑 [자동 로그인] wjsgngn / London6078! 입력 완료 -> actionLegacyLogin() 실행');

                // 2. KNOU 전용 로그인 함수 actionLegacyLogin() 또는 submit 버튼 클릭
                await page.evaluate(() => {
                  if (typeof window.actionLegacyLogin === 'function') {
                    window.actionLegacyLogin();
                  } else if (typeof window.actionLogin === 'function') {
                    window.actionLogin();
                  } else {
                    const submitBtn = document.querySelector('button.btn-submit, button.btn-login, input[type="submit"]');
                    if (submitBtn) submitBtn.click();
                  }
                });

                await page.waitForTimeout(3000);
                return;
              } catch (loginErr) {
                console.log(`[로그인 입력 에러]: ${loginErr.message}`);
              }
            }
          }
        }
      } catch (e) {}
    }
  }

  // -------------------------------------------------------------
  // [상황 B] 플레이어 창이 열려있지 않은 경우 -> 메인 강의 목록에서 미완료 강의 탐색 및 실행
  // -------------------------------------------------------------
  for (const page of activePages) {
    const url = page.url();
    // 로그인/인증 페이지는 건너뜀
    if (url.includes('login') || url.includes('sso') || url.includes('epAuth') || url.includes('lgn')) {
      continue;
    }

    // 학습 목록 페이지인 경우
    if (url.includes('study') || url.includes('Study') || url.includes('retrieveUMYStudy') || url.includes('course')) {
      if (now - lastActionTime < 5000) return; // 연속 클릭 방지 딜레이

      const startResult = await page.evaluate((globalExhaustedList) => {
        // 메뉴/네비게이션 텍스트 필터링
        function isNavOrMenu(txt) {
          const ignore = ['목록', '안내', '정보', '자료', '게시판', '홈', '공지', '전체', '설정', '도움말', '로그아웃', '마이페이지'];
          return ignore.some(w => txt.includes(w));
        }

        // 1. 접혀있는 과목 드롭다운 / 아코디언 / 토글 자동 펼치기
        function expandDropdownsAndAccordions() {
          let expandedAny = false;
          let targetLabel = '';

          // A. aria-expanded="false" 토글 버튼
          const collapsedEls = Array.from(document.querySelectorAll('[aria-expanded="false"], .collapsed, .fold, .is-closed'));
          for (const el of collapsedEls) {
            if (el.offsetParent !== null && !isNavOrMenu(el.innerText || '')) {
              el.click();
              expandedAny = true;
              targetLabel = (el.innerText || el.title || el.className).trim();
              break;
            }
          }

          // B. 과목명 아코디언 / 드롭다운 버튼 (btn_toggle, btn_drop, btn_fold, ico_arrow, subject_name 등)
          if (!expandedAny) {
            const toggleCandidates = Array.from(document.querySelectorAll('button, a, div.title, span.title, [class*="accordion"], [class*="toggle"], [class*="fold"], [class*="drop"], [class*="subject"], [class*="arrow"]'));
            for (const el of toggleCandidates) {
              const txt = (el.innerText || el.textContent || '').trim();
              const cls = el.className || '';
              const onclick = el.getAttribute('onclick') || '';
              
              if (
                (cls.includes('toggle') || cls.includes('drop') || cls.includes('fold') || cls.includes('accordion') || cls.includes('arrow') || onclick.includes('toggle') || onclick.includes('fold') || onclick.includes('open')) &&
                el.offsetParent !== null && !isNavOrMenu(txt)
              ) {
                // 이미 열려있지 않은 경우 클릭
                if (!cls.includes('open') && !cls.includes('active') && !cls.includes('expanded') && !cls.includes('on')) {
                  el.click();
                  expandedAny = true;
                  targetLabel = txt || cls;
                  break;
                }
              }
            }
          }

          // C. select 박스 자동 첫 번째 과목 선택
          if (!expandedAny) {
            const selects = Array.from(document.querySelectorAll('select'));
            for (const sel of selects) {
              if (sel.options.length > 1 && sel.selectedIndex <= 0) {
                sel.selectedIndex = 1;
                sel.dispatchEvent(new Event('change', { bubbles: true }));
                expandedAny = true;
                targetLabel = sel.options[1].text;
                break;
              }
            }
          }

          return { expanded: expandedAny, label: targetLabel };
        }

        function isStudyAction(b) {
          const txt = (b.innerText || b.textContent || b.value || '').trim();
          const title = b.getAttribute('title') || '';
          const onclick = b.getAttribute('onclick') || '';
          const href = b.getAttribute('href') || '';
          const cls = b.className || '';

          if (isNavOrMenu(txt)) return false;
          if (b.offsetParent === null) return false;

          // 1. onclick 및 href 자바스크립트 함수 매칭
          if (
            onclick.includes('fn_study') || onclick.includes('fn_lecture') ||
            onclick.includes('fn_open') || onclick.includes('fn_view') ||
            onclick.includes('retrieveUMYStudyDetail') || onclick.includes('fn_goStudy') ||
            href.includes('fn_study') || href.includes('fn_lecture')
          ) {
            return true;
          }

          // 2. 명확한 텍스트 매칭
          if (
            txt === '학습하기' || txt === '강의보기' || txt === '이어보기' ||
            txt === '수강하기' || txt === '학습' || txt === '보기' || txt === '수강' ||
            title.includes('학습하기') || title.includes('강의보기') || title.includes('이어보기')
          ) {
            return true;
          }

          // 3. 클래스명 매칭
          if (cls.includes('btn_study') || cls.includes('btn_lecture') || cls.includes('btn_view')) {
            return true;
          }

          return false;
        }

        let savedExhausted = [];
        try {
          savedExhausted = JSON.parse(sessionStorage.getItem('__knou_exhausted_courses') || '[]');
        } catch (e) {}
        window.__knou_exhausted_courses = new Set([
          ...(window.__knou_exhausted_courses || []),
          ...savedExhausted,
          ...(globalExhaustedList || [])
        ]);

        function markExhausted(title) {
          window.__knou_exhausted_courses.add(title);
          try {
            sessionStorage.setItem('__knou_exhausted_courses', JSON.stringify(Array.from(window.__knou_exhausted_courses)));
          } catch (e) {}
        }

        // 1. [과목별 80% 달성 여부 검사 및 미완료 과목 자동 탐색]
        const courseItems = Array.from(document.querySelectorAll('.lecture-progress-item, div[id^="lecture-KNOU"]'));

        if (courseItems.length > 0) {
          for (const courseEl of courseItems) {
            const courseTitle = (courseEl.querySelector('.lecture-title')?.innerText || '').trim();
            if (window.__knou_exhausted_courses.has(courseTitle)) {
              continue;
            }

            const perEl = courseEl.querySelector('.lecture-per .value, .lecture-per, span[class*="value"]');
            let progressVal = 0;
            if (perEl) {
              const match = perEl.innerText.match(/(\d+(\.\d+)?)/);
              if (match) {
                progressVal = parseFloat(match[1]);
              }
            } else {
              const match = (courseEl.innerText || '').match(/(\d+(\.\d+)?)\s*%/);
              if (match) {
                progressVal = parseFloat(match[1]);
              }
            }

            // 진도율 80% 이상인 과목은 완료로 판단하고 건너뜀 (예: 경영전략론 80% 이상이면 다음 과목으로 이동)
            if (progressVal >= 80.0) {
              markExhausted(courseTitle);
              continue;
            }

            // 과목 내부 강의 목록(ul.lecture-list > li) 탐색
            const lectureList = Array.from(courseEl.querySelectorAll('ul.lecture-list > li, li[id^="lecture-pldc-"]'));

            // 과목 내에 강의 목록이 이미 DOM에 존재할 경우, 플레이 가능한 강의가 있는지 먼저 검사
            if (lectureList.length > 0) {
              const hasPlayable = lectureList.some(li => {
                const hasCheckedIcon = li.querySelector('i.checked, i.check, .checked') !== null;
                const isTxtDone = (li.innerText || '').includes('수강완료') || (li.innerText || '').includes('학습완료');
                const chElements = Array.from(li.querySelectorAll('a.ch, .ch'));
                const allChOn = chElements.length > 0 && chElements.every(ch => ch.classList.contains('on'));
                const isDone = (hasCheckedIcon || isTxtDone) && (chElements.length === 0 || allChOn);
                const isWaiting = li.querySelector('.con-waiting') !== null || (li.innerText || '').includes('제작중') || (li.innerText || '').includes('준비중');
                return !isDone && !isWaiting;
              });

              if (!hasPlayable) {
                // 수강 가능한 강의가 없으므로(전부 완료 or 제작중) 이 과목은 영구 스킵!
                markExhausted(courseTitle);
                continue;
              }
            }

            // 80% 미만이고 플레이 가능한 강의가 있는 과목 발견!
            const bodyEl = courseEl.querySelector('.lecture-progress-item-body');
            const isInactive = courseEl.classList.contains('inactive') || (bodyEl && bodyEl.style.display === 'none');

            // 내용이 접혀있으면 '내용보기' 클릭하여 펼치기
            if (isInactive) {
              const toggleBtn = courseEl.querySelector('a.btn-toggle, .btn-toggle, a[id^="btn-toggle-"]');
              if (toggleBtn) {
                toggleBtn.click();
                return { clicked: true, label: `[과목 진도율 ${progressVal}%] ${courseTitle} 내용보기 펼치기`, method: 'course-expand' };
              }
            }

            // 과목 내부 강의 목록 중 미완료 강의 탐색
            for (const li of lectureList) {
              const hasCheckedIcon = li.querySelector('i.checked, i.check, .checked') !== null;
              const isTxtDone = (li.innerText || '').includes('수강완료') || (li.innerText || '').includes('학습완료');
              
              const chElements = Array.from(li.querySelectorAll('a.ch, .ch'));
              const allChOn = chElements.length > 0 && chElements.every(ch => ch.classList.contains('on'));

              // 학습영상과 연습문제가 모두 완료되었으면 다음 강의로
              if ((hasCheckedIcon || isTxtDone) && (chElements.length === 0 || allChOn)) {
                continue;
              }

              // 2. 제작중이거나 준비중인 미공개 강의(수강 불가)는 스킵!
              const isWaiting = li.querySelector('.con-waiting') !== null || (li.innerText || '').includes('제작중') || (li.innerText || '').includes('준비중');
              if (isWaiting) {
                continue;
              }

              // 아직 미완료된 최초 강의의 '강의보기' 클릭!
              const viewBtn = li.querySelector('a.lecture-view, a.lecture-title, .lecture-view');
              if (viewBtn) {
                const lectureTitle = (li.querySelector('.lecture-title')?.innerText || viewBtn.innerText || '강의보기').trim();
                const onclickCode = viewBtn.getAttribute('onclick') || '';
                let evalError = null;
                if (onclickCode) {
                  try {
                    new Function(onclickCode).call(viewBtn);
                  } catch (e) {
                    evalError = e.message;
                  }
                }
                viewBtn.click();
                const liId = li.getAttribute('id') || '';
                const fnStr = typeof window.fnCntsPopup === 'function' ? 'fnCntsPopup존재' : 'fnCntsPopup없음';
                const liHtml = li.outerHTML ? li.outerHTML.slice(0, 800) : '';
                const timeMatch = (li.innerText || '').match(/(\d+)분\s*\/\s*(\d+)분/);
                let studiedMinutes = 0;
                let totalMinutes = 0;
                if (timeMatch) {
                  studiedMinutes = parseInt(timeMatch[1], 10);
                  totalMinutes = parseInt(timeMatch[2], 10);
                }
                return { clicked: true, label: `[${courseTitle} (${progressVal}%)] ${lectureTitle} (현재 학습시간: ${studiedMinutes}분 / 전체: ${totalMinutes}분)`, courseTitle, studiedMinutes, totalMinutes, method: 'lecture-incomplete', liId, onclickCode, evalError, fnStr, liHtml };
              }
            }
          }
        }

        // 2. 모든 강의 목록(ul.lecture-list > li) 폴백 탐색
        const lectureItems = Array.from(document.querySelectorAll('ul.lecture-list > li, li[id^="lecture-pldc-"]'));
        for (const li of lectureItems) {
          const parentCourse = li.closest('.lecture-progress-item, div[id^="lecture-KNOU"]');
          if (parentCourse) {
            const pTitle = (parentCourse.querySelector('.lecture-title')?.innerText || '').trim();
            if (window.__knou_exhausted_courses && window.__knou_exhausted_courses.has(pTitle)) {
              continue;
            }
            const perEl = parentCourse.querySelector('.lecture-per .value, .lecture-per, span[class*="value"]');
            let progressVal = 0;
            if (perEl) {
              const match = perEl.innerText.match(/(\d+(\.\d+)?)/);
              if (match) progressVal = parseFloat(match[1]);
            }
            if (progressVal >= 80.0) continue;
          }
          const hasCheckedIcon = li.querySelector('i.checked, i.check, .checked') !== null;
          const isTxtDone = (li.innerText || '').includes('수강완료') || (li.innerText || '').includes('학습완료');
          
          const chElements = Array.from(li.querySelectorAll('a.ch, .ch'));
          const allChOn = chElements.length > 0 && chElements.every(ch => ch.classList.contains('on'));

          // 학습영상과 연습문제가 모두 'on'(수강완료)이면 스킵!
          if ((hasCheckedIcon || isTxtDone) && (chElements.length === 0 || allChOn)) {
            continue;
          }

          // 제작중이거나 준비중인 미공개 강의는 스킵!
          const isWaiting = li.querySelector('.con-waiting') !== null || (li.innerText || '').includes('제작중') || (li.innerText || '').includes('준비중');
          if (isWaiting) {
            continue;
          }

          // 아직 미완료된 최초의 강의 클릭!
          const viewBtn = li.querySelector('a.lecture-view, a.lecture-title, .lecture-view');
          if (viewBtn) {
            const lectureTitle = (li.querySelector('.lecture-title')?.innerText || viewBtn.innerText || '강의보기').trim();
            const onclickCode = viewBtn.getAttribute('onclick') || '';
            if (onclickCode) {
              try { window.eval(onclickCode); } catch (e) {}
            }
            viewBtn.click();
            const liId = li.getAttribute('id') || '';
            const timeMatch = (li.innerText || '').match(/(\d+)분\s*\/\s*(\d+)분/);
            let studiedMinutes = 0;
            let totalMinutes = 0;
            if (timeMatch) {
              studiedMinutes = parseInt(timeMatch[1], 10);
              totalMinutes = parseInt(timeMatch[2], 10);
            }
            return { clicked: true, label: `${lectureTitle} (현재 학습시간: ${studiedMinutes}분 / 전체: ${totalMinutes}분)`, studiedMinutes, totalMinutes, method: 'lecture-item-incomplete', expanded: expandResult.expanded, expandLabel: expandResult.label, liId };
          }
        }

        // 3. 기타 일반 미완료 항목 폴백
        const rows = Array.from(document.querySelectorAll('tr, .study_list_item, .lecture_item, .card, div[class*="study"]'));
        for (const row of rows) {
          const rowText = row.innerText || '';
          const isCompleted = rowText.includes('100%') || rowText.includes('수강완료') || rowText.includes('학습완료');

          if (!isCompleted) {
            const btns = Array.from(row.querySelectorAll('button, a, input[type="button"], .btn'));
            const targetBtn = btns.find(isStudyAction);

            if (targetBtn) {
              const label = (targetBtn.innerText || targetBtn.textContent || targetBtn.title || '강의보기').trim();
              targetBtn.click();
              return { clicked: true, label, method: 'row-incomplete', expanded: expandResult.expanded, expandLabel: expandResult.label };
            }
          }
        }

        // 3. 페이지 전체에서 액션 버튼 탐색
        const allBtns = Array.from(document.querySelectorAll('button, a, input[type="button"], span.btn, div.btn'));
        const firstBtn = allBtns.find(isStudyAction);

        if (firstBtn) {
          const label = (firstBtn.innerText || firstBtn.textContent || firstBtn.title || '강의보기').trim();
          firstBtn.click();
          return { clicked: true, label, method: 'page-fallback', expanded: expandResult.expanded, expandLabel: expandResult.label };
        }

        return { clicked: false, expanded: expandResult.expanded, expandLabel: expandResult.label };
      }, Array.from(globalExhaustedCourses)).catch((e) => ({ clicked: false, error: e.message }));

      if (startResult && startResult.clicked) {
        lastActionTime = now;
        if (startResult.courseTitle) {
          currentPlayingCourseTitle = startResult.courseTitle;
        }
        currentLectureStudiedMinutes = startResult.studiedMinutes || 0;
        currentLectureTotalMinutes = startResult.totalMinutes || 0;
        currentSessionPlayedSeconds = 0;
        lastSessionCheckTime = Date.now();
        hasReachedVideoEndOnce = false;
        console.log(`\n▶ [미완료 강의 자동 시작] '${startResult.label}' (onclick: ${startResult.onclickCode || '없음'}, evalError: ${startResult.evalError || '없음'}, fn: ${startResult.fnStr || '없음'})`);
        if (startResult.liHtml) {
          console.log(`   [li HTML] ${startResult.liHtml}`);
        }
        if (startResult.liId) {
          const loc = page.locator(`#${startResult.liId} a.lecture-view, #${startResult.liId} a.lecture-title`).first();
          const count = await loc.count();
          console.log(`   [네이티브 클릭] #${startResult.liId} 버튼 탐색 결과: ${count}개`);
          if (count > 0) {
            await loc.scrollIntoViewIfNeeded().catch(() => {});
            await loc.click({ force: true }).catch(() => {});
          }
        }
        break;
      }
    }
  }
}

let lastDebugTime = 0;

async function inspectPlayerState(pages) {
  const pageList = (Array.isArray(pages) ? pages : [pages]).filter(p => p && !p.isClosed());
  let activeVideoInfo = null;

  for (const page of pageList) {
    for (const frame of page.frames()) {
      try {
        const info = await frame.evaluate(() => {
          // 1. "이전 재생 기록이 있습니다" 오버레이 감지 시 [예] 버튼 자동 클릭
          const bodyText = document.body ? document.body.innerText : '';
          if (bodyText.includes('이전 재생 기록') || bodyText.includes('재생 기록') || bodyText.includes('이어보기') || bodyText.includes('이어서')) {
            const allBtns = Array.from(document.querySelectorAll('button, a, span, div, input, p, .btn'));
            const yesBtn = allBtns.find(el => {
              const txt = (el.innerText || el.textContent || el.value || '').trim();
              return (txt === '예' || txt === '예(Y)' || txt === '이어보기' || txt === '확인') && el.offsetParent !== null;
            });
            if (yesBtn) {
              yesBtn.click();
            }
          }

          // 2. 비디오 탐색 (Shadow DOM 및 iframe 내부까지 탐색)
          function findVideos(root) {
            let found = [];
            try {
              found = Array.from(root.querySelectorAll('video'));
              const all = Array.from(root.querySelectorAll('*'));
              for (const el of all) {
                if (el.shadowRoot) {
                  found = found.concat(findVideos(el.shadowRoot));
                }
                if (el.tagName === 'IFRAME') {
                  try {
                    const doc = el.contentDocument || el.contentWindow?.document;
                    if (doc) {
                      found = found.concat(findVideos(doc));
                    }
                  } catch (e) {}
                }
              }
            } catch (e) {}
            return found;
          }

          const videos = findVideos(document);
          const v = videos.find(v => v.duration > 0 || !v.paused || v.currentTime > 0) || videos[0];
          if (v) {
            if (v.playbackRate !== 2.0) {
              v.playbackRate = 2.0;
            }
            if (v.paused && !v.ended) {
              v.play().catch(() => {});
              const bigPlayBtn = document.querySelector('.vjs-big-play-button, button.vjs-play-control, button[title*="재생"], .play_btn, .btn_play');
              if (bigPlayBtn) bigPlayBtn.click();
            }
            return {
              isPlayerPage: true,
              hasVideo: true,
              currentTime: v.currentTime,
              duration: v.duration,
              playbackRate: v.playbackRate || 2.0,
              paused: v.paused,
              ended: v.ended,
              progress: v.duration > 0 ? (v.currentTime / v.duration) * 100 : 0,
              isDone: v.ended || (v.duration > 0 && (v.currentTime / v.duration) >= 0.98)
            };
          }
          return null;
        });

        if (info && info.hasVideo) {
          activeVideoInfo = info;
          break;
        }
      } catch (e) {}
    }
    if (activeVideoInfo) break;
  }

  // 비디오가 감지되지 않는 경우 6초마다 프레임 및 플레이어 DOM 진단 로그 출력
  if (!activeVideoInfo && (Date.now() - lastDebugTime > 6000)) {
    lastDebugTime = Date.now();
    for (const page of pageList) {
      if (page.url().includes('about:blank')) continue;
      const fUrls = page.frames().map(f => f.url());
      console.log(`\n🔍 [플레이어/페이지 진단] URL: ${page.url()}`);
      console.log(`   총 프레임 수: ${fUrls.length}`);
      for (const frame of page.frames()) {
        try {
          const fDiag = await frame.evaluate(() => {
            const vCount = document.querySelectorAll('video').length;
            const iframes = Array.from(document.querySelectorAll('iframe')).map(i => ({ id: i.id, src: i.src?.slice(0, 80) }));
            const tabs = Array.from(document.querySelectorAll('.tab, [class*="tab"], .nav, li, a, button'))
              .filter(el => {
                const t = (el.innerText || '').trim();
                return (t === '학습' || t === '연습문제' || t === '강의' || t === '동영상' || t.includes('차시')) && el.offsetParent !== null;
              })
              .map(el => ({ tag: el.tagName, text: (el.innerText || '').trim(), cls: el.className }));
            const bodyText = (document.body?.innerText || '').replace(/\s+/g, ' ').slice(0, 300);
            return { vCount, iframes, tabs, bodyText };
          });
          console.log(`   프레임 (${frame.url().slice(0, 60)}): video=${fDiag.vCount}, iframes=${JSON.stringify(fDiag.iframes)}, text="${fDiag.bodyText}"`);
        } catch (e) {
          console.log(`   [프레임 evaluate 에러] ${frame.url()}: ${e.message}`);
        }
      }
    }
  }

  if (activeVideoInfo) return activeVideoInfo;
  return { isPlayerPage: false, hasVideo: false, progress: 0, currentTime: 0, duration: 0, paused: true, isDone: false };
}

main().catch(err => {
  console.error('실행 중 에러:', err);
});
