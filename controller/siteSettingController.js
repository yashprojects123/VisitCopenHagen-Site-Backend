let basicSiteSettingsModel = require("../model/siteSettings.model")


let getBasicSiteSettings = async (req, res) => {
  let siteKey = req.query.siteKey;
  let settings = await basicSiteSettingsModel.findOne({ siteKey });
  console.log(settings)
  if (settings) {
    res.status(200).json({
      data: settings,
      status: "Success"
    });
  } else {
    res.status(404).json({
      data: null,
      status: "Not Found"
    });
  }
}


let upsertBasicSiteSettings = async (req, res) => {
  console.log("Received request to upsert basic site settings:", req.body);
  console.log("Received file:", req.file);
  try {
    const updatedSettings = await basicSiteSettingsModel.findOneAndUpdate(
      {},
      {
        $set: {
          siteName: req.body.siteName,
          primaryEmailId: req.body.primaryEmailId,
          facebookUrl: req.body.facebookUrl,
          instagramUrl: req.body.instagramUrl,
          youtubeUrl: req.body.youtubeUrl,
          siteLogoUrl: req.file
            ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
            : null
        }
      },
      { new: true, upsert: true } // upsert: true will creates if not exists
    );

    res.status(200).json({
      status: "Success",
      data: updatedSettings
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message
    });
  }
};


module.exports = {
  upsertBasicSiteSettings,
  getBasicSiteSettings,
}