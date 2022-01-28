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