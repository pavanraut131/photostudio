import React, {
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Stage, Layer, Line, Circle, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { addBrushStroke } from "@/redux/Imageslice";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

interface EraserCanvasProps {
  brushSize: number;
  result_image_url: string;
  loading: boolean;
}

export interface EraseimagecanvasRef {
  getMaskImage: () => string | null;
}

const Eraseimagecanvas = forwardRef<EraseimagecanvasRef, EraserCanvasProps>(
  ({ brushSize, result_image_url, loading }, ref) => {
    const dispatch = useDispatch<AppDispatch>();
    const [image] = useImage(result_image_url, "anonymous");
    const {brushHistory} = useSelector((state:RootState)=>state.image)

    const [currentLine, setCurrentLine] = useState<number[]>([]);
    const [pointerPos, setPointerPos] = useState({ x: 20, y: 20 });

    const stageRef = useRef<any>(null);
    const maskLayerRef = useRef<any>(null);
    const isDrawing = useRef(false);

    useImperativeHandle(ref, () => ({
      getMaskImage: () => {
        if (!maskLayerRef.current) return null;
        return maskLayerRef.current.toDataURL({
          mimeType: "image/png",
          pixelRatio: 1,
        });
      },
    }));

    // Scale image to fit canvas
    let scale = 1,
      imageX = 0,
      imageY = 0,
      scaledWidth = 0,
      scaledHeight = 0;
    if (image) {
      const scaleX = CANVAS_WIDTH / image.width;
      const scaleY = CANVAS_HEIGHT / image.height;
      scale = Math.min(scaleX, scaleY);
      scaledWidth = image.width * scale;
      scaledHeight = image.height * scale;
      imageX = (CANVAS_WIDTH - scaledWidth) / 2;
      imageY = (CANVAS_HEIGHT - scaledHeight) / 2;
    }

    const handleMouseDown = (e: any) => {
      isDrawing.current = true;
      const pos = e.target.getStage().getPointerPosition();
      if (!pos) return;
      setPointerPos(pos);
      setCurrentLine([pos.x, pos.y]);
    };

    const handleMouseMove = (e: any) => {
      if (!isDrawing.current) return;
      const point = e.target.getStage().getPointerPosition();
      if (!point) return;
      setPointerPos(point);
      setCurrentLine((prev) => [...prev, point.x, point.y]);
    };

    const handleMouseUp = () => {
      if (currentLine.length > 0) {
        // Add this stroke to Redux brushHistory
        dispatch(
          addBrushStroke([...brushHistory, { points: currentLine, brushSize }])
        );
      }
      setCurrentLine([]);
      isDrawing.current = false;
    };

    return (
      <div className="canvas-wrapper">
        {loading && (
          <div
            style={{
              position: "absolute",
              top: imageY + scaledHeight / 2 - 20,
              left: imageX + scaledWidth / 2 - 20,
              zIndex: 10,
            }}
            className="spinner"
          ></div>
        )}

        <Stage
          ref={stageRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          style={{
            transition: "opacity 0.5s ease",
            filter: loading ? "blur(3px)" : "none",
          }}
        >
          <Layer>
            {image && (
              <KonvaImage
                image={image}
                width={scaledWidth}
                height={scaledHeight}
                x={imageX}
                y={imageY}
              />
            )}
          </Layer>

          <Layer ref={maskLayerRef}>
            {brushHistory.map((line, i) => (
              <Line
                key={`history-${i}`}
                points={line.points}
                stroke="white"
                strokeWidth={line.brushSize}
                globalCompositeOperation="source-over"
                tension={0.5}
                lineCap="round"
                lineJoin="round"
              />
            ))}

            {currentLine.length > 0 && (
              <Line
                points={currentLine}
                stroke="white"
                strokeWidth={brushSize}
                globalCompositeOperation="source-over"
                tension={0.5}
                lineCap="round"
                lineJoin="round"
              />
            )}
          </Layer>

          <Layer listening={false}>
            <Circle
              x={pointerPos.x}
              y={pointerPos.y}
              radius={brushSize / 2}
              stroke="black"
              strokeWidth={1}
              dash={[4, 2]}
            />
          </Layer>
        </Stage>
      </div>
    );
  }
);

export default Eraseimagecanvas;
