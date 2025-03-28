package com.bac.se.backend.repositories;

import com.bac.se.backend.models.Shipment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    @Query(value = "SELECT " +
            "    s.shipment_id, " +
            "    sup.name, " +
            "    s.created_at, " +
            "    SUM(si.quantity * pp.original_price) AS total_price " +
            "FROM  " +
            "    t_shipment s " +
            "INNER JOIN " +
            "    t_shipment_item si ON s.shipment_id = si.shipment_id " +
            "INNER JOIN " +
            "    t_supplier sup on sup.supplier_id = s.supplier_id " +
            "INNER JOIN " +
            "    t_product_price pp ON si.product_id = pp.product_id " +
            "WHERE " +
            "    pp.created_at = (SELECT MAX(pp2.created_at) " +
            "                     FROM t_product_price pp2 " +
            "                     WHERE pp2.product_id = pp.product_id) " +
            "AND s.created_at >= :fromDate and s.created_at <= :toDate " +
            "GROUP BY " +
            "    s.shipment_id " +
            "ORDER BY " +
            "    s.shipment_id DESC", nativeQuery = true)
    Page<Object[]> getShipmentsImport(Pageable pageable,
                                @Param("fromDate") Date fromDate,
                                @Param("toDate") Date toDate);

    @Query(value = "select sup.name, s.createdAt from Shipment s " +
            "inner join Supplier sup on sup.id = s.supplier.id " +
            "where s.id = :id")
    List<Object[]> getShipmentById(Long id);


}
