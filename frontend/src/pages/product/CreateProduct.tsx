import { useEffect, useState } from "react";
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
  Snackbar,
  Alert,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { createProductService } from "../../services/product.service";
import { ProductSchema, defaultProductSchema } from "../../types/productSchema";
import { getCategoriesService } from "../../services/category.service";
import { getSuppliersService } from "../../services/supplier.service";

export default function CreateProduct() {
  const [product, setProduct] = useState({ ...defaultProductSchema });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const navigate = useNavigate();

  const getCategories = async () => {
    const response = await getCategoriesService();
    setCategories(response.data);
  };

  const getSuppliers = async () => {
    const response = await getSuppliersService();
    setSuppliers(response.data.responseList);
  };

  const handleChange = (
    event: SelectChangeEvent<unknown> | React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = event.target;
  
    console.log(name, value);
  
    setProduct((prev) => ({
      ...prev,
      [String(name)]:
        name === "categoryId" || name === "supplierId" ? Number(value) : value,
    }));
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      console.log(product);

      const productData = {
        ...product,
        categoryId: Number(product.categoryId),
        supplierId: Number(product.supplierId),
      };

      console.log(productData);

      ProductSchema.parse(productData);
      if (imageFile) {
        await createProductService(productData, imageFile);
        setAlertMessage("Sản phẩm đã được tạo thành công!");
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate("/products");
        }, 2000);
      }

    } catch (err: any) {
      setAlertMessage(
        err?.issues ? err.issues[0].message : "Lỗi khi tạo sản phẩm"
      );
      setSnackbarOpen(true);
    }
  };

  const handleBack = () => {
    navigate("/products");
  };


  useEffect(() => {
    const fetchData = async () => {
      await getCategories();
      await getSuppliers();
    };

    fetchData();
  }, []);
  return (
    <Container>
      <Typography
        variant="h4"
        align="center"
        padding={"5px"}
        sx={{ mb: 3, fontWeight: "bold" }}
      >
        Tạo Sản Phẩm
      </Typography>

      <Container
        component={"form"}
        onSubmit={handleSubmit}
        sx={styles.formContainer}
      >
        <Container sx={{ textAlign: "center", mb: 3 }}>
          {imagePreview ? (
            <img
              src={imagePreview}
              alt={product.name || "Sản phẩm"}
              style={{ width: "200px", height: "auto", borderRadius: "8px" }}
            />
          ) : (
            <Typography variant="body1" color="text.secondary">
              Chưa chọn hình ảnh
            </Typography>
          )}
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
            <input required type="file" accept="image/*" onChange={handleFileChange} />
          </FormControl>

          <FormControl sx={{ width: "60%" }}>
            <FormLabel htmlFor="supplierId" sx={{ textAlign: "left" }}>
              Tên nhà cung cấp:
            </FormLabel>
            <Select
              id="supplierId"
              // {...register("supplierId")}
              variant="outlined"
              displayEmpty
              native
              onChange={handleChange}
              name="supplierId"

            >
              <option value="" disabled>
                Chọn nhà cung cấp
              </option>
              {suppliers.map((supplier: any) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ width: "60%" }}>
            <FormLabel htmlFor="categoryId" sx={{ textAlign: "left" }}>
              Danh mục sản phẩm:
            </FormLabel>
            <Select
              id="categoryId"
              name="categoryId"
              // {...register("categoryId")}
              variant="outlined"
              displayEmpty
              native
              onChange={handleChange}
            >
              <option value="" disabled>
                Chọn danh mục sản phẩm
              </option>
              {categories.map((category: any) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
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
            Tạo
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