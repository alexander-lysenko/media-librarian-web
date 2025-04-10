import { Box, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { PasswordResetDialog } from "../components/modals/PasswordResetDialog";
import { AppRoutes } from "../core/enums";

export const PasswordReset = () => {
  const navigate = useNavigate();
  const handleResetDialogClose = () => {
    navigate(AppRoutes.login);
  };

  return (
    <FullscreenContainer
      sx={{
        backgroundImage:
          "url(https://avatars.mds.yandex.net/i?id=b3c744c3fe134975f44f320f95f7608e_l-5255574-images-thumbs&n=13)",
      }}
    >
      <PasswordResetDialog open={true} onClose={handleResetDialogClose} />
    </FullscreenContainer>
  );
};

const FullscreenContainer = styled(Box)({
  height: "100vh",
  width: "100vw",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
});
