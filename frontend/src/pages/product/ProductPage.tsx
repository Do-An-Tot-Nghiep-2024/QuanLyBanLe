import {
  Box,
  IconButton,
  Paper,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  TableBody,
  TableFooter,
  TablePagination,
  Snackbar,
  Alert,
  Tooltip,
  Modal,
  Button,
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
export default function ProductPage() {
  const navigate = useNavigate();
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [productToDelete, setProductToDelete] = useState(null);

  const columns = ["Hình ảnh", "Tên sản phẩm", "Danh mục", "Hành động"];

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await getProductsService();
      setProducts(response.data.responseList as any);
    };
    fetchProducts();
  }, []);

  const handleCreateCategory = async () => {
    try {
      await createCategoryService(category);
      setAlertMessage("Tạo danh mục thành công");
      setAlertOpen(true);
      setCategory(""); // Clear input
    } catch (error) {
      console.error(error);
      setAlertMessage("Tạo danh mục thất bại");
    } finally {
      setOpen(false);
      setTimeout(() => setAlertMessage(""), 3000);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await deleteProductService(productToDelete.id);
      setProducts(
        products.filter((product) => product.id !== productToDelete.id)
      );
      setAlertMessage("Xóa sản phẩm thành công");
      setAlertOpen(true);
    } catch (error) {
      console.error(error);
      setAlertMessage("Xóa sản phẩm thất bại");
    } finally {
      setConfirmOpen(false);
      setProductToDelete(null); // Clear product to delete
      setTimeout(() => setAlertMessage(""), 3000);
    }
  };

  return (
    <>
      <Typography variant="h5" align="center" padding="5px">
        Danh mục sản phẩm
      </Typography>
      <Box sx={{ width: "80%" }}>
        <Stack
          mb={2}
          direction="row"
          justifyContent="space-between"
          sx={{ width: "100%" }}
        >
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
        </Stack>

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

      {/* Confirmation Modal for Deletion */}
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="delete-confirmation-modal"
        aria-describedby="delete-confirmation-modal-description"
        sx={styles.modal}
      >
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
            >
              Hủy
            </Button>
            <Button onClick={handleDeleteProduct} sx={styles.addButton}>
              Xóa
            </Button>
          </Stack>
        </Box>
      </Modal>

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
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

const styles = {
  tableContainer: {
    width: "100%",
    backgroundColor: "white",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)",
  },
  tableHeaderCell: {
    border: "1px solid #d4d2d2",
    fontWeight: "bold",
  },
  tableCell: {
    border: "1px solid #d4d2d2",
  },
  productImage: {
    height: 100,
    width: 100,
    maxHeight: { xs: 233, md: 167 },
    maxWidth: { xs: 350, md: 250 },
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "auto",
  },
  modalContent: {
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

// export default CategoryPage;
