// Order.js

const orders = [
    {
        id: 1,
        customerName: "Nguyễn Văn A",
        phone: "0987654321",
        items: [
            { productId: 1, name: "Sữa đặc Ngôi Sao Phương Nam", quantity: 2, price: 20000 },
            { productId: 2, name: "Bánh Oreo", quantity: 1, price: 35000 }
        ],
        totalPrice: 85000,
        paymentMethod: "Tự đến lấy",
        pickupDate: "2024-09-25",
        status: "Đang chờ"
    },
    {
        id: 2,
        customerName: "Trần Thị B",
        phone: "0912345678",
        items: [
            { productId: 3, name: "Mì Hảo Hảo", quantity: 3, price: 3000 },
            { productId: 4, name: "Mì Omachi", quantity: 2, price: 3500 }
        ],
        totalPrice: 13500,
        paymentMethod: "Tự đến lấy",
        pickupDate: "2024-09-26",
        status: "Hoàn tất" // Updated status
    },
    {
        id: 3,
        customerName: "Lê Văn C",
        phone: "0987654322",
        items: [
            { productId: 5, name: "Đồ hộp cá ngừ", quantity: 1, price: 25000 },
            { productId: 6, name: "Đồ hộp đậu đỏ", quantity: 1, price: 20000 }
        ],
        totalPrice: 45000,
        paymentMethod: "Tự đến lấy",
        pickupDate: "2024-09-27",
        status: "Hoàn tất" // Updated status
    },
    {
        id: 4,
        customerName: "Nguyễn Thị D",
        phone: "0912345679",
        items: [
            { productId: 7, name: "Muối tinh", quantity: 5, price: 10000 },
            { productId: 8, name: "Hạt tiêu xay", quantity: 2, price: 15000 }
        ],
        totalPrice: 80000,
        paymentMethod: "Tự đến lấy",
        pickupDate: "2024-09-28",
        status: "Đang chờ"
    },
    {
        id: 5,
        customerName: "Phạm Văn E",
        phone: "0987654323",
        items: [
            { productId: 9, name: "Nước ngọt Pepsi", quantity: 4, price: 20000 },
            { productId: 10, name: "Nước trái cây vải", quantity: 3, price: 25000 }
        ],
        totalPrice: 115000,
        paymentMethod: "Tự đến lấy",
        pickupDate: "2024-09-29",
        status: "Hoàn tất" // Updated status
    },
    {
        id: 6,
        customerName: "Nguyễn Văn F",
        phone: "0912345680",
        items: [
            { productId: 1, name: "Sữa đặc Ngôi Sao Phương Nam", quantity: 1, price: 20000 },
            { productId: 4, name: "Mì Omachi", quantity: 5, price: 3500 }
        ],
        totalPrice: 43500,
        paymentMethod: "Tự đến lấy",
        pickupDate: "2024-09-30",
        status: "Hoàn tất" // Updated status
    },
    {
        id: 7,
        customerName: "Trần Thị G",
        phone: "0987654324",
        items: [
            { productId: 2, name: "Bánh Oreo", quantity: 3, price: 35000 },
            { productId: 6, name: "Đồ hộp đậu đỏ", quantity: 4, price: 20000 }
        ],
        totalPrice: 140000,
        paymentMethod: "Tự đến lấy",
        pickupDate: "2024-09-30",
        status: "Đang chờ"
    },
    {
        id: 8,
        customerName: "Lê Văn H",
        phone: "0912345670",
        items: [
            { productId: 5, name: "Đồ hộp cá ngừ", quantity: 2, price: 25000 },
            { productId: 9, name: "Nước ngọt Pepsi", quantity: 2, price: 20000 }
        ],
        totalPrice: 70000,
        paymentMethod: "Tự đến lấy",
        pickupDate: "2024-10-01",
        status: "Hoàn tất" // Updated status
    },
    {
        id: 9,
        customerName: "Nguyễn Văn I",
        phone: "0912345671",
        items: [
            { productId: 3, name: "Mì Hảo Hảo", quantity: 1, price: 3000 },
            { productId: 7, name: "Muối tinh", quantity: 3, price: 10000 }
        ],
        totalPrice: 33000,
        paymentMethod: "Tự đến lấy",
        pickupDate: "2024-10-02",
        status: "Đang chờ"
    },
    {
        id: 10,
        customerName: "Trần Thị J",
        phone: "0912345672",
        items: [
            { productId: 10, name: "Nước trái cây vải", quantity: 5, price: 25000 },
            { productId: 2, name: "Bánh Oreo", quantity: 1, price: 35000 }
        ],
        totalPrice: 125000,
        paymentMethod: "Tự đến lấy",
        pickupDate: "2024-10-03",
        status: "Hoàn tất" // Updated status
    }
];

export default orders;
