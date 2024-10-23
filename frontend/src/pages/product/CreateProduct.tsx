// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import colors from "../../constants/color";
// import {
//   Stack,
//   FormControl,
//   FormLabel,
//   TextField,
//   Button,
//   Container,
//   Typography,
//   Select,
//   Input,
//   Alert,
// } from "@mui/material";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { createProductService } from "../../services/product.service";
// import { getCategoriesService } from "../../services/category.service";
// import { getSuppliersService } from "../../services/supplier.service";
// import { defaultProductSchema, ProductSchema } from "../../types/productSchema";

export default function CreateProduct() {
  //   const [error, setError] = useState<string | null>(null);
  //   const [categories, setCategories] = useState([]);
  //   const [suppliers, setSuppliers] = useState([]);
  //   const navigate = useNavigate();

  //   const {
  //     register,
  //     handleSubmit,
  //   } = useForm<ProductSchema>({
  //     mode: "all",
  //     resolver: zodResolver(ProductSchema),
  //     defaultValues: defaultProductSchema,
  //   });

  //   const onSubmit = async (data: any) => {
  //     console.log("data", data);

  //     try {
  //       const file = data.productImage[0]; // Get the uploaded image file
  //       const productRequest = {
  //         name: data.productName,
  //         categoryId: parseInt(data.categoryId, 10),
  //         supplierId: parseInt(data.supplierId, 10),
  //         originalPrice: parseFloat(data.originalPrice),
  //         price: parseFloat((data.originalPrice * 1.1).toFixed(2)),
  //       };

  //       const response = await createProductService(productRequest, file);
  //       if (response.message === "success") {
  //         console.log("Create product success");
  //         navigate("/products", {
  //           state: { createdSuccess: "Thêm mới sản phẩm thành công" },
  //         });
  //       } else {
  //         setError(response.message);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       setError("An error occurred while creating the product.");
  //     }
  //   };

  //   const handleBack = () => {
  //     navigate("/category");
  //   };

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       await getCategories();
  //       await getSuppliers();
  //     };

  //     fetchData();
  //   }, []); // Empty dependency array means this runs once when the component mounts

  //   const getCategories = async () => {
  //     const response = await getCategoriesService();
  //     console.log("categories", response.data);

  //     setCategories(response.data);
  //   };

  //   const getSuppliers = async () => {
  //     const response = await getSuppliersService();
  //     setSuppliers(response.data.responseList);
  //   };

  return (
    <main></main>
    // <Container>
    //       <Typography
    //         variant="h4"
    //         align="center"
    //         padding={"5px"}
    //         sx={{ mb: 1, fontWeight: "bold" }}
    //       >
    //         Thêm sản phẩm mới
    //       </Typography>

    //       {error && <Alert severity="error">{error}</Alert>}

    //       <Container
    //         component={"form"}
    //         onSubmit={handleSubmit(onSubmit)}
    //         sx={{
    //           boxShadow: 3,
    //           borderRadius: 2,
    //           padding: 5,
    //           backgroundColor: "white",
    //           width: "80%",
    //           margin: "auto",
    //         }}
    //       >
    //         <Stack spacing={2} mb={2} sx={{ alignItems: "center" }}>
    //           <FormControl sx={{ width: "60%" }}>
    //             <FormLabel htmlFor="supplierId" sx={{ textAlign: "left" }}>
    //               Tên nhà cung cấp:
    //             </FormLabel>
    //             <Select
    //               id="supplierId"
    //               {...register("supplier")}
    //               variant="outlined"
    //               displayEmpty
    //               native
    //             >
    //               <option value="" disabled>
    //                 Chọn nhà cung cấp
    //               </option>
    //               {suppliers.map((supplier: any) => (
    //                 <option key={supplier.id} value={supplier.id}>
    //                   {supplier.name}
    //                 </option>
    //               ))}
    //             </Select>
    //           </FormControl>

    //           <FormControl sx={{ width: "60%" }}>
    //             <FormLabel htmlFor="categoryId" sx={{ textAlign: "left" }}>
    //               Danh mục sản phẩm:
    //             </FormLabel>
    //             <Select
    //               id="categoryId"
    //               {...register("category")}
    //               variant="outlined"
    //               displayEmpty
    //               native
    //             >
    //               <option value="" disabled>
    //                 Chọn danh mục sản phẩm
    //               </option>
    //               {categories.map((category: any) => (
    //                 <option key={category.id} value={category.id}>
    //                   {category.name}
    //                 </option>
    //               ))}
    //             </Select>
    //           </FormControl>

    //           <FormControl sx={{ width: "60%" }}>
    //             <FormLabel htmlFor="name" sx={{ textAlign: "left" }}>
    //               Tên sản phẩm:
    //             </FormLabel>
    //             <TextField id="name" {...register("name")} variant="outlined" />
    //           </FormControl>

    //           <FormControl sx={{ width: "60%" }}>
    //             <FormLabel htmlFor="originalPrice" sx={{ textAlign: "left" }}>
    //               Giá gốc:
    //             </FormLabel>
    //             <TextField
    //               id="originalPrice"
    //               {...register("originalPrice")}
    //               variant="outlined"
    //               type="number"
    //               inputProps={{ min: 0 }}
    //             />
    //           </FormControl>

    //           <FormControl sx={{ width: "60%" }}>
    //             <FormLabel htmlFor="productImage" sx={{ textAlign: "left", mt: 1 }}>
    //               Hình ảnh sản phẩm:
    //             </FormLabel>
    //             {/* <Input id="productImage" {...register("file")} type="file" /> */}
    //           </FormControl>
    //         </Stack>

    //         <Stack
    //           direction="row"
    //           spacing={2}
    //           mb={2}
    //           sx={{ justifyContent: "center" }}
    //         >
    //           <Button
    //             type="button"
    //             sx={{
    //               width: "30%",
    //               backgroundColor: colors.secondaryColor,
    //               color: "white",
    //               fontSize: "0.875rem",
    //               padding: "6px 12px",
    //             }}
    //             onClick={handleBack}
    //           >
    //             Quay lại
    //           </Button>

    //           <Button
    //             type="submit"
    //             variant="contained"
    //             sx={{
    //               width: "30%",
    //               backgroundColor: colors.accentColor,
    //               color: "white",
    //               fontSize: "0.875rem",
    //               padding: "6px 12px",
    //             }}
    //           >
    //             Thêm sản phẩm mới

    //           </Button>
    //         </Stack>

    //       </Container>
    // </Container>
  );
}
