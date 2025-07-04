"use client";
import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import Konva from "konva";


// Canvas size constants
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

interface Adjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  red: number;
  green: number;
  blue: number;
  sharpenAmount: number;
  highlights: number;
  shadows: number;
  exposure: number;
}

interface AdjustImageCanvaProps {
  adjustments: Adjustments;
  
}

const Adjustimagecanva = forwardRef<any, AdjustImageCanvaProps>(
  ({  adjustments }, ref) => {
    
    const [image, setImage] = useState<HTMLImageElement | null>(null);

    const stageRef = useRef<any>(null);
    const imageRef = useRef<Konva.Image>(null);

    useImperativeHandle(ref, () => ({
      loadImage: (url: string) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.src = url;
        img.onload = () => {
          setImage(img);
        };
      },
      //return a base64 image
      getImageDataURL: () => {
        if (stageRef.current) {
          return stageRef.current.toDataURL({ pixelRatio: 1 });
        }
        return null;
      },
      //return  a  blob of the image 
      getImageBlob: (mimeType = "image/png", quality = 1.0) => {
        return new Promise<Blob | null>((resolve) => {
          if (stageRef.current) {
            const canvas = stageRef.current.toCanvas();
            canvas.toBlob(
              (blob) => {
                resolve(blob);
              },
              mimeType,
              quality
            );
          } else {
            resolve(null);
          }
        });
      },
    }));

    useEffect(() => {
      if (image && imageRef.current) {
        imageRef.current.clearCache();
        imageRef.current.cache();
        imageRef.current.getLayer()?.batchDraw();
        stageRef.current?.draw();
      }
    }, [image, adjustments]);

   
    const scale =
      image && image.width && image.height
        ? Math.min(CANVAS_WIDTH / image.width, CANVAS_HEIGHT / image.height)
        : 1;

    const scaledWidth = image ? image.width * scale : 0;
    const scaledHeight = image ? image.height * scale : 0;
    const imageX = (CANVAS_WIDTH - scaledWidth) / 2;
    const imageY = (CANVAS_HEIGHT - scaledHeight) / 2;

    const exposureAdjustedBrightness =
      adjustments.brightness + adjustments.exposure * 0.5;
    const exposureAdjustedContrast =
      (adjustments.contrast + adjustments.exposure * 0.3) * 3;

    return (
      <div className="canvas-wrapper">
        <Stage
          ref={stageRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="canvas-stage"
        >
          <Layer>
            {image && (
              <KonvaImage
                ref={imageRef}
                x={imageX}
                y={imageY}
                image={image}
                width={scaledWidth}
                height={scaledHeight}
                filters={[
                  Konva.Filters.Brighten,
                  Konva.Filters.Contrast,
                  Konva.Filters.HSL,
                ]}
                brightness={exposureAdjustedBrightness * 0.3}
                contrast={exposureAdjustedContrast * 3}
                saturation={adjustments.saturation - 1}
                red={1 + adjustments.red}
                green={1 + adjustments.green}
                blue={1 + adjustments.blue}
                hue={adjustments.highlights * 20 - adjustments.shadows * 20}
              />
            )}
          </Layer>
        </Stage>
      </div>
    );
  }
);

export default Adjustimagecanva;
