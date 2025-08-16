let siteSettingsRoute = require("express").Router();
const { upload } = require('../middleware/ImageUploadMiddleware.js');


let { upsertBasicSiteSettings, getBasicSiteSettings } = require("../controller/siteSettingController.js");

siteSettingsRoute.put('/addSettings', upload.single('siteLogoUrl'), upsertBasicSiteSettings);
siteSettingsRoute.get("/getSettings", getBasicSiteSettings);

module.exports = siteSettingsRoute;
