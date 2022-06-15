const newsModel = require("../models/newsModel.js");

exports.index = (req, res) => res.render("news.html", {
    [req.session.lang ?? 'ru']: true,
    isAuth: Boolean(req.session.user_id),
    isAdmin: Boolean(req.session.role == 'admin')
});

exports.AddNews = (req, res) => res.render("add_news.html", { [req.session.lang ?? 'ru']: true, isAuth: true, isAdmin: true })

exports.EditNews = (req, res) => res.render("edit_news.html", {
    [req.session.lang ?? 'ru']: true,
    isAuth: true,
    isAdmin: true,
});

exports.EditSection = (req, res) => res.render("edit_section.html", {
    [req.session.lang ?? 'ru']: true,
    isAuth: true,
    isAdmin: true,
});

exports.deleteNews = async (req, res) => {
  const { params: { id: _id } } = req;
  newsModel.deleteOne({ _id })
    .then((data) => { res.sendStatus(204); })
    .catch(err => (err));
}

exports.searchForms = (req, res) => {

    name_fields = [
      'heading',
      'name',
      'partner.name',
      'year',
      'end_year',
    ]
    params = {}
    let skip = 0
  
    for (key in req.query) {
      if (name_fields.indexOf(key) != -1 && req.query[key]) {
        if (key == 'companyName') {
          params.$or = [
            { companyName: RegExp(req.query[key], "i") },
            { "forsearch.value": RegExp(req.query[key], "i") }
          ]
        }
        else
          params[key] = RegExp(req.query[key], "i")
      }
      else if (key == 'page')
        skip = parseInt(req.query[key], 10) * 10
    }
  
    need_fields = {
      '_id': 1,
      'heading': 1,
      'text': 1,
      'full_text': 1,
      'date': 1,
    }
  
    formModelPartner.find(params, need_fields, { skip: skip, limit: 10 })
      .then(forms => {
        if (forms) {
          formModelPartner.find(params).countDocuments()
            .then(count => res.json({ partners: forms, count: count }))
        }
        else res.json({ partners: {} })
      })
    .catch(err => (err))
}

exports.create = (req, res) => {
  newsModel.create(req.body)
    .then((data) => { res.sendStatus(201); })
    .catch(err => (err));
}

exports.read = (req, res) => {
  newsModel.find().sort({ date: -1 })
    .then((news) => { res.json({ news }); })
    .catch((err) => { res.sendStatus(400); console.log(err); });
}

exports.update = (req, res) => {
  console.log(req.params, req.body)
  res.sendStatus(200)
}

