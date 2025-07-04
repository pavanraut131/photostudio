const passport = require("passport");
const VIMEO_REDIRECT_URI = process.env.VIMEO_REDIRECT_URI
const DEVIANTART_REDIRECT_URI =process.env.DEVIANTART_REDIRECT_URI
const DEVIANTART_SCOPES = process.env.DEVIANTART_SCOPES
const DEVIANTART_CLIENT_ID = process.env.DEVIANTART_CLIENT_ID
const DRIBBBLE_CLIENT_ID = process.env.DRIBBBLE_CLIENT_ID
const DRIBBBLE_REDIRECT_URI = process.env.DRIBBBLE_REDIRECT_URI


exports.googleAuth = passport.authenticate("google", {
  scope: ["profile", "email", "https://www.googleapis.com/auth/drive.readonly"],
  accessType: "offline",
  prompt: "consent",
});

exports.googleCallback = passport.authenticate("google", { failureRedirect: "/" });

exports.dropboxAuth = (req, res) => {
  const url = `https://www.dropbox.com/oauth2/authorize?client_id=u91e3zlxkabqhgz&response_type=code&redirect_uri=http://localhost:5000/auth/dropbox/callback`;
  res.redirect(url);
};

exports.vimeoAuth = (req, res) => {
    const url = `https://api.vimeo.com/oauth/authorize?response_type=code&client_id=b0fcce063045f9ae1908978e52f10d17150e7263&redirect_uri=${VIMEO_REDIRECT_URI}&scope=public private video_files`;
    res.redirect(url);
  };

exports.deviantart = (req, res) => {
    const url = `https://www.deviantart.com/oauth2/authorize?response_type=code&client_id=${DEVIANTART_CLIENT_ID}&redirect_uri=${DEVIANTART_REDIRECT_URI}&scope=${encodeURIComponent(
      DEVIANTART_SCOPES
    )}`;
    res.redirect(url);
  }

exports.dribbble = (req, res) => {
    const url = `https://dribbble.com/oauth/authorize?client_id=${DRIBBBLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(DRIBBBLE_REDIRECT_URI)}&scope=public`;
  res.redirect(url);
  }
