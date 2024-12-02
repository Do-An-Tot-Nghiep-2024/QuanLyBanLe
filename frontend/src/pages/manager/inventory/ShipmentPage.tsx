import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import { Paper, Skeleton, Stack, Typography } from "@mui/material";
import { getShipmentsService } from "../../../services/inventory.service";
import { useQuery } from "@tanstack/react-query";
import { convertDate } from "../../../utils/dateUtil";
import colors from "../../../constants/color";
import TextSearch from "../../../components/TextSeatch";
import ProductShipment from "../../../types/inventory/productShipment";

type Order = "asc" | "desc";
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}
interface HeadCell {
  disablePadding: boolean;
  id: keyof ProductShipment;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "shipmentId",
    numeric: true,
    disablePadding: false,
    label: "Mã lô",
  },
  {
    id: "supplier",
    numeric: false,
    disablePadding: true,
    label: "Nhà cung cấp",
  },
  {
    id: "product",
    numeric: false,
    disablePadding: false,
    label: "Sản phẩm",
  },
  {
    id: "mxp",
    numeric: false,
    disablePadding: false,
    label: "Ngày sản xuất",
  },
  {
    id: "exp",
    numeric: false,
    disablePadding: false,
    label: "Ngày hết hạn",
  },
  {
    id: "soldQuantity",
    numeric: true,
    disablePadding: false,
    label: "Đã bán",
  },
  {
    id: "availableQuantity",
    numeric: true,
    disablePadding: false,
    label: "Còn lại",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof ProductShipment
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: keyof ProductShipment) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead sx={{ backgroundColor: colors.secondaryColor }}>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "center" : "left"}
            // align="center"
            sx={{ fontSize: 14, fontWeight: "bold" }}
            width={headCell.id === "product" ? "60%" : "10%"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function EnhancedTable() {
  const [order, setOrder] = React.useState<Order>("desc");
  const [orderBy, setOrderBy] =
    React.useState<keyof ProductShipment>("shipmentId");
  const [selected, setSelected] = React.useState<readonly number[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [shiment, setShiment] = React.useState("");
  const [product, setProduct] = React.useState("");

  const getShipments = async () => {
    try {
      const response = await getShipmentsService();
      if (response.message !== "success") {
        throw new Error("Error fetching shipments");
      }
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.log(error);
    }
  };
  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ["inventory/shipments"],
    queryFn: () => getShipments(),
    refetchOnWindowFocus: false,
  });

  if (isLoading || isFetching) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  console.log(data);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: keyof ProductShipment
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected =
        data !== undefined ? data.map((n) => n.shipmentId) : [];
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleShimentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShiment(event.target.value);
  };
  const handleProductChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProduct(event.target.value);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(
          0,
          (1 + page) * rowsPerPage - (data !== undefined ? data.length : 0)
        )
      : 0;

  const visibleRows = data
    ?.filter((row: ProductShipment) => {
      const matchesShiment =
        shiment === "" ||
        row.shipmentId.toString().toLowerCase().includes(shiment.toLowerCase());
      const matchesProduct =
        product === "" ||
        row.product.toString().toLowerCase().includes(product.toLowerCase());
      return matchesShiment && matchesProduct;
    })

    ?.sort(getComparator(order, orderBy))
    .slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    ) as ProductShipment[];

  return (
    <Box sx={{ width: "100%", pt: 4,px:4 }}>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontSize: 24, fontWeight: "bold", textAlign: "center" }}
      >
        {"Sản phẩm tồn kho".toUpperCase()}
      </Typography>
      <Stack spacing={2} direction="row" sx={{ mb: 2 }}>
        <TextSearch
          props={{
            placeholder: "Nhập mã lô cần tìm",
            state: shiment,
            setState: handleShimentChange,
          }}
        />
        <TextSearch
          props={{
            placeholder: "Nhập tên sản phẩm cần tìm",
            state: product,
            setState: handleProductChange,
          }}
        />
      </Stack>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          {isLoading ||
            (isFetching && (
              <Skeleton variant="rectangular" width="100%" height={400} />
            ))}
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="small"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data !== undefined ? data.length : 0}
            />
            <TableBody>
              {visibleRows.map((row: ProductShipment, _index) => {
                const isItemSelected = selected.includes(row.shipmentId);
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.shipmentId + row.product + row.exp}
                    // key={row.shipmentId}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell
                      padding="none"
                      width={30}
                      sx={{ fontSize: 16, paddingLeft: 2 }}
                    >
                      {"MLH-" + row.shipmentId}
                    </TableCell>
                    <TableCell padding="none" width={30} sx={{ fontSize: 16 }}>
                      {row.supplier}
                    </TableCell>
                    <TableCell
                      
                      align="left"
                      padding="none"
                      width={120}
                      sx={{ fontSize: 16 }}
                    >
                      {row.product}
                    </TableCell>
                    <TableCell
                      padding="none"
                      align="center"
                      sx={{ fontSize: 16 }}
                    >
                      {convertDate(row.mxp)}
                    </TableCell>
                    <TableCell
                      padding="none"
                      align="center"
                      sx={{ fontSize: 16 }}
                    >
                      {convertDate(row.exp)}
                    </TableCell>
                    <TableCell align="left" sx={{ fontSize: 16 }}>
                      {row.soldQuantity}
                    </TableCell>
                    <TableCell align="left" sx={{ fontSize: 16 }}>
                      {row.availableQuantity}
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data !== undefined ? data.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
