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
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Tabs,
  Tab,
  TablePagination,
  Pagination,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import EditIcon from "@mui/icons-material/Edit";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useNavigate } from "react-router-dom";
import { SetStateAction, useState } from "react";
import {
  deleteProductService,
  getAllProductsService,
  updateProductPriceService,
} from "../../../services/product.service";
import { useQuery } from "@tanstack/react-query";
import { GetProductSchema } from "../../../types/getProductSchema";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useAppSelector } from "../../../redux/hook";
import TextSearch from "../../../components/TextSeatch";
import colors from "../../../constants/color";

export default function ProductPage() {
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [productToDelete, setProductToDelete] = useState<GetProductSchema>();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [openPriceModal, setOpenPriceModal] = useState(false);
  const [productToUpdate, setProductToUpdate] =
    useState<GetProductSchema | null>(null);
  const [newPrice, setNewPrice] = useState<number | string>("");

  const fetchProducts = async () => {
    const response = await getAllProductsService();
    if (!response) {
      throw new Error("Error fetching products");
    }
    return response.data;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["products", page, limit],
    queryFn: fetchProducts,
  });

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      await deleteProductService(Number(productToDelete.id));
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

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenPriceModal = (product: GetProductSchema) => {
    setProductToUpdate(product);
    setNewPrice(Number(product.price));
    setOpenPriceModal(true);
  };

  const handleClosePriceModal = () => {
    setOpenPriceModal(false);
    setNewPrice("");
    setProductToUpdate(null);
  };

  const handleUpdatePrice = async () => {
    if (!productToUpdate || !newPrice) return;
    try {
      const response = await updateProductPriceService(
        Number(productToUpdate.id),
        Number(newPrice)
      );
      console.log(response);
      if (response.message === "success") {
        setAlertMessage("Cập nhật giá thành công");
        setAlertOpen(true);
        refetch();
        handleClosePriceModal();
        return;
      }
      // Make API call to update product price here (e.g., updateProductPriceService(updatedProduct))
      setAlertMessage("Cập nhật giá thất bại");
      setAlertOpen(true);
      refetch();
      handleClosePriceModal();
    } catch (error) {
      setAlertMessage("Cập nhật giá thất bại");
      setAlertOpen(true);
    } finally {
      setTimeout(() => setAlertMessage(""), 3000);
    }
  };

  const categories = Array.from(
    new Set(data?.responseList.map((product) => product.category))
  ).concat("All");

  const normalizeString = (str: string) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const filteredProducts = Array.isArray(data?.responseList)
    ? data?.responseList.filter((product) => {
        const matchesSearchTerm = normalizeString(
          String(product.name)
        ).includes(normalizeString(searchTerm));
        if (selectedCategory === "All") {
          return searchTerm ? matchesSearchTerm : true;
        } else {
          return (
            product.category === selectedCategory &&
            (!searchTerm || matchesSearchTerm)
          );
        }
      })
    : [];

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  return (
    <>
      <Box sx={{ width: "80%", height: "100vh", margin: "0 auto", pt: 4 }}>
        <Typography
          variant="h5"
          align="center"
          padding={"5px"}
          fontWeight={"600"}
        >
          DANH SÁCH SẢN PHẨM
        </Typography>
        <Stack
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          paddingBottom={5}
        >
          {/* <TextField
            id="search"
            label="Tìm kiếm sản phẩm"
            variant="filled"
            size="small"
            sx={{ width: "100%", mt: 2 }}
            onChange={(e) => setSearchTerm(e.target.value)}
          /> */}
          <TextSearch
            props={{
              placeholder: "Nhập tên sản phẩm cần tìm",
              state: searchTerm,
              setState: handleChangeSearch,
            }}
          />
          {auth?.role === "MANAGER" ? (
            <Tooltip title="Thêm sản phẩm" arrow>
              <IconButton
                onClick={() => navigate("/create-product")}
                size="medium"
                color="success"
                sx={{ width: "50px" }}
              >
                <AddBoxIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          ) : null}
        </Stack>

        <Tabs
          value={selectedCategory}
          onChange={(_event, newValue) => setSelectedCategory(newValue)}
          sx={{ mb: 2 }}
        >
          {categories.map((category) => (
            <Tab key={String(category)} label={category} value={category} />
          ))}
        </Tabs>

        <Grid container spacing={1}>
          {isLoading ? (
            <Grid size="auto" display="flex" justifyContent="center">
              <CircularProgress />
            </Grid>
          ) : isError ? (
            <Grid size="auto" display="flex" justifyContent="center">
              <Typography variant="h6">Error: {error.message}</Typography>
            </Grid>
          ) : filteredProducts?.length ? (
            filteredProducts.map((product) => (
              <Grid size="auto" key={Number(product.id)}>
                <Card
                  sx={{
                    width: 200,
                    height: 300,
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "white",
                    boxShadow: 3,
                    borderRadius: 2,
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={product.image as string}
                    alt={product.name as string}
                    sx={{ objectFit: "cover", padding: 1 }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography>{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Đơn vị tính: {product.unit}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(Number(product.price))}
                    </Typography>
                  </CardContent>
                  {auth.role === "MANAGER" ? (
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
                        onClick={() =>
                          navigate(`/update-product/${product.id}`)
                        }
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="success"
                        onClick={() => handleOpenPriceModal(product)}
                      >
                        <TrendingUpIcon />
                      </IconButton>
                    </Box>
                  ) : null}
                </Card>
              </Grid>
            ))
          ) : (
            <Grid size="auto" display="flex" justifyContent="center">
              <Typography variant="h6">No products found</Typography>
            </Grid>
          )}
        </Grid>

        {/* Pagination Component */}
        <TablePagination
          component={Pagination}
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
          <Typography variant="h6">Xác nhận xóa sản phẩm</Typography>
          <Typography>
            Bạn có chắc chắn muốn xóa sản phẩm{" "}
            <strong>{productToDelete?.name}</strong> không?
          </Typography>
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

      {/* Price Update Modal */}
      <Modal sx={{}} open={openPriceModal} onClose={handleClosePriceModal}>
        <Box sx={styles.modalContent}>
          <Typography variant="h6">Cập nhật giá sản phẩm</Typography>
          <Typography>
            Giá nhập: {Number(productToUpdate?.originalPrice)} VND
          </Typography>

          <Typography>Giá cũ: {Number(productToUpdate?.price)} VND</Typography>
          <TextField
            label="Nhập giá mới"
            variant="outlined"
            type="text" // Use type="text" for better handling of raw input
            value={
              newPrice === ""
                ? ""
                : new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(Number(newPrice))
            } // Show formatted value when newPrice is not empty
            onChange={(e) => {
              // Remove any non-numeric characters except for an empty string
              const newValue = e.target.value.replace(/[^\d]/g, "");

              // Update the raw numeric value or set it to empty string
              setNewPrice(newValue ? parseFloat(newValue) : ""); // set to empty string if invalid input
            }}
            fullWidth
            sx={{ mb: 2 }}
          />

          <Stack
            direction="row"
            gap="40px"
            justifyContent="center"
            width="100%"
          >
            <Button onClick={handleClosePriceModal} sx={styles.closeButton}>
              Hủy
            </Button>
            <Button onClick={handleUpdatePrice} sx={styles.addButton}>
              Cập nhật
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
          {alertMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

const styles = {
  modalContent: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: 24,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    width: "35vw",
    height: "40vh",
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
