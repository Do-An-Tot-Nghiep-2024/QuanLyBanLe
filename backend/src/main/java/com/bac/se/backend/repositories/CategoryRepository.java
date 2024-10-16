package com.bac.se.backend.repositories;

import com.bac.se.backend.models.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Query("SELECT c.id,c.name FROM Category c WHERE c.isActive = true order by c.name asc")
    List<Object[]> getCategories();

    boolean existsByName(String name);

}
