const path = require('path');

module.exports = {
    app_url: "http://localhost:1337",
    salt: "somesalt",
    db_url: "mongodb://localhost:27017/InternetPortal",
    admin_email: "some@email.ru",
    email_config: {
        host: 'smtp.yandex.ru',
        port: 465,
        secure: true, // true for 465, false for other ports 587
        auth: {
          user: "intPortIT@yandex.ru",
          pass: "PASSWORDNEEDED"
        }
    },
    gallery_path: `${path.resolve(__dirname)}/other/gallery/`,
    reports_path: `${path.resolve(__dirname)}/other/reports/`,
    fonts_path: `${path.resolve(__dirname)}/other/fonts/`
}
