let DynamicPageRoutes = require('express').Router();
let { addNewPage } = require('../controller/DynamicPageController.js');

DynamicPageRoutes.post('/add-new-page', addNewPage);

module.exports = DynamicPageRoutes;