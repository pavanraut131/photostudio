import React from "react";
import "./editorsidebar.css";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { setEditPrompt } from "@/redux/Imageslice";
interface Editorsidebarprops {
  brushSize: number;
  setBrushSize: (size: number) => void;
  result_image_url: string;
  edit_prompt:string

}

const Editorsidebar: React.FC<Editorsidebarprops> = ({
  brushSize,
  setBrushSize,
  result_image_url,
  edit_prompt,
  handleedit,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const handleeditprompt = (e) => {
    dispatch(setEditPrompt(e.target.value));
    console.log(edit_prompt, "editprompt");
  };    
  return (
    <div className="main-sidebar">
      <h2 className="top-title">AI Image Editor</h2>
      <p>
        First, select the area you want to change. Then, describe the image you
        would like instead.
      </p>
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
        <label className="inputlabel">Describe your Image</label>
        <textarea
          value={edit_prompt}
          onChange={handleeditprompt}
          className="textboxedit"
          placeholder="e.g., Large tree covered with beautiful pink flowers"
        />
      </div>
      <div>
        <button className="erase-button" onClick={() => handleedit(result_image_url, edit_prompt)} >
          Edit
        </button>
      </div>
    </div>
  );
};

export default Editorsidebar;
