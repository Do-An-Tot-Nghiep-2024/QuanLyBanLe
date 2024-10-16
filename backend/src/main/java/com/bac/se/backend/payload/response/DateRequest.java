package com.bac.se.backend.payload.response;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public record DateRequest(
        @JsonFormat(pattern = "yyyy-MM-dd") Date fromDate,
        @JsonFormat(pattern = "yyyy-MM-dd") Date toDate
) {
}
