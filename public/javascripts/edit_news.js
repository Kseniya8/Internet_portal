window.onload = function () {
  let vue;

  CreateVueData();

  let lang = document.querySelector('html').lang;
  const id = document.location.search.split('').splice(1).join('');
  function CreateVueData() {

    vue = new Vue({
      el: '#is-news-block',
      data: {
        inputData: {
          heading: '',
          text: '',
          full_text: '',
          date: '',
          images: [],
          img_input: '',
        }
      },
      paging: false,
      computed: {
        visibleNoResult: function () {
          return Object.keys(this.inputData).length > 0;
        }
      },
      methods: {
        GetNews: function () {
          const address = '/news/get';
          const request = new XMLHttpRequest();
          request.open('GET', address, true);
          request.setRequestHeader("Content-Type", "application/json");
          request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
              const answer = JSON.parse(request.responseText);
              vue.SaveResult(answer.news);
            }
          }
          request.send();
        },
        SaveResult: function (answer) {
          const news = answer.find(item => item._id === id);
          this.inputData = { ...news, date: new Date(news.date).toISOString().split('T')[0] };
        },
        PutNews: function (data) {
          const address = `/news/${id}`;
          const request = new XMLHttpRequest();
          request.open('PUT', address, true);
          request.setRequestHeader("Content-Type", "application/json");
          request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 200) {
              $('#back').css('display', 'none');
              ShowMsg(lang == 'ru' ? 'Новость обновлена.'
                : "News have been updated.");
            } else {
              $('#back').css('display', 'none');
              ShowMsg(lang == 'ru' ? 'Новость не обновлена, что-то пошло не так.'
                : "News not updated.");
            }
          }
          request.send(JSON.stringify(data));
        },
        AddNewsImg(event) {
          let input = event.target.files[0];
          if (IsImage(input.type)) {
            let reader = new FileReader();
            reader.onloadend = () => {
              this.inputData.images.push(reader.result);
            }
            reader.readAsDataURL(input);
          }
        },
        DeleteNewsImg(index) { this.inputData.images.splice(index, 1); },
      }
    })

    $('#back').css('display', 'none');
  }

  function sendFormButtonClick() {
    if (!vue.inputData.heading) { ShowMsg(lang === 'ru' ? 'Вы не ввели заголовок!' : 'The header is not entered!'); return; }
    if (!vue.inputData.text) { ShowMsg(lang === 'ru' ? 'Вы не ввели краткий текст!' : 'The short text is not entered!'); return; }
    if (!vue.inputData.full_text) { ShowMsg(lang == 'ru' ? 'Вы не ввели полный текст!' : 'The full text is not entered!'); return; }
    if (!vue.inputData.date) { ShowMsg(lang == 'ru' ? 'Вы не выбрали дату!' : 'The date is not selected!'); return; }
    if (!vue.inputData.images) { ShowMsg(lang == 'ru' ? 'Вы не выбрали фотографии!' : 'The photo is not present!'); return; }

    vue.PutNews(vue.inputData);
  }

  function ShowMsg(text) {
    $('#modal-msg').find('p').text(text);
    $('#modal-msg').modal();
  }

  function IsImage(type) {
    return type == "image/jpeg" ||
      type == "image/png";
  }

  vue.GetNews();
  $('#send-form').bind("click", sendFormButtonClick);
}
