import {  createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8000";

interface ImageArgs {
  prompt: string;
  style?: string;
  input_image_url?: string;
  brushmark_url?: string;
  edit_prompt: string;
}

// generateImage
export const generateImage = createAsyncThunk<string, ImageArgs>(
  "image/generate",
  async ({ prompt, style }) => {
    const response = await axios.post(`${BASE_URL}/media_gallery`, {
      prompt: prompt + (style !== "None" ? `, ${style}` : ""),
      input_image_url: null,
      brushmark_url: null,
      edit_prompt: null,
    });
    return response.data.result_url as string;
  }
);

// editImage
export const editImage = createAsyncThunk<string, ImageArgs>(
  "image/edit",
  async ({ input_image_url, brushmark_url, edit_prompt }) => {
    console.log(
      input_image_url,
      brushmark_url,
      edit_prompt,
      "we are in edit image part"
    );
    const response = await axios.post(`${BASE_URL}/media_gallery`, {
      prompt: "edit",
      input_image_url: input_image_url,
      brushmark_url: brushmark_url,
      edit_prompt: edit_prompt,
    });
    console.log(response)
    return response.data.result_url as string;
  }
);

// eraseImage
export const eraseImage = createAsyncThunk<string, ImageArgs>(
  "image/erase",
  async ({ input_image_url, brushmark_url }) => {
    console.log("Erasing image with URL:", input_image_url, brushmark_url);
    const response = await axios.post(`${BASE_URL}/media_gallery`, {
      prompt: "erase",
      input_image_url: input_image_url,
      brushmark_url: brushmark_url,
      edit_prompt: null,
    });
    return response.data.result_url as string;
  }
);

// upscaleImage
export const upscaleImage = createAsyncThunk<string, string>(
  "image/upscale",
  async (image_url) => {
    const response = await axios.post(`${BASE_URL}/media_gallery`, {
      prompt: "upscale",
      input_image_url: image_url,
      brushmark_url: null,
      edit_prompt: null,
    });
    return response.data.result_url as string;
  }
);

// extendImage
export const extendImage = createAsyncThunk<string, string>(
  "image/extend",
  async (image_url) => {
    const response = await axios.post(`${BASE_URL}/media_gallery`, {
      image_url,
    });
    return response.data.result_url as string;
  }
);

// analyzeImage
export const analyzeImage = createAsyncThunk<string, string>(
  "image/analyze",
  async (image_url) => {
    console.log("image url received ", image_url)
    const response = await axios.post(`${BASE_URL}/media_gallery`, {
      prompt: "analyze",
      input_image_url: image_url,
      brushmark_url: null,
      edit_prompt: null,
    });
    console.log(response.data.analyze_result);
    return response.data.analyze_result as string;
  }
);

export const removebackground = createAsyncThunk<string, string>(
  "image/removebackground",
  async (image_url) => {
    console.log("image url received ", image_url);
    const response = await axios.post(`${BASE_URL}/media_gallery`, {
      prompt: "remove_background",
      input_image_url: image_url,
      brushmark_url: null,
      edit_prompt: null,
    });
    
    return response.data.result_url as string;
  }
);