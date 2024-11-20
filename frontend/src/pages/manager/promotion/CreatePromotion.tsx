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
import {
  createPromotionService,
} from "../../../services/promotion.service";
import { useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  defaultPromotionSchema,
  PromotionSchema,
} from "../../../types/promotionSchema";
import { zodResolver } from "@hookform/resolvers/zod";


const CreatePromotion: React.FC = () => {
  const navigate = useNavigate();
 
  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PromotionSchema>({
    mode: "all",
    resolver: zodResolver(PromotionSchema),
    defaultValues: defaultPromotionSchema,
  });
  
  const onSubmit: SubmitHandler<PromotionSchema> = async (data) => {
    try {
      const promotion = {
          name: data.name,
          description: data.description,
          startDate: reformatDate(data.startDate),
          endDate: reformatDate(data.endDate),
          orderLimit: data.orderLimit,
          minOrderValue: data.minOrderValue,
          discountPercent: data.discountPercent
      }
      console.log(promotion);
      
      const response = await createPromotionService(promotion);
      if (response.message == "success") {
        console.log("Create employee success");
        navigate("/promotions")
      } else {
        setSnackbarMessage(response.message);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }
    } catch (error : any) {
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

  // const normalizeString = (str: string) => {
  //   return str
  //     .normalize("NFD")
  //     .replace(/[\u0300-\u036f]/g, "")
  //     .toLowerCase();
  // };

  return (
    <Container
      component={"form"}
      sx={{
        // backgroundColor: "white",
        boxShadow: 3,
        borderRadius: 2,
        mt: 3,
        p: 3,
        width: "80%",
      }}
      onSubmit={handleSubmit(onSubmit)}
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
        {...register("name")}
        fullWidth
        label="Tên khuyến mãi"
        name="name"
        error={!!errors.name}
        helperText={errors.name?.message}
        sx={{ mb: 2 }}
      />

      <TextField
        {...register("description")}
        fullWidth
        label="Mô tả khuyến mãi"
        name="description"
        error={!!errors.description}
        helperText={errors.description?.message}
        sx={{ mb: 2 }}
      />

      <Box display="flex" flexDirection="row" gap="15px">
        <TextField
          {...register("startDate")}
          fullWidth
          type="date"
          label="Ngày bắt đầu"
          name="startDate"
          error={!!errors.startDate}
          helperText={errors.startDate?.message}
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          {...register("endDate")}
          fullWidth
          type="date"
          label="Ngày kết thúc"
          name="endDate"
          error={!!errors.endDate}
          helperText={errors.endDate?.message}
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />
      </Box>

        <TextField
          {...register("minOrderValue")}
          fullWidth
          type="number"
          label="Giá trị đơn hàng tối thiểu"
          name="minOrderValue"
          error={!!errors.minOrderValue}
          helperText={errors.minOrderValue?.message}
          sx={{ mb: 2 }}
        />
      <Stack direction="row" spacing={2} mb={2}>
      <TextField
        {...register("orderLimit")}
        fullWidth
        type="number"
        error={!!errors.orderLimit}
        helperText={errors.orderLimit?.message}
        label="Số lượng đơn hàng được áp dụng khuyến mãi"
        sx={{ mb: 2 }}
      />
        <TextField
          {...register("discountPercent")}
          fullWidth
          type="number"
          label="Phần trăm giảm giá"
          name="discountPercent"
          error={!!errors.discountPercent}
          helperText={errors.discountPercent?.message}
          sx={{ mb: 2 }}
        />
      </Stack>

      <Button variant="contained" color="primary" type="submit">
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
