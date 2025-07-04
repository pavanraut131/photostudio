"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setadjustimage, setimagearray, setorginalimage, setresult_url } from "@/redux/Imageslice"
import { useRouter } from 'next/navigation';
import "./media.css"



const Medialist = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [isuploaded, setisuploaded] = useState(false)

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/google/files", { withCredentials: true })
      .then((res) => setFiles(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleUpload = async () => {
    if (!selectedFileId) {
      alert("Please select an image first!");
      return;
    }

    try {
      setisuploaded(true)
      const res = await axios.get(
        `http://localhost:5000/api/google/file/${selectedFileId}/upload-to-cloudinary`,
        { withCredentials: true }
      );
      const cloudinaryUrl = res.data.url;
      setisuploaded(false)

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
    }
  };

  return (
    <div className="medialist-container">
      <h3 className="medialist-title">Your Google Drive Files</h3>
      {files.length === 0 ? (
        <p>Loading.....</p>
      ) : (
        <ul className="medialist-list">
          {files
            ?.filter((file) => file.mimeType.startsWith("image/"))
            ?.map((file) => (
              <li
                key={file.id}
                className="medialist-item"
                onClick={() => setSelectedFileId(file.id)}
              >
                <img
                  src={`http://localhost:5000/api/google/file/${file.id}/thumbnail`}
                  alt={file.name}
                  className={`medialist-image ${
                    selectedFileId === file.id ? "selected" : ""
                  }`}
                  width={100}
                />
              </li>
            ))}
        </ul>
      )}
      {isuploaded ? <span className="upload-button">Uploading....</span> : <button className="upload-button" onClick={handleUpload}>
        Upload
      </button> }

     
    </div>
  );
};

export default Medialist;


