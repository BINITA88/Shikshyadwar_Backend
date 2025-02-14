

// const multer = require("multer");
// const maxSize = 2 * 1024 * 1024; // 2MB
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public/uploads");
//   },
//   filename: (req, file, cb) => {
//     let ext = path.extname(file.originalname);
//     cb(null, `IMG-${Date.now()}` + ext);
//   },
// });

// const imageFileFilter = (req, file, cb) => {
//   if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
//     return cb(new Error("File format not supported."), false);
//   }
//   cb(null, true);
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: imageFileFilter,
//   limits: { fileSize: maxSize },
// }).single("image");

// module.exports = upload;



const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileDestination = 'public/uploads';  // Make sure destination is scoped here
    // Check if directory exists and create it if not
    if (!fs.existsSync(fileDestination)) {
      fs.mkdirSync(fileDestination, { recursive: true });
    }
    cb(null, fileDestination);  // Destination where files will be stored
  },
  filename: (req, file, cb) => {
    // Get file name without extension and add timestamp
    const filename = path.basename(file.originalname, path.extname(file.originalname));
    const ext = path.extname(file.originalname);
    cb(null, filename + '_' + Date.now() + ext);  // Construct file name
  }
});

// File filter to only allow images
const imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|png|svg|jpeg|jfif|gif|JPG|JPEG|PNG|SVG|GIF|JFIF)$/)) {
    return cb(new Error("You can upload image files only"), false);
  }
  cb(null, true);  // Accept the file if it matches the image types
};

// Initialize multer with options
const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 3000000  // Limit file size to 3MB
  }
});

module.exports = upload;
