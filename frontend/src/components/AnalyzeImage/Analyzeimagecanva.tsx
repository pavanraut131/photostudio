"use client";
import React, { useEffect, useState } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import "../Generate/generatecanva.css";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

interface CanvasProps {
  imageUrl: string;
loading: boolean;
}

interface ImgProps {
  width: number;
  height: number;
  x: number;
  y: number;
}

const Analyzeimagecanva: React.FC<CanvasProps> = ({
    loading,
  imageUrl,
}) => {
  // const imageUrl =
  //   "  ";
  //   const { loading } = useSelector((state: RootState) => state.image);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imgProps, setImgProps] = useState<ImgProps>({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
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
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="canvas-stage"
        style={{
          transition: "opacity 0.5s ease",
          filter: loading ? "blur(3px)" : "none",
        }}
      >
        <Layer>
          {image && (
            <KonvaImage
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
};

export default Analyzeimagecanva;
