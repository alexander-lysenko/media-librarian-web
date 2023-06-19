import { green, grey, orange, red } from "@mui/material/colors";

export const ratingColorByValue = (value: number | null, size: number) => {
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
