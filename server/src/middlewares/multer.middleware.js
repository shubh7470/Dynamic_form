import multer from "multer";
import path from "path";
import mime from "mime-types";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/assets");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    let ext = path.extname(file.originalname);

    // Fallback if no extension found
    if (!ext) {
      ext = "." + mime.extension(file.mimetype);
    }

    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

export const upload = multer({ storage });
