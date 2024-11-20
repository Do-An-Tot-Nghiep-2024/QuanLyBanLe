import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { getAllPromotionService } from "../../../services/promotion.service";
import { PromotionSchema } from "../../../types/promotionSchema";
import ResponsePagination from "../../../types/responsePagination";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import colors from "../../../constants/color";

const PromotionPage: React.FC = () => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<keyof PromotionSchema | null>(
    "id"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [promotions, setPromotions] = useState<PromotionSchema[]>([]);

  const fetchPromotions = async () => {
    const response = await getAllPromotionService();
    if (!response) {
      throw new Error("Error fetching promotions");
    }
    return response.data as unknown as ResponsePagination<PromotionSchema>;
  };

  const { data, isLoading } = useQuery<
    ResponsePagination<PromotionSchema>,
    Error
  >({
    queryKey: ["promotions"],
    queryFn: fetchPromotions,
  });
  console.log(data);

  useEffect(() => {
    if (data) {
      setPromotions(data.responseList);
    }
  }, [data]);

  const getPromotionStatus = (startDate: string, endDate: string): string => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return "Sắp diễn ra";
    } else if (now >= start && now <= end) {
      return "Đang diễn ra";
    } else {
      return "Đã hết hạn";
    }
  };

  // Sorting logic
  useEffect(() => {
    if (data) {
      let sortedPromotions = [...data.responseList];

      if (sortField) {
        sortedPromotions.sort((a, b) => {
          const aValue = a[sortField];
          const bValue = b[sortField];

          // Handle different data types
          if (typeof aValue === "string" && typeof bValue === "string") {
            return sortOrder === "asc"
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          } else if (typeof aValue === "number" && typeof bValue === "number") {
            return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
          }
          return 0; // Fallback if types are unhandled
        });
      }

      setPromotions(sortedPromotions);
    }
  }, [data, sortField, sortOrder]);

  return (
    <Box pt={4} width={"90%"}>
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
          color="success"
          onClick={() => navigate("/promotions/create-promotion")}
        >
          Tạo Khuyến Mãi
        </Button>
      </Stack>

      <TableContainer
        component={Paper}
        sx={{ margin: "16px", backgroundColor: "white" }}
      >
        {isLoading ? (
          <CircularProgress />
        ) : (
          <Table>
            <TableHead sx={{ backgroundColor: colors.secondaryColor }}>
              <TableRow>
                {[
                  "ID",
                  "Tên",
                  "Mô tả",
                  "Ngày bắt đầu",
                  "Ngày kết thúc",
                  "Giới hạn đơn hàng",
                  "Trạng thái",
                  "Giá trị tố thiểu ",
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
              </TableRow>
            </TableHead>
            <TableBody>
              {promotions.map((promotion) => (
                <TableRow key={promotion.id} hover>
                  <TableCell align="center">{promotion.id}</TableCell>
                  <TableCell align="center">{promotion.name}</TableCell>
                  <TableCell align="center">{promotion.description}</TableCell>
                  <TableCell align="center">
                    {new Date(promotion.startDate).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell align="center">
                    {new Date(promotion.endDate).toLocaleDateString("vi-VN")}
                  </TableCell>
                  {/* <TableCell align="center">
                    {promotion.typePromotion}
                  </TableCell> */}
                  <TableCell align="center">{promotion.orderLimit}</TableCell>
                  <TableCell align="center">
                    {getPromotionStatus(promotion.startDate, promotion.endDate)}
                  </TableCell>
                  <TableCell>{promotion.minOrderValue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
};

export default PromotionPage;
