// YouTube API 설정
// 환경변수 우선 사용, 없으면 하드코딩된 값 사용
const config = {
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || 'AIzaSyBUlbFKibuqUjQOipuY5hcla3guivT1fqQ',
  PORT: process.env.PORT || 3000
};

// 환경변수 확인 로그 (개발용)
console.log('API Key Source:', process.env.YOUTUBE_API_KEY ? 'Environment Variable' : 'Hardcoded');
console.log('API Key exists:', !!config.YOUTUBE_API_KEY);

module.exports = config; 