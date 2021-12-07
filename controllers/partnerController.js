const formModelPartner = require("../models/formModel.js");

exports.index = (req, res) => res.render("partners.html", {
    [req.session.lang ?? 'ru']: true,
    isAuth: Boolean(req.session.user_id),
    isAdmin: Boolean(req.session.role == "admin")
});


exports.searchForms = (req, res, next) => {

    name_fields = [
        'partner.name',
        'partner.year',
        'city',
    ]
    params = { status_verified: true, isPartner: true }
    let skip = 0

    for (key in req.query) {
        if (name_fields.indexOf(key) != -1 && req.query[key])
            params[key] = req.query[key]
        else if (key == 'page')
            skip = parseInt(req.query[key], 10) * 10
    }
    need_fields = {
        '_id': 1,
        'photo': 1,
        'partner.name': 1,
        'city': 1,
        'partner.year': 1,
    }

    formModelPartner.find(params, need_fields, { skip: skip, limit: 10 })
        .then(forms => {
            if (!skip) {
                formModelPartner.find(params).countDocuments()
                    .then(count => res.json({ forms: forms, count_pages: Math.ceil(count / 10) }))
            }
            else res.json({ forms: forms })
        })
        .catch(err => next(err))
}

