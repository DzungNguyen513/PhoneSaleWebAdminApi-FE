import api from '../../Base-url/Url.js'

function editAmountProduct(productId, storageGb, colorName, amount) {
    const url = `${api}Product/EditAmoutProduct/${productId}/${storageGb}/${colorName}/${amount}`;

    const body = {
        // Bao gồm dữ liệu sản phẩm mới cần cập nhật
        productId: productId, // Đặt lại productId với giá trị đúng
        colorName: colorName,
        storageGb: storageGb,
        amount: amount // Sử dụng giá trị amount được truyền vào hàm
    };

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(response => {
            if (response.ok) {
                alert('Đơn hàng đã được cập nhật.');
                location.reload()
            } else {
                alert('Có lỗi xảy ra khi cập nhật số lượng sản phẩm.', response.status);
            }
        })
        .catch(error => {
            // Xử lý bất kỳ lỗi nào xảy ra trong quá trình yêu cầu
            console.error('Lỗi khi gửi yêu cầu cập nhật số lượng sản phẩm:', error);
        });
}

export default editAmountProduct