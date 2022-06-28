import { createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { Signup } from "./pages/Signup";
import { getDesignTokens } from "./theme";

const rootElement = document.getElementById("root") as Element;
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Router>
      <ThemeProvider theme={createTheme(getDesignTokens("light"))}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline enableColorScheme />
        <Routes>
          <Route path={"/"} element={<Landing />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/signup"} element={<Signup />} />
          <Route path={"/Profile"} element={<Profile />} />
        </Routes>
      </ThemeProvider>
    </Router>
  </React.StrictMode>,
);
