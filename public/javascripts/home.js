const title = document.getElementById('title');
const titleru = document.getElementById('titleru');
const about = document.getElementById('about');
const aboutru = document.getElementById('aboutru');
const img1 = document.getElementById('img1');
const img2 = document.getElementById('img2');
const img3 = document.getElementById('img3');
const swiperWrapper = document.getElementById('swiper-wrapper');

const sliderImage = (url, indx) => {
    const sliderImageDiv = document.createElement('div');
    const sliderImg = document.createElement('img');
    sliderImageDiv.classList.add('swiper-slide');
    if(indx === 1)sliderImg.classList.add('hidden');
    sliderImg.src = url;
    sliderImg.alt = `photo${indx}`;
    sliderImg.id = `img${indx + 1}`;
    sliderImageDiv.appendChild(sliderImg);
    return sliderImageDiv;
};

async function getData() {
    const url = "/get_homepage";
    const props = {
        method: "GET",
        headers: [
            ["Content-Type", "application/json"],
        ],
    }

    const req = await fetch(url, props);
    const res = await req.body;

    const reader = res.getReader();

    let receivedLength = 0; 
    let chunks = [];
    while(true) {
        const {done, value} = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedLength += value.length;
    }

    let chunksAll = new Uint8Array(receivedLength);
    let position = 0;
    for(let chunk of chunks) {
        chunksAll.set(chunk, position);
        position += chunk.length;
    }
    let result = new TextDecoder("utf-8").decode(chunksAll);

    home = JSON.parse(result);
    
    if(titleru) titleru.innerHTML = home.titleru;
    if(title) title.innerHTML = home.title;
    if(aboutru) aboutru.innerHTML = home.aboutru;
    if(about) about.innerHTML = home.about;
    if(home.images) home.images.map((el, indx) => {swiperWrapper.appendChild(sliderImage(el, indx))}) 
}

getData()
