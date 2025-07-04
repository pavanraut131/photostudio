"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../media/media.css";

const Vimefileuploader = () => {
  const [videos, setVideos] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
   const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/vimeo/files", { withCredentials: true })
      .then((res) => setVideos(res.data))
      .catch((err) => console.error(err));
  }, []);


  const handleUpload = async () => {
    if (!selectedFileId) return;
    setIsUploaded(true);
  
    try {
      const response = await axios.post(
        `http://localhost:5000/api/vimeo/upload/${selectedFileId}`,{},
        { withCredentials: true }
      );
  
      alert("Uploaded successfully to Cloudinary!");
      console.log("Cloudinary URL:", response.data.cloudinaryUrl);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed.");
    } finally {
      setIsUploaded(false);
    }
  };
console.log(videos,"videos")
  return (
    <div className="medialist-container">
      <h3 className="medialist-title">Your Vimeo Videos</h3>
      {videos.length===0 ? (  <p>Loading.....</p>):(<ul className="medialist-list">
        {videos.map((video: any) => (
          <li  key={video.id}
          className={`medialist-item ${
            selectedFileId === video.id ? "selected" : ""
          }`}
          onClick={() => setSelectedFileId(video.id)}>
      <a href={video.link} target="_blank" rel="noreferrer">
      <img src={video.thumbnail} width={100} height={100} alt="thumbnail" 
            className={`medialist-image ${
                selectedFileId === video.id ? "selected" : ""
              }`}/>
            </a>
            
   
          </li>
        ))}
      </ul>)}
      {/* {isUploaded ? (
        <span className="upload-button">Uploading....</span>
      ) : (
        <button
          className="upload-button"
          onClick={handleUpload}
          disabled={!selectedFileId}
        >
          Upload
        </button>
      )} */}
    </div>
  );
};

export default Vimefileuploader;