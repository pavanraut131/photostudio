const cloudinary = require("../config/cloudinary");
const axios = require('axios')
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const streamifier = require("streamifier");
const https = require("https");

const DRIBBBLE_CLIENT_ID = process.env.DRIBBBLE_CLIENT_ID
const DRIBBBLE_CLIENT_SECRET = process.env.DRIBBBLE_CLIENT_SECRET
const DRIBBBLE_REDIRECT_URI = process.env.DRIBBBLE_REDIRECT_URI

const agent = new https.Agent({ family: 4 });
exports.dribbbleCallback = async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("No code returned from Dribbble");

  const params = new URLSearchParams({
    client_id: DRIBBBLE_CLIENT_ID,
    client_secret: DRIBBBLE_CLIENT_SECRET,
    code: code,
    redirect_uri: DRIBBBLE_REDIRECT_URI,
    grant_type: "authorization_code",
  });

  try {
    console.log("response started ")
    const response = await axios.post("https://dribbble.com/oauth/token",params.toString(),{
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      httpsAgent: agent,
    });
console.log("got the response")
    req.session.dribbbleToken = response.data.access_token;
    console.log("Dribbble token:", response.data.access_token);
    res.redirect("http://localhost:3000/dribble");
  } catch (err) {
    console.error("Dribbble token exchange failed:", err.response?.data || err.message || err);
    res.status(500).send("Dribbble auth failed");
  }
};





exports.dribbbleshots =  async (req, res) => {
  const token = req.session.dribbbleToken;
  if (!token) return res.status(401).send("Missing Dribbble access token");

  try {
    const response = await axios.get("https://api.dribbble.com/v2/user/shots", {
      headers: { Authorization: `Bearer ${token}` }
    });
    res.json(response.data);
  } catch (err) {
    console.error("Error fetching Dribbble shots:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch shots" });
  }
};




exports.cloudinaryupload =   async(req, res) => {
  const accessToken = req.session.dribbbleToken;
  const shotId = req.params.id;

  if (!accessToken) return res.status(401).send("Unauthorized");

  try {
    // Step 1: Get Dribbble shot details
    const shotResponse = await axios.get(`https://api.dribbble.com/v2/shots/${shotId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const imageUrl =
      shotResponse.data.images?.hidpi ||
      shotResponse.data.images?.normal ||
      shotResponse.data.images?.teaser;

    if (!imageUrl) {
      return res.status(404).json({ error: "No image found in the Dribbble shot." });
    }

    // Step 2: Upload the image to Cloudinary using the remote image URL
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: "dribbble-images",
    });

    return res.json({ url: result.secure_url });
  } catch (error) {
    console.error("Error uploading Dribbble image:", error.response?.data || error.message);
    return res.status(500).json({ error: "Upload failed" });
  }
}

