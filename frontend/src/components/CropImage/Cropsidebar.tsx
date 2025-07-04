// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { RootState } from "@/redux/store";

// export const aspectRatios: AspectRatio[] = [
//   { value: 1 / 1, text: "Free" },
//   { value: 4 / 3, text: "4:3" },
//   { value: 16 / 9, text: "16:9" },
//   { value: 1 / 1, text: "1:1" },
//   { value: 2 / 3, text: "2:3" },
// ];

// interface AspectRatio {
//   value: number;
//   text: string;
// }

// interface CropsidebarProps {
//   currentAspect: AspectRatio;
//   onAspectChange: (newAspect: AspectRatio) => void;
//   setupscale: (loading: boolean) => void;

//   isCroppingMode: boolean;
//   onCrop: () => void;
//   onReset: () => void;

//   handleupscale: (url: string) => void;
//   extendtool: boolean;
//   loading: boolean;
//   setextendtool: (value: boolean) => void;
//   result_image_url: string;
// }

// const Cropsidebar: React.FC<CropsidebarProps> = ({
//   currentAspect,
//   onAspectChange,
//   setupscale,
//   isCroppingMode,
//   handleupscale,
//   onCrop,
//   extendtool,
//   loading,
//   setextendtool,
//   result_image_url,
// }) => {
//   const { imagedimensions } = useSelector((state: RootState) => state.image);
//   console.log(imagedimensions, "imagedimensions in Cropsidebar");

//   const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//     const selectedValue = parseFloat(event.target.value);
//     const selectedRatio = aspectRatios.find(
//       (ratio) => ratio.value === selectedValue
//     );
//     if (selectedRatio) {
//       onAspectChange(selectedRatio);
//     }
//   };

//   const [customWidth, setCustomWidth] = useState<number>(
//     imagedimensions.width || 0
//   );
//   const [customHeight, setCustomHeight] = useState<number>(
//     imagedimensions.height || 0
//   );

//   useEffect(() => {
//     if (imagedimensions.width && imagedimensions.height) {
//       setCustomWidth(imagedimensions.width);
//       setCustomHeight(imagedimensions.height);
//     }
//   }, [imagedimensions]);

//   useEffect(() => {
//     if (
//       imagedimensions.width > 0 &&
//       imagedimensions.height > 0 &&
//       currentAspect
//     ) {
//       const imageAspect = imagedimensions.width / imagedimensions.height;
//       const targetAspect = currentAspect.value;

//       let newWidth: number;
//       let newHeight: number;

//       if (targetAspect > imageAspect) {
//         newWidth = imagedimensions.width;
//         newHeight = Math.round(imagedimensions.width / targetAspect);
//       } else {
//         newHeight = imagedimensions.height;
//         newWidth = Math.round(imagedimensions.height * targetAspect);
//       }

//       setCustomWidth(newWidth);
//       setCustomHeight(newHeight);
//     }
//   }, [currentAspect, imagedimensions]);

//   return (
//     <div className="sidebar-container">
//       <div className="crop-extend-toggle">
//         <button className="crop-button" onClick={() => setextendtool(false)}>
//           Crop
//         </button>
//         <button className="extend-button" onClick={() => setextendtool(true)}>
//           Extend
//         </button>
//       </div>
//       <div>
//         <h3>Aspect Ratio</h3>
//         <select
//           onClick={() => setupscale(false)}
//           onChange={handleSelectChange}
//           value={currentAspect.value}
//           disabled={!isCroppingMode}
//         >
//           {aspectRatios.map((ratio) => (
//             <option key={ratio.text} value={ratio.value}>
//               {ratio.text}
//             </option>
//           ))}
//         </select>
//       </div>

//       <div className="custom-size-section">
//         <h4>Custom Size (px)</h4>
//         <div className="custom-size-inputs">
//           <input
//             type="number"
//             value={customWidth}
//             onChange={(e) => setCustomWidth(parseInt(e.target.value) || 0)}
//             disabled={!isCroppingMode}
//           />
//           <input
//             type="number"
//             value={customHeight}
//             onChange={(e) => setCustomHeight(parseInt(e.target.value) || 0)}
//             disabled={!isCroppingMode}
//           />
//         </div>
//       </div>

//       <div className="action-buttons">
//         {extendtool ? (
//           <button>Extend Image</button>
//         ) : (
//           <button onClick={onCrop} disabled={!isCroppingMode}>
//             Crop Image
//           </button>
//         )}
//         {loading ? (
//           <div style={{ padding: "10px", fontWeight: "bold", color: "red" }}>
//             Upscaling...
//           </div>
//         ) : (
//           <button
//             onClick={() => handleupscale(result_image_url)}
//             disabled={!result_image_url}
//           >
//             Upscale Image
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Cropsidebar;




import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store"; // Ensure this path is correct

// Define AspectRatio interface here if not already imported globally
export interface AspectRatio {
  value: number; // Use 0 for "Free"
  text: string;
}

export const aspectRatios: AspectRatio[] = [
  { value: 0, text: "Free" }, // Changed: 0 for truly free aspect
  { value: 4 / 3, text: "4:3" },
  { value: 16 / 9, text: "16:9" },
  { value: 1 / 1, text: "1:1" }, // This is the actual 1:1 Square
  { value: 2 / 3, text: "2:3" },
];

interface CropsidebarProps {
  currentAspect: AspectRatio;
  onAspectChange: (newAspect: AspectRatio) => void;
  setupscale: (loading: boolean) => void;
  isCroppingMode: boolean;
  onCrop: () => void;
  onReset: () => void; // Added onReset if it was missing from props, seems to be used
  handleupscale: (url: string) => void;
  extendtool: boolean;
  loading: boolean;
  setextendtool: (value: boolean) => void;
  result_image_url: string;
}

const Cropsidebar: React.FC<CropsidebarProps> = ({
  currentAspect,
  onAspectChange,
  setupscale,
  isCroppingMode,
  handleupscale,
  onCrop,
  // onReset, // Ensure onReset is used or remove if not needed by this component directly
  extendtool,
  loading,
  setextendtool,
  result_image_url,
}) => {
  const { imagedimensions } = useSelector((state: RootState) => state.image);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = parseFloat(event.target.value);
    const selectedRatio = aspectRatios.find(
      (ratio) => ratio.value === selectedValue
    );
    if (selectedRatio) {
      onAspectChange(selectedRatio);
    }
  };

  const [customWidth, setCustomWidth] = useState<number>(0);
  const [customHeight, setCustomHeight] = useState<number>(0);

  useEffect(() => {
    if (imagedimensions.width && imagedimensions.height) {
      let newWidth = imagedimensions.width;
      let newHeight = imagedimensions.height;

      if (currentAspect && currentAspect.value !== 0) { // If not "Free"
        const imageAspect = imagedimensions.width / imagedimensions.height;
        const targetAspect = currentAspect.value;

        if (targetAspect > imageAspect) {
         
          newHeight = Math.round(imagedimensions.width / targetAspect);
        } else {
         
          newWidth = Math.round(imagedimensions.height * targetAspect);
        }
      }
      // For "Free" (currentAspect.value === 0), newWidth and newHeight will be full image dimensions
      setCustomWidth(newWidth);
      setCustomHeight(newHeight);
    } else {
      setCustomWidth(0);
      setCustomHeight(0);
    }
  }, [currentAspect, imagedimensions]);


  return (
    <div className="sidebar-container">
      <div className="crop-extend-toggle">
        <h3>Crop Image</h3>
        {/* <button className="crop-button" onClick={() => setextendtool(false)}>
          Crop
        </button> */}
        {/* <button className="extend-button" onClick={() => setextendtool(true)}>
          Extend
        </button> */}
      </div>
      <div>
        <h3>Aspect Ratio</h3>
        <select
          // onClick={() => setupscale(false)}
          onChange={handleSelectChange}
          value={currentAspect.value} // Ensure currentAspect is never null/undefined here
          disabled={!isCroppingMode}
        >
          {aspectRatios.map((ratio) => (
            <option key={ratio.text} value={ratio.value}>
              {ratio.text}
            </option>
          ))}
        </select>
      </div>

      <div className="custom-size-section">
        <h4>Custom Size (px)</h4>
        <div className="custom-size-inputs">
          <input
            type="number"
            value={customWidth}
            onChange={(e) => setCustomWidth(parseInt(e.target.value) || 0)}
            disabled={!isCroppingMode}
            readOnly // Make these readOnly if they are for display based on crop selection
          />
          <input
            type="number"
            value={customHeight}
            onChange={(e) => setCustomHeight(parseInt(e.target.value) || 0)}
            disabled={!isCroppingMode}
            readOnly // Make these readOnly
          />
        </div>
      </div>

      <div className="action-buttons">
        {extendtool ? (
          <button>Extend Image</button>
        ) : (
          <button onClick={onCrop} disabled={!isCroppingMode || loading}>
            Crop Image
          </button>
        )}
        {loading ? (
          <div style={{ padding: "10px", fontWeight: "bold", color: "red" }}>
            Upscaling...
          </div>
        ) : (
          <button
            onClick={() => result_image_url && 
              handleupscale(result_image_url
                
              )}
            disabled={!result_image_url || loading}
          >
            Upscale Image
          </button>
        )}
      </div>
    </div>
  );
};

export default Cropsidebar;
