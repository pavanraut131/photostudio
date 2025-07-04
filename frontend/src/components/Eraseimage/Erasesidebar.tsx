import { RootState } from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";

interface ErasesidebarProps {
  brushSize: number;
  setBrushSize: (size: number) => void;
  onEraseClick: (originalImageURL: string) => void;
  originalImageURL?: string; // Optional, if needed for erasing
  maskDataURL?: string; // Optional, if needed for erasing
}

const Erasesidebar: React.FC<ErasesidebarProps> = ({
  brushSize,
  setBrushSize,
  onEraseClick,
  originalImageURL,
}) => {
 
  return (
    <div className="main-sidebar">
      <h3>Object Eraser</h3>
      <p>Select the objects you want to remove from the image.</p>

      <div>
        <label>Brush Size: {brushSize}</label>
        <input
          type="range"
          min={5}
          max={100}
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
        />
      </div>
      <div>
        <button className="erase-button" onClick={() => onEraseClick(originalImageURL)}>Erase</button>
      </div>
    </div>
  );
};

export default Erasesidebar;
