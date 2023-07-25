import { Link, Typography } from "@mui/material";

/**
 * Simple Copyright component
 * @param props
 * @constructor
 */
export const Copyright = (props: object) => {
  const date = new Date().getFullYear();
  const appName = import.meta.env.VITE_APP_NAME;
  const appUrl = import.meta.env.VITE_APP_URL;

  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {"Copyright © "}
      <Link color="inherit" href={appUrl} children={appName} />
      {` ${date}.`}
    </Typography>
  );
};
