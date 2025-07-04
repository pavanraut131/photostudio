import React, { useState, useEffect, useCallback } from "react";
import CropImage from "../../CropImage/CropImage";
import Cropsidebar, {
  aspectRatios,
  AspectRatio,
} from "../../CropImage/Cropsidebar";
import { PixelCrop } from "react-image-crop";
import { RootState, AppDispatch } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import "../Croptool/Croptool.css";
import getCroppedImg from "../../../utils/crop";
import { upscaleImage } from "@/redux/action";
import Upscale from "@/components/upscale/Upscale";
import { UseDispatch } from "react-redux";
import { setresult_url } from "@/redux/Imageslice";
import Cropimagee from "@/components/CropImage/Cropimagee";
import {uploadBlobToCloudinary} from "@/Cloudinary/cloudinaryupload";
interface CropPosition {
  x: number;
  y: number;
}

const Croptools: React.FC = ({result_image_url}) => {
  const dispatch = useDispatch<AppDispatch>();
  const {
   
    loading,
  } = useSelector((state: RootState) => state.image);
  // const dummyurl = "https://yavuzceliker.github.io/sample-images/image-1.jpg";

  const [originalImageUrl, setOriginalImageUrl] =
    useState<string>(result_image_url);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(
    null
  ); 
  const [extendtool, setextendtool] = useState<boolean>(false);
    const [upscale, setupscale] = useState<boolean>(false);
  const [finalCroppedImageUrl, setFinalCroppedImageUrl] = useState<
    string | null
  >(null);
  const [isCroppingMode, setIsCroppingMode] = useState<boolean>(true);
  const [aspect, setAspect] = useState<AspectRatio>(aspectRatios[0]);

  const [cropPosition, setCropPosition] = useState<CropPosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (result_image_url && !finalCroppedImageUrl) {
      setOriginalImageUrl(result_image_url);
      setIsCroppingMode(true);
      setAspect(aspectRatios[0]);
      setCroppedAreaPixels(null);
    }
  }, [result_image_url]);

  const handleAspectChange = (newAspect: AspectRatio) => {
    setAspect(newAspect);
    setIsCroppingMode(true);
    setCropPosition({ x: 0, y: 0 });
    setCroppedAreaPixels(null);
  };
  const handleUpscale = async (image_url: string) => {
      console.log("Upscaling image with URL:", image_url);
      await dispatch(upscaleImage(image_url));
      
      setupscale(true);
    };

  // const handleCropPositionChange = (newCrop: CropPosition) => {
  //   setCropPosition(newCrop);
  // };

  const handleConfirmCrop = async () => {
    if (
      originalImageUrl &&
      croppedAreaPixels &&
      croppedAreaPixels.width > 0 &&
      croppedAreaPixels.height > 0
    ) {
      try {
        const croppedUrl = await getCroppedImg(
          originalImageUrl,
          croppedAreaPixels
        );

        setFinalCroppedImageUrl(croppedUrl);
        console.log("the cropped image is:", croppedUrl)
        setIsCroppingMode(false);
        const blob = await fetch(croppedUrl).then((res) => res.blob());
        const imageurl = await uploadBlobToCloudinary(blob);
        dispatch(setresult_url(imageurl));
      } catch (e) {
        console.error("Error generating cropped image:", e);
      }
    } else {
      console.warn(
        "Cannot confirm crop: No image, no crop area, or crop area has zero dimension."
      );
    }
  };

  const handleCroppedAreaPixelsChange = useCallback(
    (pixels: PixelCrop | null) => {
      setCroppedAreaPixels(pixels);
    },
    []
  );

  return (
    <>
      <div className="main-sidebar">
        <Cropsidebar
          loading={loading}
          setupscale={setupscale}
          handleupscale={handleUpscale}
          result_image_url={result_image_url}
          extendtool={extendtool}
          setextendtool={setextendtool}
          currentAspect={aspect}
          onAspectChange={handleAspectChange}
         
          onCrop={handleConfirmCrop}
          // onReset={handleResetCrop}
          // onCancel={handleCancelCrop}
          isCroppingMode={isCroppingMode}
        />
      </div>
      <div className="main-content-area">
        {finalCroppedImageUrl && !isCroppingMode ? ( // Check isCroppingMode to ensure final display
          <img
            onClick={()=>setIsCroppingMode(true)}
            style={{
              maxWidth: "100%",
              maxHeight: "600px",
              objectFit: "contain",
            }}
            src={finalCroppedImageUrl}
            alt="Cropped Result"
            className="cropped-output"
          />
        ) : originalImageUrl && isCroppingMode ? (
          <Cropimagee
            imageUrl={originalImageUrl}
            // croppedImageUrl should be null if we are in cropping mode
            croppedImageUrl={null}
            isCroppingMode={isCroppingMode}
            aspectInit={aspect}
            onCroppedAreaPixelsChange={handleCroppedAreaPixelsChange}
            // onReset={handleResetCrop} // handleResetCrop from your existing code
          />
        ) : (
          <p className="no-image-placeholder">
            {!originalImageUrl
              ? "No image loaded. Please provide an image URL."
              : "Loading image..."}
          </p>
        )}
      </div>
    </>
  );
};

export default Croptools;
