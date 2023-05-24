import { StarBorderOutlined, StarOutlined } from "@mui/icons-material";
import { Box, Rating } from "@mui/material";
import { green, grey, orange, red } from "@mui/material/colors";
import { SxProps } from "@mui/system";
import React, { memo, useState } from "react";

type Props = {
  value: number | null;
  size: 5 | 10;
  name?: string;
  fontSize?: string;
  readOnly?: boolean;
  precision?: number;
  onChange?: (event: React.SyntheticEvent, value: number | null) => void;
};

const colorByValue = (value: Props["value"], size: Props["size"]) => {
  const ratio = (value as number) / size;
  switch (true) {
    case ratio <= 0:
      return grey.A200;
    case ratio > 0 && ratio < 0.5:
      return red.A200;
    case ratio >= 0.9:
      return green.A400;
    default:
      return orange.A200;
  }
};

/**
 * Overridden Rating component to display value-dependent color on hover and select
 */
export const ColoredRating = memo(({ size = 10, name, value, readOnly, precision, onChange }: Props) => {
  const [hover, setHover] = useState(-1);

  return (
    <Rating
      sx={{
        display: "flex",
        color: colorByValue(value, size),
        "&:hover": { color: colorByValue(hover, size) },
      }}
      max={size}
      name={name}
      value={value}
      size={"small"}
      readOnly={readOnly}
      precision={precision}
      onChange={onChange}
      onChangeActive={(event, newHover) => {
        event.preventDefault();
        setHover(newHover);
      }}
    />
  );
});

export const ColoredRatingCustom = memo(({ size = 10, name, value, precision, fontSize }: Props) => {
  const color = colorByValue(value, size);

  return (
    <Box component="span" flexWrap="nowrap" sx={{ display: "inline-flex", fontSize: fontSize, lineHeight: 0.675 }}>
      {[...Array(size)].map((item, index) => {
        return (
          <Box component="span" key={index} sx={{ position: "relative" }}>
            <Box component="span" sx={{ position: "absolute", left: 0, top: 0, overflow: "hidden" }} width={"100%"}>
              <StarOutlined fontSize={"inherit"} sx={{ color }} />
            </Box>
            <Box component="span" sx={{ display: "inline-flex" }}>
              <StarBorderOutlined fontSize={"inherit"} sx={{ color: grey.A400 }} />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
});
