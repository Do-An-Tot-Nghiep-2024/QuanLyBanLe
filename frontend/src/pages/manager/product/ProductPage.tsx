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
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useAppSelector } from "../../../redux/hook";
import TextSearch from "../../../components/TextSeatch";
import colors from "../../../constants/color";
import { formatMoney, formatMoneyThousand } from "../../../utils/formatMoney";
import { getCategoriesService } from "../../../services/category.service";
import CategoryResponse from "../../../types/category/categoryResponse";
import ProductResponse from "../../../types/product/productResponse";
import useDebounce from "../../../hooks/useDebounce";

export default function ProductPage() {
  const navigate = useNavigate();
  const auth = useAppSelector((state) => state.auth);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [category, setCategory] = useState("");
  const [selectProduct, setSelectProduct] = useState<ProductResponse>();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(0);
  // const [limit, setLimit] = useState(10);
  // const [searchTerm, setSearchTerm] = useState("");
  const [openPriceModal, setOpenPriceModal] = useState(false);
  // const [productToUpdate, setProductToUpdate] =
  //   useState<GetProductSchema | null>(null);
  const [newPrice, setNewPrice] = useState("");

  const search = useDebounce(searchName, 500);

  const handleError = (message: string) => {
    setAlertMessage(message);
    setAlertOpen(true);
    return;
  };

  const fetchProducts = async (
    name: string,
    category: string,
    page: number
  ) => {
    try {
      const response = await getAllProductsService(name, category, page);
      if (response.message !== "success") {
        handleError(response.message);
      }
      return response.data;
    } catch (error: any) {
      handleError(error.message as string);
    }
  };
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["products", page, category, search],
    queryFn: () => fetchProducts(search, category, page),
    refetchOnWindowFocus: false,
    // queryFn: fetchProducts({name:searchName,category,page}),
  });

  const getCategories = async () => {
    try {
      const response = await getCategoriesService();
      if (response.message !== "success") {
        handleError(response.message);
      }
      return response.data as CategoryResponse[];
    } catch (error: any) {
      handleError(error.message as string);
    }
  };

  const {
    data: categoriesResponse,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    error: errorCategories,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    refetchOnWindowFocus: false,
  });

  if (isLoadingCategories || isLoading) {
    return <div>Loading...</div>;
  }
  if (isErrorCategories) {
    return <div>Error: {errorCategories.message}</div>;
  }

  const fitImage = (image: string) => {
    const split = image.split("/");
    let rs = "";
    for (let i = 0; i < split.length; i++) {
      if (i === 5) {
        rs += split[i] + "/c_fit,h_250,w_250/";
      } else {
        rs += split[i] + "/";
      }
    }
    
    return rs.substring(0, rs.length - 1);
  };

  const handleDeleteProduct = async () => {
    if (!selectProduct) return;
    try {
      await deleteProductService(Number(selectProduct.id));
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
    setPage(Number(newPage) - 1);
  };

  // const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
  //   setLimit(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

  const handleOpenPriceModal = (product: ProductResponse) => {
    // console.log(product);

    // setProductToUpdate(product);
    setNewPrice(product.price.toString());
    setOpenPriceModal(true);
  };

  const handleClosePriceModal = () => {
    setOpenPriceModal(false);
    setNewPrice("");
    // setProductToUpdate(null);
  };

  const handleUpdatePrice = async () => {
    if (!selectProduct || !newPrice) return;
    try {
      const response = await updateProductPriceService(
        Number(selectProduct.id),
        Number(newPrice)
      );
      // console.log(response);
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

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(event.target.value);
  };

  const handleChangeNewPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawInput = event.target.value.replace(/[^\d]/g, ""); // Remove non-numeric characters
    // const input = Number(rawInput);
    setNewPrice(rawInput);
  };

  
  // console.log(page);
  return (
    <Box sx={{ width: "90%", height: "100%", py: 4 }}>
      <Box>
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
          <TextSearch
            props={{
              placeholder: "Nhập tên sản phẩm cần tìm",
              state: searchName,
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
          // selectionFollowsFocus
          value={selectedCategory}
          // onChange={(_event, newValue) => setSelectedCategory(newValue)}
          sx={{ mb: 2 }}
        >
          <Tab
            label={"Tất cả"}
            value=""
            onClick={() => {
              setCategory("");
              setSelectedCategory("");
            }}
          />
          {categoriesResponse !== undefined &&
            categoriesResponse.map((category) => (
              <Tab
                onClick={() => {
                  setCategory(category.name);
                  setSelectedCategory(category.name);
                }}
                key={category.id}
                label={category.name}
                value={category.name}
              />
            ))}
        </Tabs>

        <Grid container spacing={2}>
          {isLoading ? (
            <Grid size="auto" display="flex" justifyContent="center">
              <CircularProgress />
            </Grid>
          ) : isError ? (
            <Grid size="auto" display="flex" justifyContent="center">
              <Typography variant="h6">Error: {error.message}</Typography>
            </Grid>
          ) : data !== undefined && data?.responseList?.length ? (
            data?.responseList?.map((product) => (
              <Grid size={{ sm: 12, md: 6, lg: 4 }} key={Number(product.id)}>
                <Card
                  sx={{
                    // width: 300,
                    // height: 200,
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "white",
                    boxShadow: 3,
                    borderRadius: 2,
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={fitImage(product.image) as string}
                    alt={product.name as string}
                    sx={{ objectFit: "cover", padding: 1 }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      noWrap
                      sx={{
                        fontSize: "1rem",
                        fontWeight: "bold",
                        textAlign: "center",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        height: "2em", // Adjust based on desired fixed height
                        lineHeight: "2em",
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Danh mục: {product.category}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Đơn vị tính: {product.unit}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Giá gốc: {product.originalPrice}
                    </Typography>
                    <Typography
                      fontFamily="sans-serif"
                      fontSize={20}
                      align="center"
                      color="#000"
                    >
                      {formatMoney(Number(product.price))}
                    </Typography>
                  </CardContent>
                  {auth.role === "MANAGER" ? (
                    <Box display="flex" justifyContent="center" padding={1}>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setSelectProduct(product);
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
                        onClick={() => {
                          setSelectProduct(product);
                          handleOpenPriceModal(product);
                        }}
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

        <Pagination
          sx={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            my: 2,
            // mt: 3,
          }}
          count={data ? data.totalPages : 0}
          page={page + 1}
          onChange={handleChangePage}
          variant="outlined"
          shape="rounded"
        />
      </Box>

      {/* Confirmation Modal for Deleting Product */}
      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <Box sx={styles.modalContent}>
          <Typography variant="h6">Xác nhận xóa sản phẩm</Typography>
          <Typography>
            Bạn có chắc chắn muốn xóa sản phẩm{" "}
            <strong>{selectProduct?.name}</strong> không?
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
            Giá nhập: {Number(selectProduct?.originalPrice)} VND
          </Typography>

          <Typography>Giá cũ: {Number(selectProduct?.price)} VND</Typography>
          <TextField
            label="Nhập giá mới"
            variant="outlined"
            type="text" // Use type="text" for better handling of raw input
            value={newPrice ? formatMoneyThousand(Number(newPrice)) : ""}
            onChange={handleChangeNewPrice}
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
          severity="success"
          sx={{ width: "100%" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Box>
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
