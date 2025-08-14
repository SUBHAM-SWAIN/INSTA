import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(), // required for Cloudinary (uses buffer)
});

export default upload;
