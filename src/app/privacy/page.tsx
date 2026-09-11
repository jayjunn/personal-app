import React from 'react';

export const metadata = {
  title: '개인정보처리방침 (Privacy Policy)',
  description: 'reply - IG 서비스의 개인정보처리방침입니다.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6 border-b pb-4">개인정보처리방침 (Privacy Policy)</h1>
      <p className="text-sm text-gray-500 mb-8">최종 수정일: 2026년 9월 12일</p>

      <section className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold">1. 수집하는 개인정보 항목</h2>
        <p className="leading-relaxed">
          <strong>reply - IG</strong>(이하 &apos;서비스&apos;)는 인스타그램 댓글 기반 자동 메시지 응답 서비스를 제공하기 위해 필요한 최소한의 정보만을 처리합니다.
        </p>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li>인스타그램 사용자 식별자(User ID) 및 사용자 이름(Username)</li>
          <li>게시물 및 릴스에 작성된 공개 댓글 내용 및 댓글 고유 ID</li>
        </ul>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold">2. 개인정보의 수집 및 이용 목적</h2>
        <p className="leading-relaxed">수집된 정보는 다음 목적에 한해서만 실시간으로 이용됩니다:</p>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li>사용자가 요청한 상품 및 추천 정보 링크를 인스타그램 다이렉트 메시지(DM)로 회신</li>
          <li>요청 확인을 위한 댓글 답글(대댓글) 안내</li>
        </ul>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold">3. 개인정보의 보유 및 파기</h2>
        <p className="leading-relaxed">
          본 서비스는 실시간 메시지 발송 완료 즉시 데이터를 파기하며, 별도의 데이터베이스에 사용자의 개인정보를 영구 저장하지 않습니다.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold">4. 개인정보의 제3자 제공 및 위탁</h2>
        <p className="leading-relaxed">
          본 서비스는 이용자의 개인정보를 외부에 제공하거나 위탁하지 않습니다. 단, 인스타그램 메시징 처리를 위해 Meta(Meta Platforms, Inc.)의 공식 API를 경유합니다.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-xl font-semibold">5. 데이터 삭제 요청 및 문의</h2>
        <p className="leading-relaxed">
          사용자는 언제든지 자신의 개인정보 관련 문의 및 데이터 처리 중단을 요청할 수 있습니다. 문의사항은 아래 연락처로 문의해 주시기 바랍니다.
        </p>
        <div className="bg-gray-100 dark:bg-neutral-800 p-4 rounded-lg text-sm space-y-1">
          <p><strong>관리자:</strong> 전영근</p>
          <p><strong>이메일:</strong> jayjunnn@gmail.com</p>
          <p><strong>서비스 웹사이트:</strong> https://younggeun-jun.vercel.app</p>
        </div>
      </section>
    </div>
  );
}
