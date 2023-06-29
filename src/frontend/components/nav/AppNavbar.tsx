import { MenuOutlined } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  styled,
  Toolbar,
  Typography,
  useScrollTrigger,
} from "@mui/material";
import { cloneElement, Fragment, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { AppRoutes } from "../../core/enums";
import { NavbarProfiler } from "./NavbarProfiler";
import { NotificationsPopover } from "./NotificationsPopover";

interface Props {
  children?: ReactElement;
}

type NavRoute = {
  name: string;
  route: AppRoutes;
  isHeading?: boolean;
};

type DrawerProps = {
  open: boolean;
  onDrawerToggle: () => void;
  navRoutes: NavRoute[];
};

export const AppNavbar = () => {
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const handleDrawerToggle = () => {
    setDrawerOpen((prevState) => !prevState);
  };

  const navRoutes: NavRoute[] = [
    { name: "MUI", route: AppRoutes.appHome, isHeading: true },
    { name: "Login", route: AppRoutes.login },
    { name: "Sign Up", route: AppRoutes.signup },
    { name: "Profile", route: AppRoutes.profile },
  ];

  return (
    <>
      <ElevationScroll>
        <AppBar position="fixed" sx={{ mb: 3 }}>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Box sx={{ flexGrow: 1, display: { xs: "flex", sm: "none" } }}>
                <IconButton size="large" onClick={handleDrawerToggle} color="inherit">
                  <MenuOutlined />
                </IconButton>
              </Box>
              <Box sx={{ flexGrow: 1, display: { xs: "none", sm: "flex" } }}>
                {navRoutes.map((item: NavRoute) => (
                  <Button key={item.name} color="inherit" component={Link} to={item.route}>
                    {item.isHeading ? <Typography variant="h6">MUI</Typography> : item.name}
                  </Button>
                ))}
              </Box>
              <NotificationsPopover />
              <NavbarProfiler />
            </Toolbar>
          </Container>
        </AppBar>
      </ElevationScroll>
      <NavDrawer open={drawerOpen} onDrawerToggle={handleDrawerToggle} navRoutes={navRoutes} />
      <Toolbar sx={{ mb: 2 }} />
    </>
  );
};

const ElevationScroll = (props: Props) => {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return cloneElement(children as ReactElement, {
    elevation: trigger ? 4 : 0,
  });
};

const NavDrawer = ({ open, onDrawerToggle, navRoutes }: DrawerProps) => {
  return (
    <Box component="nav">
      <DrawerStyled
        open={open}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true /* Better open performance on mobile. */ }}
        sx={{ display: { xs: "block", sm: "none" } }}
      >
        <List disablePadding>
          {navRoutes.map((item: NavRoute) => (
            <Fragment key={item.name}>
              <ListItem disablePadding>
                <ListItemButton sx={{ textAlign: "center" }} component={Link} to={item.route} onClick={onDrawerToggle}>
                  {item.isHeading ? (
                    <ListItemText primary={item.name} primaryTypographyProps={{ variant: "h6" }} />
                  ) : (
                    <ListItemText primary={item.name} />
                  )}
                </ListItemButton>
              </ListItem>
              {item.isHeading && <Divider />}
            </Fragment>
          ))}
        </List>
      </DrawerStyled>
    </Box>
  );
};

const DrawerStyled = styled(Drawer)({
  "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
});
