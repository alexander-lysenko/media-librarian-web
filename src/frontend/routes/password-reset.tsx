import { Box, styled } from "@mui/material";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLayoutEffect, useState } from "react";

import { PasswordResetDialog } from "../components/modals/PasswordResetDialog";
import { AppRoutes } from "../core/enums";
import { useUnsplashImageRequest } from "../requests/unsplashApiRequests";

import type { CSSProperties } from "react";

export const Route = createFileRoute(AppRoutes.passwordReset)({
  component: PasswordReset,
});

/**
 * Renders the PasswordReset component, which includes a password reset dialog
 * and a full-screen container with a dynamic background image fetched from Unsplash.
 * The component navigates to a login route upon closure of the reset dialog.
 */
function PasswordReset() {
  const navigate = useNavigate();
  const handleResetDialogClose = () => {
    void navigate({ href: AppRoutes.login });
  };

  const getImageRequest = useUnsplashImageRequest("o_tcYADlSt8");
  const [backgroundImage, setBackgroundImage] = useState<string>("url()");

  useLayoutEffect(() => {
    if (getImageRequest.status === "success") {
      setBackgroundImage(`url(${getImageRequest.data.image.urlRegular})`);
    }
  }, [getImageRequest.data?.image.urlRegular, getImageRequest.status]);

  if (getImageRequest.status === "pending") {
    return <FullscreenContainer />;
  }

  return (
    <FullscreenContainer style={{ "--var-background-image": backgroundImage } as CSSProperties}>
      <PasswordResetDialog open={true} onClose={handleResetDialogClose} />
    </FullscreenContainer>
  );
}

const FullscreenContainer = styled(Box)(({ theme }) => ({
  height: "100vh",
  width: "100vw",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  [theme.breakpoints.up("sm")]: {
    backgroundImage: "var(--var-background-image)",
  },
}));
