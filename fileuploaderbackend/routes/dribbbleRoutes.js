const express = require("express");
const router = express.Router();
const dribbble = require('../controllers/dribbbleController')

router.get('/shots', dribbble.dribbbleshots)
router.get('/shot/:id/upload-to-cloudinary', dribbble.cloudinaryupload)

module.exports = router