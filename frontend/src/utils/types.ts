export interface Adjustments {
  brightness: number;
  contrast: number;
  saturation: number;
  red: number;
  green: number;
  blue: number;
  sharpenAmount: number;
  highlights: number;
  shadows: number;
  exposure: number;
}
interface LineData {
  points: number[];
  brushSize: number;
}

export interface ImageState {
  prompt: string;
  style: string;
  edit_prompt: string;
  input_image_url: string;
  result_image_url: string;
  orginal_image: string;
  imageforadjust: string;
  brushmark_url: string;
  analyze_result: string;
  activeTool: string | null;
  isutocut: boolean;
  loading: boolean;
  error: string | null;
  imagedimensions: { width: number; height: number };
  mediaarray:string[];
  adjustments: Adjustments;
  selectedFilter: string;
  brushHistory: LineData[];

  history: Partial<ImageState>[];
  future: Partial<ImageState>[];
}
