import { createSlice, isRejected } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { reducers } from "./reducers";
import {
  generateImage,
  editImage,
  eraseImage,
  upscaleImage,
  extendImage,
  analyzeImage,
  removebackground,
} from "./action";
import { ImageState } from "@/utils/types";
import { defaultAdjustments } from "@/utils/initialstate";

export const initialState: ImageState = {
  prompt: "",
  edit_prompt: "",
  input_image_url: "",
  result_image_url: "",
  orginal_image: "",
  imageforadjust: "",
  brushmark_url: "",
  analyze_result: "",
  activeTool: "Generate",
  loading: false,
  style: "None",
  error: null,
  isutocut: false,
  imagedimensions: { width: 0, height: 0 },
  mediaarray:[],

  adjustments: defaultAdjustments,

  selectedFilter: "original",
  brushHistory: [],

  history: [],
  future: [],
};

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers,
  extraReducers: (builder) => {
    builder
      .addCase(generateImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(generateImage.fulfilled, (state, action) => {
        state.loading = false;
        state.result_image_url = action.payload;
        state.orginal_image = action.payload;
        state.imageforadjust = action.payload;
      })
      .addCase(editImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(editImage.fulfilled, (state, action) => {
        state.loading = false;
        state.result_image_url = action.payload;
        state.imageforadjust = action.payload;
      })
      .addCase(eraseImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(eraseImage.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.result_image_url = action.payload;
        state.imageforadjust = action.payload;
        
      })
      .addCase(upscaleImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        upscaleImage.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.result_image_url = action.payload;
          state.imageforadjust = action.payload;
        }
      )
      .addCase(
        extendImage.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.result_image_url = action.payload;
          state.imageforadjust = action.payload;
        }
      )
      .addCase(analyzeImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        analyzeImage.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.analyze_result = action.payload;
          state.imageforadjust = action.payload;
        }
      )
      .addCase(removebackground.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        removebackground.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.result_image_url = action.payload;
          state.imageforadjust = action.payload;
          state.isutocut = true;
        }
      )
      .addMatcher(isRejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message ?? "Something went wrong";
      });
  },
});

// Export actions
export const {
  setPrompt,
  setStyle,
  setEditPrompt,
  setInputImageUrl,
  setBrushmarkUrl,
  setActiveTool,
  setLoading,
  setdimensions,
  setresult_url,
  setAdjustments,
  undo,
  redo,
  setSelectedfilter,
  reverttoorginal,
  addBrushStroke,
   resetBrushHistory,
   setadjustimage,
   setorginalimage,
   setImageArray,
  addImageToArray
} = imageSlice.actions;

// Export thunks
export {
  generateImage,
  editImage,
  eraseImage,
  upscaleImage,
  extendImage,
  analyzeImage,
  removebackground,
};

// Export reducer
export default imageSlice.reducer;
