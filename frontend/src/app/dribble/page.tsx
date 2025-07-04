"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  setadjustimage,
  setorginalimage,
  setresult_url,
} from "@/redux/Imageslice";
import { useRouter } from "next/navigation";
import "../media/media.css";

const DribbbleList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [shots, setShots] = useState<any[]>([]);
  const [selectedShotId, setSelectedShotId] = useState<string | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/dribbble/shots", { withCredentials: true })
      .then((res) => setShots(res.data))
      .catch((err) => console.error("Dribbble fetch error:", err));
  }, []);

  const handleUpload = async () => {
    if (!selectedShotId) {
      alert("Please select a shot first!");
      return;
    }

    try {
      setIsUploaded(true);
      const res = await axios.get(
        `http://localhost:5000/api/dribbble/shot/${selectedShotId}/upload-to-cloudinary`,
        { withCredentials: true }
      );
console.log(res, "resposne")
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
      console.error("Upload error:", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploaded(false);
    }
  };

  return (
    <div className="medialist-container">
      <h3 className="medialist-title">Your Dribbble Shots</h3>
      {shots.length === 0 ? (
        <p>Loading.....</p>
      ) : (
        <ul className="medialist-list">
          {shots.map((shot) => (
            <li
              key={shot.id}
              className={`medialist-item ${
                selectedShotId === shot.id ? "selected" : ""
              }`}
              onClick={() => setSelectedShotId(shot.id)}
            >
              <div className="medialist-image-wrapper">
                <img
                  src={shot.images?.normal}
                  alt={shot.title}
                  className={`medialist-image ${
                    selectedShotId === shot.id ? "selected" : ""
                  }`}
                  width={100}
                  height={100}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
      {isUploaded ? (
        <span className="upload-button">Uploading....</span>
      ) : (
        <button
          className="upload-button"
          onClick={handleUpload}
          disabled={!selectedShotId}
        >
          Upload
        </button>
      )}
    </div>
  );
};

export default DribbbleList;
