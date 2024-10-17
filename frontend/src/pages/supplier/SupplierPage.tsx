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
  Modal,
  Button,
  Tooltip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useNavigate } from "react-router-dom";
import colors from "../../constants/color";
import { getSuppliersService, deleteSupplierService } from "../../services/supplier.service";
import { useEffect, useState } from "react";

export default function SupplierPage() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  const getSuppliers = async () => {
    const response = await getSuppliersService();
    setSuppliers(response.data.responseList);
  };

  const handleDeleteClick = (supplier : any) => {
    setSupplierToDelete(supplier);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!supplierToDelete) return;

    try {
      await deleteSupplierService(supplierToDelete.id);
      setAlertMessage("Nhà cung cấp đã được xóa thành công!");
      setAlertSeverity("success");
      setSnackbarOpen(true);
      getSuppliers(); 
    } catch (error) {
      setAlertMessage("Có lỗi xảy ra khi xóa nhà cung cấp.");
      setAlertSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setConfirmOpen(false);
      setSupplierToDelete(null);
    }
  };

  const columns = ["Tên", "Số điện thoại", "Email", "Địa chỉ", "Hành động"];

  useEffect(() => {
    getSuppliers();
  }, []);

  return (
    <>
      <Typography variant="h4" align="center" padding={"5px"}>
        Quản lý nhà cung cấp
      </Typography>
      <Box>
        <Stack
          mb={2}
          display="flex"
          flexDirection={"row"}
          justifyContent={"space-between"}
          sx={{ width: "100%" }}
        >
          <TextField
            id="search"
            label="Tìm kiếm"
            variant="filled"
            size="small"
            sx={{
              display: { xs: "none", md: "inline-block", sm: "flex" },
              mr: 1,
              width: "90%",
            }}
          />
          <Tooltip title="Thêm nhà cung cấp" arrow>
            <IconButton
            onClick={() => {
              navigate("/create-supplier");
            }}
            aria-label="import"
            size="30px"
color = "success"
            sx={{ width: "10%" }}
          >
            <AddBoxIcon />
            </IconButton>
            </Tooltip>
    
        </Stack>

        <TableContainer component={Paper} sx={{ width: "100%", margin: "auto", backgroundColor: 'white', height: "100%" }}>
          <Table aria-label="custom pagination table">
            <TableHead sx={{ backgroundColor: colors.secondaryColor }}>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column} align={"center"} sx={{ padding: "16px", fontSize: "1.2rem" }}>
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow hover key={supplier.id} sx={{ height: "60px" }}>
                  <TableCell align={"center"}>{supplier.name}</TableCell>
                  <TableCell align={"center"}>{supplier.phone}</TableCell>
                  <TableCell align={"center"}>{supplier.email}</TableCell>
                  <TableCell align={"left"}>
                    <Typography noWrap>{supplier.address}</Typography>
                  </TableCell>
                  <TableCell align={"center"}>
                    <IconButton color="error" onClick={() => handleDeleteClick(supplier)}>
                      <DeleteForeverIcon />
                    </IconButton>
                    <IconButton color="warning" onClick={() => navigate(`/update-supplier/${supplier.id}`)}>
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
                  colSpan={5}
                  count={suppliers.length}
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

      {/* Snackbar for alerts */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={alertSeverity}
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>

      {/* Modal for deletion confirmation */}
      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="delete-confirmation-modal"
        aria-describedby="delete-confirmation-modal-description"
        sx={styles.modal}
      >
        <div style={styles.modalContent}>
          <h3 id="delete-confirmation-modal">Xác nhận xóa nhà cung cấp</h3>
          <p>Bạn có chắc chắn muốn xóa nhà cung cấp <strong>{supplierToDelete?.name}</strong> không?</p>
          <div style={styles.buttonContainer}>
            <Button
              onClick={() => setConfirmOpen(false)}
              style={styles.closeButton}
            >
              Hủy
            </Button>
            <Button onClick={handleDelete} style={styles.addButton}>
              Xóa
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

const styles = {
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
};
