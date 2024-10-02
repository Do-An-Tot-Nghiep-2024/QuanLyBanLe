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
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useNavigate } from "react-router-dom";
import colors from "../../constants/color";

import Tooltip from "@mui/material/Tooltip";
import {
  NoteAddOutlined,
} from "@mui/icons-material";

import { useState } from "react";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

export default function CategoryPage() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Example supplier data
  const products = [
    {
      category: "Lương thực",
      id: 5,
      name: "Mì Hảo Hảo",
      description: "Mì ăn liền Hảo Hảo vị bò, gói 65g",
      price: 3000,
      image:
        "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg",
    },
    {
      category: "Lương thực",
      id: 6,
      name: "Mì Omachi",
      description: "Mì Omachi vị hải sản, gói 70g",
      price: 3500,
      image:
        "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg",
    },
    {
      category: "Lương thực",
      id: 7,
      name: "Gạo ST25",
      description: "Gạo ST25, 5kg",
      price: 150000,
      image:
        "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg",
    },
    {
      category: "Lương thực",
      id: 8,
      name: "Bột mì đa dụng",
      description: "Bột mì đa dụng, gói 1kg",
      price: 25000,
      image:
        "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg",
    },

    // Danh mục Thức ăn đóng hộp
    {
      category: "Thức ăn đóng hộp",
      id: 9,
      name: "Đồ hộp cá ngừ",
      description: "Cá ngừ đóng hộp, 185g",
      price: 25000,
      image:
        "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg",
    },
    {
      category: "Thức ăn đóng hộp",
      id: 10,
      name: "Đồ hộp đậu đỏ",
      description: "Đậu đỏ đóng hộp, 400g",
      price: 20000,
      image:
        "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg",
    },
    {
      category: "Thức ăn đóng hộp",
      id: 11,
      name: "Thịt hộp SPAM",
      description: "Thịt hộp SPAM, 340g",
      price: 45000,
      image:
        "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg",
    },
    {
      category: "Thức ăn đóng hộp",
      id: 12,
      name: "Đồ hộp ngô ngọt",
      description: "Ngô ngọt đóng hộp, 300g",
      price: 15000,
      image:
        "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg",
    },

    // Danh mục Gia vị
    {
      category: "Gia vị",
      id: 13,
      name: "Muối tinh",
      description: "Muối tinh sạch, gói 500g",
      price: 10000,
      image:
        "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg",
    },
    {
      category: "Gia vị",
      id: 14,
      name: "Hạt tiêu xay",
      description: "Hạt tiêu xay nguyên chất, gói 100g",
      price: 15000,
      image:
        "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg",
    },
    {
      category: "Gia vị",
      id: 15,
      name: "Dầu ăn ăn sạch",
      description: "Dầu ăn ăn sạch, chai 1L",
      price: 40000,
      image:
        "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg",
    },
    {
      category: "Gia vị",
      id: 16,
      name: "Giấm ăn",
      description: "Giấm ăn, chai 500ml",
      price: 15000,
      image:
        "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg",
    },

    // Danh mục Đồ uống
    {
      category: "Đồ uống",
      id: 17,
      name: "Nước ngọt Pepsi",
      description: "Nước ngọt Pepsi, chai 1.5L",
      price: 20000,
      image:
        "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg",
    },
  ];

  const columns = ["Hình ảnh", "Tên sản phẩm", "Danh mục", "Hành động"];

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
            label="Tìm kiếm sản phẩm"
            variant="filled"
            size="small"
            sx={{
              display: { xs: "none", md: "inline-block", sm: "flex" },
              mr: 1,
              width: "100%",
              mt: 2,
            }}
          />
          <Tooltip title="Thêm sản phẩm" arrow>
            <IconButton
              onClick={() => {
                navigate("/create-product");
              }}
              aria-label="import"
              size="large"
              color="success"
            >
              <AddBoxIcon sx={{ width: "100%" }} />
            </IconButton>
          </Tooltip>
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

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="add-category-modal"
            aria-describedby="add-category-modal-description"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "auto",
            }}
          >
            <div
              style={{
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
              }}
            >
              <h3 id="add-category-modal">Thêm danh mục sản phẩm</h3>
              <TextField
                style={{
                  width: "90%",
                }}
                label="Tên danh mục"
                variant="outlined"
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "40px",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <Button
                  onClick={handleClose}
                  style={{
                    backgroundColor: "#f0f0f0",
                    borderRadius: "8px",
                    width: "30%",
                  }}
                >
                  Đóng
                </Button>
                <Button
                  onClick={() => {}}
                  style={{
                    backgroundColor: "#007bff",
                    color: "#fff",
                    borderRadius: "8px",
                    width: "30%",
                  }}
                >
                  Thêm
                </Button>
              </div>
            </div>
          </Modal>
        </Stack>

        <TableContainer
          component={Paper}
          sx={{
            width: "100%",
            backgroundColor: "white",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Table aria-label="custom pagination table">
            <TableHead sx={{ backgroundColor: colors.secondaryColor }}>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column}
                    align={"center"}
                    sx={{ border: "1px solid #d4d2d2", fontWeight: "bold" }}
                  >
                    {column}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((supplier) => (
                <TableRow hover key={supplier.id}>
                  <TableCell
                    align={"center"}
                    sx={{ border: "1px solid #d4d2d2" }}
                  >
                    <Box
                      component="img"
                      sx={{
                        height: 100,
                        width: 100,
                        maxHeight: { xs: 233, md: 167 },
                        maxWidth: { xs: 350, md: 250 },
                      }}
                      alt="The house from the offer."
                      src={supplier.image}
                    />
                  </TableCell>

                  <TableCell
                    align={"left"}
                    sx={{ border: "1px solid #d4d2d2" }}
                  >
                    {supplier.name}
                  </TableCell>
                  <TableCell
                    align={"left"}
                    sx={{ border: "1px solid #d4d2d2" }}
                  >
                    {supplier.category}
                  </TableCell>

                  <TableCell
                    align={"center"}
                    sx={{ border: "1px solid #d4d2d2" }}
                  >
                    <IconButton color="error">
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
                  colSpan={3}
                  count={products.length}
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
    </>
  );
}
