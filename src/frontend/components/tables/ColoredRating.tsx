import { Rating } from "@mui/material";
import { green, orange, red } from "@mui/material/colors";
import React, { memo, useState } from "react";

type Props = {
  value: number | null;
  size: 5 | 10;
  name?: string;
  readOnly?: boolean;
  precision?: number;
  onChange?: (event: React.SyntheticEvent, value: number | null) => void;
};

const colorByValue = (value: Props["value"], size: Props["size"]) => {
  const ratio = (value as number) / size;
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
export const ColoredRating = memo(({ size = 10, name, value, readOnly, precision, onChange }: Props) => {
  const [hover, setHover] = useState(-1);

  return (
    <Rating
      sx={{ color: colorByValue(value, size), "&:hover": { color: colorByValue(hover, size) } }}
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
