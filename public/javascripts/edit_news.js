import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.js';

var newsTable;
window.onload = function () {
  const vm = new Vue({
    el: '#newsList',
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
          console.log(request)
          if (request.readyState === 4 && request.status === 200) {
            var answer = JSON.parse(request.responseText);
            console.log(answer)
            vm.ShowResult(answer.news);
          }
        }
        request.send();
      },
      ShowResult: function (answer) {
        this.inputData = [];
        answer.forEach(item => {
          this.inputData.push({
            heading: item.heading,
            date: item.date,
            text: item.text,
            id: item._id,
            fulltext: item.full_text,
            images: item.images,
          });
        });
        CreateNewsTable(this.inputData)
      },
    }
  });
  vm.GetNews();
}

function CreateNewsTable(inputData) {
  if (newsTable) {
    newsTable.clear().rows.add(inputData).draw();
  }
  else newsTable = $('#news-table').DataTable({
    language: {
      url: "https://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Russian.json"
    },
    data: inputData,
    paging: false,
    searching: false,
    columns: [
      { data: 'id', defaultContent: "" },
      { data: 'heading', defaultContent: "" },
      { data: 'text', defaultContent: "" },
      { data: 'date', defaultContent: "" },
      {
        data: 'delete', render: function () {
          return '<button onclick="event.stopPropagation()" class="red-button">Удалить</button>'
        }
      },
    ],
    columnDefs: [
      {
        targets: [0],
        visible: false,
        searchable: false
      }
    ]
  });
  newsTable.draw();

  $('td > button').on('click', DeleteNews);

  $('#news-table tbody').on('click', 'tr', function () {
    ShowNews(newsTable.row(this).data());
  });
}
