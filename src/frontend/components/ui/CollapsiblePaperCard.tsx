import { Box, Grid, Icon, IconButton, ListItem, ListItemIcon, ListItemText, Paper, Typography } from '@mui/material';
import { useState } from 'react';

import { ArrowDropDownOutlined, ArrowDropUpOutlined } from '../icons';

import type { SvgIconComponent } from '@mui/icons-material';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
  secondaryText?: string;
  itemIcon?: SvgIconComponent;
  open?: boolean;
}

/**
 * A collapsible card with a heading bar and customizable content.
 */
export const CollapsiblePaperCard = (props: Props) => {
  const { title, secondaryText, open = true, itemIcon } = props;
  const [isOpen, setOpen] = useState<boolean>(open);

  return (
    <Paper elevation={3} sx={{ my: 3 }}>
      <ListItem component='div' dense divider>
        {itemIcon && <ListItemIcon children={<Icon component={itemIcon} />} />}
        <ListItemText>
          <Grid container columnSpacing={2} alignItems='center'>
            <Grid size={{ xs: 12, sm: 'auto' }}>
              <Typography variant='button' noWrap component='p' sx={{ mb: 0 }}>
                {title}
              </Typography>
            </Grid>
            {secondaryText && (
              <Grid size={{ xs: 12, sm: 'grow' }}>
                <Typography
                  variant='caption'
                  component='p'
                  noWrap
                  sx={{ mb: 0, textAlign: { xs: 'left', sm: 'right' } }}
                  color='textSecondary'
                  children={secondaryText}
                />
              </Grid>
            )}
          </Grid>
        </ListItemText>
        <IconButton size='small' onClick={() => setOpen(!isOpen)}>
          <Icon component={isOpen ? ArrowDropUpOutlined : ArrowDropDownOutlined} />
        </IconButton>
      </ListItem>
      <Box display={isOpen ? 'block' : 'none'}>{props.children}</Box>
    </Paper>
  );
};
