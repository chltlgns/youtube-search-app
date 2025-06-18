// 환경변수 로드
require('dotenv').config();

const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const config = require('./config');
const path = require('path');

const app = express();
const youtube = google.youtube({
  version: 'v3',
  auth: config.YOUTUBE_API_KEY
});

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 환경변수 테스트 엔드포인트 (임시)
app.get('/api/test-env', (req, res) => {
  res.json({
    hasApiKey: !!config.YOUTUBE_API_KEY,
    apiKeyLength: config.YOUTUBE_API_KEY ? config.YOUTUBE_API_KEY.length : 0,
    apiKeyPrefix: config.YOUTUBE_API_KEY ? config.YOUTUBE_API_KEY.substring(0, 10) + '...' : 'undefined',
    nodeEnv: process.env.NODE_ENV,
    port: config.PORT,
    apiKeySource: process.env.YOUTUBE_API_KEY ? 'Environment Variable' : 'Hardcoded'
  });
});

// 메인 페이지
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 유튜브 검색 API 엔드포인트
app.post('/api/search', async (req, res) => {
  try {
    const {
      keyword,
      maxResults = 10,
      order = 'relevance',
      videoDuration = 'any',
      maxSubscribers,
      minViews
    } = req.body;

    if (!keyword) {
      return res.status(400).json({ error: '검색 키워드가 필요합니다.' });
    }

    // API 키 확인
    if (!config.YOUTUBE_API_KEY || config.YOUTUBE_API_KEY === 'your_youtube_api_key_here') {
      return res.status(500).json({ 
        error: 'YouTube API 키가 설정되지 않았습니다.',
        details: 'YOUTUBE_API_KEY 환경변수를 확인해주세요.'
      });
    }

    // YouTube API 검색 파라미터 설정
    const searchParams = {
      part: 'snippet',
      q: keyword,
      type: 'video',
      maxResults: parseInt(maxResults),
      order: order,
      videoDuration: videoDuration
    };

    // YouTube 검색 실행
    const searchResponse = await youtube.search.list(searchParams);
    const videos = searchResponse.data.items;

    if (!videos || videos.length === 0) {
      return res.json({ videos: [], message: '검색 결과가 없습니다.' });
    }

    // 비디오 ID 목록 생성
    const videoIds = videos.map(video => video.id.videoId).join(',');

    // 비디오 상세 정보 가져오기 (조회수, 채널 정보 등)
    const videoDetailsResponse = await youtube.videos.list({
      part: 'statistics,snippet',
      id: videoIds
    });

    const videoDetails = videoDetailsResponse.data.items;

    // 채널 ID 목록 생성
    const channelIds = [...new Set(videoDetails.map(video => video.snippet.channelId))].join(',');

    // 채널 정보 가져오기 (구독자 수)
    const channelResponse = await youtube.channels.list({
      part: 'statistics',
      id: channelIds
    });

    const channelStats = {};
    channelResponse.data.items.forEach(channel => {
      channelStats[channel.id] = channel.statistics;
    });

    // 결과 데이터 구성
    let results = videoDetails.map(video => {
      const channelId = video.snippet.channelId;
      const channelStat = channelStats[channelId] || {};
      
      return {
        videoId: video.id,
        title: video.snippet.title,
        channelTitle: video.snippet.channelTitle,
        publishedAt: video.snippet.publishedAt,
        thumbnail: video.snippet.thumbnails.medium.url,
        viewCount: parseInt(video.statistics.viewCount || 0),
        subscriberCount: parseInt(channelStat.subscriberCount || 0),
        url: `https://www.youtube.com/watch?v=${video.id}`,
        channelUrl: `https://www.youtube.com/channel/${channelId}`
      };
    });

    // 필터링 적용
    if (minViews) {
      results = results.filter(video => video.viewCount >= parseInt(minViews));
    }

    if (maxSubscribers) {
      results = results.filter(video => video.subscriberCount <= parseInt(maxSubscribers));
    }

    res.json({ videos: results });

  } catch (error) {
    console.error('YouTube API 오류:', error);
    res.status(500).json({ 
      error: 'YouTube 검색 중 오류가 발생했습니다.',
      details: error.message 
    });
  }
});

// 서버 시작
const PORT = config.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  console.log('YouTube API 키를 config.js 파일에 설정해주세요.');
}); 