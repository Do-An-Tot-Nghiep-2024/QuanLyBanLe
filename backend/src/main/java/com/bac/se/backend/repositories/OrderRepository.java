package com.bac.se.backend.repositories;

import com.bac.se.backend.models.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query(value = "SELECT  " +
            "    o.order_id, " +
            "    COALESCE(e.name,'') as emp, " +
            "    o.order_status, " +
            "    o.payment_type, " +
            "    SUM(oi.amount) as total, " +
            "    o.total_discount, " +
            "    o.customer_payment, " +
            "    o.created_at, " +
            "    COALESCE(c.phone,''), pro.percentage, pro.min_order_value " +
            "FROM " +
            "    t_order o " +
            "        INNER JOIN " +
            "    t_order_item oi ON o.order_id = oi.order_id " +
            "        LEFT JOIN " +
            "    t_employee e ON e.employee_id = o.employee_id " +
            "        LEFT JOIN  " +
            "    t_customer c ON c.customer_id = o.customer_id " +
            "        LEFT JOIN " +
            "   t_promotion pro ON pro.promotion_id = o.promotion_id " +
            "WHERE " +
            "    o.order_id = ?1 " +
            "GROUP BY oi.order_id", nativeQuery = true)
    List<Object[]> getOrderById(Long id, Pageable pageable);

    @Query(value = "SELECT  " +
            "    o.order_id, " +
            "    COALESCE(e.name, ''), " +
            "    o.order_status, " +
            "    o.payment_type, " +
            "    SUM(oi.amount), " +
            "    o.created_at, " +
            "    c.phone " +
            "FROM " +
            "    t_customer c " +
            "        INNER JOIN " +
            "    t_order o ON c.customer_id = o.customer_id " +
            "        INNER JOIN " +
            "    t_order_item oi ON oi.order_id = o.order_id " +
            "        LEFT JOIN " +
            "    t_employee e ON e.employee_id = o.employee_id " +
            "WHERE " +
            "    c.email = :email " +
            "GROUP BY oi.order_id " +
            "ORDER BY o.order_id DESC", nativeQuery = true)
    Page<Object[]> getOrdersByCustomer(String email, Pageable pageable);

    @Query(value = "select o.order_id as orderId,COALESCE(e.name,'') as emp,o.order_status as status," +
            "o.payment_type as paymentType," +
            "sum(oi.amount) as total, o.created_at as createdAt," +
            "COALESCE(c.phone,'') as customerPhone " +
            "from t_order o " +
            "join t_order_item oi on oi.order_id = o.order_id " +
            "left join t_employee e on e.employee_id = o.employee_id " +
            "left join t_customer c on c.customer_id = o.customer_id " +
            "where o.created_at between :fromDate and :toDate " +
            "AND o.order_status LIKE CONCAT(:status,'%') AND o.payment_type LIKE CONCAT(:paymentType,'%') " +
            "AND (:phone = '' OR (c.phone IS NOT NULL AND c.phone LIKE CONCAT(:phone, '%'))) " +
            "group by oi.order_id", nativeQuery = true)
    Page<Object[]> getOrders(
            Pageable pageable,
            @Param("fromDate") Date fromDate,
            @Param("toDate") Date toDate,
            @Param("status") String status,
            @Param("paymentType") String paymentType,
            @Param("phone") String phone);

    @Query(value = "select o.order_id as orderId, e.name as emp,o.order_status,o.payment_type as paymentType," +
            "sum(oi.amount) as total, o.created_at as createdAt," +
            "COALESCE(c.phone,'') as customerPhone " +
            "from t_order o " +
            "join t_order_item oi on oi.order_id = o.order_id " +
            "inner join t_employee e on e.employee_id = o.employee_id " +
            "left join t_customer c on c.customer_id = o.customer_id " +
            "where e.email = :email and o.created_at between :fromDate and :toDate " +
            "AND o.order_status LIKE CONCAT(:status,'%') AND o.payment_type LIKE CONCAT(:paymentType,'%') " +
            "AND (:phone = '' OR (c.phone IS NOT NULL AND c.phone LIKE CONCAT(:phone, '%'))) " +
            "group by oi.order_id order by o.created_at desc", nativeQuery = true)
    Page<Object[]> getOrdersByEmployee(
            @Param("email") String email, Pageable pageable,
            @Param("fromDate") Date fromDate,
            @Param("toDate") Date toDate,
            @Param("status") String status,
            @Param("phone") String phone,
            @Param("paymentType") String paymentType);


    @Query(value = "select COALESCE(e.name,''),COALESCE(e.phone,'') from t_order o " +
            "left join t_employee e on e.employee_id = o.employee_id " +
            "where o.order_id = :orderId;", nativeQuery = true)
    List<Object[]> getEmployeeByOrderId(Long orderId);


    // for manager

    @Query(value = "SELECT COUNT(o.order_id) FROM t_order o " +
            "WHERE o.order_status = 'COMPLETED' AND DATE(o.created_at) = CURDATE()", nativeQuery = true)
    long getCurrentTotalOrders();


    @Query(value = "SELECT  " +
            "   SUM(oi.amount) - o.total_discount - SUM(oi.quantity * pp.original_price) as profit " +
            "FROM  " +
            "    t_order_item oi " +
            "INNER JOIN  " +
            "    t_product_price pp ON oi.product_price_id = pp.product_price_id " +
            "INNER JOIN  " +
            "    t_order o ON o.order_id = oi.order_id " +
            "WHERE  " +
            "   o.order_status = 'COMPLETED' AND DATE(o.created_at) = CURDATE()", nativeQuery = true)
    List<Object[]> getNetTotalProfitCurrent(Pageable pageable);

    // Get total sales by employee by date
    @Query(value = "SELECT DATE_FORMAT(o.created_at,'%d-%m-%Y') as createdAt,SUM(oi.amount) FROM t_order o   " +
            "INNER JOIN t_order_item oi ON o.order_id = oi.order_id  " +
            "INNER JOIN t_employee e ON e.employee_id = o.employee_id  " +
            "WHERE e.email = :email AND o.order_status = 'COMPLETED' AND (o.created_at BETWEEN :fromDate AND :toDate) " +
            "GROUP BY createdAt order by createdAt desc", nativeQuery = true)
    List<Object[]> getTotalSalesByEmployee(String email,
                                           Date fromDate, Date toDate);

    // Get total orders by employee by date
    @Query(value = "SELECT DATE_FORMAT(o.created_at,'%d-%m-%Y') as createdAt,COUNT(o.order_id) FROM t_order o   " +
            "INNER JOIN t_employee e ON e.employee_id = o.employee_id  " +
            "WHERE e.email = :email AND o.order_status = 'COMPLETED' AND (o.created_at BETWEEN :fromDate AND :toDate)" +
            "GROUP BY createdAt order by createdAt desc", nativeQuery = true)
    List<Object[]> getTotalOrdersByEmployee(String email,
                                            Date fromDate, Date toDate);

}
