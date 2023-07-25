import { Star, StarBorder, StarHalf } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { memo, ReactElement } from "react";

import { ratingColorByValue } from "../../core";

type RatingProps = {
  size: 5 | 10;
  value: number;
};

export const PrintRating = memo(({ size, value }: RatingProps) => {
  const stars: ReactElement[] = [];
  const color = ratingColorByValue(value, size);

  new Array(size).fill(0).forEach((_, index) => {
    switch (true) {
      case value >= index + 1:
        stars.push(<Star key={index} fontSize="small" sx={{ color }} />);
        break;
      case value % 1 > 0 && value > index && value < index + 1:
        stars.push(<StarHalf key={index} fontSize="small" sx={{ color }} />);
        break;
      default:
        stars.push(<StarBorder key={index} fontSize="small" color={"disabled"} />);
        break;
    }
  });

  return stars.concat() as unknown as ReactElement;
  return (
    <Typography variant="body2" lineHeight={0} noWrap color={color}>
      {stars.concat()}
    </Typography>
  );
});
