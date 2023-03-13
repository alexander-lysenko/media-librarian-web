import { MenuOutlined, NotificationsOutlined } from "@mui/icons-material";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  IconButton,
  styled,
  Toolbar,
  Tooltip,
  useScrollTrigger,
} from "@mui/material";
import React, { cloneElement, ReactElement } from "react";
import { Link } from "react-router-dom";

import { AppRoutes } from "../../core/enums";
import { useTranslation } from "../../hooks/useTranslation";
import { NavbarProfiler } from "./NavbarProfiler";

interface Props {
  children?: ReactElement;
}

function ElevationScroll(props: Props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return cloneElement(children as ReactElement, {
    elevation: trigger ? 4 : 0,
  });
}

export const AppNavbar = () => {
  const { t } = useTranslation();

  return (
    <>
      <ElevationScroll>
        <AppBar position="fixed" sx={{ mb: 3 }}>
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton size="large" onClick={() => ({})} color="inherit">
                  <MenuOutlined />
                </IconButton>
              </Box>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                <Button variant="text" color="inherit" component={Link} to={AppRoutes.appHome}>
                  {"MUI"}
                </Button>
                <Button variant="text" color="inherit" component={Link} to={AppRoutes.login}>
                  {"Login"}
                </Button>
                <Button variant="text" color="inherit" component={Link} to={AppRoutes.signup}>
                  {"Sign Up"}
                </Button>
                <Button variant="text" color="inherit" component={Link} to={AppRoutes.profile}>
                  {"Profile"}
                </Button>
              </Box>
              <Tooltip title={t("app.unreadNotifications", { n: 1024 })}>
                <IconButton size="large" color="inherit">
                  <Badge badgeContent={1024} color="error">
                    <NotificationsOutlined />
                  </Badge>
                </IconButton>
              </Tooltip>
              <NavbarProfiler />
            </Toolbar>
          </Container>
        </AppBar>
      </ElevationScroll>
      <Toolbar sx={{ mb: 2 }} />
    </>
  );
};

const NavLink = styled(Button)``;
