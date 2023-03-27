import { SvgIconComponent } from "@mui/icons-material";
import {
  Divider,
  Grid,
  Icon,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  SxProps,
  Typography,
} from "@mui/material";
import { IconButtonProps } from "@mui/material/IconButton/IconButton";
import React, { ReactNode } from "react";

type Props = {
  title: string | ReactNode;
  secondaryText?: string | ReactNode;
  itemIcon?: SvgIconComponent;
  actionIcon?: SvgIconComponent;
  actionEvents?: IconButtonProps;
  sx?: SxProps;
};

/**
 * Custom Card Header component which looks more like a Bootstrap Card header. Designed to use inside Paper
 * The following items be added optionally:
 * - An icon - to the left edge
 * - A button (action) - to the right edge. The action may control a state externally
 * - A secondary text - next to the primary text (aligned right)
 * @param {string | ReactNode } title
 * @param {string | ReactNode | null} secondaryText
 * @param {SvgIconComponent | null} itemIcon
 * @param {SvgIconComponent | null} actionIcon
 * @param {IconButtonProps | null} actionEvents
 * @param {SxProps | null} sx
 * @constructor
 */
export const PaperCardHeader = ({ title, secondaryText, itemIcon, actionIcon, actionEvents, sx }: Props) => {
  return (
    <ListItem component="div" dense divider>
      {itemIcon && <ListItemIcon children={<Icon component={itemIcon} />} />}
      <ListItemText>
        <Grid container columnSpacing={2} alignItems="center">
          <Grid item xs={12} sm>
            <Typography variant="button" noWrap paragraph sx={{ mb: 0 }}>
              {title}
            </Typography>
          </Grid>
          {secondaryText && (
            <Grid item zeroMinWidth xs={12} sm>
              <Typography
                variant="caption"
                noWrap
                paragraph
                sx={{ mb: 0, textAlign: { xs: "left", sm: "right" } }}
                color={(theme) => theme.palette.text.secondary}
                children={secondaryText}
              />
            </Grid>
          )}
        </Grid>
      </ListItemText>
      {actionIcon && (
        <IconButton size="small" {...actionEvents}>
          <Icon component={actionIcon} />
        </IconButton>
      )}
    </ListItem>
  );
};
