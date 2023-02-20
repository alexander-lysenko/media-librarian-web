import { SvgIconComponent } from "@mui/icons-material";
import { Divider, Grid, Icon, SxProps, Typography } from "@mui/material";
import React, { ReactNode } from "react";

type Props = {
  title: string | ReactNode;
  secondaryText?: string | ReactNode;
  icon?: SvgIconComponent;
  action?: ReactNode;
  spacing?: number;
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
 * @param {SvgIconComponent | null} icon
 * @param {ReactNode | null} action
 * @param {number | null} spacing
 * @param {SxProps | null} sx
 * @constructor
 */
export const PaperCardHeader = ({ title, secondaryText, icon, action, spacing, sx }: Props) => {
  const defaultSx: SxProps = { py: 1, px: 3 };
  const mergedSx: SxProps = { ...defaultSx, ...sx };

  return (
    <>
      <Grid container rowSpacing={0} columnSpacing={spacing ?? 2} alignItems="center" wrap="nowrap" sx={mergedSx}>
        {icon && (
          <Grid item sx={{ lineHeight: 0 }}>
            <Icon component={icon} />
          </Grid>
        )}
        <Grid container item xs zeroMinWidth columnSpacing={2} alignItems="center">
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
        {action && <Grid item>{action}</Grid>}
      </Grid>
      <Divider />
    </>
  );
};
