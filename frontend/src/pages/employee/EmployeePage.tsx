import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { lazy, useState } from "react";
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
import {
  deleteEmployeeService,
  getEmployeesService,
} from "../../services/employee.service";
import ResponsePagination from "../../types/responsePagination";
import { SearchIcon } from "../../assets/svg/Icon";
import AddBoxIcon from "@mui/icons-material/AddBox";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import {
  defaultEmployeeSchema,
  EmployeeSchema,
} from "../../types/employeeSchema";
import { useNavigate, useLocation } from "react-router-dom";
import DialogDetail from "../../components/DialogDetail";
import DownloadBtn from "../../components/DownloadBtn";
const MessageAlert = lazy(() => import("../../components/MessageAlert"));

export default function EmployeePage() {
  const updateSuccess: string = useLocation().state?.updateSuccess ?? "";
  const [deleteSuccess, setDeleteSuccess] = useState<string>("");
  const [page, setPage] = useState(0); // Removed setPage since it's not used
  const [limit, setLimit] = useState(10);
  const navigate = useNavigate(); // Removed setLimit since it's not used
  const [employee, setEmployee] = useState<EmployeeSchema | null>(null);
  const [openAlert, setOpenAlert] = useState(true);
  const queryClient = useQueryClient();
  const columns: readonly string[] = [
    "Tên",
    "Số điện thoại",
    "Email",
    "Ngày sinh",
    "Tác động",
  ];

  const getEmployees = async (
    page: number,
    limit: number
  ): Promise<ResponsePagination<EmployeeSchema>> => {
    try {
      const response = await getEmployeesService(page, limit);
      console.log(response);
      if (!response.status) {
        throw new Error("Error fetching employees");
      }
      return response.data as ResponsePagination<EmployeeSchema>;
    } catch (error) {
      console.error(error);
      throw error; // Rethrow the error to be handled by useQuery
    }
  };

  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["employees", page, limit],
    queryFn: () => getEmployees(page, limit), // No need for async/await here
  });

  // how to detructuring data from useQuery
  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleOpenAlert = () => {
    setOpenAlert(false);
  };
  const handleDeleteEmployee = async (id: number) => {
    try {
      const response = await deleteEmployeeService(id);
      if (response?.message === "success") {
        console.log("Delete employee success");
        setDeleteSuccess("Xóa nhân viên thành công");
      }
    } catch (error) {
      console.error(error);
    }
  };
  // create a mutate with delete employee service
  const { mutate: deleteEmployee } = useMutation({
    mutationFn: (id: number) => handleDeleteEmployee(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees", page, limit] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };

  console.log("Total pages: ", data?.totalPages ?? 0);
  return (
    <>
      {updateSuccess && (
        <MessageAlert
          open={openAlert}
          setOpen={handleOpenAlert}
          message={updateSuccess}
        />
      )}
      {deleteSuccess && (
        <MessageAlert
          open={openAlert}
          setOpen={handleOpenAlert}
          message={deleteSuccess}
        />
      )}
      {isLoading || isFetching ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <>
          <Typography variant="h4" align="center" padding={"5px"}>
            Quản lý nhân viên
          </Typography>
          <Box>
            <Stack
              mb={2}
              display="flex"
              flexDirection={"row"}
              justifyContent={"space-between"}
              sx={{ width: "100%" }}
            >
              {/* create textfield  with search icon*/}
              <TextField
                id="search"
                label="Tìm kiếm"
                variant="filled"
                size="small"
                slotProps={{
                  input: {
                    endAdornment: (
                      <IconButton
                        type="button"
                        aria-label="Tìm kiếm"
                        size="small"
                      >
                        <SearchIcon />
                      </IconButton>
                    ),
                    sx: { pr: 0.5 },
                  },
                }}
                sx={{
                  display: { xs: "none", md: "inline-block", sm: "flex" },
                  mr: 1,
                  width: "90%",
                }}
              />

              {/* create import and export button */}
              <Stack direction="row" spacing={2}>
                <DownloadBtn fileName="danh-sach-nhan-vien" />

                <IconButton
                  onClick={() => {
                    navigate("/create-employee");
                  }}
                  type="button"
                  aria-label="import"
                  size="small"
                  color="success"
                >
                  <AddBoxIcon />
                </IconButton>
              </Stack>
            </Stack>

            <TableContainer component={Paper} sx={{ width: "100%" }}>
              <Table aria-label="custom pagination table">
                <TableHead>
                  <TableRow>
                    {columns.map((column: string) => (
                      <TableCell
                        colSpan={column === "Hành động" ? 3 : 1}
                        key={column}
                        align={"center"}
                      >
                        {column}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data !== undefined &&
                  data.responseList !== undefined &&
                  data.responseList.length > 0 ? (
                    data.responseList.map((row: EmployeeSchema) => (
                      <TableRow hover key={row.id}>
                        <TableCell align={"center"}>{row.name}</TableCell>
                        <TableCell align={"center"}>{row.phone}</TableCell>
                        <TableCell align={"center"}>{row.email}</TableCell>
                        <TableCell align={"center"}>{row.dob}</TableCell>
                        <TableCell align={"center"}>
                          <IconButton
                            color="success"
                            onClick={() => {
                              setEmployee(row);
                              setOpen(true);
                            }}
                          >
                            <RemoveRedEyeIcon />
                          </IconButton>
                        </TableCell>

                        <TableCell align={"center"}>
                          <IconButton
                            color="error"
                            onClick={() => {
                              deleteEmployee(row.id !== undefined ? row.id : 0);
                            }}
                          >
                            <DeleteForeverIcon />
                          </IconButton>
                        </TableCell>

                        <TableCell align={"center"}>
                          <IconButton
                            color="warning"
                            onClick={() => {
                              navigate(`/update-employee/${row.id}`);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                <TableFooter>
                  <TableRow>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25]}
                      colSpan={3}
                      count={data !== undefined ? data.totalElements : 0}
                      rowsPerPage={limit}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
            <DialogDetail<EmployeeSchema>
              open={open}
              onClose={handleClose}
              selectedValue={
                employee !== null ? employee : defaultEmployeeSchema
              }
              columns={
                new Map([
                  ["name", "Tên"],
                  ["phone", "Số điện thoại"],
                  ["email", "Email"],
                  ["dob", "Ngày sinh"],
                ])
              }
            />
          </Box>
        </>
      )}
    </>
  );
}
