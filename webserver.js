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


let app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://visitcopenhagen-site-backend.onrender.com/"
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
app.use('/api', userRoutes);
app.use('/api', siteSettingsRoute);


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
