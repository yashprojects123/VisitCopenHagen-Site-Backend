const Banner = require("../model/BannerModel");

exports.getBannerByKey = async (req, res) => {
  try {
    const bannerKey = req.params.key;

    
    const banner = await Banner.findOne({ bannerKey: bannerKey });

    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    res.status(200).json({
        banner: banner,
        status: "Success",
        message: "Banner fetched successfully"
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};