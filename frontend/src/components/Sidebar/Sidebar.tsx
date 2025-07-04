import React from "react";
import "./sidebar.css"
import {
  Crop,
  SlidersHorizontal,
  ListFilterPlus,
  Eraser,
  RefreshCcw,
  Scissors,
  Text,
  Image,
  Layers,
  Pencil,
  PaintBucket,
} from "lucide-react";

interface Tool {
  id: string;
  icon: React.ReactNode;
  label: string;
}

const tools: Tool[] = [
  { id: "generate", icon: <Image size={20} />, label: "Generate" },
  { id: "crop", icon: <Crop size={20} />, label: "Crop & Extend" },
  { id: "adjust", icon: <SlidersHorizontal size={20} />, label: "Adjust" },
  { id: "filters", icon: <ListFilterPlus size={20} />, label: "Filters" },
  { id: "erase", icon: <Eraser size={20} />, label: "Eraser" },
  {id:"editor", icon:<Pencil size={20}/>, label:"AI Image Editor"},
  { id: "regenerate", icon: <RefreshCcw size={20} />, label: "Regenerate" },
  { id: "cut", icon: <Scissors size={20} />, label: "Cut Out" },
  // { id: "text", icon: <Text size={20} />, label: "Text" },
  // { id: "decor", icon: <Image size={20} />, label: "Decorative" },
  // { id: "overlay", icon: <Layers size={20} />, label: "Overlays" },
  // { id: "bg", icon: <PaintBucket size={20} />, label: "Background" },
];

const Sidebar = ({ setActiveTool, activeTool }: any) => {
  return (
    <>
      <div className="tool-tab-list">
        {tools.map((tool) => (
          <div
            key={tool.id}
            title={tool.label}
            onClick={async() => await setActiveTool(tool.label)}
            className={`tool-tab ${activeTool === tool.label ? "active" : ""}`}
          >
            {tool.icon}
          </div>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
