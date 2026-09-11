import { NextRequest, NextResponse } from 'next/server';

const VERIFY_TOKEN = process.env.INSTAGRAM_VERIFY_TOKEN || 'my_instagram_bot_token_2026';
const ACCESS_TOKEN = process.env.INSTAGRAM_PAGE_ACCESS_TOKEN || '';

/**
 * 1. Webhook 검증 엔드포인트 (Meta에서 콜백 URL 검증 시 호출)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  // Meta에서 보낸 verify_token이 우리가 설정한 토큰과 일치하는지 확인
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('[Instagram Webhook] Verified successfully');
    return new Response(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  }

  console.warn('[Instagram Webhook] Verification failed', { mode, token });
  return new Response('Forbidden', { status: 403 });
}

/**
 * 2. Webhook 이벤트 수신 엔드포인트 (댓글 발생 시 Meta에서 호출)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Instagram Webhook 이벤트인지 확인
    if (body.object === 'instagram') {
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          // 댓글 이벤트인 경우
          if (change.field === 'comments') {
            const comment = change.value;
            const commentId = comment.id;
            const commentText = comment.text || '';
            const commenter = comment.from?.username || '사용자';

            console.log(`[댓글 감지] @${commenter}: "${commentText}" (ID: ${commentId})`);

            // '정보' 키워드가 포함되어 있는지 확인
            if (commentText.includes('정보')) {
              await handleKeywordComment(commentId, commenter);
            }
          }
        }
      }

      return NextResponse.json({ status: 'EVENT_RECEIVED' }, { status: 200 });
    }

    return NextResponse.json({ status: 'NOT_INSTAGRAM_EVENT' }, { status: 404 });
  } catch (error) {
    console.error('[Instagram Webhook Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * 키워드('정보') 댓글에 대해 Private Reply (DM) 및 대댓글 전송
 */
async function handleKeywordComment(commentId: string, commenter: string) {
  if (!ACCESS_TOKEN) {
    console.warn('[경고] INSTAGRAM_PAGE_ACCESS_TOKEN이 설정되지 않았습니다.');
    return;
  }

  const dmMessage = `안녕하세요 @${commenter}님! 요청하신 정보 안내드립니다. 😊\n\n👉 링크 및 상세 정보: https://younggeun-jun.vercel.app`;
  const replyMessage = `@${commenter} DM으로 요청하신 정보 보내드렸습니다! 수신함(또는 메시지 요청함)을 확인해 주세요. ✉️`;

  try {
    // 1. Private Reply (비공개 답장 / DM 전송)
    // 상대방이 비공개 계정이든 공개 계정이든 댓글 기반으로 24시간 내 1회 DM 발송 가능
    const dmRes = await fetch(`https://graph.facebook.com/v19.0/${commentId}/private_replies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        message: dmMessage,
      }),
    });

    const dmData = await dmRes.json();
    if (!dmRes.ok) {
      console.error('[DM 전송 실패]:', dmData);
    } else {
      console.log(`[DM 전송 성공] to @${commenter}`);
    }

    // 2. 댓글에 대댓글(공개 답글) 남기기
    const replyRes = await fetch(`https://graph.facebook.com/v19.0/${commentId}/replies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        message: replyMessage,
      }),
    });

    const replyData = await replyRes.json();
    if (!replyRes.ok) {
      console.error('[대댓글 전송 실패]:', replyData);
    } else {
      console.log(`[대댓글 전송 성공] for comment ${commentId}`);
    }
  } catch (err) {
    console.error('[답장 처리 중 오류]:', err);
  }
}
