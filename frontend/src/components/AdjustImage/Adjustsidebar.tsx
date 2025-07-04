"use client";
import React, { ChangeEvent } from "react";
// Import the AdjustmentSettings interface from the correct slice
import { AdjustmentSettings } from "@/redux/Adjustfilterslice"; // Correct import path

// Slider Props Interface
interface SliderProps {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

// Slider Component
const Slider: React.FC<SliderProps> = ({
  label,
  min,
  max,
  step,
  value,
  onChange,
}) => (
  <div style={{ marginBottom: "20px" }}>
    <label
      style={{
        display: "block",
        marginBottom: "8px",
        fontWeight: "bold",
        color: "#555",
      }}
    >
      {label}:
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      style={{ width: "100%" }}
    />
  </div>
);

// Props for Adjustsidebar
interface AdjustSidebarProps {
  // Use the imported AdjustmentSettings from your Redux slice
  adjustments: AdjustmentSettings;
  onAdjustmentChange: (name: keyof AdjustmentSettings, value: number) => void;
}

// Adjustsidebar Component
const Adjustsidebar: React.FC<AdjustSidebarProps> = ({
  adjustments,
  onAdjustmentChange,
}) => {
  return (
    <div
      className="main-sidebar"

    >
      <h2 style={{ marginBottom: "20px", fontSize: "1.5em", color: "#333" }}>
        Adjust Image
      </h2>

      <Slider
        label="Brightness"
        min={-1}
        max={1}
        step={0.01}
        value={adjustments.brightness}
        onChange={(e) =>
          onAdjustmentChange("brightness", parseFloat(e.target.value))
        }
      />
      <Slider
        label="Contrast"
        min={-1}
        max={1}
        step={0.01}
        value={adjustments.contrast}
        onChange={(e) =>
          onAdjustmentChange("contrast", parseFloat(e.target.value))
        }
      />
      <Slider
        label="Highlights"
        min={-1}
        max={1}
        step={0.01}
        value={adjustments.highlights}
        onChange={(e) =>
          onAdjustmentChange("highlights", parseFloat(e.target.value))
        }
      />
      <Slider
        label="Shadows"
        min={-1}
        max={1}
        step={0.01}
        value={adjustments.shadows}
        onChange={(e) =>
          onAdjustmentChange("shadows", parseFloat(e.target.value))
        }
      />
      <Slider
        label="Color Saturation"
        min={0}
        max={2}
        step={0.01}
        value={adjustments.saturation}
        onChange={(e) =>
          onAdjustmentChange("saturation", parseFloat(e.target.value))
        }
      />
      <Slider
        label="Temperature"
        min={-0.5}
        max={0.5}
        step={0.01}
        // Assuming 'blue' is used for temperature adjustment, as per your Konva logic
        value={adjustments.blue}
        onChange={(e) => {
          const val = parseFloat(e.target.value);
          // Apply temperature adjustment across red, green, and blue channels
          onAdjustmentChange("blue", val);
          onAdjustmentChange("red", -val * 0.7); // Adjust red inversely for temperature
          onAdjustmentChange("green", -val * 0.3); // Minor green adjustment for temperature
        }}
      />
      <Slider
        label="Exposure"
        min={-1}
        max={1}
        step={0.01}
        value={adjustments.exposure}
        onChange={(e) =>
          onAdjustmentChange("exposure", parseFloat(e.target.value))
        }
      />
    </div>
  );
};

export default Adjustsidebar;
