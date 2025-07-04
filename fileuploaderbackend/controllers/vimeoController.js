// const cloudinary = require("../config/cloudinary");


const VIMEO_CLIENT_ID = process.env.VIMEO_CLIENT_ID
const VIMEO_CLIENT_SECRET =process.env.VIMEO_CLIENT_SECRET
const VIMEO_REDIRECT_URI = process.env.VIMEO_REDIRECT_URI


exports.vimeoCallback =  async (req, res) => {
  const code = req.query.code;
  try {
    const response = await fetch("https://api.vimeo.com/oauth/access_token", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${VIMEO_CLIENT_ID}:${VIMEO_CLIENT_SECRET}`).toString(
            "base64"
          ),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: VIMEO_REDIRECT_URI,
      }),
    });

    const data = await response.json();
    req.session.vimeoToken = data.access_token;

    res.redirect("http://localhost:3000/vimeo");
  } catch (err) {
    console.error("Vimeo OAuth error:", err);
    res.status(500).send("Vimeo authentication failed");
  }
};


exports.vimeolistfiles = async(req, res) => {
    const accessToken = req.session.vimeoToken;
    if (!accessToken) return res.status(401).send("Unauthorized");
  
    try {
      const response = await fetch("https://api.vimeo.com/me/videos", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const data = await response.json();
      const files = data?.data?.map((video) => {
        const videoId = video.uri?.split("/").pop()
        return {
          id:videoId,
        name: video.name,
        link: video.link,
        thumbnail: video.pictures?.sizes?.[2]?.link,}
      });
  
      res.json(files);
    } catch (err) {
      console.error("Error fetching Vimeo videos:", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };


//   exports.uploadtocloudinary = async (req, res) => {
//     const videoId = req.params.id;
    
//     const accessToken = req.session.vimeoToken;
//     if (!accessToken) return res.status(401).send("Unauthorized");
  
//     try {
//       // Step 1: Get original download URL from Vimeo
//       const response = await axios.get(`https://api.vimeo.com/videos/${videoId}`, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       });
//   console.log(response.data.download, "resosne for downaload")
//       const videoFiles = response.data.download;
//       const originalVideo = videoFiles?.find(f => f.quality === "source") || videoFiles?.[0];
  
//       if (!originalVideo?.link) {
//         return res.status(400).json({ error: "Original video file not found" });
//       }
  
//       const vimeoVideoUrl = originalVideo.link;
//       const videoName = response.data.name || `vimeo_video_${videoId}`;
  
//       // Step 2: Upload to Cloudinary (via remote URL)
//       const uploadResult = await cloudinary.uploader.upload(vimeoVideoUrl, {
//         resource_type: "video",
//         public_id: `vimeo_${videoId}_${Date.now()}`,
//         folder: "vimeo_uploads",
//       })

//     console.log("Upload success:", uploadResult.secure_url);
//     res.json({ cloudinaryUrl: uploadResult.secure_url });

//   } catch (err) {
//     console.error("Error uploading Vimeo video to Cloudinary:", err.response?.data || err.message);
//     res.status(500).json({ error: "Upload to Cloudinary failed" });
//   }
// };