const formModelNews = require("../models/newsModel.js");

exports.index = (req, res, next) => res.render("news.html", {
    [req.session.lang ?? 'ru']: true,
    isAuth: Boolean(req.session.user_id),
    isAdmin: Boolean(req.session.role == 'admin')
});

exports.admin = (req, res, next) => res.render("edit_news.html", {
    [req.session.lang ?? 'ru']: true,
    isAuth: Boolean(req.session.user_id),
    isAdmin: Boolean(req.session.role == 'admin')
});

exports.createNews = (req, res, next) => {
    new_News = req.body;
    
    formModelNews.create(new_News)
        .then((form) => {
            if (form) res.sendStatus(201);
        })
        .catch(err => next(err))
}

exports.updatePartner = (req, res, next) => {
    const { id } = req.params;
    new_News = req.body;
    
    formModelNews.updateOne({ _id: id }, new_News)
      .then((news) => {
        if (news) res.status(200).json({ ...news });
      })
    .catch(err => next(err))
}

exports.getNewsList = (req, res, next) => {
    formModelNews.find({})
      .then((news) => {
        if (news.length) {
          res.status(200).json({ partnersList: partners.map((partner) => ({ id: news.id, name: news.header })) })
        }
      })
      .catch(err => next(err))
  }