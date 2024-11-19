const createOrderService = async (order) => {
    const accessToken = await getItem("accessToken")

    let cleanedToken = accessToken.replace(/"/g, "");       
    const response = await fetch(`http://${IpAddress.ipAddress}:8080/api/v1/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cleanedToken}`
        }
    });

    const data = await response.json();
    console.log(response);
    console.log(data);
    
    
    if (response.status === 200) {
       showToastWithGravityAndOffset("Đặt hàng thành công");
       return;
    } else {
        showToastWithGravityAndOffset("Có lỗi xảy ra, vui lòng thử lại");
      
    }
}