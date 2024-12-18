package com.bac.se.backend.payload.request.product;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public record ProductItem(Long id, int quantity,
                          double price,
                          @JsonFormat(pattern = "dd/MM/yyyy") Date mxp,
                          @JsonFormat(pattern = "dd/MM/yyyy") Date exp) {
}
