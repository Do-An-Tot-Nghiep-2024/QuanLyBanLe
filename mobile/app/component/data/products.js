// products.js

const products = [
    // Danh mục Sữa, bánh kẹo
    {
        categoryId: 1,
        id: 1,
        name: "Sữa đặc Ngôi Sao Phương Nam",
        description: "Sữa đặc Ngôi Sao Phương Nam, 397g",
        price: 20000,
        image: "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg"
    },
    {
        categoryId: 1,
        id: 2,
        name: "Bánh Oreo",
        description: "Bánh quy Oreo vị vani, hộp 132g",
        price: 35000,
        image: "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg"
    },
    {
        categoryId: 1,
        id: 3,
        name: "Sữa tươi TH true MILK",
        description: "Sữa tươi TH true MILK, 1L",
        price: 45000,
        image: "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg"
    },
    {
        categoryId: 1,
        id: 4,
        name: "Bánh quy Golden",
        description: "Bánh quy Golden, hộp 200g",
        price: 30000,
        image: "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg"
    },

    // Danh mục Lương thực
    {
        categoryId: 2,
        id: 5,
        name: "Mì Hảo Hảo",
        description: "Mì ăn liền Hảo Hảo vị bò, gói 65g",
        price: 3000,
        image: "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg"
    },
    {
        categoryId: 2,
        id: 6,
        name: "Mì Omachi",
        description: "Mì Omachi vị hải sản, gói 70g",
        price: 3500,
        image: "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg"
    },
    {
        categoryId: 2,
        id: 7,
        name: "Gạo ST25",
        description: "Gạo ST25, 5kg",
        price: 150000,
        image: "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg"
    },
    {
        categoryId: 2,
        id: 8,
        name: "Bột mì đa dụng",
        description: "Bột mì đa dụng, gói 1kg",
        price: 25000,
        image: "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg"
    },

    // Danh mục Thức ăn đóng hộp
    {
        categoryId: 3,
        id: 9,
        name: "Đồ hộp cá ngừ",
        description: "Cá ngừ đóng hộp, 185g",
        price: 25000,
        image: "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg"
    },
    {
        categoryId: 3,
        id: 10,
        name: "Đồ hộp đậu đỏ",
        description: "Đậu đỏ đóng hộp, 400g",
        price: 20000,
        image: "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg"
    },
    {
        categoryId: 3,
        id: 11,
        name: "Thịt hộp SPAM",
        description: "Thịt hộp SPAM, 340g",
        price: 45000,
        image: "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg"
    },
    {
        categoryId: 3,
        id: 12,
        name: "Đồ hộp ngô ngọt",
        description: "Ngô ngọt đóng hộp, 300g",
        price: 15000,
        image: "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg"
    },

    // Danh mục Gia vị
    {
        categoryId: 4,
        id: 13,
        name: "Muối tinh",
        description: "Muối tinh sạch, gói 500g",
        price: 10000,
        image: "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg"
    },
    {
        categoryId: 4,
        id: 14,
        name: "Hạt tiêu xay",
        description: "Hạt tiêu xay nguyên chất, gói 100g",
        price: 15000,
        image: "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg"
    },
    {
        categoryId: 4,
        id: 15,
        name: "Dầu ăn ăn sạch",
        description: "Dầu ăn ăn sạch, chai 1L",
        price: 40000,
        image: "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg"
    },
    {
        categoryId: 4,
        id: 16,
        name: "Giấm ăn",
        description: "Giấm ăn, chai 500ml",
        price: 15000,
        image: "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg"
    },

    // Danh mục Đồ uống
    {
        categoryId: 5,
        id: 17,
        name: "Nước ngọt Pepsi",
        description: "Nước ngọt Pepsi, chai 1.5L",
        price: 20000,
        image: "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg"
    },
    {
        categoryId: 5,
        id: 18,
        name: "Nước trái cây vải",
        description: "Nước trái cây vải, hộp 1L",
        price: 25000,
        image: "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg"
    },
    {
        categoryId: 5,
        id: 19,
        name: "Nước ngọt Coca-Cola",
        description: "Nước ngọt Coca-Cola, chai 1.5L",
        price: 22000,
        image: "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg"
    },
    {
        categoryId: 5,
        id: 20,
        name: "Trà xanh không độ",
        description: "Trà xanh không độ, chai 500ml",
        price: 15000,
        image: "https://i.pinimg.com/564x/c8/30/17/c83017c255be137c08c568c3e284185a.jpg"
    }
];

export default products;
