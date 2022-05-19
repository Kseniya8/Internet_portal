'use strict'
const express = require('express')
const adminController = require("../controllers/adminController.js")
const adminRouter = express.Router()
const jsonParser = express.json()

adminRouter.get('/', jsonParser, adminController.checkAuth, adminController.checkRole, adminController.index)
adminRouter.get('/get_forms', jsonParser, adminController.checkAuth, adminController.checkRole, adminController.getForms)
adminRouter.get('/get_full_report', jsonParser, adminController.createReport)
adminRouter.get('/statistic/', jsonParser, adminController.statistic)
adminRouter.get('/statistic/get_statistic', jsonParser, adminController.getStatistic)
adminRouter.get('/statistic_partners/', jsonParser, adminController.statisticPartners)
adminRouter.get('/add_partners/', jsonParser, adminController.AddPartners)
adminRouter.get('/edit_partner/', jsonParser, adminController.EditPartners)
adminRouter.get('/statistic_partners/get_statistic', jsonParser, adminController.getStatisticPartners)
adminRouter.post('/add_news', jsonParser, adminController.updateStatuses)
adminRouter.post('/edit_news', jsonParser, adminController.updateStatuses)
adminRouter.post('/update_statuses', jsonParser, adminController.updateStatuses)
adminRouter.post('/update_homepage', jsonParser, adminController.updateHomepage)
adminRouter.post('/delete_partner', jsonParser, adminController.deletePartner)

module.exports = adminRouter;

