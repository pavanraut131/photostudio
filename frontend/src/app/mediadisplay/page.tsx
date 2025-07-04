"use client";
import { RootState } from "@/redux/store";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./medidisplay.css";
import { useRouter } from "next/navigation";
import {
    addImageToArray,
  setActiveTool,
  setadjustimage,
  setImageArray,
  setorginalimage,
  setresult_url,
} from "@/redux/Imageslice";
import { Sparkles, Trash2 } from "lucide-react";

const MediaDisplay = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { mediaarray } = useSelector((state: RootState) => state.image);
  console.log(mediaarray, "mediaarray");

  const handlenavigation = () => {
    router.push("/");
  };

  const handleEdit = (image: string) => {
    dispatch(setresult_url(image));
    dispatch(setorginalimage(image));
    dispatch(setadjustimage(image));
    dispatch(setActiveTool("Adjust"));
    router.push("./media-gallery");
  };

  const handleAI = (image: string) => {
    dispatch(setresult_url(image));
    dispatch(setorginalimage(image));
    dispatch(setadjustimage(image));
    dispatch(setActiveTool("Generate"));
    router.push("./media-gallery");
  };

  const handleDelete = (image: string) => {
    const updated = mediaarray.filter((img) => img !== image);
    localStorage.setItem("mediaarray", JSON.stringify(updated));
    dispatch(setImageArray(updated)); // You may need a new reducer for batch set
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("mediaarray") || "[]");
    if (stored.length > 0 && mediaarray.length === 0) {
      stored.forEach((url: string) => {
        dispatch(addImageToArray(url));
      });
    }
  }, [dispatch, mediaarray.length]);

  return (
    <div className="media-gallery">
      <h1 className="gallery-title" onClick={handlenavigation}>
        Home
      </h1>
      <h3 className="gallery-title">Our Media Gallery </h3>
      <div className="gallery-grid">
        {mediaarray?.map((image, index) => (
          <div className="gallery-card" key={index}>
            <img src={image} alt="uploaded" className="gallery-image" />
            <div className="gallery-buttons">
              <button
                className="gallery-btn edit-btn"
                onClick={() => handleEdit(image)}
              >
                Edit
              </button>
              <button
                className="gallery-btn ai-btn"
                onClick={() => handleAI(image)}
              >
                <Sparkles size={16} />
              </button>
              <button
                className="gallery-btn delete-btn"
                onClick={() => handleDelete(image)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MediaDisplay;
