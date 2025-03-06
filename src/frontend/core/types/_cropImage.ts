export type CropArea = {
  width: number;
  height: number;
  x: number;
  y: number;
};

export type CropFlip = {
  horizontal: boolean;
  vertical: boolean;
};

export type CropParams = {
  area: CropArea;
  rotation: number;
  flip: CropFlip;
};
