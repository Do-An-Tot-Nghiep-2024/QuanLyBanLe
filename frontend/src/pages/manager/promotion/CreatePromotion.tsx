import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  SnackbarCloseReason,
  Container,
  Stack,
} from "@mui/material";
import { createPromotionService } from "../../../services/promotion.service";
import { useNavigate } from "react-router-dom";

import PromotionRequest from "../../../types/promotion/promotionRequest";

const CreatePromotion: React.FC = () => {
  const navigate = useNavigate();

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const [promotion, setPromotion] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    orderLimit: 0,
    minOrderValue: 0,
    discountPercent: 0,
  });

  const handleChangeInput = (e: any) => {
    setPromotion({ ...promotion, [e.target.name]: e.target.value });
  };

  const validateForm = (data: PromotionRequest) => {
    const {
      name,
      description,
      startDate,
      endDate,
      orderLimit,
      minOrderValue,
      discountPercent,
    } = data;
    if (
      !name ||
      !description ||
      !startDate ||
      !endDate ||
      !orderLimit ||
      !minOrderValue ||
      !discountPercent
    ) {
      return {
        status: false,
        message: "Vui lòng nhập đầy đủ thông tin",
      };
    }

    if (startDate > endDate) {
      return {
        status: false,
        message: "Ngày bắt đầu phải nhỏ hơn ngày kết thúc",
      };
    }
    if(orderLimit < 1 || minOrderValue < 1 || discountPercent < 1){
      return {
        status: false,
        message: "Giá trị số lượng phải lớn hơn 0",
      }
    }
    return {
      status: true,
      message: "",
    };
    
  };

  const onSubmit = async (data: PromotionRequest) => {
    try {
      const { status, message } = validateForm(data);
      if (!status) {
        setSnackbarMessage(message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
      const promotionSave = {
        name: data.name,
        description: data.description,
        startDate: reformatDate(data.startDate),
        endDate: reformatDate(data.endDate),
        orderLimit: data.orderLimit,
        minOrderValue: data.minOrderValue,
        discountPercent: data.discountPercent,
      };

      const response = await createPromotionService(promotionSave);
      if (response.message == "success") {
        console.log("Create employee success");
        navigate("/promotions");
      } else {
        setSnackbarMessage(response.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
    } catch (error: any) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
  };

  const reformatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const handleSnackbarClose = (
    _event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Container
      sx={{
        // backgroundColor: "white",
        boxShadow: 3,
        borderRadius: 2,
        mt: 3,
        p: 3,
        width: "80%",
      }}
    >
      <Typography
        variant="h5"
        align="center"
        padding={"5px"}
        fontWeight={"600"}
      >
        TẠO KHUYẾN MÃI
      </Typography>
      <TextField
        fullWidth
        label="Tên khuyến mãi"
        name="name"
        value={promotion.name}
        onChange={handleChangeInput}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Mô tả khuyến mãi"
        name="description"
        value={promotion.description}
        onChange={handleChangeInput}
        sx={{ mb: 2 }}
      />

      <Box display="flex" flexDirection="row" gap="15px">
        <TextField
          fullWidth
          type="date"
          label="Ngày bắt đầu"
          name="startDate"
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
          value={promotion.startDate}
          onChange={handleChangeInput}
        />

        <TextField
          fullWidth
          type="date"
          label="Ngày kết thúc"
          name="endDate"
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
          value={promotion.endDate}
          onChange={handleChangeInput}
        />
      </Box>

      <TextField
        fullWidth
        type="number"
        label="Giá trị đơn hàng tối thiểu"
        name="minOrderValue"
        sx={{ mb: 2 }}
        value={promotion.minOrderValue}
        onChange={handleChangeInput}
      />
      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          fullWidth
          type="number"
          label="Số lượng đơn hàng được áp dụng khuyến mãi"
          sx={{ mb: 2 }}
          name="orderLimit"
          value={promotion.orderLimit}
          onChange={handleChangeInput}
        />
        <TextField
          fullWidth
          type="number"
          label="Phần trăm giảm giá"
          sx={{ mb: 2 }}
          name="discountPercent"
          value={promotion.discountPercent}
          onChange={handleChangeInput}
        />
      </Stack>

      <Button
        variant="contained"
        color="primary"
        onClick={() => onSubmit(promotion as PromotionRequest)}
      >
        Tạo khuyến mãi
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CreatePromotion;
