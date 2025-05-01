import { Box, styled } from "@mui/material";
import { useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PasswordResetDialog } from "../components/modals/PasswordResetDialog";
import { AppRoutes } from "../core/enums";
import { useUnsplashImageRequest } from "../requests/unsplashApiRequests";

import type { CSSProperties } from "react";

export const PasswordReset = () => {
  const navigate = useNavigate();
  const handleResetDialogClose = () => {
    navigate(AppRoutes.login);
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
};

const FullscreenContainer = styled(Box)(({ theme }) => ({
  height: "100vh",
  width: "100vw",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  [theme.breakpoints.up("sm")]: {
    backgroundImage: "var(--var-background-image)",
  },
}));
