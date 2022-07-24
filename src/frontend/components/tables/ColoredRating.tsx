import { Rating } from "@mui/material";
import { green, orange, red } from "@mui/material/colors";
import React from "react";

type Props = {
  value: number;
  size: 5 | 10;
};

const colorByValue = (value: Props["value"], size: Props["size"]) => {
  const ratio = value / size;
  switch (true) {
    case ratio < 0.5:
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
export const ColoredRating = ({ value, size = 10 }: Props) => {
  const [hover, setHover] = React.useState(-1);
  return (
    <Rating
      sx={{ color: colorByValue(value, size), "&:hover": { color: colorByValue(hover, size) } }}
      max={size}
      value={value}
      size={"small"}
      onChangeActive={(event, newHover) => {
        event.preventDefault();
        setHover(newHover);
      }}
    />
  );
};
