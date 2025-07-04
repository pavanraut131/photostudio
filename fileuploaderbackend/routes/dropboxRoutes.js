const express = require("express");
const router = express.Router();
const dropboxController = require("../controllers/dropboxController");

router.get("/files", dropboxController.listFiles);
router.get("/file/:id/upload-to-cloudinary", dropboxController.uploadToCloudinary);

module.exports = router;
