package com.bac.se.backend.payload.response.employee;

import java.util.List;

public record EmployeePageResponse(List<EmployeeResponse> responseList,
                                   Integer pageNumber,
                                   Integer totalPages,
                                   long totalElements,
                                   boolean isLastPage) {
}
