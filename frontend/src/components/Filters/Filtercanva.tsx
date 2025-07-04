import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import Konva from "konva";
import "./filtercanvas.css";
import { resolve } from "path";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

const FILTERS_MAP: Record<string, any[]> = {
  original: [],
  sepia: [Konva.Filters.Sepia],
  grayscale: [Konva.Filters.Grayscale],
  brighten: [Konva.Filters.Brighten],
  invert: [Konva.Filters.Invert],
  blur: [Konva.Filters.Blur],
  tropical: [Konva.Filters.HSV],
  crisp: [Konva.Filters.Contrast],
  sandy: [Konva.Filters.Sepia],
  moody: [Konva.Filters.HSL],
  "black-white": [Konva.Filters.Grayscale],
  neon: [Konva.Filters.HSV],
  washed: [Konva.Filters.Brighten],
  bright: [Konva.Filters.Brighten],
  mellow: [Konva.Filters.Sepia],
  romantic: [Konva.Filters.Sepia, Konva.Filters.HSV],
  newspaper: [Konva.Filters.Grayscale, Konva.Filters.Contrast],
  darken: [Konva.Filters.Brighten],
  lighten: [Konva.Filters.Brighten],
  faded: [Konva.Filters.Blur],
  unicorn: [Konva.Filters.HSV],
  nightrain: [Konva.Filters.Brighten, Konva.Filters.HSL],
  "neon-sky": [Konva.Filters.HSV],
  "blue-ray": [Konva.Filters.HSV],
  jellybean: [Konva.Filters.HSV],
  concrete: [Konva.Filters.Contrast],
};

interface FilterCanvasProps {
  selectedfilters: string;
  previewImage?: string;
}

const FilterCanvas = forwardRef<any, FilterCanvasProps>(({
  selectedfilters,
 
}, ref) => {
  const imageRef = useRef<Konva.Image>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
const stageRef = useRef<any>(null)
  const [imgProps, setImgProps] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  useImperativeHandle(ref, () => ({
   loadImage: (url: string) => {
     const img = new window.Image();
     img.crossOrigin = "anonymous";
     img.src = url;
     img.onload = () => {
       setImage(img);
     };
   },
   getImageDataURL: () => {
         if (stageRef.current) {
           const dataURL = stageRef.current?.toDataURL({ pixelRatio: 1 });
           return(dataURL);
       }},
    getImageBlob:(mimeType:"image/png", quality=1.0)=>{
      return new Promise<Blob |null>((resolve)=>{
        if (stageRef.current){
          const canvas  = stageRef.current.toCanvas();
          canvas.toBlob(
            (blob)=>{
              resolve(blob)
            },
            mimeType, quality
          )
        }else{
          resolve(null)
        }
      }
 )}
     
    
 }));
  useEffect(() => {
    if ( image) {
      const scaleX = CANVAS_WIDTH / image.width;
      const scaleY = CANVAS_HEIGHT / image.height;
      const scale = Math.min(scaleX, scaleY);

      const width = image.width * scale;
      const height = image.height * scale;
      const x = (CANVAS_WIDTH - width) / 2;
      const y = (CANVAS_HEIGHT - height) / 2;

      setImgProps({ width, height, x, y });
    }
  }, [image]);

  useEffect(() => {
    const node = imageRef.current;
    if (!node || !image || imgProps.width === 0 || imgProps.height === 0)
      return;

    const applyFilter = () => {
      node.clearCache();
      node.filters(FILTERS_MAP[selectedfilters] || []);

      
      node.brightness(0);
      node.blurRadius(0);
      node.saturation(0);
      node.hue(0);
      node.contrast(0);

      switch (selectedfilters) {
        case "bright":
          node.brightness(0.3);
          break;
        case "darken":
          node.brightness(-0.3);
          break;
        case "lighten":
          node.brightness(0.3);
          break;
        case "faded":
          node.blurRadius(10);
          break;
        case "tropical":
        case "unicorn":
        case "neon-sky":
        case "blue-ray":
        case "jellybean":
          node.saturation(1.5);
          node.hue(200);
          break;
        case "moody":
          node.brightness(-0.2);
          node.saturation(-0.2);
          break;
        case "neon":
          node.saturation(2);
          node.hue(270);
          break;
        case "washed":
          node.brightness(0.2);
          node.saturation(-0.3);
          break;
        case "mellow":
          node.saturation(-0.2);
          break;
        case "romantic":
          node.saturation(0.3);
          node.hue(320);
          break;
        case "crisp":
        case "concrete":
          node.contrast(30);
          break;
        case "sandy":
          node.saturation(0.3);
          break;
        case "nightrain":
          node.brightness(-0.1);
          node.hue(180);
          break;
      }

      node.cache();
      node.getLayer()?.batchDraw();
    };
const raf = requestAnimationFrame(applyFilter)
return ()=> cancelAnimationFrame(raf)
    
  }, [selectedfilters, image, imgProps]);

  // if (!image) {
  //   return (
  //     <div className="canvas-wrapper">
  //       <div className="canvas-error">
  //         <div>Failed to load image</div>
  //         <div>Please check your internet connection</div>
  //       </div>
  //     </div>
  //   );
  // }

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
              image={image}
              x={imgProps.x}
              y={imgProps.y}
              width={imgProps.width}
              height={imgProps.height}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
})

export default FilterCanvas;
