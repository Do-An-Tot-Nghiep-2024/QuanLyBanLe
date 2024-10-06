import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import colors from "../../constants/color";
import {
  Stack,
  FormControl,
  FormLabel,
  TextField,
  Button,
  Container,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { getSupplierByIdService, updateSupplierService } from "../../services/supplier.service";
import { SupplierSchema, defaultSupplierSchema } from "../../types/supplierSchema";

export default function UpdateSupplier() {
  const { id } = useParams();
  const [supplier, setSupplier] = useState({ ...defaultSupplierSchema });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await getSupplierByIdService(id);
        setSupplier(response.data);
      } catch (err) {
        setAlertMessage("Error fetching supplier data");
        setAlertSeverity("error");
        setSnackbarOpen(true);
      }
    };

    fetchSupplier();
  }, [id]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSupplier({ ...supplier, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      SupplierSchema.parse(supplier);
      
      await updateSupplierService(id, supplier);
      
      // Show success message
      setAlertMessage("Nhà cung cấp đã được cập nhật thành công!");
      setAlertSeverity("success");
      setSnackbarOpen(true);
      
      // Wait before navigating
      setTimeout(() => {
        navigate("/suppliers");
      }, 2000); // Navigate after 2 seconds
    } catch (err: any) {
      if (err?.issues) {
        setAlertMessage(err.issues[0].message);
      } else {
        setAlertMessage("Lỗi khi cập nhật nhà cung cấp");
      }
      setAlertSeverity("error");
      setSnackbarOpen(true);
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
        Cập nhật nhà cung cấp
      </Typography>

      <Container
        component={"form"}
        onSubmit={handleSubmit}
        sx={styles.formContainer}
      >
        <Stack spacing={2} mb={2} sx={{ alignItems: "center" }}>
          <FormControl sx={styles.formControl}>
            <FormLabel htmlFor="name" sx={styles.formLabel}>
              Tên nhà cung cấp:
            </FormLabel>
            <TextField
              name="name"
              variant="outlined"
              value={supplier.name}
              onChange={handleChange}
              required
            />
          </FormControl>

          <FormControl sx={styles.formControl}>
            <FormLabel htmlFor="phone" sx={styles.formLabel}>
              Số điện thoại:
            </FormLabel>
            <TextField
              name="phone"
              variant="outlined"
              value={supplier.phone}
              onChange={handleChange}
              required
            />
          </FormControl>

          <FormControl sx={styles.formControl}>
            <FormLabel htmlFor="email" sx={styles.formLabel}>
              Email:
            </FormLabel>
            <TextField
              name="email"
              variant="outlined"
              type="email"
              value={supplier.email}
              onChange={handleChange}
              required
            />
          </FormControl>

          <FormControl sx={styles.formControl}>
            <FormLabel htmlFor="address" sx={styles.formLabel}>
              Địa chỉ:
            </FormLabel>
            <TextField
              name="address"
              variant="outlined"
              type="text"
              value={supplier.address}
              onChange={handleChange}
              required
            />
          </FormControl>
        </Stack>

        <Stack direction="row" spacing={2} mb={2} sx={{ justifyContent: "center" }}>
          <Button
            type="button"
            sx={styles.backButton}
            onClick={handleBack}
          >
            Quay lại
          </Button>

          <Button
            type="submit"
            variant="contained"
            sx={styles.submitButton}
          >
            Cập nhật
          </Button>
        </Stack>
      </Container>

      {/* Snackbar for alerts */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={alertSeverity}
          sx={{ width: '100%' }}
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
