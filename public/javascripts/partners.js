import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js';

const representersListUrl = '/partners/representers';
let vueInput;
window.onload = function () {

    vueInput = new Vue({
        el: '#mainBlock',
        data: {
            companyName: '',
            represent_name: '',
            year: '',
            end_year: '',
            lastPage: 0,
            correntPage: 0,
            inputData: [],
            representersList: [],
            patronymic: '',
            name: '',
            surname: '',
            vacancies: [],
        },
        computed: {
            visibleNoResult: function () {
                return this.inputData.length == 0;
            }
        },
        methods: {
            searchButtonClick: function () {
                this.address = '/partners/search?companyName=' + this.companyName +
                    '&year=' + this.year + '&end_year=' + this.end_year;
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
                        vueInput.ShowResult(answer.partners);
                    }
                }
                request.send();
            },
            ShowResult: function (answer) {
                this.inputData = [];
                answer.forEach(item => {
                    this.inputData.push({
                        representname: item.represent_name,
                        companyfullname: item.companyFullName,
                        vacancies: item.vacancies,
                        companyname: item.companyName,
                        id: item._id,
                        logo: item.logo,
                        link: item.link,
                        year: item.year,
                        endyear: item.end_year,
                        countrycity: item.country_city,
                        projects: item.projects,
                        about: item.about,
                        representersList: [],
                    });
                });
                vueInput.GetRepresenters();
            },
            CheckNull(value) {
                return value == null ? '' : value;
            },
            GetRepresenters: function () {
                var request = new XMLHttpRequest();
                request.open('GET', representersListUrl, true);
                request.setRequestHeader("Content-Type", "application/json");
                request.onreadystatechange = function () {
                    if (request.readyState === 4 && request.status === 200) {
                        var response = JSON.parse(request.responseText);
                        this.representersList = response.representersList;
                        vueInput.SetRepresenters(response.representersList);
                    }
                }
                request.send();
            },
            SetRepresenters: function (representersList) {
                this.inputData = this.inputData.map((partner) => {
                    let arrSearchedRepresentatives = representersList[partner.companyname];
                    if (this.surname != '')
                        arrSearchedRepresentatives = [];
                    if (representersList[partner.companyname]) {
                        for (let i = 0; i < representersList[partner.companyname].length; i++) {
                            if (this.surname != '' && representersList[partner.companyname][i].name.toUpperCase().indexOf(this.surname.toUpperCase()) >= 0)
                                arrSearchedRepresentatives.push(representersList[partner.companyname][i]);
                        }
                        return { ...partner, representersList: arrSearchedRepresentatives };
                    }
                    return partner;
                })
            },
            ToggleText: function (n) {
                let elAbout = document.getElementsByClassName('projects');
                if (elAbout[n].style.display != 'block') {
                    elAbout[n].style.display = 'block'
                } else {
                    elAbout[n].style.display = '-webkit-box'
                }
            }
        }
    });
    vueInput.searchButtonClick();
}

