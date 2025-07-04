const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/google", authController.googleAuth);
router.get("/google/callback", authController.googleCallback, (req, res) => {
  res.redirect("http://localhost:3000/media");
});

router.get("/dropbox", authController.dropboxAuth);
router.get("/dropbox/callback", require("../controllers/dropboxController").dropboxCallback);

router.get('/vimeo', authController.vimeoAuth )
router.get('/vimeo/callback', require('../controllers/vimeoController').vimeoCallback)

router.get('/deviantart', authController.deviantart)
router.get("/deviantart/callback", require('../controllers/deviantartController').deviantartCallback )

router.get("/dribbble", authController.dribbble)
router.get('/dribbble/callback', require('../controllers/dribbbleController').dribbbleCallback)

module.exports = router;
