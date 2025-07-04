"use client";
import React from "react";
import Generateimagesidebar from "../../Generate/Generateimagesidebar";
import Generateimage from "../../Generate/Generateimage";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getImageDimensions } from "@/utils/helper";
import { useEffect } from "react";
import { setdimensions } from "../../../redux/Imageslice";
import { useDispatch } from "react-redux";

const Generatetool = ({result_image_url}) => {
  const dispatch = useDispatch();
  const { prompt, style } = useSelector(
    (state: RootState) => state.image
  );

  useEffect(() => {
    if (!result_image_url) return;

    getImageDimensions(result_image_url)
      .then(({ width, height }) => {
        dispatch(setdimensions({ width, height }));
      })
      .catch((err) => {
        console.error("Failed to get image dimensions:", err);
      });
  }, [result_image_url]);
  return (
    <>
      <div>
        <Generateimagesidebar
          prompt={prompt}
          style={style} 
          result_image_url={result_image_url}
        />
      </div>
      <div>
        <Generateimage imageUrl={result_image_url} />
      </div>
    </>
  );
};

export default Generatetool;
