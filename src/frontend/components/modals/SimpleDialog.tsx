import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grow } from "@mui/material";

export const SimpleDialog = () => {
  return (
    <Dialog open={false} fullWidth TransitionComponent={Grow} transitionDuration={120}>
      <DialogTitle variant={"h5"}>Simple Heading</DialogTitle>
      <DialogContent>
        <DialogContentText>Simple Title</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={() => false}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" endIcon={<DoneOutlinedIcon />} children={"Confirm"} />
      </DialogActions>
    </Dialog>
  );
};
