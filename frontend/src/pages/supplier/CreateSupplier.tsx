import { lazy, useState } from "react";
import { useNavigate } from "react-router-dom";
import colors from "../../constants/color";
import {
  Stack,
  FormControl,
  FormLabel,
  TextField,
  Button,
  Container,
  Typography,
  Alert,
  FormHelperText,
  Snackbar,
} from "@mui/material";
import { createSupplierService } from "../../services/supplier.service";
import {
  SupplierSchema,
  defaultSupplierSchema,
} from "../../types/supplierSchema";
const MessageAlert = lazy(() => import("../../components/MessageAlert"));

export default function CreateSupplier() {
  const [supplier, setSupplier] = useState(defaultSupplierSchema);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    [key: string]: string | null;
  }>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSupplier({ ...supplier, [name]: value });
    setFieldErrors({ ...fieldErrors, [name]: null });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      // Validate supplier data
      SupplierSchema.parse(supplier);

      // Call the service to create a supplier
      const response = await createSupplierService(supplier);
      console.log(response);

      if (response.status) {
        setAlertMessage("Nhà cung cấp đã được thêm thành công!");
        setError(null);
        setAlertSeverity("success");
        setSnackbarOpen(true);

        setTimeout(() => {
          navigate("/suppliers");
        }, 2000);
      }
    } catch (err: any) {
      if (err?.issues) {
        const newFieldErrors = err.issues.reduce((acc: any, issue: any) => {
          acc[issue.path[0]] = issue.message; 
          return acc;
        }, {});
        setFieldErrors(newFieldErrors);
        setError(null); 
      } else {
        setAlertSeverity("error");
        setAlertMessage("Lỗi khi thêm nhà cung cấp");
      }
      setSuccess(null);
    }
  };

  const handleBack = () => {
    navigate("/suppliers");
  };

  return (
    <Container>
      <Typography
        variant="h4"
        align="center"
        padding={"5px"}
        sx={{ mb: 3, fontWeight: "bold" }}
      >
        Thêm mới nhà cung cấp
      </Typography>

      <Container
        component={"form"}
        onSubmit={handleSubmit}
        sx={styles.formContainer}
      >
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <Stack spacing={2} mb={2} sx={{ alignItems: "center" }}>
          <FormControl sx={styles.formControl} error={!!fieldErrors.name}>
            <FormLabel htmlFor="name" sx={styles.formLabel}>
              Tên nhà cung cấp:
            </FormLabel>
            <TextField
              name="name"
              variant="outlined"
              value={supplier.name}
              onChange={handleChange}
              error={!!fieldErrors.name} // Red border on error
              required
            />
            <FormHelperText>{fieldErrors.name}</FormHelperText>
          </FormControl>

          <FormControl sx={styles.formControl} error={!!fieldErrors.phone}>
            <FormLabel htmlFor="phone" sx={styles.formLabel}>
              Số điện thoại:
            </FormLabel>
            <TextField
              name="phone"
              variant="outlined"
              value={supplier.phone}
              onChange={handleChange}
              error={!!fieldErrors.phone} // Red border on error
              required
            />
            <FormHelperText>{fieldErrors.phone}</FormHelperText>
          </FormControl>

          <FormControl sx={styles.formControl} error={!!fieldErrors.email}>
            <FormLabel htmlFor="email" sx={styles.formLabel}>
              Email:
            </FormLabel>
            <TextField
              name="email"
              variant="outlined"
              type="email"
              value={supplier.email}
              onChange={handleChange}
              error={!!fieldErrors.email}
              required
            />
            <FormHelperText>{fieldErrors.email}</FormHelperText>
          </FormControl>

          <FormControl sx={styles.formControl} error={!!fieldErrors.address}>
            <FormLabel htmlFor="address" sx={styles.formLabel}>
              Địa chỉ:
            </FormLabel>
            <TextField
              name="address"
              variant="outlined"
              type="text"
              value={supplier.address}
              onChange={handleChange}
              error={!!fieldErrors.address} // Red border on error
              required
            />
            <FormHelperText>{fieldErrors.address}</FormHelperText>
          </FormControl>
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          mb={2}
          sx={{ justifyContent: "center" }}
        >
          <Button type="button" sx={styles.backButton} onClick={handleBack}>
            Quay lại
          </Button>

          <Button type="submit" variant="contained" sx={styles.submitButton}>
            Thêm
          </Button>
        </Stack>
      </Container>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={alertSeverity}
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

const styles = {
  formContainer: {
    boxShadow: 3,
    borderRadius: 2,
    padding: 5,
    backgroundColor: "white",
    width: "80%",
    margin: "auto",
  },
  formControl: {
    width: "60%",
  },
  formLabel: {
    textAlign: "left",
  },
  backButton: {
    width: "30%",
    backgroundColor: colors.secondaryColor,
    color: "white",
    fontSize: "0.875rem",
    padding: "6px 12px",
  },
  submitButton: {
    width: "30%",
    backgroundColor: colors.accentColor,
    color: "white",
    fontSize: "0.875rem",
    padding: "6px 12px",
  },
};
