package com.bac.se.backend.payload.request;


import java.util.Date;

public record DateRequest(
        Date fromDate,
        Date toDate
) {
}
