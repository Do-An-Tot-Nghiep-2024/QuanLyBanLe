import {
  Box,
  IconButton,
  Stack,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Tooltip,
  Modal,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Tabs,
  Tab,
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import NoteAddOutlined from "@mui/icons-material/NoteAddOutlined";
import { useNavigate } from "react-router-dom";
import colors from "../../constants/color";
import { useEffect, useState } from "react";
import { createCategoryService } from "../../services/category.service";
import {
  getProductsService,
  deleteProductService,
} from "../../services/product.service";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
=======
import { SetStateAction, useEffect, useState } from "react";
import { deleteProductService, getAllProductsService } from "../../services/product.service";
import ResponsePagination from "../../types/responsePagination";
import { useQuery } from "@tanstack/react-query";
import { GetProductSchema } from "../../types/getProductSchema";
// import * as XLSX from "xlsx";
export default function ProductPage() {
  const navigate = useNavigate();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await getProductsService();
      setProducts(response.data.responseList as any);
    };
    fetchProducts();
  }, []);
  const [productToDelete, setProductToDelete] = useState<GetProductSchema>();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const fetchProducts = async () => {
    const response = await getAllProductsService();
    if (!response) {
      throw new Error("Error fetching products");
    }
    console.log(response.data);

    return response.data as unknown as ResponsePagination<GetProductSchema>;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["products", page, limit],
    queryFn: fetchProducts,
  });

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      await deleteProductService(productToDelete.id);
      setProducts(
        products.filter((product) => product.id !== productToDelete.id)
      );
      setAlertMessage("Xóa sản phẩm thành công");
      setAlertOpen(true);
      refetch();
    } catch (error) {
      console.error(error);
      setAlertMessage("Xóa sản phẩm thất bại");
    } finally {
      setConfirmOpen(false);
      setTimeout(() => setAlertMessage(""), 3000);
    }
  };

  const handleChangePage = (_event: any, newPage: SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string; }; }) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // const handleExcelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const data = new Uint8Array(e.target?.result as ArrayBuffer);
  //       const workbook = XLSX.read(data, { type: "array" });
  //       const sheetName = workbook.SheetNames[0];
  //       const sheet = workbook.Sheets[sheetName];
  //       const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // Get data as an array of arrays

  //       // Skip the header row
  //       jsonData.slice(1).forEach((row: any) => {
  //         const productData = {
  //           ...data?.responseList,
  //           name: row[0],
  //           categoryId: Number(row[1]),
  //           supplierId: Number(row[2]),
  //         };

  //         try {
  //           ProductSchema.parse(productData);
  //           createProductService(productData, imageFile); // Adjust if needed
  //         } catch (err: any) {
  //           setAlertMessage(err?.issues ? err.issues[0].message : "Lỗi khi tạo sản phẩm");
  //           setAlertSeverity("error");
  //           setSnackbarOpen(true);
  //         }
  //       });

  //       setAlertMessage("Sản phẩm đã được nhập thành công!");
  //       setAlertSeverity("success");
  //       setSnackbarOpen(true);
  //     };
  //     reader.readAsArrayBuffer(file);
  //   }
  // };

  const categories = Array.from(new Set(data?.responseList.map(product => product.category))).concat("All").sort();

  const filteredProducts = selectedCategory === "All"
    ? data?.responseList
    : data?.responseList.filter(product => product.category === selectedCategory);

  return (
    <>
      <Typography variant="h5" align="center" padding="5px">
        Danh mục sản phẩm
      </Typography>
      <Box sx={{ width: "80%", margin: "0 auto" }}>
        <Stack mb={2} direction="row" justifyContent="space-between">
          <TextField
            id="search"
            label="Tìm kiếm sản phẩm"
            variant="filled"
            size="small"
            sx={{
              display: { xs: "none", md: "inline-block", sm: "flex" },
              mr: 1,
              width: "100%",
              mt: 2,
            }}
          />
          <Tooltip title="Thêm sản phẩm" arrow>
            <IconButton
              onClick={() => navigate("/create-product")}
              size="large"
              color="success"
            >
              <AddBoxIcon sx={{ width: "100%" }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Quản lí danh mục sản phẩm" arrow>
            <IconButton
              onClick={() => navigate("/categories")}
              size="large"
              color="success"
            >
              <NoteAddOutlined sx={{ width: "100%" }} />
            </IconButton>
          </Tooltip>
          <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="add-category-modal"
            aria-describedby="add-category-modal-description"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "auto",
            }}
          >
            <Box
              sx={{
                backgroundColor: "white",
                padding: "10px",
                borderRadius: "8px",
                height: "30vh",
                width: "30vw",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "30px",
              }}
            >
              <h3 id="add-category-modal">Thêm danh mục sản phẩm</h3>
              <TextField
                fullWidth
                label="Tên danh mục"
                variant="outlined"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <Stack
                direction="row"
                gap="40px"
                justifyContent="center"
                width="100%"
              >
                <Button onClick={() => setOpen(false)} sx={styles.closeButton}>
                  Đóng
                </Button>
                <Button onClick={handleCreateCategory} sx={styles.addButton}>
                  Thêm
                </Button>
              </Stack>
            </Box>
          </Modal>
=======
            sx={{ width: "100%", mt: 2, display: { xs: "none", md: "inline-block", sm: "flex" } }}
          />
          <Tooltip title="Thêm sản phẩm" arrow>
            <IconButton onClick={() => navigate("/create-product")} size="large" color="success">
              <AddBoxIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Import sản phẩm" arrow>
            <IconButton onClick={() => navigate("/create-product")} size="large" color="success">
              <AddBoxIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Quản lí danh mục sản phẩm" arrow>
            <IconButton onClick={() => navigate("/categories")} size="large" color="success">
              <NoteAddOutlined />
            </IconButton>
          </Tooltip>
        </Stack>
        <Tabs value={selectedCategory} onChange={(_event, newValue) => setSelectedCategory(newValue)} sx={{ mb: 2 }}>
          {categories.map((category) => (
            <Tab key={String(category)} label={category} value={category} />
          ))}
        </Tabs>

        <TableContainer component={Paper} sx={styles.tableContainer}>
          <Table aria-label="custom pagination table">
            <TableHead sx={{ backgroundColor: colors.secondaryColor }}>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column}
                    align="center"
                    sx={styles.tableHeaderCell}
                  >
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product: any) => (
                <TableRow hover key={product.id}>
                  <TableCell align="center" sx={styles.tableCell}>
                    <Box
                      component="img"
                      sx={styles.productImage}
                      alt={product.name}
                      src={product.image}
                    />
                  </TableCell>
                  <TableCell align="left" sx={styles.tableCell}>
                    {product?.name}
                  </TableCell>
                  <TableCell align="left" sx={styles.tableCell}>
                    {product?.category}
                  </TableCell>
                  <TableCell align="center" sx={styles.tableCell}>
        <Grid container spacing={1}>
          {isLoading ? (
            <Grid item xs={12} display="flex" justifyContent="center">
              <CircularProgress />
            </Grid>
          ) : isError ? (
            <Grid item xs={12} display="flex" justifyContent="center">
              <Typography variant="h6">Error: {error.message}</Typography>
            </Grid>
          ) : filteredProducts?.length && filteredProducts?.length > 0 ? (
            filteredProducts?.map((product) => (
              <Grid item xs={6} sm={3} md={3} key={Number(product.id)}>
                <Card
                  sx={{
                    width: 200,
                    height: 300,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'white',
                    boxShadow: 3,
                    borderRadius: 2,
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={product.image as string} 
                    alt={product.name as string} 
                    sx={{ objectFit: 'cover', padding: 1 }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography>{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(product.price))}
                    </Typography>
                  </CardContent>
                  <Box display="flex" justifyContent="center" padding={1}>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setProductToDelete(product);
                        setConfirmOpen(true);
                      }}
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                    <IconButton
                      color="warning"
                      onClick={() => navigate(`/update-product/${product.id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="success"
                      onClick={() => navigate(`/reports/product-price/${product.id}`)}
                    >
                      <TrendingUpIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={3}
                  count={products.length}
                  rowsPerPage={10}
                  page={0}
                  onPageChange={() => {}}
                  onRowsPerPageChange={() => {}}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
                  </Box>
                </Card>

              </Grid>
            ))
          ) : (
            <Grid item xs={12} display="flex" justifyContent="center">
              <Typography variant="h6">No products found</Typography>
            </Grid>
          )}
        </Grid>

        {/* Pagination Component */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
          count={data ? data.totalPages : 0}
          rowsPerPage={limit}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ marginTop: 2 }}
        />
      </Box>

      {/* Confirmation Modal for Deleting Product */}
      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <Box sx={styles.modalContent}>
          <h3 id="delete-confirmation-modal">Xác nhận xóa sản phẩm</h3>
          <p>
            Bạn có chắc chắn muốn xóa sản phẩm{" "}
            <strong>{productToDelete?.name}</strong> không?
          </p>
          <Stack
            direction="row"
            gap="40px"
            justifyContent="center"
            width="100%"
          >
            <Button
              onClick={() => setConfirmOpen(false)}
              sx={styles.closeButton}
            />
          <Typography variant="h6">Xác nhận xóa sản phẩm</Typography>
          <Typography>
            Bạn có chắc chắn muốn xóa sản phẩm <strong>{productToDelete?.name}</strong> không?
          </Typography>
          <Stack direction="row" gap="40px" justifyContent="center" width="100%">
            <Button onClick={() => setConfirmOpen(false)} sx={styles.closeButton}>
              Hủy
            </Button>
            <Button onClick={handleDeleteProduct} sx={styles.addButton}>
              Xóa
            </Button>
          </Stack>
        </Box>
      </Modal>
      {/* Snackbar for Alerts */}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={alertOpen}
        autoHideDuration={3000}
        onClose={() => setAlertOpen(false)}
      >
        <Alert
          onClose={() => setAlertOpen(false)}
          severity="info"
          sx={{ width: "100%" }}
        >
        <Alert onClose={() => setAlertOpen(false)} severity="info" sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

const styles = {
  modalContent: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: 24,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    width: '30vw',
    height: '30vh',
  },
  closeButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: "8px",
    width: "30%",
  },
  addButton: {
    backgroundColor: colors.primaryColor,
    borderRadius: "8px",
    width: "30%",
    color: "white",
  },
};
