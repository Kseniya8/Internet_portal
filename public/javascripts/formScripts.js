import { q1, q2, q4, q5 } from '/javascripts/questions.js'
import { cities } from '/javascripts/cities.js'
import { errorMsg } from '/javascripts/errorMessage.js'

window.onload = function () {
    let cropper;
    let vue;
    let lang = document.querySelector('html').lang;
    let thisYear = new Date().getFullYear();

    Vue.component('v-select', VueSelect.VueSelect);

    $('#send-form').bind("click", sendFormButtonClick);
    $('#photo').bind('change', ChangePhoto);
    $('#add-photo').bind('click', addPhotoClick);
    $('#button-yes').bind('click', DeletePhoto);
    $('#button-no').bind('click', CloseModel);
    $('.required').bind('click', RequiredFieldClick);

    let request = new XMLHttpRequest();
    request.open('POST', '/account/form/get_data', true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onreadystatechange = function () {
        if (request.readyState == 4)
            if (request.status === 200) {
                CreateVueData(JSON.parse(request.responseText));
                $('#back').css('display', 'none');
            } else {
                ShowMsg(errorMsg);
                $('#back').css('display', 'none');
            }
    }
    request.send();


    function CreateVueData(inputData) {

        if (!inputData.photo) inputData.photo = "/images/default-avatar.png";
        if (!inputData.achive_files) inputData.achive_files = [];
        if (!inputData.gallery_files) inputData.gallery_files = [];
        if (!inputData.disciplines) inputData.disciplines = [];
        if (!inputData.partner) inputData.partner = {};
        if (!inputData.phone_number) inputData.phone_number = '';
        if (!inputData.city) inputData.city = '';
        inputData.patronymic = inputData.patronymic ?? '';
        inputData.deleted_photo = [];
        inputData.changed_comment = {};
        let gallery_files = inputData.gallery_files.slice(0);
        delete inputData.gallery_files;

        let birthday = '';
        if (inputData.birthday) birthday = inputData.birthday.split('-').reverse().join('-');

        let allYears = [];
        for (let year = thisYear; year >= 1971; year--) {
            allYears.push(year.toString());
        }

        vue = new Vue({
            el: '#form-data-inputs',
            data: {
                birthday,
                allYears,
                achivePage: 0,
                depPhotosPage: 0,
                lang,
                cities,
                q1, q2, q4, q5,
                inputData,
                gallery_files
            },
            computed: {
                visibleSocButton: function () {
                    return inputData.social_network.length < 4;
                },
                isValidPhone: function () {
                    return inputData.phone_number.length == 18 ||
                        inputData.phone_number.length == 0;
                },
                isValidDate: function () {
                    let date = new Date(this.birthday);
                    return !isNaN(date) && (date < new Date());
                }
            },
            methods: {
                DeleteElementFromArray: function (index, array) {
                    array.splice(index, 1);
                },
                AddElementToArray: function (array) {
                    array.push({});
                },
                AddAvatar: openModelPhoto,
                DeleteAvatar: OpenModalWindowDeletePhoto,
                AddAchievFile: function (event) {
                    let input = event.target.files[0];
                    if (IsImage(input.type)) {
                        let reader = new FileReader();
                        reader.onloadend = () => {
                            inputData.achive_files.push(reader.result);
                            vue.achivePage = inputData.achive_files.length - 1;
                        }
                        reader.readAsDataURL(input);
                    }
                },
                DeleteAchievFile: function (index) {
                    inputData.achive_files.splice(index, 1);
                    if (this.achivePage == inputData.achive_files.length &&
                        inputData.achive_files.length != 0) this.achivePage--;
                },

                AddGalleryPhoto(event) {
                    let input = event.target.files[0];
                    if (input && IsImage(input.type)) {
                        let reader = new FileReader();
                        reader.onloadend = () => {
                            this.gallery_files.push({ img: reader.result, comment: '' });
                            this.depPhotosPage = this.gallery_files.length - 1;
                        }
                        reader.readAsDataURL(input);
                    }
                },
                DeleteGalleryPhoto(index) {
                    let id = this.gallery_files[index]._id;
                    if (id) {
                        inputData.deleted_photo.push(id);
                        delete inputData.changed_comment[id];
                    }
                    this.gallery_files.splice(index, 1);
                    if (this.depPhotosPage == this.gallery_files.length &&
                        this.gallery_files.length != 0) this.depPhotosPage--;
                },
                CommentChange(id, comment) {
                    if (id) inputData.changed_comment[id] = comment;
                },

                ShowPhoto: function (file) {
                    $('#modal-show-photo').find('img').attr('src', file);
                    $('#modal-show-photo').modal();
                },
                BestPracticesAsk: function () {
                    ShowMsg(this.lang == 'ru' ? 'Best practices - это сфера, которая вам интересна и в которой вы разбираетесь и знаете лучшие практики'
                        : 'Best practices is a field that you are interested in and in which you understand and know the best practices');
                },
                EducFormChange: function (graduate) {
                    this.$set(graduate, 'qualification', '');
                    this.ZeroingValues(graduate);
                },
                QualificationChange: function (graduate) {
                    this.ZeroingValues(graduate);
                },
                DirTrainingChange: function (graduate) {
                    this.$set(graduate, 'focus', '');
                },
                ZeroingValues: function (graduate) {
                    this.$set(graduate, 'specialty', '');
                    this.$set(graduate, 'dir_training', '');
                    this.$set(graduate, 'focus', '');
                },
                InputPhone: function () {
                    let x = inputData.phone_number.replace(/\D/g, '').match(/(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
                    inputData.phone_number = (!x[1] ? '' : '+' + x[1] +
                        (!x[2] ? '' : ' ' +
                            (!x[3] ? x[2] : '(' + x[2] + ') ' + x[3] +
                                (!x[4] ? '' : '-' + x[4] +
                                    (!x[5] ? '' : '-' + x[5])))));
                },
                CorrectYearInput(obj, field) {
                    let x = obj[field].replace(/\D/g, '');
                    if (x > thisYear) x = thisYear;
                    this.$set(obj, field, x);
                },
                CorrectYearChange(obj, field) {
                    if (obj[field] && obj[field] < 1950)
                        this.$set(obj, field, 1950);
                },
                AddCompLogo(event) {
                    let input = event.target.files[0];
                    if (IsImage(input.type)) {
                        let reader = new FileReader();
                        reader.onloadend = () => {
                            this.$set(vue.inputData.partner, 'logo', reader.result);
                        }
                        reader.readAsDataURL(input);
                    }
                },
                DeleteCompLogo() {
                    this.$set(vue.inputData.partner, 'logo', '');
                }
            }
        });
        $('#back').css('display', 'none');
    }
    
    function sendFormButtonClick() {
        if (!vue.inputData.name) { ShowMsg(vue.lang == 'ru' ? 'Вы не ввели имя!' : 'The name is not entered!'); return; }
        if (!vue.inputData.surname) { ShowMsg(vue.lang == 'ru' ? 'Вы не ввели фамилию!' : 'The last name is not entered!'); return; }
        if (!vue.isValidPhone) { ShowMsg(vue.lang == 'ru' ? 'Введите корректный номер телефона!' : 'Enter the correct phone number!'); return; }
        if (!vue.isValidDate) { ShowMsg(vue.lang == 'ru' ? 'Введите корректную дату рождения!' : 'Enter the correct date of birth!'); return; }
        $('#back').css('display', 'flex');

        vue.inputData.new_gallery_files = vue.gallery_files.filter(file => !file._id);
        vue.inputData.birthday = vue.birthday.split('-').reverse().join('-');
        if (!vue.inputData.isPartner) vue.inputData.partner = {};
        if (!vue.inputData.isLecturer) vue.inputData.disciplines = [];
        else vue.inputData.disciplines = DeleteEmptyElements(vue.inputData.disciplines);
        vue.inputData.another_education = DeleteEmptyElements(vue.inputData.another_education);
        vue.inputData.education = DeleteEmptyElements(vue.inputData.education);
        vue.inputData.social_network = CheckSocNetworks(DeleteEmptyElements(vue.inputData.social_network));

        SendForm(vue.inputData);
    }

    function DeleteEmptyElements(array) {
        let currentArray = [];
        $.each(array, function (i, obj) {
            if (!$.isEmptyObject(obj)) {
                let isEmpty = true;
                $.each(obj, function (key, value) {
                    if (value) isEmpty = false;
                });
                if (!isEmpty) currentArray.push(obj);
            }
        });
        return currentArray;
    }

    function CheckSocNetworks(array) {
        let currentArray = [];
        $.each(array, function (i, obj) {
            if (obj.network_name && obj.url)
                currentArray.push(obj);
        });
        return currentArray;
    }

    function SendForm(data) {
        let request = new XMLHttpRequest();
        request.open('POST', '/account/form/', true);
        request.setRequestHeader("Content-Type", "application/json");
        request.onreadystatechange = function () {
            if (request.readyState == 4)
                if (request.status === 200) {
                    $('#back').css('display', 'none');
                    ShowMsg(vue.lang == 'ru' ? 'Ваша анкета отправлена на рассмотрение администратору. После одобрения она появится в общем списке.'
                        : 'Your application form has been sent to the administrator for review. After approval, it will appear in the general list.');
                } else {
                    ShowMsg(errorMsg);
                    $('#back').css('display', 'none');
                }
        }

        request.send(JSON.stringify(data));
    }

    function ChangePhoto() {
        document.querySelector("#error-message").classList.add('closed');
        let myimg = document.getElementById("myimg");
        let input = document.querySelector('#photo').files[0];
        if (IsImage(input.type)) {
            let reader = new FileReader();
            reader.onloadend = function () {
                myimg.src = reader.result;
                myimg.onload = function () {
                    if (cropper) cropper.destroy();
                    cropper = new Cropper(myimg, {
                        aspectRatio: 1 / 1,
                        zoomable: false,
                        minCropBoxWidth: 75,
                        minCropBoxHeight: 75,
                        viewMode: 1
                    });
                }
            };
            reader.readAsDataURL(input);
        }
    }

    function openModelPhoto() {
        $('#modal-add-photo').modal();
    }

    function CloseModel() {
        $.modal.close();
    }

    function addPhotoClick() {
        if (cropper) {
            vue.$set(vue.inputData, 'photo', cropper.getCroppedCanvas({
                width: 300,
                height: 300
            }).toDataURL());
            CloseModel();
        } else {
            document.querySelector("#error-message")
                .classList.remove('closed');
        }
    }

    function OpenModalWindowDeletePhoto() {
        $('#modal-window').modal();
    }

    function DeletePhoto() {
        CloseModel();
        vue.$set(vue.inputData, 'photo', "/images/default-avatar.png");
    }

    function RequiredFieldClick(event) {
        this.style.background = "";
    }

    function ShowMsg(text) {
        $('#modal-msg').find('p').text(text);
        $('#modal-msg').modal();
    }

    function IsImage(type) {
        return type == "image/jpeg" ||
            type == "image/png";
    }
}