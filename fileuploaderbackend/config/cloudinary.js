const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_cloud_NAME,
  api_key: process.env.CLOUDINARY_api_KEY,
  api_secret: process.env.CLOUDINARY_api_SECRET
});

module.exports = cloudinary;
