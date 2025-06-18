# 🔍 YouTube 검색기

YouTube API를 활용한 고급 검색 기능을 제공하는 웹 애플리케이션입니다.

## ✨ 주요 기능

- **키워드 검색**: 원하는 키워드로 YouTube 영상 검색
- **검색 결과 개수 설정**: 10~50개까지 결과 개수 조절
- **정렬 방식**: 관련성, 최신순, 조회수, 평점, 제목순 정렬
- **영상 길이 필터**: 4분 미만, 4-20분, 20분 이상 필터링
- **최소 조회수 필터**: 특정 조회수 이상의 영상만 검색
- **최대 구독자수 필터**: 특정 구독자수 이하의 채널 영상만 검색
- **직접 링크**: 영상 및 채널로 바로 이동 가능

## 🚀 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. YouTube API 키 설정
1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. YouTube Data API v3 활성화
4. API 키 생성
5. `config.js` 파일에서 `YOUTUBE_API_KEY`에 발급받은 API 키 입력

```javascript
const config = {
  YOUTUBE_API_KEY: '여기에_발급받은_API_키_입력',
  PORT: 3000
};
```

### 3. 서버 실행
```bash
npm start
```

또는 개발 모드로 실행:
```bash
npm run dev
```

### 4. 웹 브라우저에서 접속
```
http://localhost:3000
```

## 📋 사용 방법

1. **검색 키워드 입력** (필수)
2. **검색 조건 설정**
   - 검색 결과 개수 (10~50개)
   - 정렬 방식 선택
   - 영상 길이 필터
   - 최소 조회수 (선택사항)
   - 최대 구독자수 (선택사항)
3. **검색하기 버튼 클릭**
4. **결과 확인 및 링크 클릭**

## 🛠️ 기술 스택

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **API**: YouTube Data API v3
- **패키지**: googleapis, cors

## 📁 프로젝트 구조

```
youtube-search-app/
├── index.js          # 메인 서버 파일
├── config.js         # API 키 설정 파일
├── package.json      # 의존성 관리
├── README.md         # 프로젝트 설명
└── public/           # 웹 파일들
    ├── index.html    # 메인 HTML
    ├── style.css     # 스타일시트
    └── script.js     # 클라이언트 JavaScript
```

## ⚠️ 주의사항

1. **API 키 보안**: `config.js` 파일을 Git에 커밋하지 마세요
2. **API 할당량**: YouTube API는 일일 할당량이 있습니다
3. **CORS 설정**: 필요시 CORS 설정을 조정하세요

## 🔧 문제 해결

### API 키 관련 오류
- Google Cloud Console에서 YouTube Data API v3가 활성화되어 있는지 확인
- API 키가 올바르게 설정되어 있는지 확인
- API 할당량을 초과하지 않았는지 확인

### 서버 실행 오류
- Node.js와 npm이 올바르게 설치되어 있는지 확인
- 포트 3000이 사용 중이 아닌지 확인
- 의존성 패키지가 모두 설치되어 있는지 확인

## 📄 라이선스

ISC License 