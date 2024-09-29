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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddBoxIcon from "@mui/icons-material/AddBox";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useNavigate } from "react-router-dom";

export default function SupplierPage() {
  const navigate = useNavigate();

  // Example supplier data
  const suppliers = [
    { id: 1, name: "Nhà Cung Cấp 1", phone: "0123456789", email: "supplier1@example.com", address: "123 Đường ABC" },
    { id: 2, name: "Nhà Cung Cấp 2", phone: "0987654321", email: "supplier2@example.com", address: "456 Đường DEF" },
    { id: 3, name: "Nhà Cung Cấp 3", phone: "0112233445", email: "supplier3@example.com", address: "789 Đường GHI" },
    { id: 4, name: "Nhà Cung Cấp 4", phone: "0167890123", email: "supplier4@example.com", address: "101 Đường JKL" },
  ];

  const columns = ["Tên", "Số điện thoại", "Email", "Địa chỉ", "Hành động"];

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
          <IconButton
            onClick={() => {
              navigate("/create-supplier");
            }}
            aria-label="import"
            size="small"
            color="success"
          >
            <AddBoxIcon />
          </IconButton>
        </Stack>

        <TableContainer component={Paper} sx={{ width: "100%" }}>
          <Table aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column} align={"center"}>
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow hover key={supplier.id}>
                  <TableCell align={"center"}>{supplier.name}</TableCell>
                  <TableCell align={"center"}>{supplier.phone}</TableCell>
                  <TableCell align={"center"}>{supplier.email}</TableCell>
                  <TableCell align={"center"}>{supplier.address}</TableCell>
                  <TableCell align={"center"}>
                    <IconButton color="error">
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
                  colSpan={3}
                  count={suppliers.length} // Total count of suppliers
                  rowsPerPage={10}
                  page={0} // Set current page
                  onPageChange={() => {}} // Implement page change logic
                  onRowsPerPageChange={() => {}} // Implement rows per page change logic
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
