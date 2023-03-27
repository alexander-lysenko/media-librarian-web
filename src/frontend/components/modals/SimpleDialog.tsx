import { DoneOutlined } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grow } from "@mui/material";
import React from "react";

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
        <Button type="submit" variant="contained" endIcon={<DoneOutlined />} children={"Confirm"} />
      </DialogActions>
    </Dialog>
  );
};
