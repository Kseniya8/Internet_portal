const editMainPageModel = require("../models/editMainPageModel.js")
const bs64 = require("../other/workWithBS64")
const appConfig = require("../appConfig")

exports.admin = (req, res, next) => res.render("edit_main_page.html", {
    [req.session.lang ?? 'ru']: true,
    isAuth: Boolean(req.session.user_id),
    isAdmin: Boolean(req.session.role == 'admin')
});

exports.getFormData = (req, res, next) => {
    console.log("getFormData")

    editMainPageModel.find({}, {})
        .then(photos => {
            if (!photos) photos = []
            else {
                photos.forEach((photo, i) => {
                    photos[i]['_doc']['img'] = bs64.readFile(`${appConfig.editMainPage_path}${photo['img_name']}`)
                    delete photos[i]['_doc']['img_name']
                })
            }
            form['gallery_files'] = photos
            res.json(form)

                .catch(err => next(err))
        })
        .catch(err => next(err))
}


exports.createForm = (req, res, next) => {
    console.log("createForm")
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
            console.log("фото создано")
            changed_comment = form_from_client.changed_comment
            deleted_photo = form_from_client.deleted_photo

            new_photos.forEach(photo => {

                let filepath = `${appConfig.gallery_path}${Date.now()}.png`
                console.log("путь " + filepath)
                bs64.writeFile(filepath, photo['img'].split(',')[1])
                console.log("прочитано")

                filename = filepath.split('/')
                console.log("имя файла" + filename)
                img_name = filename[filename.length - 1]
                console.log("имя картинки" + img_name)
                photo = {
                    'user_id': req.session.user_id,
                    'img_name': img_name,
                    'comment': photo['comment'],
                    'status': false,
                }
                console.log("photo " + photo)
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

