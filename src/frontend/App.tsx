import { createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Landing } from "./pages/Landing";
import { Profile } from "./pages/Profile";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { getDesignTokens } from "./theme";
import { TranslationProvider } from "./hooks/useTranslation";

const rootElement = document.getElementById("root") as Element;
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={createTheme(getDesignTokens("light"))}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline enableColorScheme />
      <TranslationProvider value={"en"}>
        <Router>
          <Routes>
            <Route path={"/"} element={<Landing />} />
            <Route path={"/login"} element={<SignIn />} />
            <Route path={"/signup"} element={<SignUp />} />
            <Route path={"/profile"} element={<Profile />} />
          </Routes>
        </Router>
      </TranslationProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
