'use strict';
const express = require('express');
const newsController = require("../controllers/newsController.js");
const newsRouter = express.Router();
const jsonParser = express.json();

newsRouter.get('/', newsController.index);

newsRouter.get('/add_news', jsonParser, newsController.AddNews)
newsRouter.get('/edit_news', jsonParser, newsController.EditNews)
newsRouter.get('/edit_section', jsonParser, newsController.EditSection)
newsRouter.delete('/delete_news', jsonParser, newsController.deleteNews)

module.exports = newsRouter;