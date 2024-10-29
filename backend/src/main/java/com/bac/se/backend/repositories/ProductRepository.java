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

    @Query(value = "select p.id, p.name from Product p where p.category.id = ?1 and p.isActive = true")
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

}
