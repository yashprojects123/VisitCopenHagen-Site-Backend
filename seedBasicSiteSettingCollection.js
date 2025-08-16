
const bcrypt = require("bcrypt");
const basicSiteSettingsModel = require("./model/siteSettings.model");

async function seedBasicSiteSettingsCollection() {
  try {
    const settingsDocumentExist = await basicSiteSettingsModel.findOne({ siteKey: "VisitCopenhagen" });

    if (!settingsDocumentExist) {
     

      await basicSiteSettingsModel.create({
        siteKey: "VisitCopenhagen",
        siteName: "VisitCopenhagen"
      });

      console.log("✅ Document for Basic Site Settings created.");
    } else {
      console.log("ℹ️ Document for Basic Site Settings already exists. Skipping seed.");
    }
  } catch (err) {
    console.error("❌ Error seeding document for basic site settings:", err.message);
  }
}

module.exports = seedBasicSiteSettingsCollection;
