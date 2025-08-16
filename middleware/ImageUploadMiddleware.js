let multer = require("multer");
let path = require("path");
let fs = require("fs");
let upload = null;
        try {
                        // Ensure uploads folder exists
                        const uploadDir = path.join(process.cwd(), "uploads");
                        if (!fs.existsSync(uploadDir)) {
                          fs.mkdirSync(uploadDir, { recursive: true });
                        }
                        // Configure storage
                        const storage = multer.diskStorage({
                          destination: function (req, file, cb) {
                            cb(null, uploadDir);
                          },
                          filename: function (req, file, cb) {
                            cb(null, Date.now() + path.extname(file.originalname)); 
                          }
                        });
                        
                        // File filter (optional, for image only)
                        const fileFilter = (req, file, cb) => {
                          const allowedTypes = /jpeg|jpg|png|gif|svg/;
                          const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
                          const mimetype = allowedTypes.test(file.mimetype);
                        
                          if (extname && mimetype) {
                            cb(null, true);
                          } else {
                            cb(new Error('Only images are allowed'));
                          }
                        };
                        
                        // Init multer
                         upload = multer({
                          storage: storage,
                          fileFilter: fileFilter,
                          limits: { fileSize: 5 * 1024 * 1024 }
                        });
                }

         catch (error) {
                console.error("Error in uploadImage middleware:", error);
        }


module.exports = {
        upload
};
