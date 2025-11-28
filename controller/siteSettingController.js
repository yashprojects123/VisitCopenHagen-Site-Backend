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
  try {
    console.log("Received request to upsert basic site settings:", req.body);

    const {
      siteName,
      primaryEmailId,
      facebookUrl,
      instagramUrl,
      youtubeUrl,
      siteLogoUrl,
    } = req.body;

    const updatedSettings = await basicSiteSettingsModel.findOneAndUpdate(
      {},
      {
        $set: {
          siteName,
          primaryEmailId,
          facebookUrl,
          instagramUrl,
          youtubeUrl,
          siteLogoUrl,   
        },
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      status: "Success",
      message: "Basic site settings saved.",
      data: updatedSettings,
    });
  } catch (error) {
    console.error("Error saving settings:", error);
    return res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

module.exports = {
  upsertBasicSiteSettings,
  getBasicSiteSettings,
}