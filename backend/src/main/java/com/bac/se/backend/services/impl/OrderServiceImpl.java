package com.bac.se.backend.services.impl;

import com.bac.se.backend.enums.OrderStatus;
import com.bac.se.backend.enums.PageLimit;
import com.bac.se.backend.enums.PaymentType;
import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.keys.ShipmentItemKey;
import com.bac.se.backend.mapper.OrderMapper;
import com.bac.se.backend.mapper.ProductMapper;
import com.bac.se.backend.mapper.StockMapper;
import com.bac.se.backend.models.*;
import com.bac.se.backend.payload.request.DateRequest;
import com.bac.se.backend.payload.request.OrderItemRequest;
import com.bac.se.backend.payload.request.OrderRequest;
import com.bac.se.backend.payload.response.common.PageResponse;
import com.bac.se.backend.payload.response.order.*;
import com.bac.se.backend.payload.response.product.ProductPriceResponse;
import com.bac.se.backend.payload.response.stock.StockResponse;
import com.bac.se.backend.repositories.*;
import com.bac.se.backend.services.OrderService;
import com.bac.se.backend.services.ProductPriceService;
import com.bac.se.backend.services.PromotionService;
import com.bac.se.backend.utils.DateConvert;
import com.bac.se.backend.utils.JwtParse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.text.ParseException;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Slf4j
@Service
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final ShipmentRepository shipmentRepository;
    private final JwtParse jwtParse;
    private final EmployeeRepository employeeRepository;
    private final ShipmentItemRepository shipmentItemRepository;
    private final OrderItemRepository orderItemRepository;
    private final StockRepository stockRepository;
    private final CustomerRepository customerRepository;
    private final OrderMapper orderMapper;
    private final StockMapper stockMapper;
    private final ProductPriceService productPriceService;
    private final DateConvert dateConvert;
    private final ProductMapper productMapper;
    private final PromotionService promotionService;
    private final PromotionRepository promotionRepository;


    double roundPrice(double price){
        return (double) Math.round(price * 100) / 100;
    }

    @Transactional
    void minusStock(Long shipmenId, Long productId, int quantity) throws BadRequestUserException {
        var availableQuantityStock = stockRepository.getAvailableQuantityStock(shipmenId, productId, PageLimit.ONLY.getPageable());
        log.info("availableQuantityStock {}", availableQuantityStock);
        if (availableQuantityStock.isEmpty()) {
            throw new BadRequestUserException("Không tìm thấy lô hàng sản phẩm");
        }

        StockResponse stockResponse = stockMapper.mapObjectToStockResponse(availableQuantityStock.get(0));
        if (stockResponse.quantity() - stockResponse.soldQuantity() < quantity) {
            log.info("quantity is {}", stockResponse.quantity() - stockResponse.soldQuantity());
            throw new BadRequestUserException("Số lượng sản phẩm không đủ");
        }
        if(stockResponse.quantity() - stockResponse.notifyQuantity() <= stockResponse.notifyQuantity()){
            log.info("notifyQuantity is {}", stockResponse.notifyQuantity());
        }
        Stock stock = stockRepository.findById(stockResponse.id()).orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy số lượng sản phẩm"));
        stock.setSoldQuantity(stock.getSoldQuantity() + quantity);
        stockRepository.save(stock);
    }



    // create order with request are shipment id and product id for each item
    @Override
    @Transactional
    public CreateOrderResponse createOrder(OrderRequest orderRequest, HttpServletRequest request) throws BadRequestUserException {
        String phoneCustomer = "";
        String emailEmployee = jwtParse.decodeTokenWithRequest(request); // first call
        Map<Long, Integer> map = new HashMap<>();
        // Kiểm tra thông tin nhân viên
        Employee employee = employeeRepository.findByEmail(emailEmployee) // second call
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thông tin nhân viên"));
        OrderStatus orderStatus = orderRequest.isLive() ? OrderStatus.COMPLETED : OrderStatus.PENDING;
        PaymentType paymentType = orderRequest.paymentType().equals("CASH") ? PaymentType.CASH : PaymentType.E_WALLET;
        Long promotionId = 0L;
        if(orderRequest.totalDiscount() > 0){
            var latestPromotion = promotionService.getLatestPromotion();
            promotionService.minusOrderLimit(latestPromotion.id());
            promotionId = latestPromotion.id();
        }
        Promotion promotion = promotionRepository.findById(promotionId)
                .orElse(null);
        Order order = Order.builder()
                .employee(employee)
                .orderStatus(orderStatus)
                .createdAt(new Date())
                .paymentType(paymentType)
                .promotion(promotion)
                .customerPayment(BigDecimal.valueOf(orderRequest.customerPayment()))
                .totalDiscount(BigDecimal.valueOf(orderRequest.totalDiscount()))
                .build();
        // minus order limit when ordered
        // check exist account customer
        if (orderRequest.customerPhone().isPresent()) {
            phoneCustomer = orderRequest.customerPhone().get();
        }
        // Get customer
        if (!phoneCustomer.isEmpty()) {
            var customer = customerRepository.findByPhone(phoneCustomer) // third call
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thông tin khách hàng"));
            order.setCustomer(customer);
        }

        var orderItemRequests = orderRequest.orderItems();
        Order orderSave = orderRepository.save(order);
        BigDecimal total = BigDecimal.ZERO;

        List<ProductOrderItemResponse> orderItemResponses = new ArrayList<>();
        // Get product ids and shipment ids for batching
        Set<Long> productIds = orderItemRequests.stream().map(OrderItemRequest::productId).collect(Collectors.toSet());
        Set<Long> shipmentIds = orderItemRequests.stream().map(OrderItemRequest::shipmentId).collect(Collectors.toSet());
        Map<Long, Product> productMap = productRepository.findAllById(productIds).stream().collect(Collectors.toMap(Product::getId, Function.identity()));
        Map<Long, Shipment> shipmentMap = shipmentRepository.findAllById(shipmentIds).stream().collect(Collectors.toMap(Shipment::getId, Function.identity()));
        Map<Long, ProductPriceResponse> productPriceResponseMap = productIds
                    .stream()
                    .collect(Collectors.toMap(
                            Function.identity(), // The key is the value from the set (the Long ID)
                            productPriceService::getPriceLatest // The value is the ProductPriceResponse
                    ));
        for (OrderItemRequest orderItemRequest : orderItemRequests) {
            Long productId = orderItemRequest.productId();
            Long shipmentId = orderItemRequest.shipmentId();
            Product product = productMap.get(productId);
            if (product == null) {
                throw new ResourceNotFoundException("Không tìm thấy sản phẩm");
            }
            Shipment shipment = shipmentMap.get(shipmentId);
            if (shipment == null) {
                throw new ResourceNotFoundException("Không tìm thấy lô hàng");
            }
            ShipmentItemKey key = ShipmentItemKey.builder().product(product).shipment(shipment).build();
            //   check if product exist in shipment
            var shipmentItem = shipmentItemRepository.findById(key).orElseThrow(() -> new ResourceNotFoundException("Không tìm lô của sản phẩm"));

            // check if product is expired
            if (shipmentItem.getExp().before(new Date())) {
                throw new BadRequestUserException("Sản phẩm đã hết hạn");
            }

            minusStock(orderItemRequest.shipmentId(), orderItemRequest.productId(), orderItemRequest.quantity());
            ProductPriceResponse productPriceResponse = productPriceResponseMap.get(productId);
            double price = productPriceResponse.price();
            double amount = price * orderItemRequest.quantity();

            ProductPrice productPrice = productPriceService.getProductPriceById(productPriceResponse.productPriceId());

            if (map.containsKey(productId)) {
                map.put(productId, map.get(productId) + orderItemRequest.quantity());
                // increment quantity if product duplicate name
                double finalAmount = price * map.get(productId);
                orderItemResponses.replaceAll(response -> Objects.equals(response.name(), product.getName()) ?
                        new ProductOrderItemResponse(response.name(), response.quantity() + orderItemRequest.quantity(), price, finalAmount)
                        : response);
            } else {
                map.put(productId, orderItemRequest.quantity());
                orderItemResponses.add(new ProductOrderItemResponse(product.getName(), orderItemRequest.quantity(), price, amount));
            }
            OrderItem orderItem = OrderItem.builder()
                    .order(orderSave)
                    .product(product)
                    .shipment(shipment)
                    .quantity(orderItemRequest.quantity())
                    .productPrice(productPrice)
                    .amount(BigDecimal.valueOf(amount)).build();
            orderItemRepository.save(orderItem);
            total = total.add(BigDecimal.valueOf(amount));
        }
        double roundTotal = (double) Math.round(total.doubleValue() * 100) / 100;
        double change = orderRequest.customerPayment() - roundTotal - orderSave.getTotalDiscount().doubleValue();
        double roundChange = (double) Math.round(change * 100) / 100;
        return new CreateOrderResponse(orderItemResponses,roundTotal, orderRequest.customerPayment(), roundChange);
    }

    @Override
    public PageResponse<OrderResponse> getOrders(Integer pageNumber, Integer pageSize,
                                                 String fromDate, String toDate,
                                                 String orderBy,String order,
                                                 String status,
                                                 String customerPhone
                                 ) throws ParseException {
        Map<String, String> map = new HashMap<>();
        map.put("orderId","orderId");
        map.put("createdAt", "createdAt");
        map.put("total", "total");
        map.put("orderStatus", "orderStatus");
        map.put("paymentType", "paymentType");
        map.put("customerPhone", "customerPhone");
        map.put("emp", "emp");
        String column = map.get(orderBy);
        if(column == null){
           column = map.get("createdAt");
        }
        DateRequest dateRequest = dateConvert.convertDateRequest(fromDate, toDate);
        Sort sort = Sort.by(Sort.Direction.fromString(order), column);
        Pageable pageable = PageRequest.of(pageNumber, pageSize,sort);
        var orders = orderRepository.getOrders(pageable, dateRequest.fromDate(),
                dateRequest.toDate(),status,customerPhone);
        List<Object[]> orderList = orders.getContent();
        List<OrderResponse> orderResponseList = orderList.stream().map(orderMapper::mapObjectToResponse).toList();
        return new PageResponse<>(orderResponseList, pageNumber, orders.getTotalPages(), orders.getTotalElements(), orders.isLast());
    }


    @Override
    public PageResponse<OrderResponse> getOrdersByCustomer(Long id, int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        var ordersByCustomer = orderRepository.getOrdersByCustomer(id, pageable);
        List<Object[]> orderList = ordersByCustomer.getContent();
        List<OrderResponse> orderResponseList = orderList.stream().map(orderMapper::mapObjectToResponse).toList();
        return new PageResponse<>(orderResponseList, pageNumber, ordersByCustomer.getTotalPages(), ordersByCustomer.getTotalElements(), ordersByCustomer.isLast());
    }

    @Override
    public PageResponse<OrderResponse> getOrdersByEmployee(
            Long employeeId, Integer pageNumber, Integer pageSize,
            String fromDate, String toDate) throws ParseException {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        DateRequest dateRequest = dateConvert.convertDateRequest(fromDate, toDate);
        var ordersByCustomer = orderRepository.getOrdersByEmployee(employeeId, pageable,
                dateRequest.fromDate(),dateRequest.toDate());
        List<Object[]> orderList = ordersByCustomer.getContent();
        List<OrderResponse> orderResponseList = orderList.stream().map(orderMapper::mapObjectToResponse).toList();
        return new PageResponse<>(orderResponseList, pageNumber, ordersByCustomer.getTotalPages(), ordersByCustomer.getTotalElements(), ordersByCustomer.isLast());

    }


    @Override
    public OrderCustomerResponse getOrderDetailByCustomer(Long orderId) {
        if (orderRepository.findById(orderId).isEmpty()) {
            throw new ResourceNotFoundException("Không tìm thấy hóa đơn");
        }
        var ordersByCustomer = orderItemRepository.getProductInOrderItem(orderId);
        List<OrderItemQueryResponse> orderItemResponses = ordersByCustomer.stream().map(orderMapper::mapObjectToOrderItem).toList();
        BigDecimal totalPrice = BigDecimal.valueOf(0);
        for (OrderItemQueryResponse orderItemQueryResponse : orderItemResponses) {
            totalPrice = totalPrice.add(BigDecimal.valueOf(orderItemQueryResponse.totalPrice()));
        }
        var emp = orderRepository.getEmployeeByOrderId(orderId);
        log.info("emp is {}", emp.size());
        OrderEmployeeResponse orderEmployee = orderMapper.mapObjectToEmployee(emp.get(0));
        return new OrderCustomerResponse(orderEmployee.name(), orderEmployee.phone(), orderItemResponses, totalPrice);
    }

    @Override
    public OrderItemResponse getOrderById(Long orderId) {
        var orderById = orderRepository.getOrderById(orderId, PageLimit.ONLY.getPageable());
        if(orderById.isEmpty()){
            throw new ResourceNotFoundException("Không tìm thấy hóa đơn");
        }
        var orderItemResponse = orderMapper.mapToOrderItemResponse(orderById.get(0));
        var products = orderItemRepository.getProductInOrderItem(orderId);
        var productList = products.stream().map(productMapper::mapToProductOrderItemResponse).toList();
        for (var product : productList) {
            log.info("product is {}", product);
        }
        orderItemResponse.orderItemResponses().addAll(productList);
        return orderItemResponse;

    }

    @Override
    public void updateOrderStatus(Long orderId, String orderStatus) {
        orderRepository.findById(orderId).ifPresent(order -> {
            order.setOrderStatus(OrderStatus.valueOf(orderStatus));
            orderRepository.save(order);
        });
    }

}
