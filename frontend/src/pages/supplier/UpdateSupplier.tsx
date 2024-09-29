import {
    Alert,
    Button,
    Container,
    FormControl,
    FormLabel,
    Stack,
    TextField,
    Typography,
  } from "@mui/material";
  import { useState } from "react";
  import { useNavigate } from "react-router-dom"; // Import useNavigate
  import colors from "../../constants/color";
  
  export default function CreateSupplier() {
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate(); // Initialize useNavigate
  
    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      // Handle form submission logic here
      // On success, navigate back to the supplier page
      // navigate("/suppliers"); // Uncomment this line when you have success logic
    };
  
    const handleBack = () => {
      navigate("/suppliers"); // Navigate back to the supplier page
    };
  
    return (
      <Container>
      <Typography
      variant="h4"
      align="center"
      padding={"5px"}
      sx={{ mb: 3, fontWeight: 'bold' }} 
    >
      Cập nhật nhà cung cấp
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
        margin: 'auto', 
  
  }}
>
          {error && <Alert severity="error">{error}</Alert>}
  
          <Stack spacing={2} mb={2} sx={{ alignItems: "center" }}>
            <FormControl sx={{ width: "60%" }}>
              <FormLabel htmlFor="name" sx={{ textAlign: "left" }}>
                Tên nhà cung cấp:
              </FormLabel>
              <TextField name="name" variant="outlined" />
            </FormControl>
            
            <FormControl sx={{ width: "60%" }}>
              <FormLabel htmlFor="phone" sx={{ textAlign: "left" }}>
                Số điện thoại:
              </FormLabel>
              <TextField name="phone" variant="outlined" />
            </FormControl>
            
            <FormControl sx={{ width: "60%" }}>
              <FormLabel htmlFor="email" sx={{ textAlign: "left" }}>
                Email:
              </FormLabel>
              <TextField name="email" variant="outlined" type="email" />
            </FormControl>
            
            <FormControl sx={{ width: "60%" }}>
              <FormLabel htmlFor="address" sx={{ textAlign: "left" }}>
                Địa chỉ:
              </FormLabel>
              <TextField name="address" variant="outlined" type="text" />
            </FormControl>
          </Stack>
  
          <Stack direction="row" spacing={2} mb={2} sx={{ justifyContent: "center" }}>
            <Button
              type="button"
              sx={{
                width: "30%", 
                backgroundColor: colors.secondaryColor,
                color: "white",
                fontSize: "0.875rem", 
                padding: "6px 12px",
              }}
              onClick={handleBack} 
            >
              Quay lại
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              sx={{
                width: "30%", 
                backgroundColor: colors.accentColor,
                color: "white",
                fontSize: "0.875rem", 
                padding: "6px 12px", 
              }}
            >
              Cập nhật
            </Button>
          </Stack>
        </Container>
      </Container>
    );
  }
  