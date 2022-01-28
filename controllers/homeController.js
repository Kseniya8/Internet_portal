const homeModel = require("../models/homeModel.js");
const homesModel = require("../models/homesModel.js");

const index = (req, res, next) => {
  homeModel.find({})
    .then(news_docs => res.render("index.html", {
      [req.session.lang ?? 'ru']: true,
      news: news_docs,
      isAuth: Boolean(req.session.user_id),
      isAdmin: Boolean(req.session.role == "admin")
    }))
    .catch(err => next(err))
}

const setLang = (req, res) => {
  req.session.lang = req.body.lang
  res.sendStatus(200);
}

async function getHomepage(req, res, next) {
  await homesModel.findOne({ block: 'home' })
    .then(data => res.status(200).send(data))
    .catch(err => next(err))
}

module.exports = { getHomepage, setLang, index }
