"use client";
import "./newcss.css";
import React, { useRef, useState } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import CropTool from "@/components/tools/Croptool/CropTool";
import Generatetool from "@/components/tools/Generatetool/Generatetool";
import Adjusttool from "@/components/tools/Adjusttool/Adjusttool";
import Filtertool from "@/components/tools/Filtertool/Filtertool";
import Erasertool from "@/components/tools/Erasertool/Erasertool";
import Navbar from "@/components/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import Croptools from "@/components/tools/Croptool/Croptoools";
import ImageEditortool from "@/components/tools/Editortool/ImageEditortool";
import AnalyzeRegenratetool from "@/components/tools/Analyze&Regenrate/AnalyzeRegenratetool";
import RemoveBackground from "@/components/tools/RemoveBackground/RemoveBackground";
import { AppDispatch, RootState } from "@/redux/store";
import { setLoading, setresult_url } from "@/redux/Imageslice";
import { uploadBase64ToCloudinary, uploadBlobToCloudinary } from "@/Cloudinary/cloudinaryupload";

const Page = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {  activeTool,result_image_url, imageforadjust, history, future, loading } = useSelector(
    (state: RootState) => state.image
  );
  const [activateTool, setActivateTool] = useState<string>(activeTool);
  const adjustToolRef = useRef<any>(null);
  const filterToolRef = useRef<any>(null);
  // const autocutoutref = useRef<any>(null)

  const handleToolChange = async (newTool: string) => {
    if (activateTool === "Adjust" && adjustToolRef.current) {
      dispatch(setLoading(true));
      const dataURL = await adjustToolRef.current.exportImageBlob();
      if (dataURL) {
        try {
        
          const url = await uploadBlobToCloudinary(dataURL);

          dispatch(setresult_url(url));
          
        } catch (err) {
          console.log("err in uploading in the cloudinary in base64", err);
        } finally{
          dispatch(setLoading(false));
        }
      }
    }
    if (activateTool === "Filters" && filterToolRef.current) {
      dispatch(setLoading(true));
      const dataURL = await filterToolRef.current.exportImageBlob();
      if (dataURL) {
        try {
          const url = await uploadBlobToCloudinary(dataURL);
          dispatch(setresult_url(url));
         
        } catch (err) {
          console.log("err in uploading in the cloudinary in base64", err);
        }
        finally{
          dispatch(setLoading(false));
        }
      }
    }


    setActivateTool(newTool);
  };
  
  return (
    <div>
      <div className="page-container">
        <div className="topbar">
          <Navbar history={history} future={future} />
        </div>
        <div className="sidebaroriginal">
          <Sidebar setActiveTool={handleToolChange} activeTool={activateTool} />
        </div>
        <div className="main-content">
          {activateTool === "Generate" && (
            <Generatetool result_image_url={result_image_url} />
          )}
          {activateTool === "Crop & Extend" && (
            <Croptools result_image_url={result_image_url} />
          )}
          {activateTool === "Adjust" && (
            <Adjusttool ref={adjustToolRef} result_image_url={imageforadjust} />
          )}
          {activateTool === "Filters" && (
            <Filtertool ref={filterToolRef} result_image_url={imageforadjust} />
          )}
          {activateTool === "Eraser" && (
            <Erasertool result_image_url={result_image_url} />
          )}
          {activateTool === "AI Image Editor" && (
            <ImageEditortool result_image_url={result_image_url} />
          )}
          {activateTool === "Regenerate" && (
            <AnalyzeRegenratetool result_image_url={result_image_url} />
          )}
          {activateTool === "Cut Out" && (
            <RemoveBackground result_image_url={result_image_url} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
