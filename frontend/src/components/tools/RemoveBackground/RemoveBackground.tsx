import RemoveBackgroundcanva from "@/components/RemoveBackgroundImage/RemoveBackgroundcanva";
import Removebackgroundsidebar from "@/components/RemoveBackgroundImage/Removebackgroundsidebar";
import { removebackground, setLoading } from "@/redux/Imageslice";
import { AppDispatch, RootState } from "@/redux/store";
import { ref } from "firebase/storage";
import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const RemoveBackground = ({result_image_url}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, isutocut} = useSelector((state:RootState)=>state.image)
  const [bgcolor, setbgcolor] = useState('transparent')
  // const canvasRef = useRef<any>()
  

//   const result_image_url =
//     "https://yavuzceliker.github.io/sample-images/image-1.jpg";

  const handleremovebackground = async () => {
    dispatch(setLoading(true))
    dispatch(removebackground(result_image_url))
    
  };
  // useImperativeHandle(ref, () => ({
  //     exportImageBlob: async (mimeType = "image/png", quality = 1.0) => {
  //       if (canvasRef.current) {
  //         const blob = await canvasRef.current?.getImageBlob(mimeType, quality);
  //         return blob;
  //       }
  //       return null;
  //     },
  //   }));
  return (
    <>
      <div>
        <Removebackgroundsidebar
          imageUrl={result_image_url}
          handleremovebackground={handleremovebackground}
          setbgcolor={setbgcolor}
          isautocut={isutocut}
        />
      </div>
      <div>
        <RemoveBackgroundcanva
        isautocut = {isutocut}
          imageUrl={result_image_url}
          loading={loading}
          bgcolor={bgcolor}
          
        />
      </div>
    </>
  );
}

export default RemoveBackground;
