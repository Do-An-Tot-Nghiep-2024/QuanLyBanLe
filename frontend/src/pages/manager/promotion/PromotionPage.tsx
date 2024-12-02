import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Button,
  Stack,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  IconButton,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
} from "@mui/material";
import {
  getAllPromotionService,
  updatePromotionService,
} from "../../../services/promotion.service";
import {
  PromotionSchema,
} from "../../../types/promotionSchema";
import ResponsePagination from "../../../types/responsePagination";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import colors from "../../../constants/color";
import EditIcon from "@mui/icons-material/Edit";
import { convertDate, formatDateInput } from "../../../utils/dateUtil";
import { formatMoney } from "../../../utils/formatMoney";
const PromotionPage: React.FC = () => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<keyof PromotionSchema | null>(
    "id"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectPromotion, setSelectPromotion] = useState({
    id: 0,
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    orderLimit: 0,
    minOrderValue: 0,
    discountPercent: 0,
    isActive: true,
  });
  const [message, setMessage] = useState("");
  const [promotions, setPromotions] = useState<PromotionSchema[]>([]);
  const [open, setOpen] = useState(false);

  const fetchPromotions = async () => {
    const response = await getAllPromotionService();
    if (response.message !== "success") {
      setMessage("Error fetching promotions");
    }

    const data =
      response.data as unknown as ResponsePagination<PromotionSchema>;
    setPromotions(data.responseList);
    return data;
  };

  const handleChangeInput = (e: any) => {
    setSelectPromotion({ ...selectPromotion, [e.target.name]: e.target.value });
  };
  type PromotionUpdate = {
    id: number;
    promotion: any;
  };

  const { isLoading, isFetching, isError, error, refetch } = useQuery<
    ResponsePagination<PromotionSchema>,
    Error
  >({
    queryKey: ["promotions"],
    queryFn: fetchPromotions,
    refetchOnWindowFocus: false,
  });

  const handleClose = () => {
    setOpen(false);
  };
  const handleUpdatePromotion = async ({ id, promotion }: PromotionUpdate) => {
    const response = await updatePromotionService(id, promotion);
    if (response.message !== "success") {
      setMessage(response.message);
    }
    refetch();
    return response.data;
  };
  // useEffect(() => {
  //   if (data) {
  //     setPromotions(data.responseList);
  //   }
  // }, [data]);

  // const getPromotionStatus = (startDate: string, endDate: string): string => {
  //   const now = new Date();
  //   const start = new Date(startDate);
  //   const end = new Date(endDate);

  //   if (now < start) {
  //     return "Sắp diễn ra";
  //   } else if (now >= start && now <= end) {
  //     return "Đang diễn ra";
  //   } else {
  //     return "Đã hết hạn";
  //   }
  // };

  // Sorting logic
  // useEffect(() => {
  //   if (data) {
  //     let sortedPromotions = [...data.responseList];

  //     if (sortField) {
  //       sortedPromotions.sort((a, b) => {
  //         const aValue = a[sortField];
  //         const bValue = b[sortField];

  //         // Handle different data types
  //         if (typeof aValue === "string" && typeof bValue === "string") {
  //           return sortOrder === "asc"
  //             ? aValue.localeCompare(bValue)
  //             : bValue.localeCompare(aValue);
  //         } else if (typeof aValue === "number" && typeof bValue === "number") {
  //           return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
  //         }
  //         return 0; // Fallback if types are unhandled
  //       });
  //     }

  //     setPromotions(sortedPromotions);
  //   }
  // }, [data, sortField, sortOrder]);

  const handleSelectPromotion = (promotion: PromotionSchema) => {
    setSelectPromotion({
      id: promotion.id as number,
      name: promotion.name,
      description: promotion.description,
      startDate: promotion.startDate,
      endDate: promotion.endDate,
      orderLimit: promotion.orderLimit,
      minOrderValue: promotion.minOrderValue,
      discountPercent: promotion.percentage * 100,
      isActive: promotion.isActive as boolean,
    });
  };
  if (isError) {
    return <div>Error is : {error.message}</div>;
  }
  return (
    <Box pt={4} width={"95%"}>
      {message ? <Alert severity="error">{message}</Alert> : null}
      <Typography
        variant="h5"
        align="center"
        padding={"5px"}
        fontWeight={"600"}
      >
        DANH SÁCH KHUYẾN MÃI
      </Typography>

      <Stack
        direction="row"
        justifyContent="flex-end"
        sx={{ marginBottom: "16px", mr: 2 }}
      >
        <Button
          variant="contained"
          onClick={() => navigate("/promotions/create-promotion")}
        >
          Tạo Khuyến Mãi
        </Button>
      </Stack>

      <TableContainer
        component={Paper}
        sx={{ margin: "16px", backgroundColor: "white" }}
      >
        {isLoading || isFetching ? (
          <CircularProgress />
        ) : (
          <Table size="small">
            <TableHead sx={{ backgroundColor: colors.secondaryColor }}>
              <TableRow>
                {[
                  "ID",
                  "Tên",
                  "Mô tả",
                  "Ngày bắt đầu",
                  "Ngày kết thúc",
                  "Giới hạn đơn hàng",
                  // "Trạng thái",
                  "Giá trị tố thiểu ",
                  "Phần trăm giảm giá",
                ].map((header, index) => {
                  const fieldNames = [
                    "id",
                    "name",
                    "description",
                    "startDate",
                    "endDate",
                    "orderLimit",
                    "minOrderValue",
                    "discountPercent",
                  ];
                  const field = fieldNames[index];
                  return (
                    <TableCell
                      key={index}
                      align="center"
                      sx={{
                        padding: "16px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        if (field) {
                          setSortField(field as keyof PromotionSchema);
                          setSortOrder((prevOrder) =>
                            prevOrder === "asc" ? "desc" : "asc"
                          );
                        }
                      }}
                    >
                      {header}
                      {sortField === field && (
                        <span style={{ marginLeft: "5px" }}>
                          {sortOrder === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </TableCell>
                  );
                })}
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Hoạt động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {promotions.map((promotion) => (
                <TableRow key={promotion.id} hover>
                  <TableCell align="center">{promotion.id}</TableCell>
                  <TableCell align="center">{promotion.name}</TableCell>
                  <TableCell align="center">{promotion.description}</TableCell>
                  <TableCell align="center">
                    {convertDate(new Date(promotion.startDate))}
                  </TableCell>
                  <TableCell align="center">
                    {convertDate(new Date(promotion.endDate))}
                  </TableCell>
                  {/* <TableCell align="center">
                    {promotion.typePromotion}
                  </TableCell> */}
                  <TableCell align="center">{promotion.orderLimit}</TableCell>
                  {/* <TableCell align="center">
                    {getPromotionStatus(promotion.startDate, promotion.endDate)}
                  </TableCell> */}
                  <TableCell>{formatMoney(promotion.minOrderValue)}</TableCell>
                  <TableCell align="center">
                    {promotion.percentage * 100}%
                  </TableCell>
                  <TableCell
                    align="center"
                    onClick={() => {
                      handleSelectPromotion(promotion);
                      setOpen(true);
                    }}
                  >
                    <IconButton>
                      <EditIcon color="warning" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>CẬP NHẬT THÔNG TIN CHƯƠNG TRÌNH KHUYẾN MÃI</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                label="Tên chương trình khuyến mãi"
                placeholder="Tên khuyến mãi"
                name="name"
                variant="standard"
                value={selectPromotion.name}
                onChange={handleChangeInput}
              ></TextField>

              <TextField
                label="Mô tả"
                value={selectPromotion.description}
                placeholder="Mô tả"
                name="description"
                variant="standard"
                onChange={handleChangeInput}
              ></TextField>

              <TextField
                variant="standard"
                type="date"
                placeholder="Ngày bắt đầu"
                name="startDate"
                value={formatDateInput(selectPromotion.startDate)}
                onChange={handleChangeInput}
              ></TextField>
              <TextField
                variant="standard"
                type="date"
                value={formatDateInput(selectPromotion.endDate)}
                placeholder="Ngày kết thúc"
                name="endDate"
                onChange={handleChangeInput}
              ></TextField>

              <TextField
                label="Tỉ lệ % giảm giá"
                variant="standard"
                value={Number(selectPromotion.discountPercent) }
                placeholder="Tỉ lệ giảm giá"
                name="discountPercent"
                onChange={handleChangeInput}
              ></TextField>

              <TextField
                type="number"
                label="Số lượng đơn hàng tối thiểu"
                variant="standard"
                value={selectPromotion.orderLimit}
                placeholder="Số lượng đơn hàng tối thiểu"
                name="orderLimit"
                onChange={handleChangeInput}
              ></TextField>

              <TextField
                label="Giá trị đơn hàng tối thiểu"
                variant="standard"
                value={selectPromotion.minOrderValue}
                placeholder="Giá trị đơn hàng tối thiểu"
                name="minOrderValue"
                onChange={handleChangeInput}
              ></TextField>

              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Trạng thái:
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  onChange={() =>
                    setSelectPromotion({
                      ...selectPromotion,
                      isActive: !selectPromotion.isActive,
                    })
                  }
                  value={selectPromotion.isActive}
                >
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="Hoạt động"
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="Tạm dừng"
                  />
                </RadioGroup>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>HỦY BỎ</Button>
            <Button
              onClick={() => {
                console.log(selectPromotion);

                handleUpdatePromotion({
                  id: selectPromotion.id as number,
                  promotion: selectPromotion,
                });
                setOpen(false);
              }}
            >
              CẬP NHẬT
            </Button>
          </DialogActions>
        </Dialog>
      </TableContainer>
    </Box>
  );
};

export default PromotionPage;
