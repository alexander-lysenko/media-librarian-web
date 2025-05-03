import { createTheme, CssBaseline, StyledEngineProvider, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { ConfirmDialog, GlobalSnackbar } from "./components";
import { routeTree } from "./routeTree.gen";
import { useThemeStore } from "./store/system/useThemeStore";
import { useLanguageStore, useTranslationStore } from "./store/system/useTranslationStore";
import { useAuthCredentialsStore } from "./store/useAuthCredentialsStore";
import { getDesignTokens } from "./theme";

import type { ErrorResponse } from "./core/types";
import { initReactI18next } from "react-i18next";

const debug = import.meta.env.VITE_APP_DEBUG;

const i18n = useTranslationStore.getState().i18nInstance;
const getLanguage = useLanguageStore.getState().getLanguage;

// init i18n (needs to be bundled ;))
i18n
  .use(initReactI18next)
  .init({
    lng: getLanguage(),
    returnNull: false,
    debug: debug,
  })
  .then(() => null);
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

// Create a new router instance
const router = createRouter({ routeTree });

export const Main = () => {
  const colorMode = useThemeStore((state) => state.mode);
  // @ts-ignore // todo: remove this
  window.useCredentialsStore = useAuthCredentialsStore((state) => state);

  return (
    <ThemeProvider noSsr theme={createTheme(getDesignTokens(colorMode))}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline enableColorScheme />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} context={queryClient} />
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

declare module "@tanstack/react-query" {
  // noinspection JSUnusedGlobalSymbols
  interface Register {
    defaultError: ErrorResponse;
  }
}

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  // noinspection JSUnusedGlobalSymbols
  interface Register {
    router: typeof router;
  }
}
