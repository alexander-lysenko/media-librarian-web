import { StarBorderOutlined, StarOutlined } from "@mui/icons-material";
import { Box, Rating } from "@mui/material";
import { grey } from "@mui/material/colors";
import { memo, SyntheticEvent, useState } from "react";

import { ratingColorByValue } from "../../core";

type Props = {
  value: number | null;
  size: 5 | 10;
  name?: string;
  fontSize?: string;
  readOnly?: boolean;
  precision?: number;
  onChange?: (event: SyntheticEvent, value: number | null) => void;
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
        color: ratingColorByValue(value, size),
        "&:hover": { color: ratingColorByValue(hover, size) },
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
  const color = ratingColorByValue(value, size);

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
