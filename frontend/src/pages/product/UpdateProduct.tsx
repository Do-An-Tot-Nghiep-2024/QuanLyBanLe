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
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import {
  getProductByIdService,
  updateProductService,
} from "../../services/product.service";
import { ProductSchema, defaultProductSchema } from "../../types/productSchema";
import { getCategoriesService } from "../../services/category.service";
import { getSuppliersService } from "../../services/supplier.service";

export default function UpdateProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState({ ...defaultProductSchema });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await getProductByIdService(id);
        setProduct(response.data);
        setImagePreview(response.data.image);
      } catch (err) {
        setAlertMessage("Lỗi khi lấy dữ liệu sản phẩm");
        setAlertSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = event.target;

    setProduct((prev) => ({
      ...prev,
      [name]: name === "categoryId" || name === "supplierId" ? Number(value) : value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getCategories();
      await getSuppliers();
    };

    fetchData();
  }, []);

  const getCategories = async () => {
    const response = await getCategoriesService();
    setCategories(response.data);
  };

  const getSuppliers = async () => {
    const response = await getSuppliersService();
    setSuppliers(response.data.responseList);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const productData = {
        ...product,
      };

      ProductSchema.parse(productData);
      await updateProductService(productData, imageFile);

      setAlertMessage("Sản phẩm đã được cập nhật thành công!");
      setAlertSeverity("success");
      setSnackbarOpen(true);

      setTimeout(() => {
        navigate("/products");
      }, 2000);
    } catch (err: any) {
      if (err?.issues) {
        setAlertMessage(err.issues[0].message);
      } else {
        setAlertMessage("Lỗi khi cập nhật sản phẩm");
      }
      setAlertSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleBack = () => {
    navigate("/products");
  };

  return (
    <Container>
      <Typography
        variant="h4"
        align="center"
        padding={"5px"}
        sx={{ mb: 3, fontWeight: "bold" }}
      >
        Cập Nhật Sản Phẩm
      </Typography>

      {loading ? (
        <CircularProgress sx={{ display: 'block', margin: 'auto', marginTop: '20px' }} />
      ) : (
        <Container
          component={"form"}
          onSubmit={handleSubmit}
          sx={styles.formContainer}
        >
          <Container sx={{ textAlign: "center", mb: 3 }}>
            <img
              src={imagePreview || product.image}
              alt={product.name}
              style={{ width: "200px", height: "auto", borderRadius: "8px" }}
            />
          </Container>
          <Stack spacing={2} mb={2} sx={{ alignItems: "center" }}>
            <FormControl sx={styles.formControl}>
              <FormLabel htmlFor="name" sx={styles.formLabel}>
                Tên Sản Phẩm:
              </FormLabel>
              <TextField
                name="name"
                variant="outlined"
                value={product.name}
                onChange={handleChange}
                required
              />
            </FormControl>
            <FormControl sx={styles.formControl}>
              <FormLabel htmlFor="file" sx={styles.formLabel}>
                Tải Lên Hình Ảnh:
              </FormLabel>
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </FormControl>

            <FormControl sx={styles.formControl}>
              <FormLabel htmlFor="category" sx={styles.formLabel}>
                Danh Mục:
              </FormLabel>
              <Select
                name="categoryId"
                variant="outlined"
                value={product.categoryId || ""} 
                onChange={handleChange}
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={styles.formControl}>
              <FormLabel htmlFor="supplier" sx={styles.formLabel}>
                Nhà Cung Cấp:
              </FormLabel>
              <Select
                name="supplierId"
                variant="outlined"
                value={product.supplierId || ""} 
                onChange={handleChange}
required
                  placeholder={}
              >
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            mb={2}
            sx={{ justifyContent: "center" }}
          >
            <Button type="button" sx={styles.backButton} onClick={handleBack}>
              Quay Lại
            </Button>

            <Button type="submit" variant="contained" sx={styles.submitButton}>
              Cập Nhật
            </Button>
          </Stack>
        </Container>
      )}

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
