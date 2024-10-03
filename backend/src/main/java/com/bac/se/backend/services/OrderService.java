package com.bac.se.backend.services;

import com.bac.se.backend.enums.OrderStatus;
import com.bac.se.backend.enums.PaymentType;
import com.bac.se.backend.exceptions.BadRequestUserException;
import com.bac.se.backend.exceptions.ResourceNotFoundException;
import com.bac.se.backend.keys.ShipmentItemKey;
import com.bac.se.backend.models.*;
import com.bac.se.backend.payload.request.OrderItemRequest;
import com.bac.se.backend.payload.request.OrderRequest;
import com.bac.se.backend.payload.response.OrderItemResponse;
import com.bac.se.backend.payload.response.OrderResponse;
import com.bac.se.backend.repositories.*;
import com.bac.se.backend.utils.JwtParse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;


@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

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

    // create order with request are shipment id and product id for each item
    public OrderResponse createOrderLive(OrderRequest orderRequest, HttpServletRequest request) throws BadRequestUserException {

        String phoneCustomer = "";
        // Kiểm tra nó khách hàng của đăng ký tài khoản
        if (orderRequest.customerPhone().isPresent()) {
            phoneCustomer = orderRequest.customerPhone().get();
        }
        var orderItemRequests = orderRequest.orderItems();
        log.info("Phone customer is {}", phoneCustomer);
        // Kiểm tra thông tin khách hàng
        Customer customer = customerRepository.findByPhone(phoneCustomer)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thông tin khách hàng"));
        String emailEmployee = jwtParse.decodeTokenWithRequest(request);
        log.info("Email employee is {}", emailEmployee);
        // Kiểm tra thông tin nhân viên
        Employee employee = employeeRepository.findByEmail(emailEmployee)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thông tin nhân viên"));
        // Kiểm tra thông tin khách hàng
        // Tạo hóa đơn cho khách hàng mua trực tiếp
        Order order = Order.builder()
                .customer(customer)
                .employee(employee)
                .orderStatus(OrderStatus.COMPLETED)
                .createdAt(new Date())
                .paymentType(PaymentType.CASH)
                .build();
        Order orderSave = orderRepository.save(order);
        double total = 0;
        // Kiểm tra số các mặt hàng trong đơn
        List<OrderItemResponse> orderItemResponses = new LinkedList<>();
        for (OrderItemRequest orderItemRequest : orderItemRequests) {
            Product product = productRepository.findById(orderItemRequest.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm sản phẩm"));
            Shipment shipment = shipmentRepository.findById(orderItemRequest.shipmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm lô hàng"));
            ShipmentItemKey key = ShipmentItemKey.builder()
                    .product(product)
                    .shipment(shipment)
                    .build();
            // Kiểm tra sản phẩm nào có tồn tại trong lô hàng nào không
            var shipmentItem = shipmentItemRepository.findById(key)
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm lô của sản phẩm"));
            // Kiểm tra sản phẩm đã hết hạn
            if (shipmentItem.getExpirationDate().before(new Date())) {
                throw new BadRequestUserException("Sản phẩm đã hết hạn");
            }
            // Kiêm tra sản phẩm có đủ số lượng trong lô hàng hay không
            var stock = stockRepository.findStockByProductId(product.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm số lượng của sản phẩm"));
            if (stock.getQuantity() - stock.getSoldQuantity() - stock.getFailedQuantity() == stock.getNotifyQuantity()) {
                // Thông báo cho người dùng sắp hết hàng
                log.info("Sản phẩm sắp hết hàng");
            }
            // Cập nhât số lượng sản phẩm trong lô hàng
            stock.setSoldQuantity(stock.getSoldQuantity() + orderItemRequest.quantity());
            stockRepository.save(stock);
//          // Lấy ra giá mới nhất của sản phẩm và tính tổng thành tiền của sản phẩm
            var productPriceLatest = productPriceRepository.getProductPriceLatest(product.getId(), PageRequest.of(0, 1));
            double price = Double.parseDouble(productPriceLatest.get(0)[1].toString());
            double discountPrice = Double.parseDouble(productPriceLatest.get(0)[2].toString());
            double totalPrice = price * orderItemRequest.quantity();
            // Kiểm tra xem sản phẩm có khuyến mại hay không
            if (discountPrice > 0) {
                totalPrice = discountPrice * orderItemRequest.quantity();
            }
            // Thêm order item vào danh sách trả về
            orderItemResponses.add(new OrderItemResponse(product.getName(), orderItemRequest.quantity(), price, discountPrice, totalPrice));
            var orderItem = OrderItem.builder()
                    .order(orderSave)
                    .product(product)
                    .quantity(orderItemRequest.quantity())
                    .totalPrice(BigDecimal.valueOf(totalPrice))
                    .build();
            // Lưu order item vào database
            orderItemRepository.save(orderItem);
            // Tính tổng số tiền cũng như tổng tiền khuyến mại
            total += totalPrice;
        }
        double change = orderRequest.customerPayment() - total;
        if (change < 0) {
            throw new BadRequestUserException("Số tiền không đủ");
        }
        return new OrderResponse(orderItemResponses, total, orderRequest.customerPayment(), change);
    }
}
