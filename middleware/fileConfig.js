const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fileDestination = 'public/profile';  // Make sure destination is scoped here
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
