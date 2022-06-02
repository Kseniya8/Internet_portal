import Map from "./map.js";

var request = new XMLHttpRequest();
request.open('GET', '/admin/statistic_partners/get_statistic', true);
request.setRequestHeader("Content-Type", "application/json");
request.onreadystatechange = function () {
    if (request.readyState === 4)
        if (request.status === 200) {
            ShowStatistic(JSON.parse(request.responseText));
        }
        else {
            ShowModal('Возникла ошибка: ' + request.status + ' ' + request.statusText);
        }
}
request.send();

function ShowModal(text) {
    $('#modal-msg').find('p').text(text);
    $('#modal-msg').modal();
}

function ShowStatistic(inputData) {
    const map = new Map(inputData);
    var vm = new Vue({
        el: "#charts-content",
        data: inputData,
        methods: {
            ShowBlock(obj) {
                return !$.isEmptyObject(obj);
            }
        }
    });
    map.getMap();
}

// графики:
// - учился ли на кафедре сапр (кол-во человек и год выпуска)
// - города и кол-во представителей (но это на карте)
