import EditorCanva from "@/components/ImageEditor/EditorCanva";
import Editorsidebar from "@/components/ImageEditor/Editorsidebar";
import { AppDispatch, RootState } from "@/redux/store";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { editImage } from "@/redux/action";
import Eraseimagecanvas from "@/components/Eraseimage/Eraseimagecanvas";
import { resetBrushHistory } from "@/redux/Imageslice";


interface EditorCanvaRef {
  getMaskImage: () => string | null;
}

const ImageEditortool: React.FC = ({result_image_url}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [brushSize, setBrushSize] = useState<number>(40);

  const canvaref = useRef<EditorCanvaRef | null>(null);

  // const result_image_url =
  //   "https://yavuzceliker.github.io/sample-images/image-1.jpg";

  const { edit_prompt,
   
     loading,
     } = useSelector((state: RootState) => state.image);

  const uploadBase64Image = async (base64: string): Promise<string> => {
    const response = await axios.post("http://localhost:8000/upload-mask/", {
      image_base64: base64,
    });
    return response.data.mask_url;
  };

  const handleedit = async (result_image_url: string, edit_prompt: string) => {
    if (!canvaref.current) {
      console.error("Canvas ref is not ready");
      return;
    }

    const maskDataURL = canvaref.current.getMaskImage();
    if (!maskDataURL) {
      console.error("Mask image missing");
      return;
    }

    try {
      const brushmarkUrl = await uploadBase64Image(maskDataURL);


      await dispatch(
        editImage({
          input_image_url: result_image_url,
          brushmark_url: brushmarkUrl,
          prompt: "edit the image",
          edit_prompt,
        })
      );
      dispatch(resetBrushHistory())
      console.log("edit action dispatched")
    } catch (error) {
      console.error("Edit image failed:", error);
    }
  };

  return (
    <>
      <div>
        <Editorsidebar
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          result_image_url={result_image_url}
          edit_prompt={edit_prompt}
          handleedit={handleedit}
        />
      </div>
      <div>
        <Eraseimagecanvas
          result_image_url={result_image_url}
          key={result_image_url}
          ref={canvaref}
          brushSize={brushSize}
          loading={loading}
        />
      </div>
    </>
  );
};

export default ImageEditortool;
