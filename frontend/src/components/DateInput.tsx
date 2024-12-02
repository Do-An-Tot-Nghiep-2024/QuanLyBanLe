import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Dayjs } from "dayjs";
import { viVN } from "@mui/x-date-pickers/locales";
type Props = {
  date: Dayjs | null;
  onChange: (date: Dayjs | null) => void;
  lable: string;
};

export default function DateInput({ date, onChange, lable }: Props) {
  return (
    <LocalizationProvider
     
      dateAdapter={AdapterDayjs}
      localeText={
        viVN.components.MuiLocalizationProvider.defaultProps.localeText
      }
    >
      <DatePicker
        
        label={lable}
        onChange={onChange}
        value={date}
        format="DD/MM/YYYY"
        views={["day", "month", "year"]}
      />
    </LocalizationProvider>
  );
}
