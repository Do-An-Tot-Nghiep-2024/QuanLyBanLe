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

    @Query(value = "SELECT  " +
            "    CEIL(DAY(o.created_at) / 7) AS week_of_month, " +
            "    ROUND(SUM(oi.amount),3) AS tong_doanh_thu, " +
            "    ROUND(SUM(oi.amount) - o.total_discount - SUM(oi.quantity * pp.original_price),3) as loi_nhuan " +
            "FROM " +
            "    t_order_item oi " +
            "        INNER JOIN " +
            "    t_order o ON o.order_id = oi.order_id " +
            "        INNER JOIN " +
            "    t_product_price pp ON pp.product_price_id = oi.product_price_id " +
            "WHERE  " +
            "  o.order_status = 'COMPLETED' AND MONTH(o.created_at) = ?1 AND YEAR(o.created_at) = ?2 " +
            "GROUP BY  " +
            "    week_of_month " +
            "ORDER BY  " +
            "    week_of_month",nativeQuery = true)
    List<Object[]> getSalesAndProfitByMonth(Integer month,Integer year);

    // Thống kê tổng doanh thu và lợi nhuận theo tuần
    @Query(value = "SELECT " +
            "    date_format(o.created_at,'%d-%m-%Y') AS week_of_month, " +
            "    ROUND(SUM(oi.amount),3) AS tong_doanh_thu, " +
            "    ROUND(SUM(oi.amount) - o.total_discount - SUM(oi.quantity * pp.original_price),3) as loi_nhuan " +
            "FROM " +
            "    t_order o " +
            "        INNER JOIN " +
            "    t_order_item oi ON o.order_id = oi.order_id " +
            "        INNER JOIN " +
            "    t_product_price pp ON pp.product_price_id = oi.product_price_id " +
            "WHERE  " +
            "   o.order_status = 'COMPLETED' AND o.created_at >= :fromDate AND o.created_at <= :toDate " +
            "GROUP BY  " +
            "    week_of_month",nativeQuery = true)
    List<Object[]> getSalesAndProfitByDate(
           @Param("fromDate") Date fromDate,
           @Param("toDate") Date toDate);



    // get stock by product by month
    @Query(value = "SELECT  " +
            "    oi.product_id,p.name, SUM(oi.quantity) AS sold_quantity " +
            "FROM " +
            "    t_order o " +
            "        INNER JOIN " +
            "    t_order_item oi ON oi.order_id = o.order_id " +
            "        INNER JOIN " +
            "    t_shipment_item si ON si.shipment_id = oi.shipment_id " +
            "        INNER JOIN " +
            "    t_stock s ON s.stock_id = si.stock_id " +
            "        INNER JOIN " +
            "    t_product p ON p.product_id = oi.product_id " +
            "WHERE " +
            "    MONTH(o.created_at) = ?1 " +
            "GROUP BY oi.product_id",nativeQuery = true)
    List<Object[]> getSoldQuantityProductByMonth(Integer month);

    @Query(value = "SELECT p.product_id, " +
            "    p.name, " +
            "    DATE_FORMAT(si.exp, '%d-%m-%Y') AS expired_day, " +
            "    si.shipment_id, " +
            "    (s.quantity - s.sold_quantity) AS avb,si.discount " +
            "FROM " +
            "    t_shipment_item si " +
            "        INNER JOIN " +
            "    t_product p ON si.product_id = p.product_id " +
            "        INNER JOIN " +
            "    t_stock s ON s.stock_id = si.stock_id " +
            "WHERE " +
            "    MONTH(si.exp) = :month " +
            "        AND YEAR(si.exp) = :year " +
            "GROUP BY si.shipment_id ORDER BY expired_day",nativeQuery = true)
    List<Object[]> getExpirationQuantityProductByMonthAndYear(
            @Param("month") Integer month,
            @Param("year") Integer year);



    @Query(value = "SELECT si.product_id,SUM(s.quantity - s.sold_quantity) FROM t_shipment_item si " +
            "INNER JOIN t_stock s ON si.stock_id = s.stock_id " +
            "GROUP BY si.product_id",nativeQuery = true)
    List<Object[]> getAvailableQuantityProduct();

    @Query(value = "SELECT si.product_id,SUM(s.quantity) FROM t_shipment_item si  " +
            "LEFT JOIN t_shipment ship ON ship.shipment_id = si.shipment_id  " +
            "LEFT JOIN t_stock s ON s.stock_id = si.stock_id  " +
            "WHERE MONTH(ship.created_at) = ?1  " +
            "GROUP BY si.product_id",nativeQuery = true)
    List<Object[]> getImportQuantityProductByMonth(Integer month);



    // Order Service
    @Query(value = "SELECT p.name,oi.quantity,pp.price,oi.amount,oi.shipment_id,si.discount FROM t_order_item oi " +
            "INNER JOIN t_product p ON p.product_id = oi.product_id " +
            "INNER JOIN t_shipment_item si ON si.product_id = p.product_id AND si.shipment_id = oi.shipment_id " +
            "INNER JOIN t_product_price pp ON pp.product_price_id = oi.product_price_id " +
            "WHERE oi.order_id = ?1",nativeQuery = true)
    List<Object[]> getProductInOrderItemWeb(Long orderId);


    @Query(value = "SELECT p.name,SUM(oi.quantity),pp.price,SUM(oi.amount),si.shipment_id,si.discount FROM t_order_item oi " +
            "INNER JOIN t_product p ON p.product_id = oi.product_id " +
            "INNER JOIN t_product_price pp ON pp.product_price_id = oi.product_price_id " +
            "INNER JOIN t_shipment_item si ON si.product_id = p.product_id AND si.shipment_id = oi.shipment_id " +
            "WHERE oi.order_id = ?1 GROUP BY p.name,pp.price",nativeQuery = true)
    List<Object[]> getProductInOrderItemMobile(Long orderId);


    @Query(value = "SELECT s.stock_id,oi.quantity FROM t_order_item oi " +
            "INNER JOIN t_shipment_item si ON oi.shipment_id = si.shipment_id AND si.product_id = oi.product_id " +
            "INNER JOIN t_stock s ON s.stock_id = si.stock_id " +
            "WHERE oi.order_id = :orderId;", nativeQuery = true)
    List<Object[]> getStockByOrder(@Param("orderId") Long id);







}
