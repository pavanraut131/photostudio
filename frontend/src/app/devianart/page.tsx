"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../media/media.css";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  setadjustimage,
  setorginalimage,
  setresult_url,
} from "@/redux/Imageslice";
import { useRouter } from "next/navigation";

const Devianart = () => {
  const [files, setFiles] = useState([]);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
   const [isUploaded, setIsUploaded] = useState(false);
   const dispatch = useDispatch<AppDispatch>();
   const handleUpload = async () => {
    if (!selectedFileId) {
      alert("Please select an image first!");
      return;
    }

    try {
      setIsUploaded(true);
      const res = await axios.get(
        `http://localhost:5000/api/deviantart/file/${selectedFileId}/upload-to-cloudinary`,
        { withCredentials: true }
      );

      const cloudinaryUrl = res.data.url;
      dispatch(setresult_url(cloudinaryUrl));
      dispatch(setadjustimage(cloudinaryUrl));
      dispatch(setorginalimage(cloudinaryUrl));


      const existing = JSON.parse(localStorage.getItem("mediaarray") || "[]");
      if (!existing.includes(cloudinaryUrl)) {
        localStorage.setItem("mediaarray", JSON.stringify([...existing, cloudinaryUrl]));
      }

      router.push("/mediadisplay");
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploaded(false);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/deviantart/files", {
        withCredentials: true,
      })
      .then((res) => setFiles(res.data))
      .catch((err) => {
        console.error("Error fetching DeviantArt files:", err);
        setError("Failed to load DeviantArt media.");
      });
  }, []);
  console.log(files, "done with the files")

  return (
    <div className="medialist-container">
      <h3 className="medialist-title">Your DeviantArt Media</h3>
      {files.length === 0 ? (
        <p>Loading.....</p>
      ) :(<ul className="medialist-list">
        {files.map((file: any) => (
          <li key={file.id}
          className={`medialist-item ${
              selectedFileId === file.id ? "selected" : ""
            }`}
            onClick={() => setSelectedFileId(file.id)}>
                <div className="medialist-image-wrapper">
              <img
              className={`medialist-image ${
                selectedFileId === file.id ? "selected" : ""
              }`}
                src={file.thumbnail}
                alt={file.name}
                width={100}
                height={100}
              />
            </div>
          </li>
        ))}
      </ul>)
}  
{isUploaded ? (
        <span className="upload-button">Uploading....</span>
      ) : (
        <button
          className="upload-button"
          onClick={handleUpload}
          disabled={!selectedFileId}
        >
          Upload
        </button>
      )}
    </div>
  );
};

export default Devianart;
