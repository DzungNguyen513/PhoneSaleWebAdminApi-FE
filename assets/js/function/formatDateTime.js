const formatDateTime= (dateTimeString) => {
    const dateValue = new Date(dateTimeString);
    const dayOfMonth = ('0' + dateValue.getDate()).slice(-2); // Lấy ngày trong tháng và đảm bảo có 2 chữ số
    const month = ('0' + (dateValue.getMonth() + 1)).slice(-2); // Lấy tháng và đảm bảo có 2 chữ số
    const year = dateValue.getFullYear(); // Lấy năm
    const hours = dateValue.getHours() % 12; // Lấy giờ (chỉ số 12 tiếp theo)
    const minutes = ('0' + dateValue.getMinutes()).slice(-2); // Lấy phút và đảm bảo có 2 chữ số
    const seconds = ('0' + dateValue.getSeconds()).slice(-2); // Lấy giây và đảm bảo có 2 chữ số
    const ampm = dateValue.getHours() >= 12 ? 'PM' : 'AM'; // Xác định buổi sáng hoặc buổi chiều

    // Tạo chuỗi định dạng ngày giờ
    const formattedDate = `${dayOfMonth}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;

    return formattedDate;
}

export default formatDateTime