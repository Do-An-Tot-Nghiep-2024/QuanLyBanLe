package com.bac.se.backend.utils;

import com.bac.se.backend.models.Category;
import com.bac.se.backend.models.Product;
import com.bac.se.backend.models.ProductPrice;
import com.bac.se.backend.models.Supplier;
import com.bac.se.backend.repositories.CategoryRepository;
import com.bac.se.backend.repositories.ProductPriceRepository;
import com.bac.se.backend.repositories.ProductRepository;
import com.bac.se.backend.repositories.SupplierRepository;
import lombok.RequiredArgsConstructor;
import net.datafaker.Faker;
import org.springframework.boot.CommandLineRunner;

import java.util.Date;

@RequiredArgsConstructor
public class GenerateData {
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final ProductPriceRepository productPriceRepository;
    private final ProductRepository productRepository;
    static String[] random = new String[]{"Meat", "Fruit",
            "Vegetable", "Dairy", "Seafood",
            "Egg", "Bread", "Pasta", "Rice","Drink" };

    CommandLineRunner commandLineRunner() {
        Faker faker = new Faker();
        return args -> {
            for (long i = 1; i <= 10; i++) {
                // add category
                Category category = Category.builder()
                        .name(random[(int)i-1])
                        .build();
                categoryRepository.save(category);
                // add supplier
                Supplier supplier = Supplier.builder()
                        .name(faker.commerce().brand())
                        .address(faker.address().streetAddress())
                        .email(faker.internet().emailAddress())
                        .phone(faker.phoneNumber().phoneNumber())
                        .isActive(true)
                        .build();
                supplierRepository.save(supplier);
                // add product price
                ProductPrice productPrice = ProductPrice.builder()
                        .createdAt(new Date())
                        .price(Double.parseDouble(faker.commerce().price()))
                        .build();
                productPriceRepository.save(productPrice);
                // add product
                Product product = Product.builder()
                        .name(faker.commerce().productName())
                        .category(categoryRepository.findById(i).orElseThrow(()-> new RuntimeException("Category not found")))
                        .productPrice(productPriceRepository.findById(i).orElseThrow(()-> new RuntimeException("ProductPrice not found")))
                        .supplier(supplierRepository.findById(i).orElseThrow(()-> new RuntimeException("Supplier not found")))
                        .image(faker.internet().image())
                        .build();
                productRepository.save(product);
            }
        };
    }


}
