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
import colors from "../../constants/color";
import {
  getEmployeesService,
  deleteEmployeeService,
} from "../../services/employee.service";
import { useEffect, useState } from "react";
import TextSearch from "../../components/TextSeatch";

interface Employee {
  id: number;
  name: string;
  phone: string;
  email: string;
  dob: string;
}

export default function EmployeePage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );
  const [sortField, setSortField] = useState<keyof Employee | null>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [page] = useState(0); // Removed setPage since it's not used
  const [limit] = useState(5);
  const getEmployees = async () => {
    const response = await getEmployeesService(page, limit);
    let sortedEmployees = response.data.responseList;

    // Filter based on search term
    if (searchTerm) {
      sortedEmployees = sortedEmployees.filter((employee: { name: string }) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort employees
    if (sortField) {
      sortedEmployees.sort(
        (a: { [key: string]: string }, b: { [key: string]: string }) => {
          const aValue = a[sortField] as string;
          const bValue = b[sortField] as string;
          if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
          if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
          return 0;
        }
      );
    }

    setEmployees(sortedEmployees);
  };

  const handleDeleteClick = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!employeeToDelete) return;

    try {
      await deleteEmployeeService(employeeToDelete.id);
      setAlertMessage("Nhân viên đã được xóa thành công!");
      setSnackbarOpen(true);
      getEmployees();
    } catch (error) {
      setAlertMessage("Có lỗi xảy ra khi xóa nhân viên.");
      setSnackbarOpen(true);
    } finally {
      setConfirmOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const columns: Array<{
    label: string;
    field?: keyof Employee;
    width?: string;
    maxWidth?: string;
  }> = [
    { label: "Tên", field: "name", width: "25%", maxWidth: "200px" },
    { label: "Số điện thoại", field: "phone", width: "20%", maxWidth: "150px" },
    { label: "Email", field: "email", width: "20%", maxWidth: "200px" },
    { label: "Ngày sinh", field: "dob", width: "15%", maxWidth: "150px" },
    { label: "Hành động", width: "20%", maxWidth: "100px" },
  ];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    getEmployees();
  }, [sortField, sortOrder, searchTerm]);

  return (
    <>
      <Typography
        variant="h5"
        align="center"
        padding={"5px"}
        fontWeight={"600"}
      >
        DANH SÁCH NHÂN VIÊN
      </Typography>
      <Box>
        <Stack flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} paddingBottom={5}>
          <TextSearch
            props={{
              placeholder: "Nhập tên nhân viên cần tìm",
              state: searchTerm,
              setState: handleSearchChange,
            }}
          />
          <Tooltip title="Thêm nhân viên" arrow>
            <IconButton 
              onClick={() => navigate("/create-employee")}
              aria-label="import"
              size="medium"
              color="success"
              sx={{ width: "50px" }}
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
          <Table size="small" aria-label="custom pagination table">
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
              {employees.map((employee) => (
                <TableRow
                  hover
                  key={employee.id}
                  sx={{ height: "60px", overflow: "hidden" }}
                >
                  <TableCell align={"center"} sx={styles.tableCell}>
                    {employee.name}
                  </TableCell>
                  <TableCell align={"center"} sx={styles.tableCell}>
                    {employee.phone}
                  </TableCell>
                  <TableCell align={"center"} sx={styles.tableCell}>
                    {employee.email}
                  </TableCell>
                  <TableCell align={"center"} sx={styles.tableCell}>
                    {employee.dob}
                  </TableCell>
                  <TableCell align={"center"}>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(employee)}
                    >
                      <DeleteForeverIcon />
                    </IconButton>
                    <IconButton
                      color="warning"
                      onClick={() =>
                        navigate(`/update-employee/${employee.id}`)
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
                  count={employees.length}
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
          <h3 id="delete-confirmation-modal">Xác nhận xóa nhân viên</h3>
          <p>
            Bạn có chắc chắn muốn xóa nhân viên{" "}
            <strong>{employeeToDelete?.name}</strong> không?
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
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  modalContent: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    outline: "none",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px",
  },
  closeButton: {
    marginRight: "10px",
  },
  addButton: {
    backgroundColor: colors.primaryColor,
    color: "white",
  },
  tableCell: {
    wordWrap: "break-word",
    whiteSpace: "normal",
  },
  tableCellHeader: {
    fontWeight: "bold",
    cursor: "pointer",
  },
};
