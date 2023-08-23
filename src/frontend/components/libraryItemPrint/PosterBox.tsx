import { Box, Container, styled, Typography } from "@mui/material";

import type { Theme } from "@mui/material";
import type { SystemProps } from "@mui/system";

type Props = {
  src: string;
  title: string;
  height?: SystemProps<Theme>["height"];
};

export const PosterBox = ({ src, height, title }: Props) => {
  const emptySrc = "https://source.unsplash.com/oqStl2L5oxI";
  return (
    <Wrapper height={height || 240}>
      <BlurredBackground height={height || 240} sx={{ backgroundImage: `url(${src})` }} />
      <BackgroundContainer>
        <Image src={src || emptySrc} alt={title} />
        <TitleContainer sx={{ py: 2, px: { xs: 2, sm: 3 } }}>
          <Title variant={"h5"} title={title} children={title} />
        </TitleContainer>
      </BackgroundContainer>
    </Wrapper>
  );
};

const Wrapper = styled(Box)({ position: "relative", overflow: "hidden", flex: "1 0 auto" });

const BlurredBackground = styled(Box)({
  width: "100%",
  backgroundSize: "cover",
  backgroundPosition: "center",
  position: "absolute",
  // filter: "blur(5px) brightness(0.75)",
  boxShadow: "inset rgba(0,0,0,0.7) 1px 1px 1px 1000px",
});

const BackgroundContainer = styled(Box)({
  position: "relative",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const Image = styled("img")({ maxWidth: "100%", height: "100%" });

const TitleContainer = styled(Container)(({ theme }) => ({
  background: `linear-gradient(15deg, ${theme.palette.background.default}, transparent)`,
  backdropFilter: "blur(6px) brightness(0.7)",
  width: "100%",
  position: "absolute",
  bottom: 0,
}));

const Title = styled(Typography)({
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: "2",
  WebkitBoxOrient: "vertical",
});
