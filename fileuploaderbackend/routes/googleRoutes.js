const express = require("express");
const router = express.Router();
const googleController = require("../controllers/googleController");

const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).send("Unauthorized");
};

router.get("/me", isAuth, googleController.getProfile);
router.get("/files", isAuth, googleController.listFiles);
router.get("/file/:id/thumbnail", isAuth, googleController.getThumbnail);
router.get("/file/:id/upload-to-cloudinary", isAuth, googleController.uploadToCloudinary);

module.exports = router;
