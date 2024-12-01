import { Alert, Snackbar } from "@mui/material";
import React from "react";

type Props = {
    alertMessage: string;
    setSnackbarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    snackbarOpen: boolean;
    isError: boolean;
}

export default function SnackbarMessage({alertMessage, setSnackbarOpen, snackbarOpen,isError}: Props) {
  return (
    <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={() => setSnackbarOpen(false)}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={() => setSnackbarOpen(false)}
        severity={isError ? "error" : "success"}
        sx={{ width: "100%" }}
      >
        {alertMessage}
      </Alert>
    </Snackbar>
  );
}
