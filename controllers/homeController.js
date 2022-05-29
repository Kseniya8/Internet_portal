const homesModel = require("../models/homesModel.js");

const index = (req, res, next) => res.render("index.html", {
  [req.session.lang ?? 'ru']: true,
  isAuth: Boolean(req.session.user_id),
  isAdmin: Boolean(req.session.role == 'admin')
});

const politic = (req, res, next) => res.render("politic.html", {
  [req.session.lang ?? 'ru']: true,
  isAuth: Boolean(req.session.user_id),
  isAdmin: Boolean(req.session.role == 'admin')
});

const setLang = (req, res) => {
  req.session.lang = req.body.lang
  res.sendStatus(200);
}

async function getHomepage(req, res, next) {
  await homesModel.findOne({ block: 'home' })
    .then(data => res.status(200).send(data))
    .catch(err => next(err))
}

module.exports = { getHomepage, setLang, index, politic }
