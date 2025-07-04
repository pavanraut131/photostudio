"use client";
import React, { useState, useEffect, useRef, useCallback } from "react"; // Added useRef
import ReactCrop, {
  Crop,
  PixelCrop,
  centerCrop,
  makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css"; 

interface AspectRatio {
  
  value: number; 
  text: string;
}

interface CropImageProps {
  imageUrl: string;
  croppedImageUrl: string | null;
  isCroppingMode: boolean;
  aspectInit: AspectRatio;
  onCroppedAreaPixelsChange: (pixels: PixelCrop | null) => void; 
  onReset: () => void;
}

const Cropimagee: React.FC<CropImageProps> = ({
  imageUrl,
  // croppedImageUrl, 
  isCroppingMode,
  aspectInit,
  onCroppedAreaPixelsChange,
//   onReset,
}) => {
  const [crop, setCrop] = useState<Crop | undefined>(); 
  const imgRef = useRef<HTMLImageElement | null>(null); 
  const [imageLoaded, setImageLoaded] = useState(false);

  const onImageLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      setImageRef(event.currentTarget);
      setImageLoaded(true);
    },
    []
  );

  
  const setImageRef = (imageElement: HTMLImageElement | null) => {
    imgRef.current = imageElement;
  };

  
  useEffect(() => {
    if (imageLoaded && imgRef.current && aspectInit) {
      const { naturalWidth, naturalHeight } = imgRef.current;

      if (naturalWidth === 0 || naturalHeight === 0) {
        setCrop(undefined); 
        onCroppedAreaPixelsChange(null);
        return;
      }

     
      const targetAspect =
        aspectInit.value === 0 ? undefined : aspectInit.value;

        let initialCropShape: { unit: "%"; width: number; height?: number };

        if (targetAspect) {
          initialCropShape = { unit: "%", width: 90, height: 90 };
        } else {
          // Freeform aspect, just set width (no height or aspect)
        initialCropShape = { unit: "%", width: 90 };
        }
        const newCentralCrop = targetAspect
          ? centerCrop(
              makeAspectCrop(
                initialCropShape,
                targetAspect,
                naturalWidth,
                naturalHeight
              ),
              naturalWidth,
              naturalHeight
            )
          : {
              unit: "%",
              x: 5,
              y: 5,
              width: 90,
              height: 90,
            };
      setCrop(newCentralCrop); 

      
      if (newCentralCrop.width && newCentralCrop.height) {
        const pixelCrop: PixelCrop = {
          unit: "px",
          x: Math.round((newCentralCrop.x / 100) * naturalWidth),
          y: Math.round((newCentralCrop.y / 100) * naturalHeight),
          width: Math.round((newCentralCrop.width / 100) * naturalWidth),
          height: Math.round((newCentralCrop.height / 100) * naturalHeight),
        };
        if (pixelCrop.width > 0 && pixelCrop.height > 0) {
          onCroppedAreaPixelsChange(pixelCrop);
        } else {
          onCroppedAreaPixelsChange(null);
        }
      } else {
        onCroppedAreaPixelsChange(null);
      }
    }
  }, [aspectInit, imageLoaded, onCroppedAreaPixelsChange]);

  const handleCropChange = (pixelVal: PixelCrop, percentVal: Crop) => {
    setCrop(percentVal); 
  };

//   const handleCropComplete = (pixelVal: PixelCrop, percentVal: Crop) => {
//     if (pixelVal.width && pixelVal.height) {
//       onCroppedAreaPixelsChange(pixelVal);
//     } else {
//       onCroppedAreaPixelsChange(null);
//     }
//   };

const handleCropComplete = (pixelVal: PixelCrop, percentVal: Crop) => {
  if (
    !imgRef.current ||
    percentVal.width === undefined ||
    percentVal.height === undefined
  ) {
    onCroppedAreaPixelsChange(null);
    return;
  }

  const { naturalWidth, naturalHeight } = imgRef.current;

  const pixelCrop: PixelCrop = {
    unit: "px",
    x: Math.round((percentVal.x / 100) * naturalWidth),
    y: Math.round((percentVal.y / 100) * naturalHeight),
    width: Math.round((percentVal.width / 100) * naturalWidth),
    height: Math.round((percentVal.height / 100) * naturalHeight),
  };

  if (pixelCrop.width > 0 && pixelCrop.height > 0) {
    onCroppedAreaPixelsChange(pixelCrop);
  } else {
    onCroppedAreaPixelsChange(null);
  }
};
  

  
  const reactCropAspect = aspectInit.value === 0 ? undefined : aspectInit.value;

  return (
    <div
      className="crop-image-wrapper"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
      }}
    >
    
      {isCroppingMode && imageUrl && (
        <div
          className="crop-container"
          style={{ position: "relative", lineHeight: 0 }}
        >
          <ReactCrop
            crop={crop}
            onChange={handleCropChange}
            onComplete={handleCropComplete}
            aspect={reactCropAspect} 
            keepSelection={false} 
            minWidth={10}
            minHeight={10}
            ruleOfThirds={true}
          >
            <img
             
              ref={(el) => {
                imgRef.current = el;
                if (el && !imageLoaded) {
                }
              }}
              src={imageUrl}
              onLoad={(e) => {
                imgRef.current = e.currentTarget;
                setImageLoaded(true);
              }}
              alt="Crop source"
              style={{
                display: "block",
                maxWidth: "80vw",
                maxHeight: "80vh",
                objectFit: "contain",
              }}
            />
          </ReactCrop>
        </div>
      )}
      {!isCroppingMode && (
        <p className="no-image-placeholder">Processing or finished.</p>
      )}
      {!imageUrl && <p className="no-image-placeholder">No image loaded.</p>}
    </div>
  );
};

export default Cropimagee;
