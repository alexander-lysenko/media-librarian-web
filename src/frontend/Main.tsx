import { createTheme, CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { GlobalSnackbar } from "./components";
import { ConfirmDialog } from "./components/modals";
import { AppRoutes } from "./core/enums";
import { App } from "./pages/App";
import { EmailConfirmation } from "./pages/EmailConfirmation";
import { Landing } from "./pages/Landing";
import { PasswordReset } from "./pages/PasswordReset";
import { Profile } from "./pages/Profile";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { useThemeStore } from "./store/system/useThemeStore";
import { useLanguageStore, useTranslationStore } from "./store/system/useTranslationStore";
import { useAuthCredentialsStore } from "./store/useAuthCredentialsStore";
import { getDesignTokens } from "./theme";

import type { ErrorResponse } from "./core/types";

const debug = import.meta.env.VITE_APP_DEBUG;

const i18n = useTranslationStore.getState().i18nInstance;
const getLanguage = useLanguageStore.getState().getLanguage;

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ErrorResponse;
  }
}

// init i18n (needs to be bundled ;))
i18n.init({ lng: getLanguage(), debug }).then(() => null);
// init dayjs
dayjs.extend(localizedFormat, {});

const rootElement = document.getElementById("root") as Element;
const root = createRoot(rootElement);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

export const Main = () => {
  const colorMode = useThemeStore((state) => state.mode);
  // @ts-ignore // todo: remove this
  window.useCredentialsStore = useAuthCredentialsStore((state) => state);

  return (
    <ThemeProvider noSsr theme={createTheme(getDesignTokens(colorMode))}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline enableColorScheme />

      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path={"/"} element={<Landing />} />
            <Route path={AppRoutes.login} element={<SignIn />} />
            <Route path={AppRoutes.signup} element={<SignUp />} />
            <Route path={AppRoutes.appHome} element={<App />} />
            <Route path={AppRoutes.profile} element={<Profile />} />
            <Route path={AppRoutes.passwordReset} element={<PasswordReset />} />
            <Route path={AppRoutes.emailConfirmation} element={<EmailConfirmation />} />
          </Routes>
        </Router>
        <GlobalSnackbar />
        <ConfirmDialog />
      </QueryClientProvider>
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
