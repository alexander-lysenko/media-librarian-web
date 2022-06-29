import { Link, Typography } from "@mui/material";
import React from "react";

export const Copyright = (props: object) => {
  const date = new Date().getFullYear();

  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href="https://example.com/">
        Your Website
      </Link>
      {` ${date}.`}
    </Typography>
  );
};
