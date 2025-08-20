let DynamicPageRoutes = require('express').Router();
let { addNewPage, checkPageExists, getPage } = require('../controller/DynamicPageController.js');

DynamicPageRoutes.post('/add-new-page', addNewPage);

DynamicPageRoutes.get('/page/:slug', getPage);

DynamicPageRoutes.get('/check-page-exists', checkPageExists);

module.exports = DynamicPageRoutes;