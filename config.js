// YouTube API 설정
// 환경변수 우선, fallback으로 하드코딩된 값 사용
const config = {
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || 'AIzaSyBUlbFKibuqUjQOipuY5hcla3guivT1fqQ',
  PORT: process.env.PORT || 3000
};

module.exports = config; 