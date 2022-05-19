import { errorMsg } from '/javascripts/errorMessage.js'

window.onload = function () {
  let cropper;
  let vue;
  const id = document.location.search.split('=')[1];
  let lang = document.querySelector('html').lang;
  let thisYear = new Date().getFullYear();
  Vue.component('v-select', VueSelect.VueSelect);
  $('#send-form').bind("click", sendFormButtonClick);
  GetPartner();
  CreateVueData();
  function CreateVueData() {
    const date = new Date();
    const inputData = {
      logo: '',
      companyFullName: '',
      companyName: '',
      country_city: '',
      represent_name: '',
      year: date.getFullYear(),
      end_year: '',
      projects: '',
      about: '',
      link: '',
      vacancies: [{ name: '', description: '' }],
      forsearch: [''],
    };
    let allYears = [];
    for (let year = thisYear; year >= 1971; year--) {
      allYears.push(year.toString());
    }
    vue = new Vue({
      el: '#is-partner-block',
      data: { inputData },
      computed: {},
      methods: {
        DeleteElementFromArray: function (index, array) {
          array.splice(index, 1);
        },
        AddElementToArray: function (array) {
          array.push({});
        },
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
        AddCompLogo(event) {
          let input = event.target.files[0];
          if (IsImage(input.type)) {
            let reader = new FileReader();
            reader.onloadend = () => {
              this.$set(vue.inputData, 'logo', reader.result);
            }
            reader.readAsDataURL(input);
          }
        },
        DeleteCompLogo() {
          this.$set(vue.inputData, 'logo', '');
        }
      }
    });
    $('#back').css('display', 'none');
  }

  function sendFormButtonClick() {
    if (!vue.inputData.companyName) { ShowMsg(lang === 'ru' ? 'Вы не ввели название компании!' : 'The company name is not entered!'); return; }
    if (!vue.inputData.companyFullName) { ShowMsg(lang === 'ru' ? 'Вы не ввели Название компании!' : 'The company name is not entered!'); return; }
    if (!vue.inputData.represent_name) { ShowMsg(lang == 'ru' ? 'Вы не ввели ФИО представителя компании!' : 'The company represernter is not entered!'); return; }
    if (!vue.inputData.logo) vue.inputData.logo = '/images/sapr.png';
    if (vue.inputData.year > vue.inputData.end_year) {
      ShowMsg(lang === 'ru' ? 'Не верные даты партнерства!' : 'Incorrect partnership dates!');
      return;
    }

    for (let i = 0; i < vue.inputData.vacancies.length; i++) {
      if (!vue.inputData.vacancies[i].name || !vue.inputData.vacancies[i].description) {
        ShowMsg(lang === 'ru' ?
          'В вакансии № ' + (i + 1) + ' заполнены не все поля' : 'In vacancy № ' + (i + 1) + ', not all fields are filled in');
        return;
      }
    }

    for (let i = 0; i < vue.inputData.forsearch.length; i++) {
      if (!vue.inputData.forsearch[i]) {
        ShowMsg(lang === 'ru' ?
          'Нет названия компании № ' + (i + 1) : 'In company name № ' + (i + 1) + ', not field are filled in');
        return;
      }
    }
    SendForm(vue.inputData);
  }

  function SendForm(data) {
    let request = new XMLHttpRequest();
    request.open('PUT', `/partners/${id}`, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onreadystatechange = function () {
      if (request.readyState == 4)
        if (request.status === 200) {
          $('#back').css('display', 'none');
          ShowMsg('Данные партнера обновлены');
        } else {
          ShowMsg(errorMsg);
          $('#back').css('display', 'none');
        }
    }

    request.send(JSON.stringify(data));
  }

  function GetPartner() {
    let request = new XMLHttpRequest();
    request.open('GET', `/partners/${id}`, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onreadystatechange = function () {
      if (request.readyState == 4)
        if (request.status === 200) {
          const newData = JSON.parse(request.response);
          vue.inputData = { ...newData }
        } else {
          ShowMsg(lang == 'ru' ? 'Партнер не найден.'
            : "Partner not found.");
          $('#back').css('display', 'none');
        }
    }
    request.send();
  }


  function CloseModel() { $.modal.close(); }

  function ShowMsg(text) {
    $('#modal-msg').find('p').text(text);
    $('#modal-msg').modal();
  }

  function IsImage(type) {
    return type == "image/jpeg" ||
      type == "image/png";
  }
}
