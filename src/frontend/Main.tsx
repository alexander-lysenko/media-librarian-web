import { createTheme, StyledEngineProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { App } from "./pages/App";
import { Landing } from "./pages/Landing";
import { Profile } from "./pages/Profile";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { useThemeStore } from "./store/useThemeStore";
import { getDesignTokens } from "./theme";
import { AppRoutes } from "./core/enums";

const rootElement = document.getElementById("root") as Element;
const root = createRoot(rootElement);

const Main: React.FC = () => {
  const colorMode = useThemeStore((state) => state.mode);

  return (
    <ThemeProvider theme={createTheme(getDesignTokens(colorMode))}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline enableColorScheme />
      <Router>
        <Routes>
          <Route path={"/"} element={<Landing />} />
          <Route path={AppRoutes.login} element={<SignIn />} />
          <Route path={AppRoutes.signup} element={<SignUp />} />
          <Route path={AppRoutes.appHome} element={<App />} />
          <Route path={AppRoutes.profile} element={<Profile />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

root.render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <Main />
    </StyledEngineProvider>
  </React.StrictMode>,
);
