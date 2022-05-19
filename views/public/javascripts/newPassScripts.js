import {errorMsg} from '/javascripts/errorMessage.js'

var inputNewPassButton = document.querySelector(".InputPass");
inputNewPassButton.addEventListener("click", SendPass);

function SendPass() {
    var pass = document.querySelector('input[type="password"]').value;
    if(!pass) { OpenModel('Вы не ввели пароль'); return; }
    if (pass.length < 6) {OpenModel('Пароль слишком короткий, должно быть более 6 символов'); return;}

    inputNewPassButton.disabled = true;
    var request = new XMLHttpRequest();
    request.open('POST','/account/reset_pass',true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onreadystatechange = function () { 
        if (request.readyState === 4)
            if (request.status === 200) {
                var answer = JSON.parse(request.responseText);
                OpenModel(answer.msg);
            } else {
                OpenModel(errorMsg);
            }
        inputNewPassButton.disabled = false;
    }
    var data = JSON.stringify({"password": pass});
    request.send(data);
}

function OpenModel(text){
    $('#modal').find('p').text(text);
    $('#modal').modal();
}