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
    Modal,
    Button,
    Tooltip,
    Snackbar,
    Alert,
  } from "@mui/material";
  import EditIcon from "@mui/icons-material/Edit";
  import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
  import { useNavigate } from "react-router-dom";
  import colors from "../../constants/color";
  import { NoteAddOutlined } from "@mui/icons-material";
  import { useEffect, useState } from "react";
  import {
    createCategoryService,
    getCategoriesService,
    updateCategoryService,
    deleteCategoryService,
  } from "../../services/category.service";
import { CategorySchema } from "../../types/categorySchema";
  
  export default function CategoryPage() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [category, setCategory] = useState<string>("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    
    // Pagination states
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
  
    const columns = ["Tên danh mục", "Hành động"];
  
    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
      setCategory(""); // Reset category for new addition
    };
  
    const handleEditOpen = (categoryId: number, categoryName: string) => {
      setCurrentCategoryId(categoryId);
      setCategory(categoryName);
      setEditOpen(true);
    };
  
    const handleEditClose = () => {
      setEditOpen(false);
      setCategory(""); // Reset category after edit
      setCurrentCategoryId(null); // Reset current category ID
    };
  
    const handleDeleteOpen = (categoryId: number) => {
      setCurrentCategoryId(categoryId);
      setDeleteConfirmOpen(true);
    };
  
    const handleDeleteClose = () => {
      setDeleteConfirmOpen(false);
      setCurrentCategoryId(null); // Reset current category ID
    };
  
    const showSnackbar = (message: string) => {
      setSnackbarMessage(message);
      setSnackbarOpen(true);
    };
  
    async function handleCreateCategory() {
      try {
        await createCategoryService(category);
        showSnackbar("Tạo danh mục thành công");
        getCategories();
        handleClose();
      } catch (error) {
        console.error(error);
        showSnackbar("Tạo danh mục thất bại");
      }
    }
  
    async function handleUpdateCategory() {
      if (currentCategoryId) {
        const categorySchema = CategorySchema.parse({ name: category });
        try {
          await updateCategoryService(currentCategoryId, categorySchema);
          showSnackbar("Cập nhật danh mục thành công");
          getCategories();
          handleEditClose();
        } catch (error) {
          console.error(error);
          showSnackbar("Cập nhật thất bại");
        }
      }
    }
  
    const handleDeleteCategory = async () => {
      if (currentCategoryId) {
        try {
          await deleteCategoryService(currentCategoryId);
          showSnackbar("Xóa danh mục thành công");
          getCategories();
          handleDeleteClose();
        } catch (error) {
          console.error(error);
          showSnackbar("Xóa thất bại");
        }
      }
    };
  
    const getCategories = async () => {
      const response = await getCategoriesService();
      setCategories(response.data);
    };
  
    useEffect(() => {
      getCategories();
    }, []);
  
    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };
  
    return (
      <>
        <Typography variant="h5" align="center" padding={"5px"}>
          Danh mục sản phẩm
        </Typography>
        <Box sx={{ width: "80%" }}>
          <Stack
            mb={2}
            display="flex"
            flexDirection={"row"}
            justifyContent={"space-between"}
            sx={{ width: "100%" }}
          >
            <TextField
              id="search"
              label="Tìm kiếm danh mục"
              variant="filled"
              size="small"
              sx={styles.searchField}
            />
            <Tooltip title="Thêm danh mục sản phẩm" arrow>
              <IconButton
                onClick={handleOpen}
                aria-label="import"
                size="large"
                color="success"
              >
                <NoteAddOutlined sx={{ width: "100%" }} />
              </IconButton>
            </Tooltip>
  
            {/* Modal for adding a category */}
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="add-category-modal"
              aria-describedby="add-category-modal-description"
              sx={styles.modal}
            >
              <div style={styles.modalContent}>
                <h3 id="add-category-modal">Thêm danh mục sản phẩm</h3>
                <TextField
                  style={styles.inputField}
                  label="Tên danh mục"
                  variant="outlined"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <div style={styles.buttonContainer}>
                  <Button
                    onClick={handleClose}
                    style={styles.closeButton}
                  >
                    Đóng
                  </Button>
                  <Button
                    style={styles.addButton}
                    onClick={handleCreateCategory}
                  >
                    Thêm
                  </Button>
                </div>
              </div>
            </Modal>
  
            {/* Modal for editing a category */}
            <Modal
              open={editOpen}
              onClose={handleEditClose}
              aria-labelledby="edit-category-modal"
              aria-describedby="edit-category-modal-description"
              sx={styles.modal}
            >
              <div style={styles.modalContent}>
                <h3 id="edit-category-modal">Chỉnh sửa danh mục sản phẩm</h3>
                <TextField
                  style={styles.inputField}
                  label="Tên danh mục"
                  variant="outlined"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
                <div style={styles.buttonContainer}>
                  <Button
                    onClick={handleEditClose}
                    style={styles.closeButton}
                  >
                    Đóng
                  </Button>
                  <Button
                    style={styles.addButton}
                    onClick={handleUpdateCategory}
                  >
                    Cập nhật
                  </Button>
                </div>
              </div>
            </Modal>
  
            {/* Confirmation modal for deletion */}
            <Modal
              open={deleteConfirmOpen}
              onClose={handleDeleteClose}
              aria-labelledby="delete-category-modal"
              aria-describedby="delete-category-modal-description"
              sx={styles.modal}
            >
              <div style={styles.modalContent}>
                <h3 id="delete-category-modal">Xác nhận xóa</h3>
                <Typography>Bạn có chắc chắn muốn xóa danh mục này không?</Typography>
                <div style={styles.buttonContainer}>
                  <Button
                    onClick={handleDeleteClose}
                    style={styles.closeButton}
                  >
                    Hủy
                  </Button>
                  <Button
                    style={styles.addButton}
                    onClick={handleDeleteCategory}
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            </Modal>
          </Stack>
  
          <TableContainer component={Paper} sx={styles.tableContainer}>
            <Table aria-label="custom pagination table">
              <TableHead sx={styles.tableHead}>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column}
                      align={"center"}
                      sx={styles.tableCellHeader}
                    >
                      {column}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((category) => (
                  <TableRow hover key={category.id}>
                    <TableCell align={"left"} sx={styles.tableCell}>
                      {category.name}
                    </TableCell>
                    <TableCell align={"center"} sx={styles.tableCell}>
                      <IconButton color="error" onClick={() => handleDeleteOpen(category.id)}>
                        <DeleteForeverIcon />
                      </IconButton>
                      <IconButton
                        color="warning"
                        onClick={() => handleEditOpen(category.id, category.name)}
                      >
                        <EditIcon />
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
                    count={categories.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
  
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </>
    );
  }
  
  const styles = {
    searchField: {
      display: { xs: "none", md: "inline-block", sm: "flex" },
      mr: 1,
      width: "100%",
      mt: 2,
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
      justifyContent: "center",
      alignItems: "center",
      margin: "auto",
      flexDirection: "column",
      gap: "30px",
    },
    inputField: {
      width: "90%",
    },
    buttonContainer: {
      display: "flex",
      flexDirection: "row",
      gap: "40px",
      width: "100%",
      justifyContent: "center",
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
    tableContainer: {
      width: "100%",
      backgroundColor: "white",
      boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)",
    },
    tableHead: {
      backgroundColor: colors.secondaryColor,
    },
    tableCellHeader: {
      border: "1px solid #d4d2d2",
      fontWeight: "bold",
    },
    tableCell: {
      border: "1px solid #d4d2d2",
    },
  };
  