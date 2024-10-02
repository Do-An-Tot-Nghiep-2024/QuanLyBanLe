import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { Stack, TableHead, TextField } from "@mui/material";
import { useState } from "react";
import { SearchIcon } from "../assets/svg/Icon";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import DialogDetail from "./DialogDetail";
import AddBoxIcon from "@mui/icons-material/AddBox";
import GetAppIcon from "@mui/icons-material/GetApp";
import { useNavigate } from "react-router-dom";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import Column from "../types/column";
import ResponsePagination from "../types/responsePagination";
interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const employees = [
  {
    id: 1,
    name: "John Doe",
    phone: "1234567890",
    email: "johndoe@example.com",
    dob: "01/01/1990",
  },
  {
    id: 2,
    name: "Jane Doe",
    phone: "1234567890",
    email: "janedoe@example.com",
    dob: "01/01/1990",
  },
];

interface DataTableProps<T> {
  columns: Column[];
  data: ResponsePagination<T>;
  caseType: string;
}

export default function DataTable<T>({
  columns,
  data,
  caseType,
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  console.log(data);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - data.responseList.length)
      : 0;

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(employees[0]);
  const columnsMap = new Map([
    ["name", "Họ và tên"],
    ["phone", "Số điện thoại"],
    ["email", "Email"],
    ["dob", "Ngày sinh"],
  ]);
  const handleClickOpen = () => {
    setOpen(true);
    setSelectedValue(employees[0]);
  };

  const getKeys = function (obj: T) {
    return Object.keys(obj as object) as (keyof T)[];
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = () => {
    if (caseType === "employee") {
      navigate("/create-employee");
    }
    if (caseType === "customer") {
      navigate("/create-customer");
    }
    if (caseType === "product") {
      navigate("/create-product");
    }
    if (caseType === "provider") {
      navigate("/create-provider");
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
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
                <IconButton type="button" aria-label="Tìm kiếm" size="small">
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
          <IconButton
            type="button"
            aria-label="export"
            size="small"
            color="default"
          >
            <GetAppIcon />
          </IconButton>

          <IconButton
            onClick={handleCreate}
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
              {columns.map((column, index) => (
                <TableCell
                  colSpan={column.id === "action" ? 3 : 1}
                  key={index}
                  align={"center"}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? (data?.responseList ?? []).slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : (data?.responseList ?? [])
            ).map((row: T, index: number) => (
              <TableRow hover key={index}>
                {getKeys(row).map((key) => (
                  <TableCell align={"center"}>
                    {row[key] !== undefined ? String(row[key]) : "N/A"}
                  </TableCell>
                ))}
                <TableCell align={"center"}>
                  <IconButton color="success" onClick={handleClickOpen}>
                    <RemoveRedEyeIcon />
                  </IconButton>
                </TableCell>

                <TableCell align={"center"}>
                  <IconButton color="error">
                    <DeleteForeverIcon />
                  </IconButton>
                </TableCell>

                <TableCell align={"center"}>
                  <IconButton color="warning">
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow>
                <TableCell colSpan={6} />
              </TableRow>
            )}
            <DialogDetail
              selectedValue={selectedValue}
              open={open}
              onClose={handleClose}
              columns={columnsMap}
            />
          </TableBody>

          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={3}
                count={data.totalElements}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      "aria-label": "rows per page",
                    },
                    native: true,
                  },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Box>
  );
}
