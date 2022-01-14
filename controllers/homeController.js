const homeModel = require("../models/homeModel.js")
const editMainPageModel = require("../models/editMainPageModel.js")
const base64 = require("../other/workWithBS64")
const appConfig = require("../appConfig")

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

exports.getTruePhotos = (req, res, next) => {

  page = req.query.page
  skip = parseInt(page, 10) * 10

  editMainPageModel.find({}, {}, { skip: skip, limit: 10 })
    .then((photos => {
      photos.forEach((photo, i) =>
        photos[i]['_doc']['img'] = base64.readFile(`${appConfig.editMainPage_path}${photo.img_name}`)
      )
      if (!skip) {
        editMainPageModel.find({}).countDocuments()
          .then(count => res.json({ photos: photos, count_pages: Math.ceil(count / 10) }))
      }
      else res.json({ photos: photos })
    }))
    .catch(err => next(err))
}

