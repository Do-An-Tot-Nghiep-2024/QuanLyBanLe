package com.bac.se.backend.payload.response.employee;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public record EmployeeResponse(Long id,String name, String phone, String email,
                               @JsonFormat(pattern = "dd/MM/yyyy") Date dob){
}
