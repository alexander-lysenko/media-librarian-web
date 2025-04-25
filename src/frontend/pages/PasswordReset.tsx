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

  const getImageRequest = useUnsplashImageRequest();
  const [backgroundImage, setBackgroundImage] = useState<string>("url()");

  useLayoutEffect(() => {
    getImageRequest.setResponseEvents({
      onSuccess: (response) => {
        setBackgroundImage(`url(${response.image.urlRegular})`);
      },
    });
    getImageRequest.setPathParams({ id: "o_tcYADlSt8" });
    void getImageRequest.fetch();

    return () => getImageRequest.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
