const { Dropbox } = require("dropbox");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

exports.dropboxCallback = async (req, res) => {
  const { code } = req.query;
  try {
    const response = await fetch("https://api.dropbox.com/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        grant_type: "authorization_code",
        client_id: "u91e3zlxkabqhgz",
        client_secret: "h5e9vr75a6fc3mn",
        redirect_uri: "http://localhost:5000/auth/dropbox/callback",
      }),
    });
    const data = await response.json();
    req.session.dropboxToken = data.access_token;
    res.redirect("http://localhost:3000/dropbox");
  } catch (err) {
    console.error("Dropbox OAuth error:", err);
    res.status(500).send("Dropbox authentication failed");
  }
};

exports.listFiles = async (req, res) => {
  const accessToken = req.session.dropboxToken;
  if (!accessToken) return res.status(401).send("Unauthorized");

  try {
    const dbx = new Dropbox({ accessToken, fetch });
    let entries = [];
    let list = await dbx.filesListFolder({ path: "" });
    entries = entries.concat(list.result.entries);

    while (list.result.has_more) {
      list = await dbx.filesListFolderContinue({ cursor: list.result.cursor });
      entries = entries.concat(list.result.entries);
    }

    const enriched = await Promise.all(entries.map(async (file) => {
      if (file[".tag"] === "file" && file.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
        const tempLink = await dbx.filesGetTemporaryLink({ path: file.path_lower });
        return { ...file, previewLink: tempLink.result.link };
      }
      return file;
    }));

    res.json(enriched);
  } catch (err) {
    console.error("Dropbox error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.uploadToCloudinary = async (req, res) => {
  try {
    const dbx = new Dropbox({ accessToken: req.session.dropboxToken, fetch });
    const fileId = req.params.id;

    const download = await dbx.filesDownload({ path: fileId });
    const fileBlob = download.result.fileBinary;

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "dropbox-images" },
        (error, result) => error ? reject(error) : resolve(result)
      );
      streamifier.createReadStream(fileBlob).pipe(uploadStream);
    });

    res.json({ url: result.secure_url });
  } catch (err) {
    console.error("Upload to Cloudinary failed:", err);
    res.status(500).json({ error: "Upload failed" });
  }
};
