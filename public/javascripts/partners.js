import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js';

let vueInput;
window.onload = function () {

    vueInput = new Vue({
        el: '#mainBlock',
        data: {
            surname: '', name: '', patronymic: '', partner_name: '', partner_year: '',
            lastPage: 0,
            correntPage: 0,
            inputData: []
        },
        computed: {
            visibleNoResult: function () {
                return this.inputData.length == 0;
            }
        },
        methods: {
            searchButtonClick: function () {
                this.address = '/partners/search?partner.name=' + this.partner_name +
                    '&partner.year=' + this.partner_year +
                    '&surname=' + this.surname +
                    '&name=' + this.name +
                    '&patronymic=' + this.patronymic;
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
                        partner_name: item.partner['name'],
                        id: item._id,
                        logo: item.partner.logo,
                        photo: item.photo,
                        link: item.partner.link,
                        year: item.partner.year,
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

