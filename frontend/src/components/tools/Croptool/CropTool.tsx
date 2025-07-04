import React, { useState, useEffect, use } from "react";
import CropImage from "../../CropImage/CropImage";
import Cropsidebar, {
  aspectRatios,
  AspectRatio,
} from "../../CropImage/Cropsidebar";
import { RootState, AppDispatch } from "@/redux/store";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import "../Croptool/Croptool.css";
import getCroppedImg from "../../../utils/crop";
import { upscaleImage } from "@/redux/action";
import Upscale from "@/components/upscale/Upscale";
import { UseDispatch } from "react-redux";
import { setresult_url } from "@/redux/Imageslice";
interface CropPosition {
  x: number;
  y: number;
}

const CropTool: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
const result_image_url =
  "https://yavuzceliker.github.io/sample-images/image-1.jpg";
  const { 
    // result_image_url,
     loading } = useSelector(
    (state: RootState) => state.image
  );
 

  const [extendtool, setextendtool] = useState<boolean>(false);
  const [upscale, setupscale] = useState<boolean>(false);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>(
    result_image_url 
  );
  const [aspect, setAspect] = useState<AspectRatio>(aspectRatios[0]);
  const [finalCroppedImageUrl, setFinalCroppedImageUrl] = useState<
    string | null
  >(null);
  const [isCroppingMode, setIsCroppingMode] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(1);
  const [cropPosition, setCropPosition] = useState<CropPosition>({
    x: 0,
    y: 0,
  });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  // dispatch(setresult_url(finalCroppedImageUrl));
  const handleUpscale = async (image_url: string) => {
    console.log("Upscaling image with URL:", image_url);
    await dispatch(upscaleImage(image_url));
    
    setupscale(true);
  };

  
  useEffect(() => {
    if (result_image_url && !finalCroppedImageUrl) {
      setOriginalImageUrl(result_image_url);
      setIsCroppingMode(true);
      setAspect(aspectRatios[0]);
      setZoom(1);
      setCropPosition({ x: 0, y: 0 });
      setCroppedAreaPixels(null);
    }
  }, [result_image_url]);
  

  const handleAspectChange = (newAspect: AspectRatio) => {
    setAspect(newAspect);
    setIsCroppingMode(true);
    setZoom(1);
    setCropPosition({ x: 0, y: 0 });
    setCroppedAreaPixels(null);
  };

  const handleCropPositionChange = (newCrop: CropPosition) => {
    setCropPosition(newCrop);
  };

  const handleCroppedAreaPixelsChange = (pixels: any) => {
    setCroppedAreaPixels(pixels);
  };

  const handleConfirmCrop = async () => {
    if (originalImageUrl && croppedAreaPixels) {
      try {
        const croppedUrl = await getCroppedImg(
          originalImageUrl,
          croppedAreaPixels
        );
        setFinalCroppedImageUrl(croppedUrl);
        setIsCroppingMode(false);
        dispatch(setresult_url(croppedUrl));

        console.log("Cropped image URL:", croppedUrl);
      } catch (e) {
        console.error("Error generating cropped image:", e);
      }
    }
  };

  const handleResetCrop = () => {
    setFinalCroppedImageUrl(null);
    setIsCroppingMode(true);
    setAspect(aspectRatios[0]);
    setZoom(1);
    setCropPosition({ x: 0, y: 0 });
    setCroppedAreaPixels(null);
  };

  // const handleCancelCrop = () => {
  //   setIsCroppingMode(true);
  //   setZoom(1);
  //   setCropPosition({ x: 0, y: 0 });
  //   setCroppedAreaPixels(null);
  // };

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
          zoom={zoom}
          onZoomChange={setZoom}
          onCrop={handleConfirmCrop}
          onReset={handleResetCrop}
          // onCancel={handleCancelCrop}
          isCroppingMode={isCroppingMode}
        />
      </div>

      <div className="main-content-area">
        {upscale ? (
          <Upscale imageUrl={result_image_url} />
        ) : finalCroppedImageUrl ? (
          <img
          height={600}
          width={600}
            src={finalCroppedImageUrl}
            alt="Cropped Result"
            className="cropped-output"
          />
        ) : originalImageUrl && isCroppingMode ? (
          <CropImage
            id={uuidv4()}
            imageUrl={originalImageUrl}
            croppedImageUrl={finalCroppedImageUrl}
            isCroppingMode={isCroppingMode}
            aspectInit={aspect}
            zoom={zoom}
            cropPosition={cropPosition}
            onZoomChange={setZoom}
            onCropPositionChange={handleCropPositionChange}
            onCroppedAreaPixelsChange={handleCroppedAreaPixelsChange}
            onReset={handleResetCrop}
          />
        ) : (
          <p className="no-image-placeholder">
            No image loaded. Please provide an image URL.
          </p>
        )}
      </div>
    </>
  );
};

export default CropTool;
