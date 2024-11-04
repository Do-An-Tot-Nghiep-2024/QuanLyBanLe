package com.bac.se.backend.services.impl;

import com.bac.se.backend.enums.OrderStatus;
import com.bac.se.backend.enums.PageLimit;
import com.bac.se.backend.enums.PaymentType;
import com.bac.se.backend.enums.PromotionScope;
import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.keys.OrderItemKey;
import com.bac.se.backend.keys.ShipmentItemKey;
import com.bac.se.backend.mapper.OrderMapper;
import com.bac.se.backend.mapper.PromotionMapper;
import com.bac.se.backend.mapper.StockMapper;
import com.bac.se.backend.models.*;
import com.bac.se.backend.payload.request.OrderItemRequest;
import com.bac.se.backend.payload.request.OrderRequest;
import com.bac.se.backend.payload.response.common.PageResponse;
import com.bac.se.backend.payload.response.order.*;
import com.bac.se.backend.payload.response.promotion.OrderPromotionResponse;
import com.bac.se.backend.payload.response.stock.StockResponse;
import com.bac.se.backend.repositories.*;
import com.bac.se.backend.services.OrderService;
import com.bac.se.backend.utils.JwtParse;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

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
    private final ProductPriceRepository productPriceRepository;
    private final OrderItemRepository orderItemRepository;
    private final StockRepository stockRepository;
    private final CustomerRepository customerRepository;
    private final OrderMapper orderMapper;
    private final QuantityPromotionRepository quantityPromotionRepository;
    private final GiftPromotionRepository giftPromotionRepository;
    private final StockMapper stockMapper;
    private final PromotionRepository promotionRepository;
    private final PromotionMapper promotionMapper;


    void minusStock(Long shipmenId, Long productId, int quantity) throws BadRequestUserException {
        var availableQuantityStock = stockRepository.getAvailableQuantityStock(shipmenId, productId, PageLimit.ONLY.getPageable());
        if (availableQuantityStock.isEmpty()) {
            throw new BadRequestUserException("Khong tim thay lo hang cua san pham");
        }
        StockResponse stockResponse = stockMapper.mapObjectToStockResponse(availableQuantityStock.get(0));
        if (stockResponse.quantity() - stockResponse.soldQuantity() < quantity) {
            throw new BadRequestUserException("So luong san pham khong du");
        }
        Stock stock = stockRepository.findById(stockResponse.id())
                .orElseThrow(() -> new ResourceNotFoundException("Khong tim thay so luong san pham"));
        stock.setSoldQuantity(stock.getSoldQuantity() + quantity);
        stockRepository.save(stock);
    }

    // create order with request are shipment id and product id for each item
    @Override
    public CreateOrderResponse createOrder(OrderRequest orderRequest, HttpServletRequest request) throws BadRequestUserException {
        String phoneCustomer = "";
        String emailEmployee = jwtParse.decodeTokenWithRequest(request);
        Map<Long, Integer> map = new HashMap<>();
        // Kiểm tra thông tin nhân viên
        Employee employee = employeeRepository.findByEmail(emailEmployee)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thông tin nhân viên"));

        OrderStatus orderStatus = orderRequest.isLive() ? OrderStatus.COMPLETED : OrderStatus.PENDING;
        PaymentType paymentType = orderRequest.paymentType().equals("CASH") ? PaymentType.CASH : PaymentType.E_WALLET;
        Order order = Order.builder()
                .employee(employee)
                .orderStatus(orderStatus)
                .createdAt(new Date())
                .paymentType(paymentType)
                .build();

        // Kiểm tra nó khách hàng của đăng ký tài khoản
        if (orderRequest.customerPhone().isPresent()) {
            phoneCustomer = orderRequest.customerPhone().get();
        }
        // Kiểm tra thông tin khách hàng
        if (!phoneCustomer.isEmpty()) {
            var customer = customerRepository.findByPhone(phoneCustomer)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thông tin khách hàng"));
            order.setCustomer(customer);
        }

        var orderItemRequests = orderRequest.orderItems();
        Order orderSave = orderRepository.save(order);
        BigDecimal total = BigDecimal.ZERO, totalDiscount = BigDecimal.ZERO;
        int remain = 0;
        // Kiểm tra số các mặt hàng trong đơn
        List<OrderItemResponse> orderItemResponses = new LinkedList<>();
        for (OrderItemRequest orderItemRequest : orderItemRequests) {
            Product product = productRepository.findById(orderItemRequest.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm"));
            Shipment shipment = shipmentRepository.findById(orderItemRequest.shipmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lô hàng"));
            ShipmentItemKey key = ShipmentItemKey.builder()
                    .product(product)
                    .shipment(shipment)
                    .build();
            // Kiểm tra sản phẩm nào có tồn tại trong lô hàng nào không
            var shipmentItem = shipmentItemRepository.findById(key)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm lô của sản phẩm"));

            // Kiểm tra sản phẩm đã hết hạn
            if (shipmentItem.getExp().before(new Date())) {
                throw new BadRequestUserException("Sản phẩm đã hết hạn");
            }

            // Kiểm tra số lượng của lô hàng
            log.info("Trừ số lượng trong lô hàng");
            minusStock(orderItemRequest.shipmentId(),
                    orderItemRequest.productId(), orderItemRequest.quantity());
            // Lấy ra giá mới nhất của sản phẩm và tính tổng thành tiền của sản phẩm
            var productPriceLatest = productPriceRepository.getProductPriceLatest(product.getId(), PageLimit.ONLY.getPageable());
            double price = Double.parseDouble(productPriceLatest.get(0)[1].toString());
            double discountPrice = Double.parseDouble(productPriceLatest.get(0)[2].toString());
            double totalPrice = 0;
            // Kiểm tra xem sản phẩm có giảm giá hay không
            if (discountPrice > 0) {
                totalPrice += discountPrice * orderItemRequest.quantity();
            } else {
                totalPrice += price * orderItemRequest.quantity();
            }
            OrderItemResponse orderItemResponse;
            if (map.containsKey(product.getId())) {
                remain = map.get(product.getId());
                map.put(product.getId(), map.get(product.getId()) + orderItemRequest.quantity());
                // increment quantity if product duplicate name
                double finalTotalPrice = totalPrice;
                orderItemResponses.replaceAll(response ->
                        Objects.equals(response.name(), product.getName())
                                ? new OrderItemResponse(
                                response.name(),
                                response.quantity() + orderItemRequest.quantity(),
                                price,
                                discountPrice,
                                response.totalPrice() + finalTotalPrice)
                                : response
                );
            } else {
                map.put(product.getId(), orderItemRequest.quantity());
                orderItemResponses.add(new OrderItemResponse(
                        product.getName(),
                        orderItemRequest.quantity(),
                        price,
                        discountPrice,
                        totalPrice));
            }

            // Kiem tra san pham co khuyen mai hay khong
            if (product.getPromotion() != null
                    && product.getPromotion().getScope() == PromotionScope.PRODUCT
                    && product.getPromotion().getEndDate().after(new Date())
                    && product.getPromotion().getOrderLimit() > 0) {
                // check quantity promotion
                log.info("existing promotion");
                Promotion promotion = product.getPromotion();
                var existQuantityPromotion = quantityPromotionRepository.findByPromotion(promotion);
                var existGiftPromotion = giftPromotionRepository.findByPromotion(promotion);
                if (existQuantityPromotion.isPresent() && product.getPromotion().getOrderLimit() > 0) {
                    log.info("Quantity Promotion found");
                    QuantityPromotion quantityPromotion = existQuantityPromotion.get();
                    int freeQuantity = (map.get(product.getId()) / quantityPromotion.getBuyQuantity()) * quantityPromotion.getFreeQuantity();
                    totalPrice = totalPrice - (freeQuantity * price);
                    promotion.setOrderLimit(promotion.getOrderLimit() - 1);
                    product.setPromotion(promotion);
                    productRepository.save(product);
                    promotionRepository.save(promotion);
                }
                if (existGiftPromotion.isPresent()) {
                    GiftPromotion giftPromotion = existGiftPromotion.get();
                    log.info("Gift Promotion found");
                    int giftQuantity = (map.get(product.getId()) / giftPromotion.getBuyQuantity()) * giftPromotion.getGiftQuantity();
                    int remainQuantity = (remain / giftPromotion.getBuyQuantity()) * giftPromotion.getGiftQuantity();
                    if (giftQuantity > 0) {
                        OrderItem giftOrderItem = OrderItem.builder()
                                .product(productRepository.findById(giftPromotion.getGiftProductId()).orElseThrow(
                                        () -> new IllegalArgumentException("product not found")
                                ))
                                .quantity(giftQuantity)
                                .order(order)
                                .note("Sản phẩm tặng kèm")
                                .totalPrice(BigDecimal.ZERO)
                                .build();
                        orderItemRepository.save(giftOrderItem);
                        log.info("Trừ số lượng khuyến mãi");
                        giftQuantity = giftQuantity - remainQuantity;
                        minusStock(giftPromotion.getGiftShipmentId(), giftPromotion.getGiftProductId(), giftQuantity);
                        promotion.setOrderLimit(promotion.getOrderLimit() - 1);
                        product.setPromotion(promotion);
                        productRepository.save(product);
                        promotionRepository.save(promotion);
                    }
                }
            }

            // Thêm order item vào danh sách trả về
            Optional<OrderItem> orderItemExist = orderItemRepository.findById(
                    OrderItemKey.builder()
                            .product(product)
                            .order(orderSave)
                            .build()
            );

            OrderItem orderItem;
            if (orderItemExist.isPresent()) {
                orderItem = orderItemExist.get();
                orderItem.setQuantity(orderItem.getQuantity() + orderItemRequest.quantity());
                orderItem.setTotalPrice(orderItem.getTotalPrice().add(BigDecimal.valueOf(totalPrice)));

            } else {
                orderItem = OrderItem.builder()
                        .order(orderSave)
                        .product(product)
                        .quantity(orderItemRequest.quantity())
                        .totalPrice(BigDecimal.valueOf(totalPrice))
                        .build();
            }
            orderItemRepository.save(orderItem);
            // Tính tổng số tiền cũng như tổng tiền khuyến mại
            total = total.add(BigDecimal.valueOf(totalPrice));
        }

        double change = orderRequest.customerPayment() - total.doubleValue();
        if (change < 0) {
            throw new BadRequestUserException("Số tiền không đủ");
        }
        
        var promotionOrderLatest = promotionRepository.getPromotionOrderLatest(PageLimit.ONLY.getPageable());
        if (!promotionOrderLatest.isEmpty()) {
            OrderPromotionResponse promotionResponse = promotionMapper.mapToPromotionResponse(promotionOrderLatest.get(0));
            Promotion promotion = promotionRepository.findById(promotionResponse.promotionId()).orElseThrow(
                    () -> new ResourceNotFoundException("Không tìm thấy khuyến mãi")
            );
            if (total.compareTo(promotionResponse.minOrderValue()) > 0 && promotion.getOrderLimit() > 0) {
                promotion.setOrderLimit(promotion.getOrderLimit() - 1);
                promotionRepository.save(promotion);
                totalDiscount = totalDiscount.add(total.multiply(BigDecimal.valueOf(promotionResponse.discountPercent())));
                total = total.subtract(totalDiscount);
                orderSave.setTotalDiscount(totalDiscount);
            }
        }
        orderSave.setCustomerPayment(BigDecimal.valueOf(orderRequest.customerPayment()));

        orderRepository.save(orderSave);
        return new CreateOrderResponse(orderItemResponses, total.doubleValue(), orderRequest.customerPayment(), change);
    }

    // get orders customer bought
    @Override
    public PageResponse<OrderResponse> getOrdersByCustomer(Long id, int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        var ordersByCustomer = orderRepository.getOrdersByCustomer(id, pageable);
        List<Object[]> orderList = ordersByCustomer.getContent();
        List<OrderResponse> orderResponseList = orderList.stream()
                .map(orderMapper::mapObjectToResponse)
                .toList();
        return new PageResponse<>(orderResponseList, pageNumber,
                ordersByCustomer.getTotalPages(), ordersByCustomer.getTotalElements(), ordersByCustomer.isLast());
    }

    @Override
    public PageResponse<OrderResponse> getOrdersByEmployee(Long employeeId, int pageNumber, int pageSize) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        var ordersByCustomer = orderRepository.getOrdersByEmployee(employeeId, pageable);
        List<Object[]> orderList = ordersByCustomer.getContent();
        List<OrderResponse> orderResponseList = orderList.stream()
                .map(orderMapper::mapObjectToResponse)
                .toList();
        return new PageResponse<>(orderResponseList, pageNumber,
                ordersByCustomer.getTotalPages(), ordersByCustomer.getTotalElements(), ordersByCustomer.isLast());

    }

    @Override
    public PageResponse<OrderResponse> getOrdersEmployeeByDate(Long employeeId, int pageNumber, int pageSize,
                                                               @JsonFormat(pattern = "yyyy-MM-dd") Date fromDate,
                                                               @JsonFormat(pattern = "yyyy-MM-dd") Date toDate) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        var ordersEmployeeByDate = orderRepository.getOrdersEmployeeByDate(employeeId, pageable, fromDate, toDate);
        List<Object[]> orderList = ordersEmployeeByDate.getContent();
        List<OrderResponse> orderResponseList = orderList.stream()
                .map(orderMapper::mapObjectToResponse)
                .toList();
        return new PageResponse<>(orderResponseList, pageNumber,
                ordersEmployeeByDate.getTotalPages(), ordersEmployeeByDate.getTotalElements(), ordersEmployeeByDate.isLast());
    }


    @Override
    public OrderCustomerResponse getOrderDetailByCustomer(Long orderId) {
        if (orderRepository.findById(orderId).isEmpty()) {
            throw new ResourceNotFoundException("Không tìm thấy hóa đơn");
        }
        var ordersByCustomer = orderRepository.getOrderItemByOrderId(orderId);
        List<OrderItemQueryResponse> orderItemResponses = ordersByCustomer.stream()
                .map(orderMapper::mapObjectToOrderItem)
                .toList();
        BigDecimal totalPrice = BigDecimal.valueOf(0);
        for (OrderItemQueryResponse orderItemQueryResponse : orderItemResponses) {
            totalPrice = totalPrice.add(BigDecimal.valueOf(orderItemQueryResponse.totalPrice()));
        }
        var emp = orderRepository.getEmployeeByOrderId(orderId);
        log.info("emp is {}", emp.size());
        OrderEmployeeResponse orderEmployee = orderMapper.mapObjectToEmployee(emp.get(0));
        return new OrderCustomerResponse(
                orderEmployee.name(),
                orderEmployee.phone(),
                orderItemResponses,
                totalPrice
        );
    }
}
