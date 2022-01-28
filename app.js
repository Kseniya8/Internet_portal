'use strict'
// node modules
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const mustacheExpress = require("mustache-express");
const MongoDBStore = require('connect-mongodb-session')(session);

//config
const appConfig = require('./appConfig');

// routers
const homeRouter = require('./routes/homeRouter')
const accountRouter = require('./routes/accountRouter')
const searchFormsRouter = require('./routes/searchFormsRouter')
const adminRouter = require('./routes/adminRouter')
const partnerRouter = require('./routes/partnerRouter')
const galleryRouter = require('./routes/galleryRouter')
const newsRouter = require('./routes/newsRouter')
const editMainPageRouter = require('./routes/editMainPageRouter')

// scripts
const startTimerNotify = require('./other/notify')();

const app = express();

// view engine setup
app.engine('html', mustacheExpress());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.use(morgan('common', {
    stream: fs.createWriteStream('./access.log', { flags: 'a' })
}));

app.use(morgan('common', {
    skip: (req, res) => { return res.statusCode < 400 },
    stream: fs.createWriteStream('./error.log', { flags: 'a' })
}));
//:remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"

app.use(express.json({ extended: false, limit: '5mb' }));
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false, limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// auth
var store = new MongoDBStore({
    uri: appConfig.db_url,
    collection: 'sessions'
});
app.use(cookieParser());
app.use(session({
    store: store,
    resave: false,
    saveUninitialized: true,
    secret: 'supersecret',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    },
}));

// routers
app.use('/', homeRouter)
app.use('/account', accountRouter)
app.use('/forms', searchFormsRouter)
app.use('/admin', adminRouter)
app.use('/partners', partnerRouter)
app.use('/gallery', galleryRouter)
app.use('/news', newsRouter)
app.use('/edit_main_page', editMainPageRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        if (err.name == 'UserError' && err.type_response == 'json') {
            res.status(200);
            res.json({ success: false, msg: err.message })
        }
        else {
            console.error(err.message)
            console.error(err.stack || '')
            res.status(err.status || 500)
            res.render('error.html', {
                [req.session.lang ?? 'ru']: true,
                message: err.message,
                status: err.status || 500,
                stack: err.stack,
                isAuth: Boolean(req.session.user_id),
                isAdmin: Boolean(req.session.role == "admin")
            });
        }
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    if (err.name == 'UserError' && err.type_response == 'json') {
        res.status(200);
        res.json({ success: false, msg: err.message })
    }
    else {
        console.error(err.message)
        res.status(err.status || 500)
        res.render('error.html', {
            [req.session.lang ?? 'ru']: true,
            message: err.message,
            status: err.status || 500,
            isAuth: Boolean(req.session.user_id),
            isAdmin: Boolean(req.session.role == "admin")
        });
    }
});


app.set('port', process.env.PORT || 1337);

mongoose.connect(appConfig.db_url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (err) return console.log(err);
    app.listen(app.get('port'), function () {
        console.log("Serever has been started 1337...");
    });
});
