import { createTheme, StyledEngineProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { ConfirmDialog } from "./components/modals";
import { GlobalSnackbar } from "./components/ui/GlobalSnackbar";
import { AppRoutes } from "./core/enums";
import { App } from "./pages/App";
import { Landing } from "./pages/Landing";
import { Profile } from "./pages/Profile";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { useAuthCredentialsStore } from "./store/useAuthCredentialsStore";
import { useThemeStore } from "./store/useThemeStore";
import { useLanguageStore, useTranslationStore } from "./store/useTranslationStore";
import { getDesignTokens } from "./theme";

const debug = import.meta.env.VITE_APP_DEBUG;

const i18n = useTranslationStore.getState().i18nInstance;
const getLanguage = useLanguageStore.getState().getLanguage;

// init i18n (needs to be bundled ;))
i18n.init({ lng: getLanguage(), debug }).then(() => null);
// init dayjs
dayjs.extend(localizedFormat, {});

const rootElement = document.getElementById("root") as Element;
const root = createRoot(rootElement);

export const Main = () => {
  const colorMode = useThemeStore((state) => state.mode);
  // @ts-ignore
  window.useCredentialsStore = useAuthCredentialsStore((state) => state);

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
      <GlobalSnackbar />
      <ConfirmDialog />
    </ThemeProvider>
  );
};

root.render(
  <StrictMode>
    <StyledEngineProvider injectFirst>
      <Main />
    </StyledEngineProvider>
  </StrictMode>,
);
