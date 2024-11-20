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
import { NoteAddOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import {
  createUnitService,
  getUnitService,
  updateUnitService,
  deleteUnitService,
} from "../../../services/unit.service";
import { UnitSchema } from "../../../types/unitSchema";
import colors from "../../../constants/color";
import TextSearch from "../../../components/TextSeatch";

type Unit = {
  id: number;
  name: string;
};

const UnitPage = () => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [unit, setUnit] = useState<string>("");
  const [units, setUnits] = useState<Unit[]>([]);
  const [currentUnitId, setCurrentUnitId] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState<"name">("name");
  const sortCategories = (a: Unit, b: Unit) => {
    if (sortField === "name") {
      return sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    return 0;
  };

  const sortedUnits = [...units].sort(sortCategories);

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setUnit("");
  };

  const handleEditOpen = (unitId: number, unitName: string) => {
    setCurrentUnitId(unitId);
    setUnit(unitName);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setUnit("");
    setCurrentUnitId(null);
  };

  const handleDeleteOpen = (unitId: number) => {
    setCurrentUnitId(unitId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteConfirmOpen(false);
    setCurrentUnitId(null);
  };

  const showSnackbar = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleCreateUnit = async () => {
    try {
      if (!unit) {
        showSnackbar("Vui lòng nhập tên đơn vị");
        return;
      }
      await createUnitService(unit);
      showSnackbar("Tạo đơn vị thành công");
      getUnits();
      handleClose();
    } catch (error) {
      console.error(error);
      showSnackbar("Tạo đơn vị thất bại");
    }
  };

  const handleUpdateUnit = async () => {
    if (currentUnitId) {
      const unitSchema = UnitSchema.parse({ name: unit });
      try {
        await updateUnitService(currentUnitId, unitSchema);
        showSnackbar("Cập nhật đơn vị thành công");
        getUnits();
        handleEditClose();
      } catch (error) {
        console.error(error);
        showSnackbar("Cập nhật thất bại");
      }
    }
  };

  const handleDeleteUnit = async () => {
    if (currentUnitId) {
      try {
        await deleteUnitService(currentUnitId);
        showSnackbar("Xóa đơn vị thành công");
        getUnits();
        handleDeleteClose();
      } catch (error) {
        console.error(error);
        showSnackbar("Xóa thất bại");
      }
    }
  };

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };
  const getUnits = async () => {
    const response = await getUnitService();
    setUnits(response.data);
  };

  useEffect(() => {
    getUnits();
  }, []);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: "80%", height: "100vh", pt: 4 }}>
      <Typography
        variant="h5"
        align="center"
        padding={"5px"}
        fontWeight={"600"}
      >
        DANH SÁCH ĐƠN VỊ TÍNH
      </Typography>
      <Stack
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        paddingBottom={3}
      >
        {/* <TextField
          id="search"
          label="Tìm kiếm đơn vị"
          variant="filled"
          size="small"
          sx={styles.searchField}
        /> */}
        <TextSearch
          props={{
            placeholder: "Nhập tên đơn vị cần tìm",
            state: search,
            setState: handleChangeSearch,
          }}
        />
        <Tooltip title="Thêm đơn vị" arrow>
          <IconButton
            onClick={handleOpen}
            aria-label="add"
            size="large"
            color="success"
          >
            <NoteAddOutlined fontSize="large" />
          </IconButton>
        </Tooltip>

        {/* Add Unit Modal */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="add-unit-modal"
          aria-describedby="add-unit-modal-description"
          sx={styles.modal}
        >
          <Box sx={styles.modalContent}>
            <Typography variant="h6" id="add-unit-modal">
              Thêm đơn vị
            </Typography>
            <TextField
              sx={styles.inputField}
              label="Tên đơn vị"
              variant="outlined"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
            <Box sx={styles.buttonContainer}>
              <Button onClick={handleClose} sx={styles.closeButton}>
                Đóng
              </Button>
              <Button sx={styles.addButton} onClick={handleCreateUnit}>
                Thêm
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Edit Unit Modal */}
        <Modal
          open={editOpen}
          onClose={handleEditClose}
          aria-labelledby="edit-unit-modal"
          aria-describedby="edit-unit-modal-description"
          sx={styles.modal}
        >
          <Box sx={styles.modalContent}>
            <Typography variant="h6" id="edit-unit-modal">
              Chỉnh sửa đơn vị
            </Typography>
            <TextField
              sx={styles.inputField}
              label="Tên đơn vị"
              variant="outlined"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />
            <Box sx={styles.buttonContainer}>
              <Button onClick={handleEditClose} sx={styles.closeButton}>
                Đóng
              </Button>
              <Button sx={styles.addButton} onClick={handleUpdateUnit}>
                Cập nhật
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          open={deleteConfirmOpen}
          onClose={handleDeleteClose}
          aria-labelledby="delete-unit-modal"
          aria-describedby="delete-unit-modal-description"
          sx={styles.modal}
        >
          <Box sx={styles.modalContent}>
            <Typography variant="h6" id="delete-unit-modal">
              Xác nhận xóa
            </Typography>
            <Typography>Bạn có chắc chắn muốn xóa đơn vị này không?</Typography>
            <Box sx={styles.buttonContainer}>
              <Button onClick={handleDeleteClose} sx={styles.closeButton}>
                Hủy
              </Button>
              <Button sx={styles.addButton} onClick={handleDeleteUnit}>
                Xóa
              </Button>
            </Box>
          </Box>
        </Modal>
      </Stack>

      <TableContainer component={Paper} sx={styles.tableContainer}>
        <Table aria-label="custom pagination table" size="small">
          <TableHead sx={styles.tableHead}>
            <TableRow>
              <TableCell
                align={"center"}
                sx={styles.tableCellHeader}
                onClick={() => {
                  setSortField("name");
                  toggleSortOrder();
                }}
                style={{ cursor: "pointer" }}
              >
                Tên đơn vị tính
                <span style={{ marginLeft: "15px" }}>
                  {sortOrder === "asc" ? "↑" : "↓"}
                </span>
              </TableCell>
              <TableCell align={"center"} sx={styles.tableCellHeader}>
                Hành động
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedUnits
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((unit) => (
                <TableRow hover key={unit.id}>
                  <TableCell align="left" sx={styles.tableCell}>
                    {unit.name}
                  </TableCell>
                  <TableCell align="center" sx={styles.tableCell}>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteOpen(unit.id)}
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                    <IconButton
                      color="warning"
                      onClick={() => handleEditOpen(unit.id, unit.name)}
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
                rowsPerPageOptions={[5, 10, 25, { label: "Tất cả", value: -1 }]}
                colSpan={3}
                count={units.length}
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
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

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

export default UnitPage;
