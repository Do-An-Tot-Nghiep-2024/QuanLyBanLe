package com.bac.se.backend.services;

import com.bac.se.backend.payload.response.statistic.DashboardEmpResponse;
import com.bac.se.backend.payload.response.statistic.DashboardResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.text.ParseException;

public interface DashboardService {
    DashboardResponse getDashboard();

    DashboardEmpResponse getDashboardEmp(HttpServletRequest request,String fromDate,String toDate) throws ParseException;


}
