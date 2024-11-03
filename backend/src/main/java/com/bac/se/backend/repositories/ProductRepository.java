package com.bac.se.backend.repositories;

import com.bac.se.backend.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p.id, p.name, p.image, c.name, s.name, " +
            "COALESCE(pp.originalPrice, 0) as originalPrice, " +
            "COALESCE(pp.price, 0) as price, " +
            "COALESCE(pp.discountPrice, 0) as discountPrice, " +
            "u.name " +
            "FROM Product p " +
            "JOIN p.category c " +
            "JOIN p.supplier s " +
            "LEFT JOIN Unit u on u.id = p.unit.id " +
            "LEFT JOIN ProductPrice pp ON pp.product.id = p.id " +
            "AND pp.createdAt = (SELECT MAX(p1.createdAt) FROM ProductPrice p1 WHERE p1.product.id = p.id) " +
            "WHERE p.isActive = true order by p.name asc")
    Page<Object[]> getProducts(Pageable pageable);


    @Query(value = "select count(*) from t_product where is_active = 0", nativeQuery = true)
    long getTotalQuantityProduct();


    @Query(value = "select p.id, p.name from Product p where p.supplier.id = ?1 and p.isActive = true")
    List<Object[]> getProductsBySupplier(Long supplierId);

    @Query(value = "SELECT  " +
            "    p.product_id, p.name, p.image,pp.price,pp.discount_price " +
            "FROM " +
            "    t_product p " +
            "        INNER JOIN " +
            "    t_category c ON c.category_id = p.category_id " +
            "        INNER JOIN " +
            "    t_product_price pp ON p.product_id = pp.product_id " +
            "WHERE " +
            "    pp.created_at = (SELECT  " +
            "            MAX(pp2.created_at) " +
            "        FROM " +
            "            t_product_price pp2 " +
            "        WHERE " +
            "            pp2.product_id = pp.product_id) " +
            "        AND p.is_active = 1 AND c.category_id = ?1", nativeQuery = true)
    List<Object[]> getProductsByCategory(Long categoryId);


    @Query(value = "SELECT " +
            "    p.name, SUM(s.sold_quantity) AS total_sold_quantity " +
            "FROM " +
            "    t_order o" +
            "        INNER JOIN " +
            "    t_order_item oi ON o.order_id = oi.order_id " +
            "        INNER JOIN " +
            "    t_product p ON oi.product_id = p.product_id " +
            "        INNER JOIN" +
            "    t_shipment_item si ON si.product_id = p.product_id " +
            "        INNER JOIN " +
            "    t_stock s ON s.stock_id = si.stock_id " +
            "WHERE " +
            "    o.created_at BETWEEN :fromDate AND :toDate " +
            "GROUP BY p.product_id " +
            "ORDER BY total_sold_quantity DESC", nativeQuery = true)
    Page<Object[]> getBestSellingProducts(Pageable pageable,
                                          @Param("fromDate") Date fromDate,
                                          @Param("toDate") Date toDate);





    @Query(value = "WITH LatestProductPrice AS ( " +
            "    SELECT  " +
            "        pp.product_id, " +
            "        pp.price, " +
            "        pp.discount_price, " +
            "        pp.product_price_id " +
            "    FROM  " +
            "        t_product_price pp " +
            "    INNER JOIN  " +
            "        (SELECT  " +
            "            product_id, MAX(created_at) AS latest_created_at " +
            "         FROM  " +
            "            t_product_price  " +
            "         GROUP BY  " +
            "            product_id " +
            "        ) AS latest_pp ON pp.product_id = latest_pp.product_id  " +
            "        AND pp.created_at = latest_pp.latest_created_at " +
            "), " +
            "MaxAvbTable AS ( " +
            "    SELECT  " +
            "        si.product_id,  " +
            "        MAX(s.quantity - s.sold_quantity) AS max_avb " +
            "    FROM  " +
            "        t_shipment_item si " +
            "    INNER JOIN  " +
            "        t_stock s ON si.stock_id = s.stock_id " +
            "    GROUP BY  " +
            "        si.product_id " +
            ") " +
            " " +
            "SELECT  " +
            "    p.name, " +
            "    p.image, " +
            "    lpp.price, " +
            "    lpp.discount_price, " +
            "    si.shipment_id, " +
            "    (s.quantity - s.sold_quantity) AS avb " +
            "FROM " +
            "    t_product p " +
            "INNER JOIN  " +
            "    LatestProductPrice lpp ON p.product_id = lpp.product_id " +
            "INNER JOIN  " +
            "    t_shipment_item si ON si.product_id = p.product_id " +
            "INNER JOIN  " +
            "    t_stock s ON s.stock_id = si.stock_id " +
            "INNER JOIN  " +
            "    MaxAvbTable max_avb_table ON si.product_id = max_avb_table.product_id " +
            "    AND (s.quantity - s.sold_quantity) = max_avb_table.max_avb " +
            "WHERE  " +
            "    p.is_active = 1 AND p.category_id = ?1 " +
            "ORDER BY  p.name",nativeQuery = true)
    Page<Object[]> getProductsMobile(Long categoryId, Pageable pageable);

}
