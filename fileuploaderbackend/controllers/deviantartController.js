const cloudinary = require("../config/cloudinary");
const DEVIANTART_CLIENT_ID = process.env.DEVIANTART_CLIENT_ID
const DEVIANTART_CLIENT_SECRET = process.env.DEVIANTART_CLIENT_SECRET
const DEVIANTART_REDIRECT_URI =process.env.DEVIANTART_REDIRECT_URI
const axios = require('axios')
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const streamifier = require("streamifier");

exports.deviantartCallback = async (req, res) => {
  const code = req.query.code;
  if (!code) {
    console.error("DeviantArt OAuth error: No code received");
    return res
      .status(400)
      .send("DeviantArt authentication failed: No code received");
  }
  try { 
    const response = await fetch("https://www.deviantart.com/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: DEVIANTART_REDIRECT_URI,
        client_id: DEVIANTART_CLIENT_ID,
        client_secret: DEVIANTART_CLIENT_SECRET,
      }),
    });

    const data = await response.json()

    if (data.error) {
      console.error(
        "DeviantArt OAuth token error:",
        data.error,
        data.error_description
      );
      return res
        .status(500)
        .send(
          `DeviantArt authentication failed: ${
            data.error_description || data.error
          }`
        );
    }

    req.session.deviantartToken = data.access_token;

    req.session.deviantartRefreshToken = data.refresh_token;

    console.log("DeviantArt access token obtained:", data.access_token);
    res.redirect("http://localhost:3000/devianart"); // Redirect to your frontend media page
  } catch (err) {
    console.error("DeviantArt OAuth error:", err);
    res.status(500).send("DeviantArt authentication failed");
  }
}

exports.deviantartlistfiles  =  async (req, res) => {
  const accessToken = req.session.deviantartToken;
  if (!accessToken) return res.status(401).send("Unauthorized");
  
  try {
    console.log("started making requests ");
    const response = await axios.get(
      "https://www.deviantart.com/api/v1/oauth2/gallery/all",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": "axios/1.9.0",
        },
        params: {
          limit: 20, 
          offset: 0,
        },
      }
    );

    const data = response.data;
    console.log(data, "data+============");

    if (data.error) {
      console.error("API Error:", data.error_description);
      return res.status(500).json({ error: data.error_description });
    }

    const files = data.results.map((deviation) => ({
      id:deviation.deviationid,
      name: deviation.title,
      link: deviation.url,
      thumbnail: deviation.preview?.src,
    }));

    res.json(files);
  } catch (err) {
    console.error("DeviantArt fetch error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch DeviantArt files." });
  }
}

exports.uploadtocloudinary = async (req, res) => {
  const accessToken = req.session.deviantartToken;
  const fileId = req.params.id;
  if (!accessToken) return res.status(401).send("Unauthorized");

  try {

    const response = await axios.get(
      `https://www.deviantart.com/api/v1/oauth2/deviation/${fileId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const deviation = response.data;

    const imageUrl = deviation.content?.src;
  
    if (!imageUrl) {
      return res.status(404).json({ error: "Image URL not found." });
    }

    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(imageResponse.data, "binary");

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "deviantart-images",
          public_id: `deviantart_${fileId}`,
        },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    });

    res.json({ url: result.secure_url });
  } catch (err) {
    console.error("Upload error:", err.response?.data || err.message);
    res.status(500).json({ error: "Upload to Cloudinary failed." });
  }
};
