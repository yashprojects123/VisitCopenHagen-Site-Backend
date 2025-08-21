let express = require("express");
let mongoose = require("mongoose");
let MenuApiRoutes = require("./routes/MenuRoutes.js");
require('dotenv').config();
const cors = require('cors');
const { userRoutes } = require("./routes/AuthRoutes.js");
let siteSettingsRoute = require("./routes/SettingsRoute.js");
let path = require("path");
let { backendHomepageMarkup } = require("./utils/BackendHomepage.js");
const seedAdmin = require("./seedAdmin.js");
const seedBasicSiteSettingsCollection = require("./seedBasicSiteSettingCollection.js");
const DynamicPageRoutes = require("./routes/DynamicPageRoutes.js");
const {upload,handleImageUploadAndDeduplication, multerErrorHandler} = require("./middleware/ImageUploadMiddleware.js");

let app = express();
const allowedOrigins = [
  "http://localhost:5173",
   "http://localhost:5174",
    "http://localhost:5175",
  "https://visit-copen-hagen-site-frontend.vercel.app"
];
app.use(cors({
  origin:  allowedOrigins,
  credentials: true             
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Api routes attachment
app.use('/api', MenuApiRoutes);
app.use('/api', DynamicPageRoutes);
app.use('/api', userRoutes);
app.use('/api', siteSettingsRoute);

app.post(
  '/api/upload-images',
  upload.array('images', 4), // Multer middleware
  handleImageUploadAndDeduplication, //deduplication logic
  multerErrorHandler, // Multer-specific error handling
  // final route handler
  (req, res) => {
    // Access the processed images information from req.processedImageUploads
    const processedImages = req.processedImageUploads;

    // Separate successful uploads from any that might have had errors
    const successfulUploads = processedImages.filter(file => !file.error);
    const failedUploads = processedImages.filter(file => file.error);

    // If no images were successfully processed, return an appropriate error.
    // This catches cases where handleImageUploadAndDeduplication might have processed
    // files, but all of them encountered an internal error during saving/hashing.
    if (successfulUploads.length === 0 && processedImages.length > 0) {
      return res.status(500).json({
        success: false,
        message: 'No images could be processed successfully.',
        errors: failedUploads.map(f => f.error)
      });
    }

    // Construct the response using the data from successfulUploads
    res.status(200).json({
      success: true,
      message: `${successfulUploads.length} images processed!`,
      imageUrls: successfulUploads.map(info => info.imageUrl),
      fileNames: successfulUploads.map(info => info.fileName),
      // Optionally, you can return more details about each upload
      details: successfulUploads.map(info => ({
        url: info.imageUrl,
        fileName: info.fileName,
        isNew: info.isNew // Indicates if it was a new upload or an existing duplicate
      }))
    });
  }
);


app.get("/", (req, res) => {
    res.send(backendHomepageMarkup);
});




// Connect DB, then listen
mongoose.connect(`${process.env.MONGODB_URL}`)
    .then(() => {
        const port = process.env.PORT || 5000;
        app.listen(port, async() => {
            console.log("Backend server connected successfully at Port " + port);
            await seedAdmin();
            await seedBasicSiteSettingsCollection();
        });
    })
    .catch((error) => {
        console.log("Error while database connection: " + error.message);
    });
