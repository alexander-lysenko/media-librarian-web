import { Grid2 as Grid, Icon, IconButton, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";

import type { SvgIconComponent } from "@mui/icons-material";
import type { IconButtonProps } from "@mui/material";
import type { ReactNode } from "react";

type Props = {
  title: string | ReactNode;
  secondaryText?: string | ReactNode;
  itemIcon?: SvgIconComponent;
  actionIcon?: SvgIconComponent;
  actionEvents?: IconButtonProps;
};

/**
 * Custom Card Header component which looks more like a Bootstrap Card header.
 * Designed to use inside the Paper component.
 * @param title - Primary text on card header
 *
 * The following items be added optionally:
 * @param secondaryText - a text next to the primary text (aligned right)
 * @param itemIcon - an icon to the left edge
 * @param actionIcon - an icon to the button on the right edge
 * @param actionEvents - props and events to the button on the right edge, the events may control its state externally
 */
export const PaperCardHeader = ({ title, secondaryText, itemIcon, actionIcon, actionEvents }: Props) => {
  return (
    <ListItem component="div" dense divider>
      {itemIcon && <ListItemIcon children={<Icon component={itemIcon} />} />}
      <ListItemText>
        <Grid container columnSpacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: "auto" }}>
            <Typography variant="button" noWrap component="p" sx={{ mb: 0 }}>
              {title}
            </Typography>
          </Grid>
          {secondaryText && (
            <Grid size={{ xs: 12, sm: "grow" }}>
              <Typography
                variant="caption"
                component="p"
                noWrap
                sx={{ mb: 0, textAlign: { xs: "left", sm: "right" } }}
                color="textSecondary"
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
