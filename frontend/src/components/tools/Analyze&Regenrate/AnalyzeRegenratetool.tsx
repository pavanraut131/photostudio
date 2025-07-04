"use client";
import Analyzeimagecanva from "@/components/AnalyzeImage/Analyzeimagecanva";
import Analyzeimagesidebar from "@/components/AnalyzeImage/Analyzeimagesidebar";
import Generateimagesidebar from "@/components/Generate/Generateimagesidebar";
import { analyzeImage, setLoading, setPrompt } from "@/redux/Imageslice";
import { AppDispatch, RootState } from "@/redux/store";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const AnalyzeRegenratetool = ({result_image_url}) => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    prompt,
    style,
    loading,
    analyze_result,
  } = useSelector((state: RootState) => state.image);
  const [isregenrate, setisregenrate] = useState(false);
//  const result_image_url =
//    "https://yavuzceliker.github.io/sample-images/image-1.jpg";

  const handleanalyzeimage = async () => {
    dispatch(setLoading(true))
    await dispatch(
      analyzeImage(result_image_url)
    )
  };
  useEffect(() => {
    if (analyze_result) {
      dispatch(setPrompt(analyze_result));
      setisregenrate(true);
    }
  }, [analyze_result, dispatch]);
  return (
    <>
      <div>
        {!isregenrate ? (
          <Analyzeimagesidebar handleanalyzeimage={handleanalyzeimage} />
        ) :(
      analyze_result &&
          <Generateimagesidebar
            analyzed_result={analyze_result}
            result_image_url={result_image_url}
            prompt={prompt}
            style={style}
            isregenrate={isregenrate}
          />
        )}
      </div>
      <div>
        <Analyzeimagecanva loading={loading} imageUrl={result_image_url} />
      </div>
    </>
  );
};

export default AnalyzeRegenratetool;
