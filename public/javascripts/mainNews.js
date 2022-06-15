import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js';

var newsTable;
window.onload = function () {
    const vm = new Vue({
        el: '#news_section',
        data: {
            lastPage: 0,
            correntPage: 0,
            inputData: [],
        },
        paging: false,
        computed: {
            visibleNoResult: function () {
                return this.inputData.length == 0;
            }
        },
        methods: {
            GetNews: function () {
                this.address = '/news/get';
                var request = new XMLHttpRequest();
                request.open('GET', this.address, true);
                request.setRequestHeader("Content-Type", "application/json");
                request.onreadystatechange = function () {
                    if (request.readyState === 4 && request.status === 200) {
                        var answer = JSON.parse(request.responseText);
                        vm.SetInputData(answer.news);
                    }
                }
                request.send();
            },
            SetInputData: function (news) {
                this.inputData = news.map(item => ({ ...item, date: new Date(item.date).toLocaleDateString() })).splice(0, 6);
            },
        }
    });
    vm.GetNews();
}
