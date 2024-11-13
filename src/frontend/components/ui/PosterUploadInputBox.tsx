import {
  Box,
  Button,
  CardMedia,
  Grid2 as Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  Paper,
  styled,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  useTheme,
} from "@mui/material";
import { useState } from "react";

import { AttachFileOutlined, CloudUploadOutlined, ContentPasteOutlined } from "../icons";

import type { SxProps } from "@mui/system";
import type { ReactNode, SyntheticEvent } from "react";

type TabPanelProps = {
  children?: ReactNode;
  dir?: string;
  index: number;
  value: number;
};

export const PosterUploadInputBox = () => {
  const theme = useTheme();
  const [tab, setTab] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const startAdornment = (
    <InputAdornment position="start" sx={{ cursor: "pointer" }}>
      <Tooltip title={"Choose File"} placement="top" arrow>
        <IconButton size="small" onClick={() => true}>
          <AttachFileOutlined fontSize="small" />
        </IconButton>
      </Tooltip>
    </InputAdornment>
  );

  const cardMediaSx: SxProps = {
    height: 100,
    width: 200,
    backgroundSize: "contain",
    filter: "blur(2px)",
  };

  const posterUrl = [
    "https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/2weak2slow2/phpza5oxW.jpeg",
    "https://i-a.d-cd.net/PX_ZUBJvag0Kncb8wxahJl8UAKY-1920.jpg",
  ][1];

  return (
    <Grid container spacing={1} flexGrow={1} height={180}>
      <Grid size={"auto"} component={StyledPosterPreviewPaper} square={false} variant="outlined">
        <CardMedia sx={cardMediaSx} image={posterUrl} />
        <LinearProgress variant="determinate" value={67} />
      </Grid>

      <Grid size={"grow"} component={StyledDropzone} square={false} elevation={2} variant="outlined">
        <AttachFileOutlined />
        <div>Drop file here</div>
        <Button variant="outlined" children={"Browse"} startIcon={<CloudUploadOutlined />} />
        <Button variant="outlined" children={"Paste"} endIcon={<ContentPasteOutlined />} />
        <TextField size="small" margin="dense" />
        {/*<Tabs value={tab} variant="fullWidth" onChange={handleChange}>*/}
        {/*  <Tab label="From URL" value={0} />*/}
        {/*  <Tab label="Local File" value={1} />*/}
        {/*</Tabs>*/}
        {/*<TabPanel value={tab} index={0}>*/}
        {/*  <TextField*/}
        {/*    type="text"*/}
        {/*    label="URL"*/}
        {/*    size="small"*/}
        {/*    margin="dense"*/}
        {/*    fullWidth*/}
        {/*    error*/}
        {/*    helperText={*/}
        {/*      "Connection refused Connection refused Connection refused Connection refused Connection refused Connection refused Connection refused Connection refused Connection refused Connection refused Connection refused Connection refused Connection refused Connection refused Connection refused "*/}
        {/*    }*/}
        {/*    slotProps={{*/}
        {/*      inputLabel: { shrink: true },*/}
        {/*      formHelperText: { title: "asdasdfsdfghdfgjkgfdsafhg", sx: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } },*/}
        {/*    }}*/}
        {/*  />*/}
        {/*</TabPanel>*/}
        {/*<TabPanel value={tab} index={1}>*/}
        {/*  <TextField*/}
        {/*    type="file"*/}
        {/*    label="File"*/}
        {/*    size="small"*/}
        {/*    margin="dense"*/}
        {/*    fullWidth*/}
        {/*    slotProps={{*/}
        {/*      input: { startAdornment },*/}
        {/*      inputLabel: { shrink: true },*/}
        {/*    }}*/}
        {/*  />*/}
        {/*</TabPanel>*/}
      </Grid>
    </Grid>
  );
};

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  const factoryProps = {
    role: "tabpanel",
    id: `full-width-tabpanel-${index}`,
    "aria-labelledby": `full-width-tab-${index}`,
  };

  return (
    <div hidden={value !== index} {...factoryProps} {...other}>
      {value === index && <Box sx={{ display: "flex" }}>{children}</Box>}
    </div>
  );
};

const StyledPosterPreviewPaper = styled(Paper)(() => ({
  backgroundColor: "transparent",
  backgroundImage: "radial-gradient(transparent, transparent, rgba(0, 0, 0, .05))",
}));

const StyledDropzone = styled(Paper)(() => ({
  backgroundColor: "transparent",
  backgroundImage: "none",
  // backgroundImage: "radial-gradient(transparent, transparent, rgba(0, 0, 0, .05))",
  padding: 16,
}));
