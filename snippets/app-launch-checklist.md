# 앱 런칭 체크리스트

새 앱을 출시하기 전에 훑어보세요. (Cursor 에게 "이 체크리스트 기준으로 점검해줘" 라고 시키면 좋습니다.)

## 기본
- [ ] `npm run create-app` 으로 생성, 이름/번들ID 변경 완료
- [ ] `.env` 채움 (`.env.example` 기준), 시크릿은 커밋 금지
- [ ] `npm run typecheck` / `npm run lint` 통과
- [ ] `npm run build` 성공

## 디자인 시스템
- [ ] 하드코딩 hex 없음 → 토큰/Tailwind 클래스만 사용
- [ ] 다크모드 정상 동작 (`.dark` 토글)
- [ ] 신규 컴포넌트는 `figma/component-map.md` 에 매핑 추가

## 인증/보안
- [ ] Supabase RLS 모든 테이블에 활성화
- [ ] 보호 라우트 미들웨어 동작
- [ ] anon key 만 클라이언트 노출 (service key 노출 금지)

## 품질
- [ ] 로딩/에러/빈 상태 UI 존재
- [ ] 접근성: label, aria, 포커스 링
- [ ] 모바일 반응형 확인

## 배포
- [ ] 환경변수 배포 환경(Vercel 등)에 등록
- [ ] 프로덕션 도메인 OAuth redirect 등록
- [ ] 결제 사용 시 Stripe webhook 프로덕션 endpoint 등록
- [ ] 애널리틱스/에러 모니터링 연결
