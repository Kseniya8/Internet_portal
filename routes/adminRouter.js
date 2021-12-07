'use strict'
const express = require('express')
const adminController = require("../controllers/adminController.js")
const adminRouter = express.Router()
const jsonParser = express.json()

adminRouter.get('/', jsonParser, adminController.checkAuth, adminController.checkRole, adminController.index)
adminRouter.get('/get_forms', jsonParser,  adminController.checkAuth, adminController.checkRole, adminController.getForms)
adminRouter.get('/get_full_report', jsonParser, adminController.createReport)
adminRouter.get('/statistic/', jsonParser, adminController.statistic)
adminRouter.get('/statistic/get_statistic', jsonParser, adminController.getStatistic)


adminRouter.post('/update_statuses', jsonParser, adminController.updateStatuses)


module.exports = adminRouter;