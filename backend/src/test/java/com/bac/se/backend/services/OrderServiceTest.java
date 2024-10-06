package com.bac.se.backend.services;

import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.keys.ShipmentItemKey;
import com.bac.se.backend.models.*;
import com.bac.se.backend.payload.request.OrderItemRequest;
import com.bac.se.backend.payload.request.OrderRequest;
import com.bac.se.backend.payload.response.order.CreateOrderResponse;
import com.bac.se.backend.payload.response.order.OrderItemResponse;
import com.bac.se.backend.repositories.*;
import com.bac.se.backend.utils.JwtParse;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.PageRequest;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class OrderServiceTest {


    @Mock
    private OrderRepository orderRepository;
    @Mock
    private ProductRepository productRepository;
    @Mock
    private ShipmentRepository shipmentRepository;
    @Mock
    private JwtParse jwtParse;
    @Mock
    private EmployeeRepository employeeRepository;
    @Mock
    private ShipmentItemRepository shipmentItemRepository;
    @Mock
    private ProductPriceRepository productPriceRepository;
    @Mock
    private OrderItemRepository orderItemRepository;
    @Mock
    private StockRepository stockRepository;
    @Mock
    private CustomerRepository customerRepository;
    @Mock
    private HttpServletRequest request;

    @InjectMocks
    private OrderService orderService;

    OrderRequest orderRequest;

    Date expectedDate;
    SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd-MM-yyyy", Locale.ENGLISH);
    @BeforeEach
    void setUp() throws ParseException {
        MockitoAnnotations.openMocks(this);
        orderRequest = new OrderRequest(List.of(
                new OrderItemRequest(1L, 1L, 1),
                new OrderItemRequest(2L, 2L, 2)
        ), Optional.of("123456789"), 50000.0);
        expectedDate = simpleDateFormat.parse("01-01-2027");
        request = mock(HttpServletRequest.class);
    }

    @Test
    void createOrderLiveWithCustomerNotFound() {
        // Arrange
        OrderRequest orderRequest = mock(OrderRequest.class);
        when(customerRepository.findByPhone(any())).thenReturn(Optional.empty());
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> orderService.createOrderLive(orderRequest, request));
        assertEquals("Không tìm thông tin khách hàng", exception.getMessage());
        verify(customerRepository).findByPhone(any());
        verify(jwtParse, never()).decodeTokenWithRequest(any());
        verify(employeeRepository, never()).findByEmail(any());
        verify(orderRepository, never()).save(any());
        verify(productRepository, never()).findById(any());
        verify(shipmentRepository, never()).findById(any());
        verify(stockRepository, never()).findStockByProductId(any());
        verify(stockRepository, never()).save(any());
        verify(orderItemRepository, never()).save(any());
    }

    @Test
    void createOrderLiveWithEmployeeNotFound() {
        // Arrange
        when(customerRepository.findByPhone(any())).thenReturn(Optional.of(mock(Customer.class)));
        when(jwtParse.decodeTokenWithRequest(any())).thenReturn("test");
        when(employeeRepository.findByEmail(any())).thenReturn(Optional.empty());
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class,
                () -> orderService.createOrderLive(mock(OrderRequest.class), request));
        assertEquals("Không tìm thông tin nhân viên", exception.getMessage());
        verify(customerRepository).findByPhone(anyString());
        verify(jwtParse).decodeTokenWithRequest(any());
        verify(employeeRepository).findByEmail(any());
        verify(orderRepository, never()).save(any());
        verify(productRepository, never()).findById(anyLong());
        verify(shipmentRepository, never()).findById(anyLong());
        verify(stockRepository, never()).findStockByProductId(anyLong());
        verify(stockRepository, never()).save(any(Stock.class));
        verify(orderItemRepository, never()).save(any(OrderItem.class));
    }


    @Test
    void createOrderLiveWithChangeInvalid() throws BadRequestUserException {
        OrderRequest orderRequest = mock(OrderRequest.class); // provide necessary data
        setUpCommonMocks();
        when(shipmentItemRepository.findById(any(ShipmentItemKey.class))).thenReturn(Optional.of(new ShipmentItem(
                mock(Shipment.class),
                mock(Product.class),
                0,
                Date.from(Instant.now()),
                expectedDate
        )));

        when(stockRepository.findStockByProductId(anyLong())).thenReturn(Optional.of(mock(Stock.class)));
        List<Object[]> productPrice = new LinkedList<>();
        Object[] objects = new Object[]{1000, 1500, 30};
        productPrice.add(objects);
        when(productPriceRepository.getProductPriceLatest(anyLong(), any(PageRequest.class))).thenReturn(productPrice);
        double change = -1.0;
        double total  = 1;
        when(orderRequest.customerPayment() - total).thenReturn(change);
        BadRequestUserException exception = assertThrows(BadRequestUserException.class,
                () -> orderService.createOrderLive(orderRequest, request));
        assertEquals("Số tiền không đủ", exception.getMessage());
        // Verify the results
        // Add more assertions as needed

        // Verify interactions with mocks
    }


    @Test
    void createOrderLiveProductNotFound() {

    }

    @Test
    void createOrderLiveWithExpiredProduct() {
        setUpCommonMocks();
        when(shipmentItemRepository.findById(any(ShipmentItemKey.class))).thenReturn(Optional.of(new ShipmentItem(
                mock(Shipment.class),
                mock(Product.class),
                0,
                Date.from(Instant.now()),
                new Date()
        )));
        BadRequestUserException exception = assertThrows(BadRequestUserException.class,
                () -> orderService.createOrderLive(orderRequest, request));
        assertEquals("Sản phẩm đã hết hạn", exception.getMessage());
    }

    @Test
    void createOrderLiveSuccess() throws BadRequestUserException {
        setUpCommonMocks();
        when(shipmentItemRepository.findById(any(ShipmentItemKey.class))).thenReturn(Optional.of(new ShipmentItem(
                mock(Shipment.class),
                mock(Product.class),
                0,
                Date.from(Instant.now()),
                expectedDate
        )));

        when(stockRepository.findStockByProductId(anyLong())).thenReturn(Optional.of(mock(Stock.class)));
        List<Object[]> productPrice = new LinkedList<>();
        Object[] objects = new Object[]{1000, 1500, 30};
        productPrice.add(objects);
        when(productPriceRepository.getProductPriceLatest(anyLong(), any(PageRequest.class))).thenReturn(productPrice);
        CreateOrderResponse expectedResponse = new CreateOrderResponse(
                List.of(
                        new OrderItemResponse(null,1,1500.0,30,30),
                        new OrderItemResponse(null,2,1500.0,30,60)
                ),
                90.0, 50000.0, 49910.0
        );
        // Call the method under test
        CreateOrderResponse response = orderService.createOrderLive(orderRequest, request);

        // Verify the results
        assertNotNull(response);
        assertEquals(expectedResponse, response);
        assertEquals(jwtParse.decodeTokenWithRequest(request), "employee@example.com");
        // Add more assertions as needed

        // Verify interactions with mocks
        verify(employeeRepository, times(1)).findByEmail(anyString());
        verify(orderRepository, times(1)).save(any(Order.class)); // save order
        verify(productRepository, times(orderRequest.orderItems().size())).findById(anyLong()); // find product
        verify(shipmentRepository, times(orderRequest.orderItems().size())).findById(anyLong()); // find shipment
        verify(shipmentItemRepository, times(orderRequest.orderItems().size())).findById(any(ShipmentItemKey.class)); // find shipment item
        verify(stockRepository, times(orderRequest.orderItems().size())).findStockByProductId(anyLong()); // find stock
        verify(stockRepository, times(orderRequest.orderItems().size())).save(any(Stock.class)); // update stock
        verify(productPriceRepository, times(orderRequest.orderItems().size())).getProductPriceLatest(anyLong(), any(PageRequest.class)); // find product price
        verify(orderItemRepository, times(orderRequest.orderItems().size())).save(any(OrderItem.class)); // save order item
    }


     void setUpCommonMocks() {
        OrderRequest orderRequest =  mock(OrderRequest.class); // provide necessary data
        doReturn(orderRequest.customerPayment()).when(orderRequest).customerPayment();
        when(orderRequest.customerPhone()).thenReturn(Optional.of("123456789"));
        when(jwtParse.decodeTokenWithRequest(request)).thenReturn("employee@example.com");
        when(customerRepository.findByPhone(anyString())).thenReturn(Optional.of(mock(Customer.class)));
        when(employeeRepository.findByEmail(anyString())).thenReturn(Optional.of(mock(Employee.class)));
        when(orderItemRepository.save(any(OrderItem.class))).thenReturn(mock(OrderItem.class));
        when(orderRequest.orderItems()).thenReturn(List.of(mock(OrderItemRequest.class)));
        when(productRepository.findById(anyLong())).thenReturn(Optional.of(mock(Product.class)));
        when(shipmentRepository.findById(anyLong())).thenReturn(Optional.of(mock(Shipment.class)));
    }
}