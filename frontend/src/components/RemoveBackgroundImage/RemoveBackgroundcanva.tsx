"use client";
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Stage, Layer,Rect, Image as KonvaImage } from "react-konva";
import "../Generate/generatecanva.css";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

interface CanvasProps {
  imageUrl: string;
    loading: boolean;
  bgcolor:string;
  isautocut:boolean
}

interface ImgProps {
  width: number;
  height: number;
  x: number;
  y: number;
}

const RemoveBackgroundcanva:React.FC<CanvasProps> =({
    loading,
  imageUrl,
  bgcolor,
  isautocut
}) => {

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imgProps, setImgProps] = useState<ImgProps>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const stageRef = useRef<any>(null)

//   useImperativeHandle(ref, ()=>({
//     getImageBlob:(mimeType:"image/png", quality=1.0)=>{
//       if(!isautocut) return;
//       return new Promise<Blob |null>((resolve)=>{
//         if (stageRef.current){
//           const canvas  = stageRef.current.toCanvas();
//           canvas.toBlob(
//             (blob)=>{
//               resolve(blob)
//             },
//             mimeType, quality
//           )
//         }else{
//           resolve(null)
//         }
//       }
//  )}
//   }))

  useEffect(() => {
    if (!imageUrl) return;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const scaleX = CANVAS_WIDTH / img.width;
      const scaleY = CANVAS_HEIGHT / img.height;
      const scale = Math.min(scaleX, scaleY);

      const width = img.width * scale;
      const height = img.height * scale;

      const x = (CANVAS_WIDTH - width) / 2;

      const y = (CANVAS_HEIGHT - height) / 2;

      setImgProps({ width, height, x, y });
      setImage(img);
    };
    img.onerror = (err) => {
      console.error("Image load error:", err);
    };
    img.src = imageUrl;
  }, [imageUrl]);


  return (
    <div className="canvas-wrapper">
      {loading && (
        <div
          style={{
            position: "absolute",
            top: CANVAS_HEIGHT / 2 - 20,
            left: CANVAS_WIDTH / 2 - 20,
            zIndex: 10,
          }}
          className="spinner"
        ></div>
      )}
      <Stage
      ref={stageRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="canvas-stage"
        style={{
          transition: "opacity 0.5s ease",
          filter: loading ? "blur(3px)" : "none",
        }}
      >
        <Layer>
          <Rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill={bgcolor} />
          {image && (            <KonvaImage
              image={image}
              width={imgProps.width}
              height={imgProps.height}
              x={imgProps.x}
              y={imgProps.y}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
}

export default RemoveBackgroundcanva;
