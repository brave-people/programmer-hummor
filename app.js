async function fetchHumorFeed() {
    try {
        // const apiUrl = process.env.REAL_API_HOST || 'humor_data.json';
        const apiUrl = 'https://real-brave-people.p-e.kr';
        const response = await fetch(apiUrl + '/front/v1/humors?orderType=RECENTLY&langType=ENG,KO');
        if (!response.ok) {
            throw new Error('fail to call API');
        }
        return await response.json();
    } catch (error) {
        console.error('fail to get feed:', error);
        return null;
    }
}

function createFeedHTML(feedItem) {
    const imageListHTML = feedItem.image_list.map(img => 
        `<div class="swiper-slide">
            <img src="${img.image_url}" alt="유머 이미지 ${img.seq}" loading="lazy">
         </div>`
    ).join('');

    return `
        <article class="feed-item">
            <h2>${feedItem.title}</h2>
            <p>${feedItem.content}</p>
            <div class="swiper">
                <div class="swiper-wrapper">
                    ${imageListHTML}
                </div>
                <div class="swiper-pagination"></div>
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
            </div>
        </article>
    `;
}

async function updateFeed() {
    const feedContainer = document.getElementById('feed-container');
    const data = await fetchHumorFeed();
    if (data && data.length > 0) {
        const feedHTML = data.map(createFeedHTML).join('');
        feedContainer.innerHTML = feedHTML;
        
        // Swiper 초기화
        data.forEach((_, index) => {
            new Swiper(`.feed-item:nth-child(${index + 1}) .swiper`, {
                pagination: {
                    el: '.swiper-pagination',
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            });
        });
    } else {
        feedContainer.innerHTML = '<p>Fail to call feed.</p>';
    }
}

// feed update when page loading
document.addEventListener('DOMContentLoaded', updateFeed);