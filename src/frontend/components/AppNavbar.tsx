import { AppBar, Badge, Box, Button, Container, IconButton, styled, Toolbar, useScrollTrigger } from "@mui/material";
import React, { cloneElement, ReactElement } from "react";

import { NavbarProfiler } from "./NavbarProfiler";
import { Link } from "react-router-dom";
import { AppRoutes } from "../core";
import { MenuOutlined, NotificationsOutlined } from "@mui/icons-material";

interface Props {
  children?: ReactElement;
}

function ElevationScroll(props: Props) {
  const { children } = props;
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0
  });

  return cloneElement(children as ReactElement, {
    elevation: trigger ? 4 : 0
  });
}

export const AppNavbar = () => {
  return (
    <>
      <ElevationScroll>
        <AppBar position="fixed" sx={{ mb: 2 }}>
          <Container maxWidth="xl">
            <Toolbar>
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  onClick={() => ({})}
                  color="inherit"
                >
                  <MenuOutlined />
                </IconButton>
              </Box>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                <Button variant={"text"} component={Link} to={AppRoutes.appHome}>
                  {"MUI"}
                </Button>
                <Link to={AppRoutes.login}>Login</Link>
                <Link to={AppRoutes.signup}>Sign Up</Link>
                <Link to={AppRoutes.profile}>Profile</Link>
                {"MUI"}
              </Box>
              <IconButton size="large" aria-label="show 17 new notifications" color="inherit">
                <Badge badgeContent={1024} color="error">
                  <NotificationsOutlined />
                </Badge>
              </IconButton>
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
