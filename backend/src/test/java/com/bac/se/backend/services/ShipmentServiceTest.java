package com.bac.se.backend.services;

class ShipmentServiceTest {
//    @InjectMocks
//    private ShipmentServiceImpl shipmentService;
//    @Mock
//    private StockRepository stockRepository;
//    @Mock
//    private ShipmentRepository shipmentRepository;
//    @Mock
//    private ShipmentItemRepository shipmentItemRepository;
//    @Mock
//    private ProductPriceRepository productPriceRepository;
//    @Mock
//    private ProductRepository productRepository;
//    @Mock
//    private ProductPriceMapper productPriceMapper;
//    @Mock
//    private SupplierRepository supplierRepository;
//
//    static final double DEFAULT_PROFIT = 0.2;
//    static final String PRODUCT_NOT_FOUND = "Không tìm thấy sản phẩm";
//    static final String STOCK_NOT_FOUND = "Không tìm thấy lô hàng của sản phẩm";
//
//    Shipment shipment = null;
//    ProductItem productItem = null;
//
//    @BeforeEach
//    void setUp() {
//        MockitoAnnotations.openMocks(this);
//        shipment = Shipment.builder().createdAt(new Date()).build();
//        productItem = mock(ProductItem.class);
//    }
//
//    @Test
//    void createShipment() throws BadRequestUserException {
//        ShipmentRequest shipmentRequest = mock(ShipmentRequest.class);
//        Supplier supplier = Supplier.builder().id(1L).name("Supplier").build();
//        when(supplierRepository.findById(1L)).thenReturn(Optional.of(supplier));
//        setupCommonMocks(shipmentRequest);
//
//
//        Product product = mock(Product.class);
//        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
//
//        List<Object[]> productPrice = new LinkedList<>();
//        Object[] objects = new Object[]{1000, 1500, 30};
//        productPrice.add(objects);
//        when(productPriceRepository.getProductPriceLatest(eq(1L), any(PageRequest.class))).thenReturn(productPrice);
//        when(productPriceMapper.mapObjectToProductPriceResponse(productPrice.get(0))).thenReturn(new ProductPriceResponse(1200, 1700, 30));
//        double oldPrice = productPriceMapper.mapObjectToProductPriceResponse(productPrice.get(0)).price();
//        ProductPrice newProductPrice = ProductPrice.builder()
//                .product(Product.builder().id(productItem.id()).build())
//                .originalPrice(productItem.price())
//                .price(productItem.price() + productItem.price() * DEFAULT_PROFIT)
//                .discountPrice(0)
//                .createdAt(new Date())
//                .build();
//        when(productPriceRepository.save(any(ProductPrice.class))).thenReturn(newProductPrice);
//
//        Stock stock = mock(Stock.class);
//        when(stockRepository.findStockByProductId(1L)).thenReturn(Optional.of(stock));
//
//        // Act
//        ShipmentResponse response = shipmentService.createShipment(shipmentRequest);
//
//        // Assert
//        assertNotNull(response);
//        assertEquals(supplier.getName(), response.name());
//        assertEquals(BigDecimal.valueOf(1000.0), response.total());
//        assertNotEquals(oldPrice, productItem.price());
//        verify(shipmentRepository, times(1)).save(any(Shipment.class));
//        verify(shipmentItemRepository, times(1)).save(any(ShipmentItem.class));
//        verify(stockRepository, times(1)).save(any(Stock.class));
//        verify(productPriceRepository, times(1)).save(any(ProductPrice.class));
//    }
//
//    @Test
//    void testCreateShipmentWithProductException() {
//        ShipmentRequest shipmentRequest = mock(ShipmentRequest.class);
//        setupCommonMocks(shipmentRequest);
//        when(productRepository.findById(1L)).thenReturn(Optional.empty());
//
//        ResourceNotFoundException resourceNotFoundException = assertThrows(ResourceNotFoundException.class,
//                () -> shipmentService.createShipment(shipmentRequest));
//        assertEquals(PRODUCT_NOT_FOUND, resourceNotFoundException.getMessage());
//
//        verify(productRepository).findById(1L);
//        verify(productPriceRepository, never()).getProductPriceLatest(any(Long.class), any(PageRequest.class));
//        verify(productPriceMapper, never()).mapObjectToProductPriceResponse(any(Object[].class));
//        verify(productPriceRepository, never()).save(any(ProductPrice.class));
//        verify(shipmentItemRepository, never()).save(any(ShipmentItem.class));
//        verify(stockRepository, never()).save(any(Stock.class));
//    }
//
//    @Test
//    void testCreateShipmentWithStockException() {
//        ShipmentRequest shipmentRequest = mock(ShipmentRequest.class);
//        setupCommonMocks(shipmentRequest);
//
//        Product product = mock(Product.class);
//        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
//
//        List<Object[]> productPrice = new LinkedList<>();
//        Object[] objects = new Object[]{1000, 1500, 30};
//        productPrice.add(objects);
//        when(productPriceRepository.getProductPriceLatest(eq(1L), any(PageRequest.class))).thenReturn(productPrice);
//        when(productPriceMapper.mapObjectToProductPriceResponse(productPrice.get(0))).thenReturn(new ProductPriceResponse(1200, 1700, 30));
//
//        when(stockRepository.findStockByProductId(1L)).thenReturn(Optional.empty());
//
//        ResourceNotFoundException resourceNotFoundException = assertThrows(ResourceNotFoundException.class,
//                () -> shipmentService.createShipment(shipmentRequest));
//        assertEquals(STOCK_NOT_FOUND, resourceNotFoundException.getMessage());
//
//        verify(productRepository, times(1)).findById(1L);
//        verify(stockRepository).findStockByProductId(1L);
//        verify(productPriceRepository, times(1)).getProductPriceLatest(any(Long.class), any(PageRequest.class));
//        verify(productPriceMapper, times(1)).mapObjectToProductPriceResponse(any(Object[].class));
//        verify(shipmentItemRepository, times(1)).save(any(ShipmentItem.class));
//        verify(stockRepository, never()).save(any(Stock.class));
//    }
//
//    private void setupCommonMocks(ShipmentRequest shipmentRequest) {
//        when(shipmentRepository.save(any(Shipment.class))).thenReturn(shipment);
//        ProductItem productItem = mock(ProductItem.class);
//        when(productItem.id()).thenReturn(1L);
//        when(productItem.quantity()).thenReturn(10);
//        when(productItem.price()).thenReturn(100.0);
//        when(shipmentRequest.productItems()).thenReturn(List.of(productItem));
//    }


}