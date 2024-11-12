import {
  FormControl,
  InputAdornment,
  TextField,
  IconButton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { SearchIcon } from "../assets/svg/Icon"; // Adjust import path as needed

interface Props {
  placeholder: string;
  state: string;
  setState: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TextSearch({props}: {props: Props}) {
  const handleClick = (): void => {
    props.setState({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>); // Clear the search input
  };
  return (
    <FormControl fullWidth>
      <TextField
        placeholder={props.placeholder}
        size="small"
        variant="outlined"
        value={props.state}
        onChange={props.setState}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: props.state && (
              <InputAdornment position="end">
                <IconButton onClick={handleClick} edge="end">
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    </FormControl>
  );
}