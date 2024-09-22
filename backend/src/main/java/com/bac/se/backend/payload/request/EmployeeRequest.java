package com.bac.se.backend.payload.request;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public record EmployeeRequest(String name, String phone, String email,
                              @JsonFormat(pattern = "dd/MM/yyyy") Date dob) {
}
