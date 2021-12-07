const appConfig = require("../appConfig");
const homeModel = require("../models/homeModel.js")
const mustache = require("mustache")

exports.index = (req, res, next) => {
  homeModel.find({})
    .then(news_docs => res.render("index.html", {
      [req.session.lang ?? 'ru']: true,
      news: news_docs,
      isAuth: Boolean(req.session.user_id),
      isAdmin: Boolean(req.session.role == "admin")
    }))
    .catch(err => next(err))
}

exports.setLang = (req, res) => {
  req.session.lang = req.body.lang
  res.sendStatus(200);
}


