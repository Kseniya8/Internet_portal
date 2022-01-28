'use strict';
const express = require('express');
const partnerController = require("../controllers/partnerController.js");
const partnerRouter = express.Router();
const jsonParser = express.json();

partnerRouter.get('/', jsonParser, partnerController.index);
partnerRouter.get('/search', jsonParser, partnerController.searchForms);

module.exports = partnerRouter;