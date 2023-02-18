import { Box, Container, Paper } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { AppNavbar } from "../components/AppNavbar";
import { AppRoutes } from "../core";

export const Profile = () => {
  return (
    <>
      <AppNavbar />
      <Container>
        <Paper elevation={1} sx={{ px: { xs: 3, md: 6 } }}>
          <Link to={"/"}>Home</Link>
          <Link to={AppRoutes.appHome}>App</Link>
          <Link to={AppRoutes.login}>Login</Link>
          <Link to={AppRoutes.signup}>Sign Up</Link>
          <Link to={AppRoutes.profile}>Profile</Link>
        </Paper>
      </Container>
      {/*</Box>*/}
    </>
  );
};
