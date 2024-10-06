import { useState } from "react";
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
} from "@mui/material";
import { createSupplierService } from "../../services/supplier.service"; 
import { SupplierSchema, defaultSupplierSchema } from "../../types/supplierSchema"

export default function CreateSupplier() {
  const [supplier, setSupplier] = useState(defaultSupplierSchema);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSupplier({ ...supplier, [name]: value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
     
      SupplierSchema.parse(supplier);
      
      await createSupplierService(supplier);
      setSuccess("Nhà cung cấp đã được thêm thành công!");
      setError(null);
      navigate("/suppliers");
      
   
      setSupplier(defaultSupplierSchema);
    } catch (err: any) {
      if (err?.issues) {
        setError(err.issues[0].message); 
      } else {
        setError("Lỗi khi thêm nhà cung cấp");
      }
      setSuccess(null);
    }
  };

  const handleBack = () => {
    navigate("/suppliers");
  };

  return (
    <>
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
          {success && <Alert severity="success">{success}</Alert>} {/* Success message */}

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

          <Stack
            direction="row"
            spacing={2}
            mb={2}
            sx={{ justifyContent: "center" }}
          >
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
              Thêm
            </Button>
          </Stack>
        </Container>
      </Container>
    </>
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
