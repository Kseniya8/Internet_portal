import {errorMsg} from '/javascripts/errorMessage.js'

let vm = new Vue({
    el: "#main-content",
    data: {
        allPhotos: [],
        changedStatus: {},
        correntPage: 0,
        lastPage: 0,
        loading: true,
    },
    methods: {
        MoveOnPage(page){
            this.loading = true;
            let request = new XMLHttpRequest();
            request.open('GET','/gallery/get_all?page=' + (page - 1),true);
            request.setRequestHeader("Content-Type", "application/json");
            request.onreadystatechange = function () { 
                if (request.readyState == 4){
                    if (request.status === 200) {
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
        ChangeStatus(photo){
            photo.status = !photo.status;
            this.changedStatus[photo._id] = photo.status;
            console.log(this.changedStatus);
        },
        ShowPhoto(img){
            $('#modal-show-photo').find('img').attr('src', img);
            $('#modal-show-photo').modal();
        },
        SaveChanges(){
            if ($.isEmptyObject(this.changedStatus)) {ShowMsg('Изменений не найдено'); return;}
            
            $('#back').css('display', 'flex');
            let request = new XMLHttpRequest();
            request.open('POST','/gallery/update_statuses',true);
            request.setRequestHeader("Content-Type", "application/json");
            request.onreadystatechange = function () { 
                if (request.readyState == 4)
                    if (request.status === 200) {
                        ShowMsg('Изменения успешно сохранены');
                        $('#back').css('display', 'none');
                    } else {
                        ShowMsg(errorMsg);
                        $('#back').css('display', 'none');
                    }
            }
            request.send(JSON.stringify(this.changedStatus));
        }
    }
});
vm.MoveOnPage(1);

function ShowMsg(text){
    $('#modal-msg').find('p').text(text);
    $('#modal-msg').modal();
}