import api from '../../Base-url/Url.js'
import currentDateTime from '../function/currentDateTime.js'
import fetchAmountProduct from '../function/fetchAmountProduct.js'
import calculatePrice from '../function/calculatePrice.js'
const urlParams = new URLSearchParams(window.location.search);
const billId = urlParams.get('id');

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.btn-secondary').addEventListener('click', function (event) {
        event.preventDefault();
        window.location.href = `../../../pages/Bill/Bill-detail.html?id=${billId}`;
    });
    const breadcrumbLink = document.querySelector('.breadcrumb-item.page-1 a');
    breadcrumbLink.href = `../../../pages/Bill/Bill-detail.html?id=${billId}`;
    // Lấy thông tin từ URL
    const productId = urlParams.get('productId');
    let colorName = urlParams.get('colorName');
    let storageGb = parseInt(urlParams.get('storageGb'));
    let discount = urlParams.get('discount');
    let amount = urlParams.get('amount');
    const price = urlParams.get('price');
    const total = urlParams.get('total');

    fetchAmountProduct(productId, colorName, storageGb)
        .then(amountProduct => {
            // Hiển thị số lượng sản phẩm tồn kho trên giao diện người dùng
            document.getElementById('amount-product').innerText = amountProduct;
            // console.log(amount)
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
        const inputAmount = parseInt(this.value);
        let amountProduct = parseInt(document.getElementById('amount-product').innerText);
        const originalAmount = parseInt(urlParams.get('amount'))
        console.log(amountProduct)
        if (inputAmount > amountProduct) {

            alert('Bạn đã nhập quá số lượng tồn kho.');
            this.value = " ";
        }

        // amountProduct = calculateTotal(inputAmount,originalAmount,amountProduct)
        // console.log(amountProduct)
        
        amount = parseInt(this.value);
        updatePriceAndTotal(productId, colorName, storageGb, discount, amount);
    });


    // Thêm sự kiện submit vào form
    const form = document.getElementById('form-edit-bill-detail');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const value = input()
        if (value !== true) {
            alert(value);
            return;
        } else {
            const newAmount = parseInt(document.getElementById('amount').value);
            const newPrice = parseInt(document.getElementById('price').value);
            const newTotal = parseInt(document.getElementById('total').value);
            const newDiscount = parseInt(document.getElementById('discount').value);

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
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedBillDetailData)
                })
                .then(response => {
                    if (response.ok) {
                        return fetch(`${api}Bill/CalculateTotalBill/${billId}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                    } else {
                        console.error('Đã xảy ra lỗi khi cập nhật thông tin chi tiết hóa đơn:', response.status);
                        throw new Error('Có lỗi khi cập nhật thông tin chi tiết hóa đơn.');
                    }
                })
                .then(calculateTotalBillResponse => {
                    if (calculateTotalBillResponse.ok) {
                        window.location.href = `../../../pages/Bill/Bill-detail.html?id=${billId}`;
                        alert('Thông tin chi tiết hóa đơn đã được cập nhật thành công.');
                    } else {
                        console.error('Đã xảy ra lỗi khi tính toán tổng hóa đơn:', calculateTotalBillResponse.status);
                        throw new Error('Có lỗi khi tính toán tổng hóa đơn.');
                    }
                })
                .catch(error => {
                    console.error('Lỗi khi gửi yêu cầu cập nhật thông tin chi tiết hóa đơn:', error);
                });
        }
    });
});

function updatePriceAndTotal(productId, colorName, storageGb, discount, amount) {
    storageGb = parseInt(storageGb);
    fetchAmountProduct(productId, colorName, storageGb)
        .then(amountProduct => {
            // document.getElementById('amount-product').innerText = amountProduct;
            return calculatePrice(productId, colorName, storageGb, discount);
        })
        .then(newPrice => {
            document.getElementById('price').value = newPrice;
            const newTotal = newPrice * amount;
            document.getElementById('total').value = newTotal;
        })
        .catch(error => {
            alert('Lỗi khi cập nhật giá và tổng mới:', error);
        });
}

function input() {
    const newAmount = document.getElementById('amount').value;

    if (newAmount === '') {
        return "Thiếu số lượng!";
    } else {
        return true;
    }
}

function calculateTotal(inputAmount,originalAmount, amountProduct) {

    while (inputAmount >0) {
        amountProduct += originalAmount - inputAmount;
        return amountProduct;
    }
}

// const total = calculateTotal();