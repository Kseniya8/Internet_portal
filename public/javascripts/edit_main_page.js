import {errorMsg} from '/javascripts/errorMessage.js'
let buttonUpdateHomePage = document.querySelector('.button_update_homepage');
        
        buttonUpdateHomePage.addEventListener('click', () => {
            let inputTitle = document.forms.FormHomepage.title.value;
            let inputPhoto1 = document.forms.FormHomepage.photo1.value;
            let inputPhoto2 = document.forms.FormHomepage.photo2.value;
            let inputPhoto3 = document.forms.FormHomepage.photo3.value;
            let inputAbout = document.forms.FormHomepage.about.value;
            if(inputTitle && inputPhoto1 && inputPhoto2 && inputPhoto3 && inputAbout) {
                alert('Страница изменена')
            } else {
                alert('Заполните все поля')
            }
})
