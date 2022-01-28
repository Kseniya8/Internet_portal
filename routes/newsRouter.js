'use strict';
const express = require('express');
const newsController = require("../controllers/newsController.js");
const newsRouter = express.Router();
const jsonParser = express.json();

newsRouter.get('/', newsController.index);
newsRouter.get('/admin', jsonParser, newsController.admin)

module.exports = newsRouter;