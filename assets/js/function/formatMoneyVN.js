const formatMoney = (amount) => {
    // Sử dụng Intl.NumberFormat để định dạng số và thêm hàng nghìn đằng sau
    const formatter = new Intl.NumberFormat('vi-VN');
    return formatter.format(amount) + ".000 VNĐ";
}

export default formatMoney
