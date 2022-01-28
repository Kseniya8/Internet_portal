function User(name, patronymic, email, status){
    this.name = name
    this.patronymic = patronymic
    this.email = email
    this.status = status
}
var changesStatuses = {}

var changesUpdate = new Map();
var table;
let vueInput;
let vm;
window.onload = function(){
    vm = new Vue({
        el: '#pages-section',
        data: {
            lastPage: 0,
            correntPage: 0
        },
        methods:{
            MoveOnPage: function(page){
                var request = new XMLHttpRequest();
                request.open('GET','/admin/get_forms?page=' + (page - 1), true);
                request.setRequestHeader("Content-Type", "application/json");
                request.onreadystatechange = function(){
                    if (request.readyState === 4)
                        if (request.status === 200){
                            var answer = JSON.parse(request.responseText);
                            if (answer.count_pages != undefined) vm.lastPage = answer.count_pages;
                            vm.correntPage = page;
                            GetTableDate(answer.forms);
                        }
                        else {
                            ShowModal('Возникла ошибка: ' + request.status + ' ' + request.statusText);
                        }
                }
                request.send();
            }
        }
    });
    vm.MoveOnPage(1);
}

function GetTableDate(inputData){
    inputData.forEach(function(item, i){
        item.button_status = GetButtonStatus(item.status_verified, item.update);
    });
    CreateTable(inputData);
}

function GetButtonStatus(status_verified, update){
    var button = '<button onclick="event.stopPropagation()">';
    if (status_verified){
        if (update) button += 'Изменено';
        else button += 'Проверен';
    }
    else button += 'Гость';
    button += '</button>';
    return button;
}

function CreateTable(inputData){
    if (table){
        table.clear().rows.add(inputData).draw();
    }
    else table = $('#admin-table').DataTable( {
        language: {
            url: "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Russian.json"
        },
        data: inputData,
        paging: false,
        searching: false,
        columns: [
            { data: '_id' },
            { data: 'name'},
            { data: 'surname' },
            { data: 'patronymic' },
            { data: 'city' },
            { data: 'button_status'}
        ],
        order: [[ 5, "asc" ]],
        columnDefs: [
            {
                targets: [0],
                visible: false,
                searchable: false
            }
        ]
    } );
    table.draw();

    $('td > button').on('click', TableButtonClick);

    $('#admin-table tbody').on('click', 'tr', function () {
        ShowForm(table.row(this).data());
    } );
}

$('#save-button').on('click', function(){
    var changesArr = [];
    var changesUpdateArr = [];
    console.log(changesStatuses)
    if(!changesStatuses && !changesUpdate.size){
        ShowModal('Изменений не обнаружено');
        return;
    }
    for (key in changesStatuses)
        changesArr.push({
            _id: key, 
            name: changesStatuses[key].name,
            patronymic: changesStatuses[key].patronymic,
            email: changesStatuses[key].email,
            status_verified: changesStatuses[key].status,
        });

    changesUpdate.forEach(function(value, key){
        changesUpdateArr.push({_id: key, update: value});
    });

    let request = new XMLHttpRequest();
    request.open('POST','/admin/update_statuses',true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onreadystatechange = function () {
        if (request.readyState === 4){
            if (request.status === 200){
                ShowModal('Изменения сохранены');
                changesStatuses = {};
                changesUpdate.clear();
                $('td > button').each( function(){
                    this.classList.remove('red-button')});
            } else {
                ShowModal('При отправке данных возникла ошибка');
            }
        }
    }
    request.send(JSON.stringify({
        statuses_ver: JSON.stringify(changesArr),
        statuses_upd: JSON.stringify(changesUpdateArr)
    }));
});

function ShowForm(data){
    $('#form').attr('href','/forms/get_form/' + data['_id']);
    $('#form-block').modal();
    $("#form-email").text(data['email']);
    $("#form-name").text(data['name']);
    $("#form-surname").text(data['surname']);
    $("#form-patronymic").text(data['patronymic']);
    $("#form-city").text(data['city']);
    $("#form-phone").text(data['phone_number']);
    $("#form-img").attr('src', data['photo']);
}

function TableButtonClick(){
    let obj = table.row(this.parentElement.parentElement).data();
    let update = obj['update'];
    let id =  obj['_id'];
    this.classList.toggle('red-button');
    switch(this.textContent){
        case "Изменено":
            this.textContent = "Проверен";
            changesUpdate.set(id, false);
            break;
        case "Гость":
            this.textContent = "Проверен";
            if (!(id in changesStatuses)) 
                changesStatuses[id] = new User(
                                                obj.name,
                                                obj.patronymic,
                                                obj.email,
                                                this.textContent == "Проверен",
                );
            else delete changesStatuses[id];
            break;
        case "Проверен":
            if (update){
                this.textContent = "Изменено";
                changesUpdate.set(id, true);
            } else {
                this.textContent = "Гость";
                if (!(id in changesStatuses)) 
                changesStatuses[id] = new User(
                                                obj.name,
                                                obj.patronymic,
                                                obj.email,
                                                this.textContent == "Проверен",
                );
            }
            break;
    }
}

function ShowModal(text){
    $('#modal-msg').find('p').text(text);
    $('#modal-msg').modal();
}