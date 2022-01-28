<<<<<<< HEAD
import { errorMsg } from '/javascripts/errorMessage.js'
let buttonUpdateHomePage = document.querySelector('.button_update_homepage');

buttonUpdateHomePage.addEventListener('click', () => {
    let inputTitle = document.forms.FormHomepage.title.value;
    let inputPhoto1 = document.forms.FormHomepage.photo1.value;
    let inputPhoto2 = document.forms.FormHomepage.photo2.value;
    let inputPhoto3 = document.forms.FormHomepage.photo3.value;
    let inputAbout = document.forms.FormHomepage.about.value;
    if (inputTitle && inputPhoto1 && inputPhoto2 && inputPhoto3 && inputAbout) {
        alert('Страница изменена')
    } else {
        alert('Заполните все поля')
    }
})

///код по добавлению фото, можно взять из формскрипт. запрос POST идет на эдитмейнпейдж_контроллер getFormData (/admin/get_data)
//обязательные поля заголовок и о нас, фото можно не проверять
=======
import {errorMsg} from '/javascripts/errorMessage.js'
let buttonUpdateHomePage = document.querySelector('.button_update_homepage');
const slidersImages = document.getElementById('slidersImages');
let home = {};
let newImages;

async function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
}

const imageInput = (url, indx) => {
    let imageInput;
    const imageInputDiv = document.createElement('div');
    if(url[0] === 'd') {
        imageInput = document.createElement('img');
        imageInput.classList.add('img');
        imageInput.src = url;
        imageInput.value = url;
        imageInput.style = "margin: 20px; width: 250px;";
    } else {
        imageInput = document.createElement('input');
        imageInput.classList.add('img');
        imageInput.type = 'text';
        imageInput.name = `photo${indx}`;
        imageInput.value = url;
    } 
    const imageRemoveButton = document.createElement('button');
    imageRemoveButton.classList = 'image-remove';
    imageRemoveButton.innerText = '-';
    imageRemoveButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        newImages.splice(indx, 1);
        setSlidersImages(newImages);
    });
    imageInputDiv.appendChild(imageInput);
    imageInputDiv.appendChild(imageRemoveButton);
    return imageInputDiv;
}

const setSlidersImages = (images) => {
    newImages = images;
    slidersImages.innerHTML = '';
    const imageAddButton = document.createElement('button');
    imageAddButton.classList = 'image-add';
    imageAddButton.innerText = '+';
    imageAddButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        newImages.push('images/sapr.png');
        setSlidersImages(newImages);
    });

    if(newImages.length > 0) {
        newImages.forEach((url, indx) => { 
            slidersImages.append(imageInput(url, indx));
        })
    }
    slidersImages.append(imageAddButton);
}

async function sendData(data) {
    const url = "/admin/update_homepage";
    const props = {
        method: "POST",
        headers: [
            ["Content-Type", "application/json"],
        ],
        body: JSON.stringify(data)
    }

    const req = await fetch(url, props);
    const res = await req;
    return await res;
}

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
    // console.log(home)
    
    document.forms.FormHomepage.title.value = home.title;
    document.forms.FormHomepage.titleru.value = home.titleru;
    document.forms.FormHomepage.about.value = home.about;  
    document.forms.FormHomepage.aboutru.value = home.aboutru;  
    
    if(home.images) setSlidersImages(home.images);
}

buttonUpdateHomePage.addEventListener('click', async (e) => {
    e.preventDefault();
    e.stopPropagation();
    let images = [];
    const inputImgs = document.querySelectorAll('.img');
    const inputImgsFiles = document.querySelector('.imgfile');
    
    let inputTitle = document.forms.FormHomepage.title.value;
    let inputAboutru = document.forms.FormHomepage.aboutru.value;
    let inputAbout = document.forms.FormHomepage.about.value;
    
    inputImgs.forEach(el => { images.push(el.value) });

    async function convertToBase64() {
        for(let file of inputImgsFiles.files) {  images.push(await getBase64(file)); }
    }

    await convertToBase64();

    if(inputTitle && images && inputAbout) {
        const result = {
            title: inputTitle,
            images: images,
            aboutru: inputAboutru, 
            about: inputAbout 
        }
        const response = await sendData(result);   
        if(response.status === 200)  {
            alert('Данные обновлены');
            document.location.reload();
        }
        else alert('Ошибка загрузки');
    } else {
            alert('Заполните все поля')
        }
})

getData();
>>>>>>> master
