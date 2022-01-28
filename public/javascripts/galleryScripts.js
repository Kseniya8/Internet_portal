import {errorMsg} from '/javascripts/errorMessage.js'

let vm = new Vue({
    el: "#main-content",
    data: {
        allPhotos: [],
        correntPage: 0,
        lastPage: 0,
        loading: true
    },
    methods: {
        MoveOnPage(page){
            this.loading = true;
            let request = new XMLHttpRequest();
            request.open('GET','/gallery/get_true?page=' + (page - 1), true);
            request.setRequestHeader("Content-Type", "application/json");
            request.onreadystatechange = function () { 
                if (request.readyState == 4){
                    if (request.status === 200){
                        let answer = JSON.parse(request.responseText);
                        vm.allPhotos = answer.photos;
                        if (answer.count_pages != undefined) vm.lastPage = answer.count_pages;
                        vm.correntPage = page;
                    }
                    else ShowMsg(errorMsg);
                   vm.loading = false;
                }
            }
            request.send();
        },
        ShowPhoto(img){
            if (window.innerWidth < 425) return;
            $('#modal-show-photo').find('img').attr('src', img);
            $('#modal-show-photo').modal();
        }
    }
});
vm.MoveOnPage(1);


function ShowMsg(text){
    $('#modal-msg').find('p').text(text);
    $('#modal-msg').modal();
}