package com.bac.se.backend.payload.request;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public record EmployeeAccountRequest(
        String name,
        @JsonFormat(pattern = "dd/MM/yyyy") Date dob,
        String phone,
        String email,
        String password) {
}
