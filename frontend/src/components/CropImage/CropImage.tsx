"use client";
import React, { useCallback } from "react";
import Cropper from "react-easy-crop";
import { Area } from "react-easy-crop";
// import "./Cropimage.css"

interface AspectRatio {
  value: number;
  text: string;
}

interface CropImageProps {
  id: string;
  imageUrl: string;
  croppedImageUrl: string | null;
  isCroppingMode: boolean;
  aspectInit: AspectRatio;
  zoom: number;
  cropPosition: { x: number; y: number };
  onZoomChange: (newZoom: number) => void;
  onCropPositionChange: (newCrop: { x: number; y: number }) => void;
  onCroppedAreaPixelsChange: (pixels: Area) => void;
  onReset: () => void;
}

const CropImage: React.FC<CropImageProps> = ({
  id,
  imageUrl,
  croppedImageUrl,
  isCroppingMode,
  aspectInit,
  zoom,
  cropPosition,
  onZoomChange,
  onCropPositionChange,
  onCroppedAreaPixelsChange,
  onReset,
}) => {
  const handleCropChange = useCallback(
    (newCrop: { x: number; y: number }) => {
      onCropPositionChange(newCrop);
    },
    [onCropPositionChange]
  );

  const handleZoomChange = useCallback(
    (newZoom: number) => {
      onZoomChange(newZoom);
    },
    [onZoomChange]
  );

  const handleCropComplete = useCallback(
    (_area: Area, pixels: Area) => {
      onCroppedAreaPixelsChange(pixels);
    },
    [onCroppedAreaPixelsChange]
  );
  console.log("Cropped Image URL:", imageUrl);

  return (
    <div className="crop-image-wrapper">
      {isCroppingMode && imageUrl ? (
        <>
          <div className="backdrop"></div>
          <div className="crop-container">
            <Cropper
              image={imageUrl}
              zoom={zoom}
              crop={cropPosition}
              aspect={aspectInit.value}
              onCropChange={handleCropChange}
              onZoomChange={handleZoomChange}
              onCropComplete={handleCropComplete}
              objectFit="contain"
            />
          </div>
        </>
      ) : croppedImageUrl ? (
        <div className="cropped-image-display">
          <img src={croppedImageUrl} alt="Cropped" className="cropped-image" />
          <div className="display-controls">
            <button onClick={onReset} className="re-crop-button">
              Revert to Original
            </button>
          </div>
        </div>
      ) : (
        <p className="no-image-placeholder">No image available for editing.</p>
      )}
    </div>
  );
};

export default CropImage;
