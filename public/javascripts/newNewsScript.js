import { errorMsg } from '/javascripts/errorMessage.js'

window.onload = function () {
  let cropper;
  let vue;
  let lang = document.querySelector('html').lang;
  let thisYear = new Date().getFullYear();

  Vue.component('v-select', VueSelect.VueSelect);

  $('#send-form').bind("click", sendFormButtonClick);

  CreateVueData();

  function CreateVueData() {
    const inputData = {
      heading: '',
      text: '',
      full_text: '',
      date: '',
      images: [],
      img_input: '',
    };

    vue = new Vue({
      el: '#is-news-block',
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
        AddNewsImage(event) {
          let input = event.target.files[0];
          if (IsImage(input.type)) {
            let reader = new FileReader();
            reader.onloadend = () => {
              vue.inputData.images.push(reader.result);
              console.log(inputData)
            }
            reader.readAsDataURL(input);
          }
        },
        DeleteNewsImg(index) {
          vue.inputData.images.splice(index, 1);
        }
      }
    });

    $('#back').css('display', 'none');
  }

  function sendFormButtonClick() {
    if (!vue.inputData.heading) { ShowMsg(lang === 'ru' ? 'Вы не ввели заголовок!' : 'The header is not entered!'); return; }
    if (!vue.inputData.text) { ShowMsg(lang === 'ru' ? 'Вы не ввели краткий текст!' : 'The short text is not entered!'); return; }
    if (!vue.inputData.full_text) { ShowMsg(lang == 'ru' ? 'Вы не ввели полный текст!' : 'The full text is not entered!'); return; }
    if (!vue.inputData.date) { ShowMsg(lang == 'ru' ? 'Вы не выбрали дату!' : 'The date is not selected!'); return; }
    if (!vue.inputData.images) { ShowMsg(lang == 'ru' ? 'Вы не выбрали фотографии!' : 'The photo is not present!'); return; }

    SendForm(vue.inputData);
  }

  function SendForm(data) {
    console.log(data)
    let request = new XMLHttpRequest();
    request.open('POST', '/news', true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onreadystatechange = function () {
      if (request.readyState == 4)
        if (request.status === 201) {
          $('#back').css('display', 'none');
          ShowMsg(lang == 'ru' ? 'Новость добавлена.'
            : "News have been created.");
        } else {
          ShowMsg(errorMsg);
          $('#back').css('display', 'none');
        }
    }

    request.send(JSON.stringify(data));
  }

  function CloseModel() {
    $.modal.close();
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
