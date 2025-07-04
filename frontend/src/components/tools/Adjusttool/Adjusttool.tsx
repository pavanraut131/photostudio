import React, { useRef, useEffect, useImperativeHandle, forwardRef } from "react";
import Adjustimagecanva from "@/components/AdjustImage/Adjustimagecanva";
import Adjustsidebar from "@/components/AdjustImage/Adjustsidebar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setAdjustments } from "@/redux/Imageslice";
import { Adjustments } from "@/utils/types";


const Adjusttool = forwardRef(({ result_image_url }: any, ref) => {
  const dispatch = useDispatch();
  const canvasRef = useRef<any>();
  const { adjustments } = useSelector((state: RootState) => state.image);

  useEffect(() => {
    if (canvasRef.current && result_image_url) {
      canvasRef.current.loadImage(result_image_url);
    }
  }, [result_image_url]);

  

  const handleAdjustmentChange = (name: keyof Adjustments, value: number) => {
    dispatch(setAdjustments({ name, value }));
  };
  useImperativeHandle(ref, () => ({

    //get image in base64
    exportImage: () => {
      if (canvasRef.current) {
        return canvasRef.current.getImageDataURL();
      }
      return null;
    },
    //get image in blob
    exportImageBlob: async (mimeType = "image/png", quality = 1.0) => {
      if (canvasRef.current) {
        const blob = await canvasRef.current.getImageBlob(mimeType, quality);
        return blob;
      }
      return null;
    },
  }));
  

  return (
    <>
      <Adjustsidebar
        adjustments={adjustments}
        onAdjustmentChange={handleAdjustmentChange}
      />
      <Adjustimagecanva ref={canvasRef} adjustments={adjustments} />
    </>
  );
})

export default Adjusttool;
