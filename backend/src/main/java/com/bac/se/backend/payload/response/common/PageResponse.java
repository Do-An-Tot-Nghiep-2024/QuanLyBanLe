package com.bac.se.backend.payload.response.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class PageResponse<T> {
    private List<T> responseList;
    private Integer pageNumber;
    private Integer totalPages;
    private long totalElements;
    private boolean isLastPage;


}
