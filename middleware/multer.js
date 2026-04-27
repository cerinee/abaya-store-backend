const multer = require("multer");

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
       cb(null, "uploads/"); // folder where images go
    },
    filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });
exports.upload = upload;

