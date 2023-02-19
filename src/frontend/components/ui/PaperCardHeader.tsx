import { Box, Divider, Grid, Icon, SxProps, Typography } from "@mui/material";
import React from "react";
import { ReactNode } from "react";
import { MenuOutlined, SvgIconComponent } from "@mui/icons-material";

type Props = {
  sx?: SxProps;
  title: ReactNode;
  icon?: SvgIconComponent;
  action?: ReactNode;
  secondaryText?: ReactNode;
};

/**
 * todo: add docs
 * @param sx
 * @param title
 * @param icon
 * @param secondaryText
 * @param action
 * @constructor
 */
export const PaperCardHeader = ({ sx, title, icon, secondaryText, action }: Props) => {
  return (
    <>
      <Grid container spacing={1} sx={{ px: 3 }}>
        <Grid item spacing={2}>
          {icon && <Icon component={icon} />}
        </Grid>
        <Grid item spacing={2} xs sx={{ alignItems: "baseline" }}>
          <Typography>{title}</Typography>
        </Grid>
        <Grid item spacing={2}>
          {secondaryText && <Typography>{secondaryText}</Typography>}
        </Grid>
        <Grid item spacing={2}>
          {action}
        </Grid>
      </Grid>
      <Divider />
    </>
  );
};
