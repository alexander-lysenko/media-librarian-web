import { createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Landing } from "./pages/Landing";
import { SignIn } from "./pages/SignIn";
import { Profile } from "./pages/Profile";
import { SignUp } from "./pages/SignUp";
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
          <Route path={"/login"} element={<SignIn />} />
          <Route path={"/signup"} element={<SignUp />} />
          <Route path={"/Profile"} element={<Profile />} />
        </Routes>
      </ThemeProvider>
    </Router>
  </React.StrictMode>,
);
