import React, { useRef, useState } from "react";
import Eraseimagecanvas, {
  EraseimagecanvasRef,
} from "@/components/Eraseimage/Eraseimagecanvas";
import Erasesidebar from "@/components/Eraseimage/Erasesidebar";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { eraseImage } from "@/redux/action";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import axios from "axios";
import { resetBrushHistory } from "@/redux/Imageslice";

const Erasertool: React.FC = ({result_image_url}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [brushSize, setBrushSize] = useState<number>(40);
  const canvasRef = useRef<EraseimagecanvasRef>(null);

  // const originalImageURL =
  //   "https://yavuzceliker.github.io/sample-images/image-1.jpg";
  const {  loading } = useSelector((state: RootState) => state.image);
  const uploadBase64Image = async (base64: string): Promise<string> => {
    const response = await axios.post("http://localhost:8000/upload-mask/", {
      image_base64: base64,
    });
    return response.data.mask_url;
  };

  const handleErase = async (originalImageURL) => {
    if (!canvasRef.current) {
      console.error("Canvas ref is not ready");
      return;
    }

    const maskDataURL = canvasRef.current.getMaskImage();
    if (!maskDataURL) {
      console.error("Mask image missing");
      return;
    }

  
    const brushmarkUrl = await uploadBase64Image(maskDataURL);

    await dispatch(
      eraseImage({
        input_image_url: originalImageURL,
        brushmark_url: brushmarkUrl,
        prompt: "erase the image",
        edit_prompt: null,
      })
    );
    dispatch(resetBrushHistory())

    console.log("Erase action dispatched");
  };

  return (
    <>
      <div>
        <Erasesidebar
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          onEraseClick={handleErase}
          originalImageURL={result_image_url}
        />
      </div>
      <div>
        <Eraseimagecanvas 
        result_image_url={result_image_url}
        key = {result_image_url} ref={canvasRef} brushSize={brushSize} 
        loading={loading}
        />
      </div>
    </>
  );
};

export default Erasertool;
