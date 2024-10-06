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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductByIdService(id);
        console.log(response.data);

        setProduct(response.data);

        setImagePreview(response.data.image);
      } catch (err) {
        setAlertMessage("Error fetching product data");
        setAlertSeverity("error");
        setSnackbarOpen(true);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | { name?: string; value: unknown }
    >
  ) => {
    const { name, value } = event.target;
    setProduct({ ...product, [name]: value });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create a preview URL for the selected image
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
        price: parseFloat(product.price),
        originalPrice: parseFloat(product.originalPrice),
        discountPrice: parseFloat(product.discountPrice),
      };

      ProductSchema.parse(productData);
      await updateProductService(productData, imageFile);

      setAlertMessage("Product updated successfully!");
      setAlertSeverity("success");
      setSnackbarOpen(true);

      setTimeout(() => {
        navigate("/products");
      }, 2000);
    } catch (err: any) {
      if (err?.issues) {
        setAlertMessage(err.issues[0].message);
      } else {
        setAlertMessage("Error updating product");
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
        Update Product
      </Typography>

      {/* Display the product image */}

      <Container
        component={"form"}
        onSubmit={handleSubmit}
        sx={styles.formContainer}
      >
        <Container sx={{ textAlign: "center", mb: 3 }}>
          <img
            src={imagePreview || product.image} // Use the preview URL or fallback to the product's current image
            alt={product.name}
            style={{ width: "200px", height: "auto", borderRadius: "8px" }} // Adjust the width and styling as needed
          />
        </Container>
        <Stack spacing={2} mb={2} sx={{ alignItems: "center" }}>
          <FormControl sx={styles.formControl}>
            <FormLabel htmlFor="name" sx={styles.formLabel}>
              Product Name:
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
            <FormLabel htmlFor="price" sx={styles.formLabel}>
              Price:
            </FormLabel>
            <TextField
              name="price"
              variant="outlined"
              type="number"
              value={product.price}
              onChange={handleChange}
              required
            />
          </FormControl>

          <FormControl sx={styles.formControl}>
            <FormLabel htmlFor="image" sx={styles.formLabel}>
              Image URL:
            </FormLabel>
            <TextField
              name="image"
              variant="outlined"
              value={product.image}
              onChange={handleChange}
              required
            />
          </FormControl>

          <FormControl sx={styles.formControl}>
            <FormLabel htmlFor="file" sx={styles.formLabel}>
              Upload Image:
            </FormLabel>
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </FormControl>

          <FormControl sx={styles.formControl}>
            <FormLabel htmlFor="category" sx={styles.formLabel}>
              Category:
            </FormLabel>
            <Select
              name="category"
              variant="outlined"
              value={product.category}
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
              Supplier:
            </FormLabel>
            <Select
              name="supplier"
              variant="outlined"
              value={product.supplier}
              onChange={handleChange}
              required
            >
              {suppliers.map((supplier) => (
                <MenuItem key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={styles.formControl}>
            <FormLabel htmlFor="originalPrice" sx={styles.formLabel}>
              Original Price:
            </FormLabel>
            <TextField
              name="originalPrice"
              variant="outlined"
              type="number"
              value={product.originalPrice}
              onChange={handleChange}
              required
            />
          </FormControl>

          <FormControl sx={styles.formControl}>
            <FormLabel htmlFor="discountPrice" sx={styles.formLabel}>
              Discount Price:
            </FormLabel>
            <TextField
              name="discountPrice"
              variant="outlined"
              type="number"
              value={product.discountPrice}
              onChange={handleChange}
            />
          </FormControl>
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          mb={2}
          sx={{ justifyContent: "center" }}
        >
          <Button type="button" sx={styles.backButton} onClick={handleBack}>
            Back
          </Button>

          <Button type="submit" variant="contained" sx={styles.submitButton}>
            Update
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
