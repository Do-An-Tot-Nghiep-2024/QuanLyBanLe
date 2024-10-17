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
import { ProductSchema } from "../../types/productSchema";
import { getCategoriesService } from "../../services/category.service";
import { getSuppliersService } from "../../services/supplier.service";
import { any, set } from "zod";
import { UpdateProductSchema } from "../../types/updateProductSchema";

export default function UpdateProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState({
    name: "",
    categoryId: any,
    supplierId: any,
    price: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [supplier, setSupplier] = useState("");
  const [categoryId, setCategoryId] = useState(0);
  const [supplierId, setSupplierId] = useState(0);

  const getCategories = async () => {
    const response = await getCategoriesService();
    setCategories(response.data);
  };

  const getSuppliers = async () => {
    const response = await getSuppliersService();
    setSuppliers(response.data.responseList);
  };

  const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = event.target;


    setProduct((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));

    if (name === "categoryId") {
      setCategory(value);
      setProduct((prev) => ({
        ...prev,
        categoryId: Number(categories.find((cat) => cat.name === value)?.id),
      }))
    }

    if (name === "supplierId") {
      setSupplier(value);
      setProduct((prev) => ({
        ...prev,
        supplierId: Number(suppliers.find((sup) => sup.name === value)?.id),
      }))

    }

  
 
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();    
    try {

      getId().then(async () => { 
        const productId = Number.parseInt(id ?? "");
        console.log(product);
        
        const data = UpdateProductSchema.parse({
          name: product.name,
          categoryId: product.categoryId,
          supplierId: product.supplierId,
          price: product.price,
        });
  
        const response = await updateProductService(productId, data, imageFile || new File([], ""));
        if (response.message === "success") {
          navigate("/products", {
            state: { updateSuccess: "Cập nhật thông tin sản phẩm thành công" },
          });
        } else {
          setAlertMessage(response.message);
          setAlertSeverity("error");
          setSnackbarOpen(true);
        }
      })
      
    } catch (error) {
      console.log(error);
      setAlertMessage(error.errors[0].message);
      setAlertSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleBack = () => {
    navigate("/products");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getCategories();
        await getSuppliers();
        const response = await getProductByIdService(id);
        // setProduct(response.data);
        setImagePreview(response.data.image);
        setCategory(response.data.category);
        setSupplier(response.data.supplier);
        setProduct((prev) => ({
          ...prev,
          name: response.data.name,
          price: response.data.price,
        }));
      } catch (err) {
        setAlertMessage("Lỗi khi lấy dữ liệu sản phẩm");
        setAlertSeverity("error");
        setSnackbarOpen(true);
      }
    };

    fetchData();
  }, [id]);


  const getId = async () => { 
    const categoryObj = categories.find((cat) => cat.name === category);
    const supplierObj = suppliers.find((sup) => sup.name === supplier);
    
    const categoryId = categoryObj ? Number(categoryObj.id) : null;
    const supplierId = supplierObj ? Number(supplierObj.id) : null;
  
    setProduct((prev) => ({
      ...prev,
      categoryId: categoryId,
      supplierId: supplierId,
    }));
  }
  
  
  
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
              value={category}
              onChange={handleChange}
              sx={{ textAlign: "left" }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.name}>
                  {cat.name}
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
              value={supplier}
              onChange={handleChange}
              sx={{ textAlign: "left" }}
            >
              {suppliers.map((sup) => (
                <MenuItem key={sup.id} value={sup.name}>
                  {sup.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={styles.formControl}>
            <FormLabel htmlFor="price" sx={styles.formLabel}>
              Giá bán:
            </FormLabel>
            <TextField
              name="price"
              variant="outlined"
              value={product.price}
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
            Quay Lại
          </Button>
          <Button type="submit" variant="contained" sx={styles.submitButton}>
            Cập Nhật
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
