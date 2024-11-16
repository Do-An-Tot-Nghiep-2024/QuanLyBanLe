package com.bac.se.backend.services;

import com.bac.se.backend.payload.response.DashboardResponse;
import com.bac.se.backend.repositories.CustomerRepository;
import com.bac.se.backend.repositories.OrderItemRepository;
import com.bac.se.backend.repositories.OrderRepository;
import com.bac.se.backend.services.impl.DashboardServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class DashboardServiceTest {

    @InjectMocks
    private DashboardServiceImpl dashboardService;

    @Mock
    private OrderItemRepository orderItemRepository;
    @Mock
    private CustomerRepository customerRepository;
    @Mock
    private OrderRepository orderRepository;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getDashboard() {
        when(orderItemRepository.getTotalSales()).thenReturn(1000.0);
        when(customerRepository.count()).thenReturn(10L);
        when(orderRepository.getTotalOrders()).thenReturn(100L);
        DashboardResponse response = dashboardService.getDashboard();
        assertEquals(100, response.totalOrders());
        assertEquals(1000.0, response.totalSales());
        assertEquals(10, response.totalCustomers());
    }
}
