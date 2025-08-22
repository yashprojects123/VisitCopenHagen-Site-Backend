let DynamicPageRoutes = require('express').Router();
let { addNewPage, checkPageExists, getPage, editPage } = require('../controller/DynamicPageController.js');

// Api for adding new page
DynamicPageRoutes.post('/add-new-page', addNewPage);

// Api for editing/updating a page
DynamicPageRoutes.put('/update-page/:slug', editPage);

// Api to fetch a page
DynamicPageRoutes.get('/page/:slug', getPage);

// Api to check a page exist or not
DynamicPageRoutes.get('/check-page-exists', checkPageExists);

module.exports = DynamicPageRoutes;