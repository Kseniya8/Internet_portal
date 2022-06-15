import { errorMsg } from '/javascripts/errorMessage.js'

window.onload = function () {
  let vue;
  let lang = document.querySelector('html').lang;

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
        AddNewsImage(event) {
          let input = event.target.files[0];
          if (IsImage(input.type)) {
            let reader = new FileReader();
            reader.onloadend = () => {
              this.inputData.images.push(reader.result);
            }
            reader.readAsDataURL(input);
          }
        },
        DeleteNewsImg(index) { this.inputData.images.splice(index, 1); }
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
