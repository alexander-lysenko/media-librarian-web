/**
 * Represents the dimensions of a crop region with width and height properties.
 *
 * This interface is used to define the size of a cropped area, typically in pixels
 * or another unit of measurement relevant to the use case.
 */
export interface CropSize {
  width: number;
  height: number;
}

/**
 * Represents a rectangular area to be cropped from an image or a canvas.
 *
 * This interface defines the properties necessary to specify a crop area with dimensions and positioning.
 * The `width` and `height` determine the size of the area,
 * while `x` and `y` specify the top-left corner position relative to the source.
 */
export interface CropArea {
  width: number;
  height: number;
  x: number;
  y: number;
}

/**
 * Represents the flipping configuration for a cropping operation.
 * This interface provides two properties to indicate whether
 * the crop should be flipped horizontally or vertically.
 */
export interface CropFlip {
  horizontal: boolean;
  vertical: boolean;
}

/**
 * Represents the parameters required for cropping an image.
 *
 * This interface defines the properties necessary to configure an image crop,
 * including area, rotation, and flipping options.
 */
export interface CropParams {
  area: CropArea;
  rotation: number;
  flip: CropFlip;
}
