import { Box, Grid2 as Grid, Slider, Stack, styled } from "@mui/material";
import { useState } from "react";
import Cropper from "react-easy-crop";

import type { Area, Point, Size } from "react-easy-crop";
import { ArrowDropDownOutlined, FlipOutlined, RotateLeft, RotateRight, ZoomIn, ZoomOut } from "../icons";

type Props = {
  cropSize: Size;
  height?: number;
};

/**
 * https://valentinh.github.io/react-easy-crop/
 * https://codesandbox.io/p/sandbox/xenodochial-tdd-53w20p2o3n?file=%2Fsrc%2Findex.js%3A10%2C1-21%2C4&from-embed
 * @constructor
 */
export const ImageCrop = (props: Props) => {
  const { cropSize } = props;
  const { height = cropSize.height + 32 } = props;

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);

  const onCropChange = (crop: Point) => {
    setCrop(crop);
  };

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    console.log(croppedAreaPixels.width / croppedAreaPixels.height);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  return (
    <Wrapper container spacing={0} className="crop-wrapper" height={height}>
      <CropContainer size={12} className="crop-container">
        <Cropper
          image="https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000"
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          showGrid={false}
          cropSize={{ width: 192, height: 192 }}
          onCropChange={onCropChange}
          onCropComplete={onCropComplete}
          onZoomChange={onZoomChange}
        />
      </CropContainer>
      <ControlsContainer size={12} className="crop-controls">
        <Stack spacing={2} direction="row" sx={{ alignItems: "center", width: "100%" }}>
          <ZoomOut />
          <Slider value={zoom} min={1} max={3} step={0.1} onChange={(e, zoom) => onZoomChange(zoom as number)} />
          <ZoomIn />
          <ArrowDropDownOutlined />
        </Stack>
        <Stack spacing={2} direction="row" sx={{ alignItems: "center", width: "100%" }}>
          <FlipOutlined transform="rotate(90)" />
          <FlipOutlined />
          <RotateLeft />
          <RotateRight />
        </Stack>
      </ControlsContainer>
    </Wrapper>
  );
};

const Wrapper = styled(Grid)({
  display: "flex",
  alignItems: "flex-start",
  alignContent: "space-between",
  flex: "1 0 auto",
});

const CropContainer = styled(Grid)({
  display: "flex",
  alignItems: "flex-start",
  position: "relative",
  height: "100%",
  width: "100%",
});

const CropArea = styled(Box)({
  // position: "absolute",
  // top: 0,
  // bottom: 0,
  // left: 0,
  // right: 0,
});

const ControlsContainer = styled(Grid)({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
});
