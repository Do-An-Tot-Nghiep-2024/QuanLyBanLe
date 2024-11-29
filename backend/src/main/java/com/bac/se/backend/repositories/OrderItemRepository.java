package com.bac.se.backend.repositories;

import com.bac.se.backend.keys.OrderItemKey;
import com.bac.se.backend.models.OrderItem;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, OrderItemKey> {

    // Thống kê tổng tiền bán hàng
    @Query(value = "select sum(oi.amount) from t_order_item oi " +
            "inner join t_order o on o.order_id = oi.order_id" +
            " where o.order_status = 'COMPLETED' AND DATE(o.created_at) = CURDATE()",nativeQuery = true)
    List<Object[]> getCurrentTotalSales(Pageable pageable);

    // Thống kê tổng tiền bán hàng cho mỗi sản phẩm
    @Query(value = "select p.name, SUM(oi.total_price) from t_order_item oi " +
            "inner join t_product p on p.product_id = oi.product_id " +
            "group by oi.product_id ",nativeQuery = true)
    List<Object[]> salesStatisticsByProduct();

    // Thống kê tổng tiền bán hàng của nhân viên
    @Query(value = "select e.name, sum(oi.amount) from t_order o " +
            "inner join t_order_item oi on oi.order_id = o.order_id " +
            "inner join t_employee e on e.employee_id = o.employee_id " +
            "group by o.employee_id", nativeQuery = true)
    List<Object[]> salesStatisticsByEmployee();

    // Thống kê doanh số và lợi nhuận theo thời gian cho quản lí
    @Query(value = "SELECT  " +
            "     DATE_FORMAT(o.created_at,'%d-%m-%Y') AS createdAt, " +
            "    ROUND(SUM(oi.amount),3) AS total, " +
            "    ROUND(SUM(oi.amount) - o.total_discount - SUM(oi.quantity * pp.original_price),3) AS total_profit " +
            "FROM " +
            "    t_order o " +
            "        INNER JOIN " +
            "    t_order_item oi ON oi.order_id = o.order_id " +
            "        INNER JOIN " +
            "    t_product_price pp ON pp.product_price_id = oi.product_price_id " +
            "WHERE " +
            "    o.created_at BETWEEN :fromDate AND :toDate " +
            "AND o.order_status = 'COMPLETED' " +
            "GROUP BY createdAt",nativeQuery = true)
    List<Object[]> getSalesAndProfitByDate(Date fromDate, Date toDate);

    // Top five highest grossing product
    @Query(value = "SELECT p.name, ROUND(SUM(oi.amount),2) as total FROM t_order o  " +
            "INNER JOIN t_order_item oi ON o.order_id = oi.order_id  " +
            "INNER JOIN t_product p ON oi.product_id = p.product_id  " +
            "WHERE o.order_status = 'COMPLETED' AND (o.created_at BETWEEN :fromDate AND :toDate)  " +
            "GROUP BY p.product_id  " +
            "ORDER BY total DESC",nativeQuery = true)
    List<Object[]> getTopFiveHighestGrossingProduct(Pageable pageable, Date fromDate, Date toDate);


    // Statistics sales by supplier
    @Query(value = "SELECT s.name,COALESCE(ROUND(SUM(oi.amount),2),0) as total FROM t_supplier s  " +
            "LEFT JOIN t_product p ON s.supplier_id = p.supplier_id " +
            "LEFT JOIN t_order_item oi ON oi.product_id = p.product_id " +
            "GROUP BY s.supplier_id",nativeQuery = true)
    List<Object[]> getSalesBySupplier();

    // Order Service
    @Query(value = "SELECT p.name,oi.quantity,pp.price,oi.amount FROM t_order_item oi " +
            "INNER JOIN t_product p ON p.product_id = oi.product_id " +
            "INNER JOIN t_product_price pp ON pp.product_price_id = oi.product_price_id " +
            "WHERE oi.order_id = ?1",nativeQuery = true)
    List<Object[]> getProductInOrderItemWeb(Long orderId);


    @Query(value = "SELECT p.name,SUM(oi.quantity),pp.price,SUM(oi.amount) FROM t_order_item oi " +
            "INNER JOIN t_product p ON p.product_id = oi.product_id " +
            "INNER JOIN t_product_price pp ON pp.product_price_id = oi.product_price_id " +
            "WHERE oi.order_id = ?1 GROUP BY p.name,pp.price",nativeQuery = true)
    List<Object[]> getProductInOrderItemMobile(Long orderId);


    @Query(value = "SELECT s.stock_id,oi.quantity FROM t_order_item oi " +
            "INNER JOIN t_shipment_item si ON oi.shipment_id = si.shipment_id AND si.product_id = oi.product_id " +
            "INNER JOIN t_stock s ON s.stock_id = si.stock_id " +
            "WHERE oi.order_id = :orderId;", nativeQuery = true)
    List<Object[]> getStockByOrder(@Param("orderId") Long id);







}
