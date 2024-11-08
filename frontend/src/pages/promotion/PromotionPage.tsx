import React from 'react';
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
} from '@mui/material';
import { getAllPromotionService } from '../../services/promotion.service';
import { PromotionSchema } from '../../types/promotionSchema';
import ResponsePagination from '../../types/responsePagination';
import { useQuery } from '@tanstack/react-query';



const PromotionPage: React.FC = () => {
  const fetchPromotions = async () => {
    const response = await getAllPromotionService();
    if (!response) {
      throw new Error("Error fetching products");
    }
    console.log(response.data);


    return response.data as unknown as ResponsePagination<PromotionSchema>;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchPromotions,
  });

  return (
    <TableContainer component={Paper}>
      <Typography variant="h4" component="h2" style={{ margin: '16px' }}>
        Danh sách khuyến mãi
      </Typography>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Ngày bắt đầu</TableCell>
              <TableCell>Ngày kết thúc</TableCell>
              <TableCell>Loại khuyến mãi</TableCell>
              <TableCell>Phạm vi</TableCell>
              <TableCell>Giới hạn đơn hàng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.responseList.map((promotion) => (
              <TableRow key={promotion.id}>
                <TableCell>{promotion.id}</TableCell>
                <TableCell>{promotion.name}</TableCell>
                <TableCell>{promotion.description}</TableCell>
                <TableCell>
                  {new Date(promotion.startDate).toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell>
                  {new Date(promotion.endDate).toLocaleDateString('vi-VN')}
                </TableCell>
                <TableCell>{promotion.typePromotion}</TableCell>
                <TableCell>{promotion.scope}</TableCell>
                <TableCell>{promotion.orderLimit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
    </TableContainer>
  );
};

export default PromotionPage;
