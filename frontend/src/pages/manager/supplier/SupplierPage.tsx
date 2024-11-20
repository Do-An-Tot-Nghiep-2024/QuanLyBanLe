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
  Typography,
  TableBody,
  TableFooter,
  TablePagination,
  Snackbar,
  Alert,
  Modal,
  Button,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useNavigate } from "react-router-dom";
import colors from "../../../constants/color";
import {
  getSuppliersService,
  deleteSupplierService,
} from "../../../services/supplier.service";
import { useEffect, useState } from "react";
import TextSearch from "../../../components/TextSeatch";

interface Supplier {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
}

export default function SupplierPage() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(
    null
  );
  const [sortField, setSortField] = useState<keyof Supplier | null>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");

  const getSuppliers = async () => {
    const response = await getSuppliersService();
    let sortedSuppliers = response.data.responseList;

    // Filter based on search term
    if (searchTerm) {
      sortedSuppliers = sortedSuppliers.filter((supplier: { name: string }) =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort suppliers
    if (sortField) {
      sortedSuppliers.sort(
        (a: { [x: string]: number }, b: { [x: string]: number }) => {
          if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
          if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
          return 0;
        }
      );
    }

    setSuppliers(sortedSuppliers);
  };

  const handleDeleteClick = (supplier: Supplier) => {
    setSupplierToDelete(supplier);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!supplierToDelete) return;

    try {
      await deleteSupplierService(supplierToDelete.id);
      setAlertMessage("Nhà cung cấp đã được xóa thành công!");
      setSnackbarOpen(true);
      getSuppliers();
    } catch (error) {
      setAlertMessage("Có lỗi xảy ra khi xóa nhà cung cấp.");
      setSnackbarOpen(true);
    } finally {
      setConfirmOpen(false);
      setSupplierToDelete(null);
    }
  };

  const columns: Array<{
    label: string;
    field?: keyof Supplier;
    width?: string;
    maxWidth?: string;
  }> = [
    { label: "Tên", field: "name", width: "15%", maxWidth: "200px" },
    { label: "Số điện thoại", field: "phone", width: "15%", maxWidth: "150px" },
    { label: "Email", field: "email", width: "20%", maxWidth: "200px" },
    { label: "Địa chỉ", field: "address", width: "40%", maxWidth: "300px" },
    { label: "Hành động", width: "10%", maxWidth: "100px" },
  ];

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    getSuppliers();
  }, [sortField, sortOrder, searchTerm]);

  return (
    <Box sx={{ pt: 4 }}>
      <Typography
        variant="h5"
        align="center"
        padding={"5px"}
        fontWeight={"600"}
      >
        DANH SÁCH NHÀ CUNG CẤP
      </Typography>
      <Box>
        <Stack
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          paddingBottom={2}
        >
          {/* <TextField
            id="search"
            label="Tìm kiếm"
            variant="filled"
            size="small"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              getSuppliers();
            }}
            sx={{
              display: { xs: "none", md: "inline-block", sm: "flex" },
              mr: 1,
              width: "90%",
            }}
          /> */}
          <TextSearch
            props={{
              placeholder: "Nhập tên nhà cung cấp cần tìm",
              state: searchTerm,
              setState: handleChangeSearch,
            }}
          />
          <Tooltip title="Thêm nhà cung cấp" arrow>
            <IconButton
              onClick={() => {
                navigate("/create-supplier");
              }}
              aria-label="import"
              size="medium"
              color="success"
            >
              <AddBoxIcon fontSize="large" />
            </IconButton>
          </Tooltip>
        </Stack>

        <TableContainer
          component={Paper}
          sx={{
            width: "900px",
            margin: "auto",
            backgroundColor: "white",
            maxHeight: "700px",
            overflowY: "auto",
          }}
        >
          <Table aria-label="custom pagination table" size="small">
            <TableHead sx={{ backgroundColor: colors.secondaryColor }}>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.label}
                    align={"center"}
                    sx={{
                      width: column.width,
                      maxWidth: column.maxWidth,
                      ...styles.tableCellHeader,
                    }}
                    onClick={() => {
                      if (column.field) {
                        setSortField(column.field);
                        setSortOrder((prevOrder) =>
                          prevOrder === "asc" ? "desc" : "asc"
                        );
                      }
                    }}
                    style={{ cursor: column.field ? "pointer" : "default" }}
                  >
                    {column.label}
                    {column.field && (
                      <span style={{ marginLeft: "15px" }}>
                        {sortField === column.field
                          ? sortOrder === "asc"
                            ? "↑"
                            : "↓"
                          : ""}
                      </span>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow
                  hover
                  key={supplier.id}
                  sx={{ height: "60px", overflow: "hidden" }}
                >
                  <TableCell align={"center"} sx={styles.tableCell}>
                    {supplier.name}
                  </TableCell>
                  <TableCell align={"center"} sx={styles.tableCell}>
                    {supplier.phone}
                  </TableCell>
                  <TableCell align={"center"} sx={styles.tableCell}>
                    {supplier.email}
                  </TableCell>
                  <TableCell align={"left"} sx={styles.tableCell}>
                    <Typography
                      variant="body2"
                      sx={{ wordWrap: "break-word", whiteSpace: "normal" }}
                    >
                      {supplier.address}
                    </Typography>
                  </TableCell>
                  <TableCell align={"center"}>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(supplier)}
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                    <IconButton
                      color="warning"
                      onClick={() =>
                        navigate(`/update-supplier/${supplier.id}`)
                      }
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
        <Alert onClose={() => setSnackbarOpen(false)} sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        aria-labelledby="delete-confirmation-modal"
        aria-describedby="delete-confirmation-modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "auto",
        }}
      >
        <Box style={styles.modalContent}>
          <h3 id="delete-confirmation-modal">Xác nhận xóa nhà cung cấp</h3>
          <p>
            Bạn có chắc chắn muốn xóa nhà cung cấp{" "}
            <strong>{supplierToDelete?.name}</strong> không?
          </p>
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
        </Box>
      </Modal>
    </Box>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
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
  tableCellHeader: {
    fontWeight: "bold",
  },
  tableCell: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
};
