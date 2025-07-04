"use client";
import Filtercanva from "@/components/Filters/Filtercanva";
import Filterssidebar from "@/components/Filters/Filterssidebar";
import { RootState } from "@/redux/store";
import { ref } from "firebase/storage";
import React, {
  useImperativeHandle,
  useEffect,
  forwardRef,
  useRef,
} from "react";
import { useSelector } from "react-redux";

const Filtertool = forwardRef(({ result_image_url }, ref) => {
  const { selectedFilter } = useSelector((state: RootState) => state.image);

  const canvasRef = useRef<any>();
  // const result_image_url =
  //   "https://yavuzceliker.github.io/sample-images/image-1.jpg";
  useEffect(() => {
    if (canvasRef.current && result_image_url) {
      canvasRef.current.loadImage(result_image_url);
    }
  }, [result_image_url]);

  useImperativeHandle(ref, () => ({
    exportImage: async () => {
      if (canvasRef.current) {
        const dataurl = await canvasRef.current?.getImageDataURL();
        return dataurl;
      }
      return null;
    },
    exportImageBlob: async (mimeType = "image/png", quality = 1.0) => {
      if (canvasRef.current) {
        const blob = await canvasRef.current?.getImageBlob(mimeType, quality);
        return blob;
      }
      return null;
    },
  }));
  return (
    <>
      <div>
        <Filterssidebar
          previewImage={result_image_url}
          selectedfilters={selectedFilter}
        />
      </div>
      <div>
        <Filtercanva ref={canvasRef} selectedfilters={selectedFilter} />
      </div>
    </>
  );
});

export default Filtertool;
