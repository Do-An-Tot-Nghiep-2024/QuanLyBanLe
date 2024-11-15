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
            "    e.name, " +
            "    o.order_status, " +
            "    o.payment_type, " +
            "    SUM(oi.amount) as total, " +
            "    o.total_discount, " +
            "    o.customer_payment, " +
            "    o.created_at, " +
            "    c.phone " +
            "FROM " +
            "    t_order o " +
            "        INNER JOIN " +
            "    t_order_item oi ON o.order_id = oi.order_id " +
            "        INNER JOIN " +
            "    t_employee e ON e.employee_id = o.employee_id " +
            "        LEFT JOIN  " +
            "    t_customer c ON c.customer_id = o.customer_id " +
            "WHERE " +
            "    o.order_id = ?1 " +
            "GROUP BY oi.order_id",nativeQuery = true)
    List<Object[]> getOrderById(Long id, Pageable pageable);

    @Query(value = "select o.order_id, e.name as emp,sum(oi.total_price) as total, o.order_status,o.payment_type,o.total_discount,o.created_at,c.name " +
            "from t_order o " +
            "inner join t_order_item oi on oi.order_id = o.order_id " +
            "inner join t_employee e on e.employee_id = o.employee_id " +
            "inner join t_customer c on c.customer_id = o.customer_id " +
            "where o.customer_id = :id " +
            "group by oi.order_id", nativeQuery = true)
    Page<Object[]> getOrdersByCustomer(Long id, Pageable pageable);

    @Query(value = "select o.order_id as orderId, e.name as emp,o.order_status as status," +
            "o.payment_type as paymentType," +
            "sum(oi.amount) as total, o.created_at as createdAt," +
            "COALESCE(c.phone,'') as customerPhone " +
            "from t_order o " +
            "join t_order_item oi on oi.order_id = o.order_id " +
            "join t_employee e on e.employee_id = o.employee_id " +
            "left join t_customer c on c.customer_id = o.customer_id " +
            "where o.created_at between :fromDate and :toDate " +
            "AND o.order_status LIKE CONCAT(:status,'%') " +
            "AND (:phone = '' OR (c.phone IS NOT NULL AND c.phone LIKE CONCAT(:phone, '%'))) " +
            "group by oi.order_id", nativeQuery = true)
    Page<Object[]> getOrders(
            Pageable pageable,
            @Param("fromDate") Date fromDate,
            @Param("toDate") Date toDate,
            @Param("status") String status,
            @Param("phone") String phone);

    @Query(value = "select o.order_id, e.name as emp,o.order_status,o.payment_type," +
            "sum(oi.amount) as total, o.created_at," +
            "COALESCE(c.phone,'') as customer_phone " +
            "from t_order o " +
            "join t_order_item oi on oi.order_id = o.order_id " +
            "join t_employee e on e.employee_id = o.employee_id " +
            "left join t_customer c on c.customer_id = o.customer_id " +
            "where e.employee_id = :id and o.created_at between :fromDate and :toDate " +
            "group by oi.order_id order by o.created_at desc", nativeQuery = true)
    Page<Object[]> getOrdersByEmployee(
            @Param("id") Long id, Pageable pageable,
            @Param("fromDate") Date fromDate,
            @Param("toDate") Date toDate);





    @Query(value = "select e.name,e.phone from t_order o " +
            "join t_employee e on e.employee_id = o.employee_id " +
            "where o.order_id = :orderId;", nativeQuery = true)
    List<Object[]> getEmployeeByOrderId(Long orderId);

    @Query(value = "SELECT COUNT(o.order_id) FROM t_order o WHERE o.order_status = 'COMPLETED'",nativeQuery = true)
    long getTotalOrders();
}
