# ✨ 이상형 이미지 생성기

AI를 활용하여 당신의 이상형 이미지를 자동으로 생성해주는 웹 서비스입니다.

## 🎯 주요 기능

- **직관적인 선택 인터페이스**: Select/Input으로 이상형의 특징을 쉽게 선택
  - 성별, 나이대, 체형, 스타일, 성격, 얼굴형 등
  - 추가 설명 입력 (최대 30자)
  
- **자동 프롬프트 변환**: 선택한 정보를 Stable Diffusion API용 프롬프트로 자동 변환

- **고품질 이미지 생성**: Stable Diffusion SDXL 모델을 사용하여 1024x1024 해상도의 이미지 생성

- **이미지 다운로드**: 생성된 이미지를 바로 다운로드 가능

- **NSFW 필터**: 부적절한 콘텐츠 자동 필터링

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모두 지원

## 🛠 기술 스택

### 프론트엔드
- **Next.js 16** - React 기반 풀스택 프레임워크
- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Tailwind CSS 4** - 유틸리티 기반 스타일링

### 백엔드
- **Next.js API Routes** - 서버리스 API 엔드포인트
- **Replicate API** - Stable Diffusion 모델 호스팅
- **프롬프트 빌더 클래스** - 체계적인 프롬프트 관리

## 📋 시스템 요구사항

- Node.js 18.17 이상
- npm 또는 pnpm 패키지 매니저
- Replicate API 토큰 (무료 계정 가능)

## 🚀 설치 방법

### 1. 저장소 클론 (또는 프로젝트 다운로드)

```bash
git clone <repository-url>
cd favorite
```

### 2. 의존성 패키지 설치

```bash
npm install
# 또는
pnpm install
```

### 3. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 입력하세요:

```env
REPLICATE_API_TOKEN=your_replicate_api_token_here
```

**Replicate API 토큰 발급 방법:**

1. [Replicate](https://replicate.com) 사이트 방문
2. 회원가입 또는 로그인
3. [Account > API Tokens](https://replicate.com/account/api-tokens) 페이지로 이동
4. 새 토큰 생성 후 복사하여 `.env.local` 파일에 붙여넣기

💡 `.env.local.example` 파일을 참고하세요.

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📦 프로덕션 빌드

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start
```

## 📁 프로젝트 구조

```
favorite/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── generate/
│   │   │       └── route.ts          # 이미지 생성 API 엔드포인트
│   │   ├── layout.tsx                 # 루트 레이아웃
│   │   ├── page.tsx                   # 메인 페이지 (UI)
│   │   └── globals.css                # 전역 스타일
│   └── lib/
│       └── promptBuilder.ts           # 프롬프트 빌더 클래스
├── public/                            # 정적 파일
├── .env.local                         # 환경 변수 (생성 필요)
├── .env.local.example                 # 환경 변수 예시
├── package.json                       # 프로젝트 설정
├── tsconfig.json                      # TypeScript 설정
├── tailwind.config.ts                 # Tailwind CSS 설정
└── README.md                          # 프로젝트 문서 (이 파일)
```

## 🎨 사용 방법

### 1. 이상형 특징 선택

왼쪽 폼에서 다음 항목들을 선택하세요:

- **성별**: 남성, 여성, 중성
- **나이대**: 10대, 20대, 30대, 40대
- **체형**: 마른, 보통, 탄탄한, 근육질
- **스타일**: 캐주얼, 포멀, 스트리트, 스포티, 빈티지, 미니멀
- **성격**: 밝은, 차분한, 시크한, 귀여운, 섹시한, 지적인
- **얼굴형**: 에겐 (샤프한), 테토 (부드러운), 혼합형
- **추가 설명** (선택): 30자 이내로 추가 특징 입력

### 2. 이미지 생성

"✨ 이상형 생성하기" 버튼을 클릭하면:

- 약 30~60초 후 AI가 생성한 이미지가 오른쪽에 표시됩니다
- 로딩 상태와 진행 상황이 표시됩니다

### 3. 결과 확인 및 다운로드

- 생성된 이미지를 확인하고
- "💾 이미지 다운로드" 버튼으로 저장할 수 있습니다

### 4. 다시 생성

- "🔄 초기화" 버튼으로 폼을 초기화하고 새로 시작할 수 있습니다

## 🔒 보안 및 필터링

### NSFW 필터

시스템은 다음과 같은 다층 필터링을 적용합니다:

1. **프롬프트 레벨**: 사용자 입력에서 부적절한 키워드 자동 제거
2. **네거티브 프롬프트**: Stable Diffusion에 부적절한 콘텐츠 생성 방지 지시
3. **입력 검증**: 모든 필수 항목 검증 및 30자 길이 제한

### 에러 처리

- API 연결 실패 시 명확한 에러 메시지 표시
- 네트워크 오류 처리
- 타임아웃 관리
- 사용자 친화적인 피드백

## 💡 핵심 구현 사항

### 프롬프트 빌더 클래스

`src/lib/promptBuilder.ts`에서 구조화된 프롬프트 관리:

```typescript
// 사용 예시
const options: IdealTypeOptions = {
  gender: '여성',
  age: '20대',
  bodyType: '보통',
  style: '캐주얼',
  personality: '밝은',
  faceType: '테토',
  customText: '긴 생머리',
};

const prompt = PromptBuilder.buildPrompt(options);
// 결과: "high quality portrait, ..., beautiful woman, ..., long straight hair"
```

### API Route 구조

`src/app/api/generate/route.ts`에서 서버리스 이미지 생성:

```typescript
POST /api/generate
- 입력: IdealTypeOptions
- 출력: { success, imageUrl, prompt, negativePrompt }
```

## 🐛 문제 해결

### 이미지가 생성되지 않아요

1. `.env.local` 파일에 올바른 `REPLICATE_API_TOKEN`이 설정되어 있는지 확인
2. Replicate 계정의 크레딧이 충분한지 확인
3. 인터넷 연결 상태 확인
4. 콘솔 로그에서 구체적인 에러 메시지 확인

### 패키지 설치 오류

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules
rm package-lock.json  # 또는 pnpm-lock.yaml
npm install  # 또는 pnpm install
```

### 개발 서버가 시작되지 않아요

```bash
# 포트 3000이 이미 사용 중인 경우
npx kill-port 3000
npm run dev
```

## 📊 비용 안내

- **Replicate API**: 사용량 기반 과금
  - 무료 크레딧으로 테스트 가능
  - SDXL 모델: 이미지당 약 $0.001~0.005
  - 자세한 가격: [Replicate Pricing](https://replicate.com/pricing)

## 🔧 커스터마이징

### 다른 AI 모델 사용

`src/app/api/generate/route.ts`에서 모델 변경:

```typescript
const output = await replicate.run(
  "다른-모델-아이디",  // 모델 변경
  { input: { /* 설정 */ } }
);
```

### UI 스타일 변경

`src/app/page.tsx`와 `src/app/globals.css`에서 Tailwind CSS 클래스를 수정하세요.

### 새로운 선택 옵션 추가

1. `src/lib/promptBuilder.ts`에 새 맵 추가
2. `src/app/page.tsx`에 UI 요소 추가
3. `IdealTypeOptions` 인터페이스에 필드 추가

## 📝 라이선스

이 프로젝트는 개인 및 교육 목적으로 자유롭게 사용 가능합니다.

생성된 이미지는 AI가 만든 것으로 실제 인물이 아닙니다.

## 🤝 기여

버그 리포트, 기능 제안, Pull Request를 환영합니다!

## 📞 지원

문제가 발생하거나 질문이 있으신 경우:

1. [Issues](../../issues) 페이지에서 유사한 문제 검색
2. 새 이슈 생성하여 문의
3. 가능한 한 상세한 정보 제공 (에러 로그, 스크린샷 등)

---

**Powered by Next.js, Stable Diffusion & Replicate**

Made with ❤️ by AI
