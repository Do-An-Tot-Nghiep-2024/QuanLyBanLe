import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import colors from "../../constants/color";
import {
  Stack,
  FormControl,
  FormLabel,
  TextField,
  Button,
  Container,
  Typography,
  Select,
  Input,
  Alert,
} from "@mui/material";

export default function CreateProduct() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
    // On success, navigate back to the supplier page
    // navigate("/suppliers"); // Uncomment this line when you have success logic
    try {
    } catch (err: any) {
      setError(err?.message);
    }
  };
  const handleBack = () => {
    navigate("/category"); // Navigate back to the supplier page
  };

  return (
    <Container>
      <Typography
        variant="h4"
        align="center"
        padding={"5px"}
        sx={{ mb: 3, fontWeight: "bold" }}
      >
        Thêm sản phẩm mới
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Container
        component={"form"}
        onSubmit={handleSubmit}
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          padding: 5,
          backgroundColor: "white",
          width: "80%",
          margin: "auto",
        }}
      >
        <Stack spacing={2} mb={2} sx={{ alignItems: "center" }}>
          <FormControl sx={{ width: "60%" }}>
            <FormLabel htmlFor="name" sx={{ textAlign: "left" }}>
              Tên nhà cung cấp:
            </FormLabel>
            <Select
              name="name"
              variant="outlined"
              displayEmpty
              native // Sử dụng native để tạo dropdown menu
            >
              <option value="" disabled>
                Chọn nhà cung cấp
              </option>
              <option value="supplier1">Nhà cung cấp 1</option>
              <option value="supplier2">Nhà cung cấp 2</option>
              <option value="supplier3">Nhà cung cấp 3</option>
              {/* Thêm các option khác tương ứng với các nhà cung cấp khác */}
            </Select>
          </FormControl>

          <FormControl sx={{ width: "60%" }}>
            <FormLabel htmlFor="name" sx={{ textAlign: "left" }}>
              Danh mục sản phẩm:
            </FormLabel>
            <Select
              name="name"
              variant="outlined"
              displayEmpty
              native // Sử dụng native để tạo dropdown menu
            >
              <option value="" disabled>
                Chọn danh mục sản phẩm
              </option>
              <option value="supplier1">Danh mục 1</option>
              <option value="supplier2">Danh mục 2</option>
              <option value="supplier3">Danh mục 3</option>
              {/* Thêm các option khác tương ứng với các nhà cung cấp khác */}
            </Select>
          </FormControl>

          <FormControl sx={{ width: "60%" }}>
            <FormLabel htmlFor="name" sx={{ textAlign: "left" }}>
              Tên sản phẩm:
            </FormLabel>
            <TextField name="name" variant="outlined" />
          </FormControl>

          <FormControl sx={{ width: "60%" }}>
            <FormLabel htmlFor="productImage" sx={{ textAlign: "left" }}>
              Hình ảnh sản phẩm:
            </FormLabel>
            <Input id="productImage" name="productImage" type="file" />
          </FormControl>
        </Stack>

        <Stack
          direction="row"
          spacing={2}
          mb={2}
          sx={{ justifyContent: "center" }}
        >
<<<<<<< Updated upstream
          <Button
            type="button"
            sx={{
              width: "30%", // Decreased button width
              backgroundColor: colors.secondaryColor,
              color: "white",
              fontSize: "0.875rem", // Decrease font size
              padding: "6px 12px", // Decrease padding
            }}
            onClick={handleBack} // Call handleBack to navigate back
=======
          Thêm sản phẩm mới
        </Typography>

        <Container
          component={"form"}
          onSubmit={handleSubmit}
          sx={{
            boxShadow: 3,
            borderRadius: 2,
            padding: 5,
            backgroundColor: "white",
            width: "80%",
            margin: "auto",
          }}
        >
          {error && <Alert severity="error">{error}</Alert>}

          <Stack spacing={2} mb={2} sx={{ alignItems: "center" }}>
            <FormControl sx={{ width: "60%" }}>
              <FormLabel htmlFor="name" sx={{ textAlign: "left" }}>
                Tên nhà cung cấp:
              </FormLabel>
              <Select
                name="name"
                variant="outlined"
                displayEmpty
                native // Sử dụng native để tạo dropdown menu
              >
                <option value="" disabled>
                  Chọn nhà cung cấp
                </option>
                <option value="supplier1">Nhà cung cấp 1</option>
                <option value="supplier2">Nhà cung cấp 2</option>
                <option value="supplier3">Nhà cung cấp 3</option>
                {/* Thêm các option khác tương ứng với các nhà cung cấp khác */}
              </Select>
            </FormControl>

            <FormControl sx={{ width: "60%" }}>
              <FormLabel htmlFor="name" sx={{ textAlign: "left" }}>
                Danh mục sản phẩm:
              </FormLabel>
              <Select
                name="name"
                variant="outlined"
                displayEmpty
                native // Sử dụng native để tạo dropdown menu
              >
                <option value="" disabled>
                  Chọn danh mục sản phẩm
                </option>
                <option value="supplier1">Danh mục 1</option>
                <option value="supplier2">Danh mục 2</option>
                <option value="supplier3">Danh mục 3</option>
                {/* Thêm các option khác tương ứng với các nhà cung cấp khác */}
              </Select>
            </FormControl>

            <FormControl sx={{ width: "60%" }}>
              <FormLabel htmlFor="name" sx={{ textAlign: "left" }}>
                Tên sản phẩm:
              </FormLabel>
              <TextField name="name" variant="outlined" />
            </FormControl>
            
            <FormControl sx={{ width: "60%" }}>
            <FormLabel htmlFor="name" sx={{ textAlign: "left" }}>
              Giá sản phẩm:
            </FormLabel>
            <TextField name="name" variant="outlined" />
          </FormControl>

            <FormControl sx={{ width: "60%" }}>
              <FormLabel htmlFor="productImage" sx={{ textAlign: "left" }}>
                Hình ảnh sản phẩm:
              </FormLabel>
              <Input
                accept="image/*"
                id="productImage"
                name="productImage"
                type="file"
              />
            </FormControl>
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            mb={2}
            sx={{ justifyContent: "center" }}
>>>>>>> Stashed changes
          >
            Quay lại
          </Button>

          <Button
            type="submit"
            variant="contained"
            sx={{
              width: "30%", // Decreased button width
              backgroundColor: colors.accentColor,
              color: "white",
              fontSize: "0.875rem", // Decrease font size
              padding: "6px 12px", // Decrease padding
            }}
          >
            Thêm
          </Button>
        </Stack>
      </Container>
    </Container>
  );
}
