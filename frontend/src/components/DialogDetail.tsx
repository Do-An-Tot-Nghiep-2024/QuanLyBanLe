import { Dialog, DialogTitle, Typography, Stack } from "@mui/material";
import Grid from "@mui/material/Grid2";

export interface SimpleDialogProps<T> {
  open: boolean;
  selectedValue: T;
  onClose: () => void;
  columns: Map<string, string>;
}

export default function DialogDetail<T>(props: SimpleDialogProps<T>) {
  const { onClose, selectedValue, open, columns } = props;

  // const handleClose = () => {
  //   onClose(selectedValue);
  // };

  const getKeys = function (obj: T) {
    return Object.keys(obj as object) as (keyof T)[];
  };

  console.log(getKeys(selectedValue));

  return (
    <Dialog fullWidth maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle align="center">Thông tin chi tiết</DialogTitle>
      <Grid container spacing={2} sx={{ py: 5 }}>
        {getKeys(selectedValue)
          .filter((key) => key !== "id")
          .map((key) => (
            <Stack direction="row" spacing={2} px={2} key={String(key)}>
              <Typography
                sx={{ width: "150px" }}
                component="label"
                fontWeight={"bold"}
              >
                {columns.get(key as string)}
              </Typography>
              <Typography sx={{ width: "150px" }}>
                {selectedValue[key] !== undefined
                  ? String(selectedValue[key])
                  : "N/A"}
              </Typography>
            </Stack>
          ))}
      </Grid>
    </Dialog>
  );
}
