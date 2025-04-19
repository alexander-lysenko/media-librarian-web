import { Button, Fade, Grid2 as Grid, styled, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import type { CSSProperties } from "react";

type Props = {
  backgroundInfo?: {
    linkHtml: string;
    urlFull: string;
    urlRegular: string;
    urlSmall: string;
    author: string;
  };
};

/**
 * The component can be used as a Container with background-image taken randomly from Unsplash.
 */
export const BackgroundContainer = ({ backgroundInfo }: Props) => {
  const { t } = useTranslation();

  const cssVariables = {
    "--background-image-xl": `url(${backgroundInfo?.urlFull ?? ""})`,
    "--background-image-md": `url(${backgroundInfo?.urlRegular ?? ""})`,
    "--background-image-sm": `url(${backgroundInfo?.urlSmall ?? ""})`,
  };

  return (
    <Fade in timeout={150}>
      <Background size={{ xs: false, sm: 4, md: 7, xl: 8 }} style={cssVariables as CSSProperties}>
        {backgroundInfo && (
          <Credits>
            <Typography variant="body2">
              {t("unsplash.author") + ": "}
              {backgroundInfo?.author}
            </Typography>
            <Button variant="text" size="small" href={backgroundInfo?.linkHtml ?? ""} target="_blank" rel="noreferrer">
              {t("unsplash.viewOnUnsplash")}
            </Button>
          </Credits>
        )}
      </Background>
    </Fade>
  );
};

const Background = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "light" ? theme.palette.grey[50] : theme.palette.grey[900],
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  backgroundPosition: "center",
  [theme.breakpoints.up("xl")]: {
    backgroundImage: "var(--background-image-md)", // temporary
  },
  [theme.breakpoints.between("md", "xl")]: {
    backgroundImage: "var(--background-image-md)",
  },
  [theme.breakpoints.down("md")]: {
    backgroundImage: "var(--background-image-sm)",
  },
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const Credits = styled("div")({
  padding: "16px",
  position: "absolute",
  bottom: 0,
  left: 0,
});
