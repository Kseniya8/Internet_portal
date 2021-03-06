import { focus, specialty } from '/javascripts/education.js'
import { cities } from '/javascripts/cities.js'

let vueInput;
window.onload = function () {
    Vue.component('v-select', VueSelect.VueSelect);

    var yearsArray = [];
    for (var i = new Date().getFullYear(); i >= 1971; i--) {
        yearsArray.push(i);
    }

    vueInput = new Vue({
        el: '#mainBlock',
        data: {
            name: '', surname: '',
            patronymic: '', group: '',
            year: '', focus: '',
            specialty: '', city: '',

            address: '',

            cities, focusList: focus,
            specialtyList: specialty,

            lastPage: 0,
            correntPage: 0,
            yearsArray,
            inputData: []
        },
        computed: {
            visibleNoResult: function () {
                return this.inputData.length == 0;
            }
        },
        methods: {
            searchButtonClick: function () {
                this.address = '/forms/search?name=' + this.name +
                    '&surname=' + this.surname +
                    '&patronymic=' + this.patronymic +
                    '&education.group=' + this.group +
                    '&education.year_graduation=' + this.CheckNull(this.year) +
                    '&city=' + this.CheckNull(this.city) +
                    '&education.focus=' + this.CheckNull(this.focus) +
                    '&education.specialty=' + this.CheckNull(this.specialty);
                this.MoveOnPage(1);
            },
            MoveOnPage: function (page) {
                var request = new XMLHttpRequest();
                request.open('GET', this.address + '&page=' + (page - 1), true);
                request.setRequestHeader("Content-Type", "application/json");
                request.onreadystatechange = function () {
                    if (request.readyState === 4 && request.status === 200) {
                        var answer = JSON.parse(request.responseText);
                        if (answer.count_pages != undefined) vueInput.lastPage = answer.count_pages;
                        vueInput.correntPage = page;
                        vueInput.ShowResult(answer.forms);
                    }
                }
                request.send();
            },
            ShowResult: function (answer) {
                this.inputData = [];
                answer.forEach(item => {
                    this.inputData.push({
                        full_name: item.surname + ' ' + item.name + ' ' + item.patronymic,
                        id: item._id,
                        photo: item.photo,
                        year_graduation: !item.education[0] ? '' : item.education[0].year_graduation,
                        city: item.city
                    });
                });
            },
            CheckNull(value) {
                return value == null ? '' : value;
            }
        }
    });
    vueInput.searchButtonClick();
}
