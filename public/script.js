document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const resultsContainer = document.getElementById('results');
    const searchBtn = document.querySelector('.search-btn');
    const btnText = document.querySelector('.btn-text');
    const loading = document.querySelector('.loading');

    searchForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // 버튼 상태 변경
        searchBtn.disabled = true;
        btnText.style.display = 'none';
        loading.style.display = 'inline';
        
        // 기존 결과 지우기
        resultsContainer.innerHTML = '';
        
        // 폼 데이터 수집
        const formData = new FormData(searchForm);
        const searchData = {
            keyword: formData.get('keyword'),
            maxResults: formData.get('maxResults'),
            order: formData.get('order'),
            videoDuration: formData.get('videoDuration'),
            minViews: formData.get('minViews') || null,
            maxSubscribers: formData.get('maxSubscribers') || null
        };

        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(searchData)
            });

            const result = await response.json();

            if (response.ok) {
                displayResults(result.videos);
            } else {
                displayError(result.error || '검색 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('검색 오류:', error);
            displayError('서버와의 연결에 문제가 발생했습니다.');
        } finally {
            // 버튼 상태 복원
            searchBtn.disabled = false;
            btnText.style.display = 'inline';
            loading.style.display = 'none';
        }
    });

    function displayResults(videos) {
        if (!videos || videos.length === 0) {
            resultsContainer.innerHTML = `
                <div class="no-results">
                    <h3>검색 결과가 없습니다</h3>
                    <p>다른 키워드나 조건으로 다시 검색해보세요.</p>
                </div>
            `;
            return;
        }

        const videosHTML = videos.map(video => `
            <div class="video-card">
                <div class="video-thumbnail">
                    <img src="${video.thumbnail}" alt="${video.title}" loading="lazy">
                </div>
                <div class="video-info">
                    <h3 class="video-title">${escapeHtml(video.title)}</h3>
                    <p class="video-channel">${escapeHtml(video.channelTitle)}</p>
                    <div class="video-stats">
                        <div class="stats-item">
                            <span class="stats-label">조회수</span>
                            <span class="stats-value">${formatNumber(video.viewCount)}</span>
                        </div>
                        <div class="stats-item">
                            <span class="stats-label">구독자</span>
                            <span class="stats-value">${formatNumber(video.subscriberCount)}</span>
                        </div>
                        <div class="stats-item">
                            <span class="stats-label">업로드</span>
                            <span class="stats-value">${formatDate(video.publishedAt)}</span>
                        </div>
                    </div>
                    <div class="video-links">
                        <a href="${video.url}" target="_blank" class="video-link">영상 보기</a>
                        <a href="${video.channelUrl}" target="_blank" class="channel-link">채널 보기</a>
                    </div>
                </div>
            </div>
        `).join('');

        resultsContainer.innerHTML = videosHTML;
    }

    function displayError(message) {
        resultsContainer.innerHTML = `
            <div class="error-message">
                <h3>오류 발생</h3>
                <p>${message}</p>
            </div>
        `;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function formatNumber(num) {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1) + 'B';
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return '1일 전';
        } else if (diffDays < 30) {
            return `${diffDays}일 전`;
        } else if (diffDays < 365) {
            const months = Math.floor(diffDays / 30);
            return `${months}달 전`;
        } else {
            const years = Math.floor(diffDays / 365);
            return `${years}년 전`;
        }
    }
}); 