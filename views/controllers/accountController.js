const accountModel = require("../models/accountModel")
const galleryModel = require("../models/galleryModel")
const appConfig = require("../appConfig");
const bcrypt = require('bcrypt');
var crypto = require("crypto");
const formModel = require("../models/formModel.js");
const sendMessageToEmail = require("../other/email").sendMessageToEmail
const UserError = require("../other/error");
const bs64 = require('../other/workWithBS64')
const fs = require('fs')

exports.index = (req, res) => res.render("auth.html", {
    [req.session.lang ?? 'ru']: true,
    isAuth: Boolean(req.session.user_id),
    isAdmin: Boolean(req.session.role == 'admin'),
})

//#region Login
exports.checkBeforeLogin = (req, res, next) => {

    if (!req.body.email || !req.body.password)
        throw new UserError(req.session.lang == 'en' ? 'Invalid request!' : 'Некорректный запрос!', 'json')

    if (req.session.user_id)
        throw new UserError(req.session.lang == 'en' ? 'You are already logged in!' : 'Вы уже вошли в систему!', 'json')

    next()
}

exports.login = (req, res, next) => {

    accountModel.Account.findOne({ email: req.body.email })
        .then(acc => {
            if (!acc)
                throw new UserError(req.session.lang == 'en' ? 'Wrong e-mail or password!' : 'Неправильный email или пароль!', 'json')

            bcrypt.compare(req.body.password, acc.password)
                .then((result) => {
                    if (!result)
                        throw new UserError(req.session.lang == 'en' ? 'Wrong e-mail or password!' : "Неправильный email или пароль!", 'json')

                    req.session.user_id = acc.id
                    req.session.role = acc.role
                    return res.json({ success: true, role: acc.role })
                })
                .catch(err => next(err))
        })
        .catch(err => next(err))
}
//#endregion Login


// #region Reg
exports.checkBeforeReg = (req, res, next) => {

    if (!req.body.email || !req.body.password)
        throw new UserError(req.session.lang == 'en' ? 'Invalid request!' : 'Некорректный запрос!', 'json')

    if (req.session.user_id)
        throw new UserError(req.session.lang == 'en' ? 'You are already registered and are in the system!' : "Вы уже зарегистрированы и находитесь в системе!", "json")

    next()
}

exports.reg = (req, res, next) => {

    accountModel.Account.findOne({ email: req.body.email })
        .then(acc => {
            if (acc)
                if (acc.active)
                    throw new UserError(req.session.lang == 'en' ? 'A user with this e-mail already exists!' : "Пользователь с таким email уже существует!", "json")
                else {
                    return sendMessageToEmail(acc.email, (req.session.lang == 'en' ? 'To confirm your e-mail, click on the link:' : `Для подтверждения почты перейдите по ссылке:`)
                        + `\n${appConfig.app_url}/account/confirm-email/${acc.verify_hash}`)
                        .then(() => {
                            throw new UserError(req.session.lang == 'en' ?
                                "Check your e-mail address. A link was sent to it to confirm the mail! If the e-mail didn't arrive, check the spam folder!"
                                : "Проверьте свой email. На него была отправлена ссылка для подтверждения почты! Если письмо не пришло, проверьте папку спам!", "json")
                        })
                }
            else return bcrypt.hash(req.body.password, 10)
        })
        .then((hash) =>
            accountModel.Account({
                password: hash,
                email: req.body.email,
                active: false,
                verify_hash: crypto.randomBytes(20).toString('hex'),
                role: ""
            }).save()
        )
        .then((newAcc) => sendMessageToEmail(newAcc.email,
            (req.session.lang == 'en' ? 'To confirm your e-mail, click on the link:' : `Для подтверждения почты перейдите по ссылке:`)
            + `\n${appConfig.app_url}/account/confirm-email/${newAcc.verify_hash}`))
        .then(() => res.json({
            msg: req.session.lang == 'en' ?
                "A message has been sent to your e-mail! If the e-mail didn't arrive, check the spam folder!" :
                "На вашу почту отправлено сообщение! Если письмо не пришло, проверьте папку спам!"
        }))
        .catch(err => next(err))
}
//#endregion Reg


// #region Confirm Email
module.exports.confirmEmail = (req, res, next) => {
    if (!req.params["hash"])
        throw new UserError(req.session.lang == 'en' ? 'Invalid request!' : 'Некорректный запрос!', 'html')

    accountModel.Account.findOne({ verify_hash: req.params["hash"] })
        .then(acc => {
            if (!acc) throw new UserError(req.session.lang == 'en' ? "This link is outdated!" : "Данная ссылка устарела!", "html")

            return accountModel.Account.findOneAndUpdate({ _id: acc.id }, { role: "guest", active: true, $unset: { verify_hash: 1 } })
        })
        .then((acc) => {
            req.session.user_id = acc.id
            req.session.role = acc.role
            res.redirect('/account/form/')
        })
        .catch(err => next(err))
}
// #endregion Confirm Email


//#region Logout
module.exports.logout = (req, res) => {
    if (req.session) {
        delete req.session.user_id
        delete req.session.role
    }
    return res.redirect("/account")
}
//#endregion Logout


//#region Reset password
//#region Req Reset

exports.ReqResetPasswordHandler = (req, res, next) => {
    if (req.session.user_id) throw new UserError(req.session.lang == 'en' ? "You are already logged in!" : "Вы уже вошли в систему!", "json")

    accountModel.Account.findOne({ email: req.body.email })
        .then(acc => {
            if (!acc) throw new UserError(req.session.lang == 'en' ? "The account with this e-mail was not found!" : "Аккаунт с такой почтой не найден!", "json")
            else return accountModel.ResetPass.findOne({ email: req.body.email })
        })
        .then((acc) => {
            if (acc) return acc
            else return accountModel.ResetPass({
                email: req.body.email,
                verify_hash: crypto.randomBytes(20).toString('hex')
            }).save()
        })
        .then((reqRes) => sendMessageToEmail(reqRes.email, (req.session.lang == 'en' ?
            "To reset your password, follow the link:" : `Для сброса пароля перейдите по ссылке:`) + `\n${appConfig.app_url}/account/reset_pass/${reqRes.verify_hash}`))
        .then(() => res.json({
            success: true, msg: "Проверьте свой email. На него была отправлена ссылка для сброса пароля!" +
                " Если письмо не пришло, проверьте папку спам!"
        }))
        .catch(err => next(err))
}
//#endregion Req Reset

//#region Following a link
exports.inputNewPass = (req, res) => {
    accountModel.ResetPass.findOne({ verify_hash: req.params.hash })
        .then(reqRes => {
            if (!reqRes) throw new UserError(req.session.lang == 'en' ? "This link is outdated!" : "Данная ссылка устарела!")

            req.session.email = reqRes.email;
            req.session.verify_hash_for_resetPass = req.params.hash;
            return res.render("input_new_pass.html", {
                [req.session.lang ?? 'ru']: true,
                isAuth: Boolean(req.session.user_id),
                isAdmin: Boolean(req.session.role == 'admin')
            })
        })
        .catch(err => next(err))
}
//#endregion Following a link

//#region Reset
exports.findReq = (req, res, next) => {
    accountModel.ResetPass.findOne({ verify_hash: req.session.verify_hash_for_resetPass })
        .then((reqRes) => {
            if (!reqRes) return res.json({ success: false, msg: req.session.lang == 'en' ? "The request is outdated!" : "Запрос устарел!" })
            else next()
        })
        .catch(err => next(err))
}

exports.resetPass = (req, res, next) => {

    bcrypt.hash(req.body.password, 10)
        .then((hash) => accountModel.Account.updateOne({ email: req.session.email }, { password: hash }))
        .then(() => {
            delete req.session.email
            delete req.session.verify_hash_for_resetPass
            return res.json({ success: true, msg: req.session.lang == 'en' ? "Password successfully updated!" : "Пароль успешно обновлён!" })
        })
        .then()
        .catch(err => next(err))
}
//#endregion Reset

//#endregion Reset password


// #region Form

exports.returnForm = (req, res, next) => res.render("form.html", { [req.session.lang ?? 'ru']: true, isAuth: Boolean(req.session.user_id) })


exports.getFormData = (req, res, next) => {

    formModel.findOne({ _id: req.session.user_id }, { _id: 0 })
        .then(form => {
            if (!form) form = {}
            else form = form['_doc']
            if (form['education'] == null) form['education'] = [{}]
            if (form['another_education'] == null) form['another_education'] = [{}]
            if (form['social_network'] == null) form['social_network'] = [{}]
            if (form['disciplines'] == null) form['disciplines'] = [{}]

            galleryModel.find({ user_id: req.session.user_id }, { user_id: 0 })
                .then(photos => {
                    if (!photos) photos = []
                    else {
                        photos.forEach((photo, i) => {
                            photos[i]['_doc']['img'] = bs64.readFile(`${appConfig.gallery_path}${photo['img_name']}`)
                            delete photos[i]['_doc']['img_name']
                        })
                    }
                    form['gallery_files'] = photos
                    res.json(form)
                })
                .catch(err => next(err))
        })
        .catch(err => next(err))
}

exports.checkRole = (req, res, next) => {
    if (!req.session.user_id) throw new UserError(req.session.lang == 'en' ? "You are not logged in!" : "Вы не вошли в систему!", 'html')

    accountModel.Account.findById(req.session.user_id)
        .then((acc) => {
            if (acc.role != "guest" && acc.role != "user") {
                throw new UserError(req.session.lang == 'en' ? "You are not logged in for this page!" : 'Вы не авторизованы для данной страницы!', 'html')
            }
            else next()
        })
        .catch(err => next(err))
}

exports.createForm = (req, res, next) => {
    form_from_client = req.body

    formModel.findOne({ _id: req.session.user_id })
        .then((form) => {
            if (form) {
                form_from_client.update = true
                return formModel.updateOne({ _id: req.session.user_id }, form_from_client)
            }
            else {
                form_from_client.status_verified = false
                form_from_client['_id'] = req.session.user_id
                return formModel(form_from_client).save()
            }
        })
        .then(() => {
            // Работаем с фотками которые пришли с клиента
            new_photos = form_from_client.new_gallery_files
            changed_comment = form_from_client.changed_comment
            deleted_photo = form_from_client.deleted_photo

            new_photos.forEach(photo => {

                let filepath = `${appConfig.gallery_path}${Date.now()}.png`
                bs64.writeFile(filepath, photo['img'].split(',')[1])

                filename = filepath.split('/')
                img_name = filename[filename.length - 1]
                photo = {
                    'user_id': req.session.user_id,
                    'img_name': img_name,
                    'comment': photo['comment'],
                    'status': false,
                }
                galleryModel(photo).save().then()
                    .catch(err => next(err))
            })

            deleted_photo.forEach(id => {
                galleryModel.findByIdAndDelete(id)
                    .then((doc) => fs.unlink(`${appConfig.gallery_path}${doc.img_name}`, (err) => { if (err) throw err }))
                    .catch(err => next(err))
            })

            for (key in changed_comment)
                galleryModel.updateOne({ _id: key }, { comment: changed_comment[key] })
                    .then()
                    .catch(err => next(err))
        })
        .then(() => res.sendStatus(200))
        .catch(err => next(err))
}
// #endregion Form