package com.bac.se.backend.services.impl;

import com.bac.se.backend.mapper.StockMapper;
import com.bac.se.backend.payload.response.StockResponse;
import com.bac.se.backend.payload.response.common.PageResponse;
import com.bac.se.backend.repositories.StockRepository;
import com.bac.se.backend.services.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StockServiceImpl implements StockService {
    private final StockRepository stockRepository;
    private final StockMapper stockMapper;
    @Override
    public PageResponse<StockResponse> getStocksByProduct(Integer page, Integer size) {;
        Pageable pageable = PageRequest.of(page, size);
        Page<Object[]> stockPage = stockRepository.getStocksByProduct(pageable);
        List<Object[]> stockList = stockPage.getContent();
        List<StockResponse> stockResponses = stockList.stream()
                .map(stockMapper::mapObjectToStockResponse)
                .toList();
        return new PageResponse<>(stockResponses, page,
                stockPage.getTotalPages(),
                stockPage.getTotalElements(), stockPage.isLast());
    }
}
