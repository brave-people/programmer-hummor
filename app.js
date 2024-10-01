async function fetchHumorFeed() {
    try {
        // API 대신 로컬 JSON 파일을 사용합니다.
        const response = await fetch('humor_data.json');
        if (!response.ok) {
            throw new Error('JSON 파일을 불러오는데 실패했습니다.');
        }
        return await response.json();
    } catch (error) {
        console.error('피드를 가져오는 중 오류 발생:', error);
        return null;
    }
}

function createFeedHTML(feedItem) {
    const imageListHTML = feedItem.imageList.map(img => 
        `<img src="${img.imageUrl}" alt="유머 이미지 ${img.seq}" loading="lazy">`
    ).join('');

    return `
        <article class="feed-item">
            <h2>${feedItem.title}</h2>
            <p>${feedItem.description}</p>
            <div class="image-container">
                ${imageListHTML}
            </div>
            <time datetime="${feedItem.createDate}">${new Date(feedItem.createDate).toLocaleDateString('ko-KR')}</time>
        </article>
    `;
}

async function updateFeed() {
    const feedContainer = document.getElementById('feed-container');
    const data = await fetchHumorFeed();
    console.log(data);
    if (data && data.length > 0) {
        const feedHTML = data.map(createFeedHTML).join('');
        feedContainer.innerHTML = feedHTML;
    } else {
        feedContainer.innerHTML = '<p>피드를 불러올 수 없습니다.</p>';
    }
}

// 페이지 로드 시 피드 업데이트
document.addEventListener('DOMContentLoaded', updateFeed);