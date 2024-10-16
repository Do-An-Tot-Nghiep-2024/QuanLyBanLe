package com.bac.se.backend.services.impl;

import com.bac.se.backend.payload.response.DashboardResponse;
import com.bac.se.backend.repositories.CustomerRepository;
import com.bac.se.backend.repositories.OrderItemRepository;
import com.bac.se.backend.repositories.OrderRepository;
import com.bac.se.backend.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final OrderItemRepository orderItemRepository;
    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;

    @Override
    public DashboardResponse getDashboard() {
        long totalCustomers = customerRepository.count();
        double totalSales = orderItemRepository.getTotalPriceOrder();
        long totalQuantityOrder = orderRepository.getTotalQuantityOrder();
        return new DashboardResponse(totalQuantityOrder, totalSales, totalCustomers);
    }
}
