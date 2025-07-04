const { google } = require("googleapis");
const NodeCache = require("node-cache");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const imageCache = new NodeCache({ stdTTL: 3600 });

exports.getProfile = (req, res) => {
  res.json(req.user);
};

exports.listFiles = async (req, res) => {
  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: req.user.accessToken });

    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const response = await drive.files.list({
      q: "mimeType contains 'image/'",
      pageSize: 20,
      fields: 'files(id, name, mimeType, thumbnailLink, webContentLink, webViewLink)',
    });

    res.json(response.data.files);
  } catch (err) {
    console.error("Error fetching Google Drive files:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getThumbnail = async (req, res) => {
  const fileId = req.params.id;
  const cached = imageCache.get(fileId);
  if (cached) {
    res.setHeader("Content-Type", "image/png");
    return res.send(cached);
  }

  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: req.user.accessToken });
    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const { data } = await drive.files.get({ fileId, alt: 'media' }, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(data, 'binary');
    imageCache.set(fileId, buffer);

    res.setHeader("Content-Type", "image/png");
    res.send(buffer);
  } catch (err) {
    console.error("Error proxying file image:", err.message);
    res.status(500).send("Error fetching image");
  }
};

exports.uploadToCloudinary = async (req, res) => {
  try {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: req.user.accessToken });

    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const fileId = req.params.id;

    const driveResponse = await drive.files.get({ fileId, alt: "media" }, { responseType: "stream" });

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "google-drive-images" },
        (error, result) => error ? reject(error) : resolve(result)
      );
      driveResponse.data.pipe(uploadStream);
    });

    res.json({ url: result.secure_url });
  } catch (err) {
    console.error("Error uploading to Cloudinary:", err);
    res.status(500).json({ error: "Could not upload image to Cloudinary" });
  }
};
