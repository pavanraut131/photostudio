"use client";

import type { ChangeEvent } from "react";
import "./generatesidebar.css";
import { generateImage } from "@/redux/action";
import { useDispatch } from "react-redux";
import { setLoading, setPrompt, setStyle } from "../../redux/Imageslice";
import type { AppDispatch } from "../../redux/store";

interface GenerateImageSidebarProps {
  prompt: string;
  style: string;
  result_image_url: string | null;
  analyzed_result: string;
  isregenrate:boolean
}

const Generateimagesidebar: React.FC<GenerateImageSidebarProps> = ({
  prompt,
  style,
  result_image_url,
  analyzed_result,
  isregenrate,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  
  const handlePromptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    dispatch(setPrompt(e.target.value));
  };
  // const handleanalyzechange = (e: ChangeEvent<HTMLTextAreaElement>) => {
  //   dispatch(setPrompt(e.target.value));
  // };

  const handleStyleChange = (styleOption: string) => {
    dispatch(setStyle(styleOption));
  };

  const handleGenerate = async (prompt: string, style: string) => {
    dispatch(setLoading(true));
    await dispatch(
      generateImage({
        prompt,
        style,
        input_image_url: "",
        brushmark_url: "",
        edit_prompt: "",
      })
    );
    dispatch(setLoading(false));
  };

  const styleOptions = [
    "None",
    "Photo",
    "Illustration",
    "3D",
    "Packshot",
    "Painting",
    "Sketch",
    "Fantasy",
    "Cartoon",
    "Pop Art",
    "Background",
    "Collage",
  ];

  return (
    <div className="main-sidebar">
      {isregenrate ? (
        <h2 className="panel-title">Regenrate Image</h2>
      ) : (
        <h2 className="panel-title">AI Image Creator</h2>
      )}

      <label className="input-label">Describe your image</label>
      {isregenrate ? (
        <textarea
          className="prompt-input"
          value={prompt}
          onChange={handlePromptChange}
          
        />
      ) : (
        <textarea
          className="prompt-input"
          value={prompt}
          onChange={handlePromptChange}
          placeholder="e.g. books library"
        />
      )}

      <label className="input-label">Choose a style</label>
      <div className="style-grid">
        {styleOptions.map((styleOption) => (
          <button
            key={styleOption}
            className={`style-btn ${style === styleOption ? "active" : ""}`}
            onClick={() => handleStyleChange(styleOption)}
            type="button"
          >
            {styleOption}
          </button>
        ))}
      </div>

      <div className="action-buttons">
        <button
          type="button"
          className="generate-btn"
          onClick={() => handleGenerate(prompt, style)}
        >
          Generate
        </button>
      </div>
    </div>
  );
};

export default Generateimagesidebar;
