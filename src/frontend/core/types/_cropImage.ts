export interface CropSize {
  width: number;
  height: number;
}

export interface CropArea {
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface CropFlip {
  horizontal: boolean;
  vertical: boolean;
}

export interface CropParams {
  area: CropArea;
  rotation: number;
  flip: CropFlip;
}
