const express = require("express");
const router = express.Router();
const devianart = require('../controllers/deviantartController')

router.get('/files', devianart.deviantartlistfiles)
router.get("/file/:id/upload-to-cloudinary", devianart.uploadtocloudinary)

module.exports = router