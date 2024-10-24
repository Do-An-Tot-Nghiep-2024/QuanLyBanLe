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
  SelectChangeEvent,
} from "@mui/material";
import {
  getProductByIdService,
  updateProductService,
} from "../../services/product.service";
import { getCategoriesService } from "../../services/category.service";
import { getSuppliersService } from "../../services/supplier.service";
import { UpdateProductSchema } from "../../types/updateProductSchema";

type Category = {
  id: number;
  name: string;
};

type Supplier = {
  id: number;
  name: string;
};

export default function UpdateProduct() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<{
    name: String;
    categoryId: number;
    supplierId: number;
    price: Number;
    image:String;
  }>({
    name: "",
    categoryId: 0,
    supplierId: 0,
    price: 0,
    image:""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<String | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState<"success" | "error">("success");
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const navigate = useNavigate();
  const [category, setCategory] = useState<String>("");
  const [supplier, setSupplier] = useState<String>("");

  const getCategories = async () => {
    const response = await getCategoriesService();
    setCategories(response.data);
  };

  const getSuppliers = async () => {
    const response = await getSuppliersService();
    setSuppliers(response.data.responseList);
  };

  const handleChange = (event: React.ChangeEvent<{ name?: String; value: unknown }> | SelectChangeEvent<String>) => {
    const { name, value } = event.target;
  
    setProduct((prev) => ({
      ...prev,
      [String(name)]: name === "price" ? Number(value) : value,
    }));
  
    if (name === "categoryId") {
      const categoryObj = categories.find((cat) => cat.name === value);
      setCategory(value as string);
      setProduct((prev) => ({
        ...prev,
        categoryId: categoryObj ? categoryObj.id : 0,
      }));
    }
  
    if (name === "supplierId") {
      const supplierObj = suppliers.find((sup) => sup.name === value);
      setSupplier(value as string);
      setProduct((prev) => ({
        ...prev,
        supplierId: supplierObj ? supplierObj.id : 0,
      }));
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
      await getId();
      const productId = Number.parseInt(id ?? "");
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
    } catch (error: any) {
      setAlertMessage(error?.errors ? error.errors[0].message : "An error occurred");
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
        const response = await getProductByIdService(Number(id));

        const idCategoryTemp = categories.find((cate) => cate.name === response.data?.category)?.id || 0;
        const idSupplyTemp = suppliers.find((cate) => cate.name === response.data?.supplier)?.id || 0;

          if(response.data){
            setImagePreview(response.data?.image);
            setCategory(response.data?.category );
            setSupplier(response.data?.supplier);
            setProduct((prev) => ({
              ...prev,
              name: response.data!.name,
              price: response.data!.price,
              categoryId: idCategoryTemp,
              supplierId: idSupplyTemp,
            }));

          }
       
        

       
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
    
    const categoryId = categoryObj ? categoryObj.id : null;
    const supplierId = supplierObj ? supplierObj.id : null;

    setProduct((prev) => ({
      ...prev,
      categoryId: categoryId || 0,
      supplierId: supplierId || 0,
    }));
  };

  return (
    <Container>
      <Typography variant="h4" align="center" padding={"5px"} sx={{ mb: 3, fontWeight: "bold" }}>
        Cập Nhật Sản Phẩm
      </Typography>
      <Container component={"form"} onSubmit={handleSubmit} sx={styles.formContainer}>
        <Container sx={{ textAlign: "center", mb: 3 }}>
          <img
            src={imagePreview?.toString() || product.image.toString()}
            alt={product.name.toString()}
            style={{ width: "200px", height: "auto", borderRadius: "8px" }}
          />
        </Container>
        <Stack spacing={2} mb={2} sx={{ alignItems: "center" }}>
          <FormControl sx={styles.formControl}>
            <FormLabel htmlFor="name" sx={styles.formLabel}>
              Tên Sản Phẩm:
            </FormLabel>
            <TextField name="name" variant="outlined" value={product.name} onChange={handleChange} />
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
            <TextField name="price" variant="outlined" value={product.price} onChange={handleChange} />
          </FormControl>
        </Stack>
        <Stack direction="row" spacing={2} mb={2} sx={{ justifyContent: "center" }}>
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