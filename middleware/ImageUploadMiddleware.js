// ImageUploadMiddleware.js
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const crypto = require("crypto");
const mongoose = require("mongoose"); 
const UploadedImageModel = require("../model/UploadedImage.model"); 

// --- MongoDB Connection Check---

let isMongoConnected = false;
async function connectToMongo() {
    if (mongoose.connection.readyState === 1) { // 1 means connected
        console.log("MongoDB is already connected.");
        isMongoConnected = true;
        return;
    }
    // Attempt to connect if not already
    try {
        
        const mongoURI = process.env.MONGODB_URL;
        await mongoose.connect(mongoURI);
        console.log("MongoDB connected successfully!");
        isMongoConnected = true;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        isMongoConnected = false;
    }
}

// Ensure connection is established when this module is first loaded
connectToMongo(); 


// --- Multer Configuration ---
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only images (jpeg, jpg, png,webp, gif, svg) are allowed.'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 }
});

const calculateHash = (buffer) => {
    return crypto.createHash('md5').update(buffer).digest('hex');
};

// --- Middleware to Handle File Uploads and Deduplication with MongoDB ---
const handleImageUploadAndDeduplication = async (req, res, next) => {
    if (!isMongoConnected) {
        console.error("MongoDB not connected. Image deduplication/persistence unavailable.");
        return res.status(503).json({ success: false, message: 'Database not available. Cannot process images.' });
    }

    const uploadDir = path.join(process.cwd(), "uploads");
    try {
        await fs.mkdir(uploadDir, { recursive: true });
    } catch (error) {
        console.error("Error creating uploads directory:", error);
        return res.status(500).json({ success: false, message: 'Server error: Could not prepare upload directory.' });
    }

    const filesToProcess = req.files || (req.file ? [req.file] : []);

    if (filesToProcess.length === 0) {
        return res.status(400).json({ success: false, message: 'No images provided or wrong field name.' });
    }

    const processedFilesInfo = [];
    const userId = req.user ? req.user._id : 'anonymous'; // Assuming req.user is populated by auth middleware

    for (const file of filesToProcess) {
        try {
            const fileBuffer = file.buffer;
            const fileHash = calculateHash(fileBuffer);
            const fileExtension = path.extname(file.originalname).toLowerCase();
            const finalFileName = `${fileHash}${fileExtension}`;
            console.log(finalFileName)
            const filePathOnDisk = path.join(uploadDir, finalFileName);
            const host = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
            const imageUrl = `${host}/uploads/${finalFileName}`;


            let isNewUpload = true; 

            // Check if image metadata already exists in MongoDB by its hash
            const existingImageMetadata = await UploadedImageModel.findById(fileHash);

            if (existingImageMetadata) {
                // Image exists in MongoDB, so it's a duplicate
                isNewUpload = false;
                console.log(`Duplicate image found in MongoDB (hash: ${fileHash}), returning existing URL: ${imageUrl}`);
                processedFilesInfo.push({
                    imageUrl: imageUrl, // URL will be based on the consistent hash-based filename
                    fileName: existingImageMetadata.fileName,
                    isNew: false
                });
            } else {
                // Image not found in MongoDB, it's truly new. Save it.
                await fs.writeFile(filePathOnDisk, fileBuffer); // Save file to disk

                // Create new metadata document in MongoDB
                await UploadedImageModel.create({
                    _id: fileHash, // Use hash as _id
                    fileName: finalFileName,
                    originalName: file.originalname,
                    mimeType: file.mimetype,
                    size: file.size,
                    uploadDate: new Date(),
                    uploadedBy: userId
                });
                console.log(`New image uploaded (hash: ${fileHash}), saved as: ${finalFileName} and metadata in MongoDB`);
                processedFilesInfo.push({
                    imageUrl: imageUrl,
                    fileName: finalFileName,
                    isNew: true
                });
            }
        } catch (error) {
            console.error(`Error processing file ${file.originalname}:`, error);
            processedFilesInfo.push({
                imageUrl: 'Error: Could not process file',
                fileName: 'error',
                isNew: false,
                error: error.message
            });
        }
    }

    req.processedImageUploads = processedFilesInfo;
    next();
};

const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    } else if (err) {
        return res.status(400).json({ success: false, message: `Image upload failed: ${err.message}` });
    }
    next();
};

// --- Export a function to delete metadata from MongoDB for the DELETE endpoint ---
const deleteImageMetadata = async (fileName) => {
    if (!isMongoConnected) {
        console.warn("MongoDB not connected, cannot delete metadata.");
        throw new Error("MongoDB not connected.");
    }
    try {
        const fileHash = path.parse(fileName).name; // Extract hash from filename (e.g., 'hash.ext' -> 'hash')
        const result = await Image.deleteOne({ _id: fileHash }); // Delete by hash (_id)
        if (result.deletedCount === 0) {
            console.warn(`No image metadata found in MongoDB for hash: ${fileHash}`);
            throw new Error('Image metadata not found in database.');
        }
        console.log(`Image metadata deleted from MongoDB for hash: ${fileHash}`);
    } catch (error) {
        console.error("Error deleting image metadata from MongoDB:", error);
        throw error; // Re-throw to be caught by the route handler
    }
};

module.exports = {
    upload,
    handleImageUploadAndDeduplication,
    multerErrorHandler,
    deleteImageMetadata
};
