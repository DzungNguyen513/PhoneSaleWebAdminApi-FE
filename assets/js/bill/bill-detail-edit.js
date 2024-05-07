import api from '../../Base-url/Url.js'
import currentDateTime from '../function/currentDateTime.js'
import fetchAmountProduct from '../function/fetchAmountProduct.js'
import calculatePrice from '../function/calculatePrice.js'
const urlParams = new URLSearchParams(window.location.search);

document.addEventListener('DOMContentLoaded', function () {
    // Lấy thông tin từ URL
    const billId = urlParams.get('id');
    const productId = urlParams.get('productId');
    let colorName = urlParams.get('colorName');
    let storageGb = parseInt(urlParams.get('storageGb'));
    let discount = urlParams.get('discount');
    let amount = urlParams.get('amount');
    const price = urlParams.get('price');
    const total = urlParams.get('total');

    fetchAmountProduct(productId, colorName, storageGb)
        .then(amount => {
            // Hiển thị số lượng sản phẩm tồn kho trên giao diện người dùng
            document.getElementById('amount-product').innerText = amount;
            console.log(amount)
        })
        .catch(error => {
            console.error('Lỗi khi lấy số lượng số sản phẩm:', error);
        });

    // Đổ dữ liệu vào các trường nhập liệu trên trang chỉnh sửa
    document.getElementById('name').value = productId;
    document.getElementById('color').value = colorName;
    document.getElementById('storage').value = storageGb;
    document.getElementById('amount').value = amount;
    document.getElementById('price').value = price;
    document.getElementById('discount').value = discount;
    document.getElementById('total').value = total;


    document.getElementById('discount').addEventListener('input', function () {
        discount = this.value;
        updatePriceAndTotal(productId, colorName, storageGb, discount, amount);
    });

    document.getElementById('amount').addEventListener('input', function () {
        amount = this.value;
        updatePriceAndTotal(productId, colorName, storageGb, discount, amount);
    });


    // Thêm sự kiện submit vào form
    const form = document.getElementById('form-edit-bill-detail');
    form.addEventListener('submit', function (event) {
        event.preventDefault(); 
        const newAmount = parseInt(document.getElementById('amount').value);
        const newPrice = parseInt(document.getElementById('price').value);
        const newTotal = parseInt(document.getElementById('total').value);
        const newDiscount = parseInt(document.getElementById('discount').value);

        // console.log(newColor, newStorage, newAmount, newPrice, newTotal)
        console.log(billId, productId, colorName, storageGb)
        // // Tạo object chứa dữ liệu cập nhật
        const updatedBillDetailData = {
            billId: billId,
            productId: productId,
            colorName: colorName,
            storageGb: parseInt(storageGb),
            amount: newAmount,
            price: newPrice,
            discount: newDiscount,
            total: newTotal,
            updateAt: currentDateTime()


        };

        fetch(`${api}BillDetail/${billId}/${productId}/${colorName}/${storageGb}`,
            // fetch(`${api}BillDetail/BILL0105240001/PRD002/${colorName}/${storageGb}`, 
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedBillDetailData)
            })
            .then(response => {
                if (response.ok) {
                    // Xử lý thành công
                    // Gọi endpoint CalculateTotalBill để tính lại tổng hóa đơn
                    return fetch(`${api}Bill/CalculateTotalBill/${billId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                } else {
                    // Xử lý lỗi khi cập nhật thông tin chi tiết hóa đơn
                    console.error('Đã xảy ra lỗi khi cập nhật thông tin chi tiết hóa đơn:', response.status);
                    throw new Error('Có lỗi khi cập nhật thông tin chi tiết hóa đơn.');
                }
            })
            .then(calculateTotalBillResponse => {
                if (calculateTotalBillResponse.ok) {
                    // Xử lý khi tính toán tổng hóa đơn thành công
                    // Chuyển hướng hoặc hiển thị thông báo tùy ý
                    window.location.href = `../../../pages/Bill/Bill-detail.html?id=${billId}`;
                    alert('Thông tin chi tiết hóa đơn đã được cập nhật thành công.');
                } else {
                    // Xử lý khi có lỗi khi tính toán tổng hóa đơn
                    console.error('Đã xảy ra lỗi khi tính toán tổng hóa đơn:', calculateTotalBillResponse.status);
                    throw new Error('Có lỗi khi tính toán tổng hóa đơn.');
                }
            })
            .catch(error => {
                console.error('Lỗi khi gửi yêu cầu cập nhật thông tin chi tiết hóa đơn:', error);
            });
    });
});

function updatePriceAndTotal(productId, colorName, storageGb, discount, amount) {
    storageGb = parseInt(storageGb);
    fetchAmountProduct(productId, colorName, storageGb)
        .then(amountProduct => {
            // Hiển thị số lượng sản phẩm tồn kho trên giao diện người dùng
            document.getElementById('amount-product').innerText = amountProduct;
            // Sau khi cập nhật số lượng sản phẩm tồn kho, tính toán và cập nhật giá và tổng mới
            return calculatePrice(productId, colorName, storageGb, discount);
        })
        .then(newPrice => {
            document.getElementById('price').value = newPrice;
            const newTotal = newPrice * amount;
            document.getElementById('total').value = newTotal;
        })
        .catch(error => {
            console.error('Lỗi khi cập nhật giá và tổng mới:', error);
        });
}

