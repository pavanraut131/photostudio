const express = require("express");
const router = express.Router();
const vimeoController = require('../controllers/vimeoController')

router.get('/files', vimeoController.vimeolistfiles)
// router.get("/upload/:id", vimeoController.uploadtocloudinary)

module.exports = router