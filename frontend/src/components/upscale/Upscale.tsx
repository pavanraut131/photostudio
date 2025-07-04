"use client";
import React, { useEffect, useState } from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

interface CanvasProps {
  imageUrl: string;
  
  //   loading: boolean;
}

interface ImgProps {
  width: number;
  height: number;
  x: number;
  y: number;
}

const Upscale: React.FC<CanvasProps> = (
  {

      imageUrl,
  }
) => {
//   const imageUrl = "https://yavuzceliker.github.io/sample-images/image-1.jpg";
  const { loading } = useSelector((state: RootState) => state.image);
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
    console.log(img, "img");
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
  console.log(loading, "loading");

  return (
    <div className="canvas-wrapper">
      {!loading ? (
        <Stage
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="canvas-stage"
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
      ) : (
        <div className="loading"> Loading.....</div>
      )}
    </div>
  );
};

export default Upscale;
