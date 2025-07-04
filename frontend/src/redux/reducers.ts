import { original, type PayloadAction } from "@reduxjs/toolkit";

import { defaultAdjustments } from "@/utils/initialstate";
import { Adjustments, ImageState } from "@/utils/types";


function saveToHistory(state: ImageState) {
  state.history.push({
    adjustments: { ...state.adjustments },
    selectedFilter: state.selectedFilter,
    brushHistory: [...state.brushHistory],
    result_image_url: state.result_image_url,
  });
  state.future = []; 
}

export const reducers = {
  setPrompt: (state: ImageState, action: PayloadAction<string>) => {
    state.prompt = action.payload;
  },
  setEditPrompt: (state: ImageState, action: PayloadAction<string>) => {
    state.edit_prompt = action.payload;
  },
  setInputImageUrl: (state: ImageState, action: PayloadAction<string>) => {
    state.input_image_url = action.payload;
  },
  setBrushmarkUrl: (state: ImageState, action: PayloadAction<string>) => {
    state.brushmark_url = action.payload;
  },
  setStyle: (state: ImageState, action: PayloadAction<string>) => {
    state.style = action.payload;
  },
  setActiveTool: (state: ImageState, action: PayloadAction<string>) => {
    state.activeTool = action.payload;
  },
  setLoading: (state: ImageState, action: PayloadAction<boolean>) => {
    state.loading = action.payload;
  },

  setdimensions: (
    state: ImageState,
    action: PayloadAction<{ width: number; height: number }>
  ) => {
    state.imagedimensions.height = action.payload.height;
    state.imagedimensions.width = action.payload.width;
  },
  setresult_url: (state: ImageState, action: PayloadAction<string>) => {
    state.result_image_url = action.payload;
    // state.imageforadjust = action.payload
  },
  setadjustimage: (state: ImageState, action: PayloadAction<string>) => {
    // state.result_image_url = action.payload;
    state.imageforadjust = action.payload
  },
  setorginalimage: (state: ImageState, action: PayloadAction<string>) => {
    // state.result_image_url = action.payload;
    state.orginal_image = action.payload
  },
  // setOriginalImageUrl: (state: ImageState, action: PayloadAction<string>) => {
  //   state.original_image_url = action.payload;
  // },
  setSelectedfilter: (state: ImageState, action: PayloadAction<string>) => {
    saveToHistory(state);
    state.selectedFilter = action.payload;
  },
  setImageArray: (state:ImageState, action: PayloadAction<string[]>) => {
    state.mediaarray = action.payload;
  },
  addImageToArray: (state:ImageState, action: PayloadAction<string>) => {
    if (!state.mediaarray.includes(action.payload)) {
      state.mediaarray = [...state.mediaarray, action.payload];
    }
  },
  setAdjustments: (
    state: ImageState,
    action: PayloadAction<{ name: keyof Adjustments; value: number }>
  ) => {
    saveToHistory(state);
    const { name, value } = action.payload;
    state.adjustments[name] = value;
  },
  addBrushStroke: (state:ImageState, action: PayloadAction) => {
    saveToHistory(state)
    state.brushHistory = action.payload;
  },
  resetBrushHistory:(state:ImageState)=>{
    state.brushHistory =[]
  },
  undo: (state: ImageState) => {
    if (state.history.length === 0) return;
    const prev = state.history.pop()!;
    state.future.push({
      adjustments: { ...state.adjustments },
      selectedFilter: state.selectedFilter,
      brushHistory: [...state.brushHistory],
      result_image_url: state.result_image_url,
    });

    state.adjustments = prev.adjustments ?? state.adjustments;
    state.selectedFilter = prev.selectedFilter ?? state.selectedFilter;
    state.brushHistory = prev.brushHistory ?? state.brushHistory;
    state.result_image_url = prev.result_image_url ?? state.result_image_url;
  },
  redo: (state: ImageState) => {
    if (state.future.length === 0) return;
    const next = state.future.pop()!;
    state.history.push({
      adjustments: { ...state.adjustments },
      selectedFilter: state.selectedFilter,
      brushHistory: [...state.brushHistory],
      result_image_url: state.result_image_url,
    });

    state.adjustments = next.adjustments ?? state.adjustments;
    state.selectedFilter = next.selectedFilter ?? state.selectedFilter;
    state.brushHistory = next.brushHistory ?? state.brushHistory;
    state.result_image_url = next.result_image_url ?? state.result_image_url;
  },
  reverttoorginal: (state: ImageState) => {
    if (!state.orginal_image) return;
    state.result_image_url = state.orginal_image;
    state.imageforadjust = state.orginal_image;
    state.adjustments = defaultAdjustments;
    state.selectedFilter = "original";
    state.brushHistory = [];
    state.history = [];
    state.future = [];
  },
};

