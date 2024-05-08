import api from '../../Base-url/Url.js'
import fetchAmountProduct from '../function/fetchAmountProduct.js'
import editAmountProduct from '../function/editAmoutProduct.js'

import currentDateTime from '../function/currentDateTime.js'

import calculatePrice from '../function/calculatePrice.js'
const urlParams = new URLSearchParams(window.location.search);

const billId = urlParams.get('id');
let productId = null;
let colorName = null;
let storageGb = null;
let discount = 0;
let amount = 0;

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.btn-secondary').addEventListener('click', function (event) {
        event.preventDefault();
        window.location.href = `../../../pages/Bill/Bill-detail.html?id=${billId}`;
    });
    const breadcrumbLink = document.querySelector('.breadcrumb-item.page-1 a');
    breadcrumbLink.href = `../../../pages/Bill/Bill-detail.html?id=${billId}`;
    // Lấy dữ liệu product từ URL và đổ vào trường lựa chọn 'product'
    const productSelect = document.getElementById('name');
    fetch(`${api}Product/GetProducts`)
        .then(response => response.json())
        .then(data => {
            data.forEach(product => {
                const optionElement = document.createElement('option');
                optionElement.value = product.productId;
                optionElement.textContent = product.productName;
                productSelect.appendChild(optionElement);
            });
            // Chọn productSelect từ dữ liệu ban đầu
            productSelect.value = storageGb;
        })
        .catch(error => console.error('Error fetching storage data:', error));

    // Lấy dữ liệu storageGb từ URL và đổ vào trường lựa chọn 'storage'
    const storageSelect = document.getElementById('storage');
    fetch(`${api}Storages/GetStorages`)
        .then(response => response.json())
        .then(data => {
            // Duyệt qua dữ liệu trả về để tạo các tùy chọn cho trường lựa chọn storage
            data.forEach(storage => {
                const optionElement = document.createElement('option');
                optionElement.value = storage.storageGb;
                optionElement.textContent = storage.storageGb;
                storageSelect.appendChild(optionElement);
            });
            // Chọn storageGb từ dữ liệu ban đầu
            storageSelect.value = storageGb;
        })
        .catch(error => console.error('Error fetching storage data:', error));

    // Lấy dữ liệu color từ URL và đổ vào trường lựa chọn 'color'
    const colorSelect = document.getElementById('color');
    fetch(`${api}Colors/GetColors`)
        .then(response => response.json())
        .then(data => {
            // Duyệt qua dữ liệu trả về để tạo các tùy chọn cho trường lựa chọn color
            data.forEach(color => {
                const optionElement = document.createElement('option');
                optionElement.value = color.colorName;
                optionElement.textContent = color.colorName;
                colorSelect.appendChild(optionElement);
            });
            colorSelect.value = colorName;
        })
        .catch(error => console.error('Error fetching color data:', error));

    // Thêm sự kiện change vào các trường colorName, storageGb, discount và amount
    productSelect.addEventListener('change', function () {
        productId = this.value;
        updatePriceAndTotal(productId, colorName, storageGb, discount, amount);
    });
    colorSelect.addEventListener('change', function () {
        colorName = this.value;
        updatePriceAndTotal(productId, colorName, storageGb, discount, amount);
    });

    storageSelect.addEventListener('change', function () {
        storageGb = this.value;
        updatePriceAndTotal(productId, colorName, storageGb, discount, amount);
    });

    document.getElementById('discount').addEventListener('input', function () {
        discount = this.value;
        updatePriceAndTotal(productId, colorName, storageGb, discount, amount);
    });

    document.getElementById('amount').addEventListener('input', function () {
        const inputAmount = parseInt(this.value);
        const amountProduct = parseInt(document.getElementById('amount-product').innerText);
        if (inputAmount > amountProduct) {

            alert('Bạn đã nhập quá số lượng tồn kho.');
            this.value = " ";
        }
        amount = parseInt(this.value);
        updatePriceAndTotal(productId, colorName, storageGb, discount, amount);
    });

    const form = document.getElementById('form-add-bill-detail');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const value = input();
        if (value !== true) {
            alert(value);
            return;
        }
        else {
            // Lấy giá trị từ các trường nhập liệu
            const newProduct = document.getElementById('name').value;
            const newColor = document.getElementById('color').value;
            const newStorage = parseInt(document.getElementById('storage').value);
            const newAmount = parseInt(document.getElementById('amount').value);
            const newPrice = parseInt(document.getElementById('price').value);
            const newTotal = parseInt(document.getElementById('total').value);
            const newDiscount = parseInt(document.getElementById('discount').value);

            console.log(billId, newProduct, newColor, newStorage, newAmount, newPrice, newTotal, newDiscount)

            const addBillDetailData = {
                billId: billId,
                productId: newProduct,
                colorName: newColor,
                storageGb: newStorage,
                amount: newAmount,
                price: newPrice,
                discount: newDiscount,
                total: newTotal,
                createAt: currentDateTime(),
                updateAt: currentDateTime(),
                bill: null,
                colorNameNavigation: null,
                product: null,
                storageGbNavigation: null
            };

            // Gửi yêu cầu POST đến API
            fetch(`${api}BillDetail/CreateBillDetail/${billId}/${newProduct}/${newColor}/${newStorage}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(addBillDetailData)
            })
                //Cập nhật tổng tiền bill
                .then(response => {
                    if (response.ok) {
                        return fetch(`${api}Bill/CalculateTotalBill/${billId}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                    } else {
                        alert('Hóa đơn đã có sản phẩm này rồi', response.status);
                        throw new Error('Có lỗi khi cập nhật thông tin chi tiết hóa đơn.');
                    }
                })
                //Cập nhập số lượng sản phẩm
                .then(response => {
                    if (response.ok) {
                        fetchAmountProduct(newProduct, newColor, newStorage)
                            .then(amountProduct => {
                                editAmountProduct(newProduct, newStorage, newColor, amountProduct - newAmount);
                                window.location.href = `../../../pages/Bill/Bill-detail.html?id=${billId}`;
                                alert('Thông tin chi tiết hóa đơn đã được cập nhật thành công.');

                            })
                            .catch(error => {
                                console.error('Lỗi khi lấy số lượng sản phẩm từ cơ sở dữ liệu:', error);
                            });
                    } else {
                        alert('số lượng sản phẩm không cập nhật được ', response.status);
                        throw new Error('Có lỗi khi cập nhật thông tin chi tiết hóa đơn.');
                    }
                })
                //Cập nhật bill deatil Thành công
                .then(response => {
                    if (response.ok) {
                        
                        // alert('Thông tin chi tiết hóa đơn đã được cập nhật thành công.');
                        window.location.href = `../../../pages/Bill/Bill-detail.html?id=${billId}`;
                    } else {
                        alert('Hóa đơn đã có sản phẩm này rồi', response.status);
                        throw new Error('Có lỗi khi cập nhật thông tin chi tiết hóa đơn.');
                    }
                })
                .catch(error => {
                    // Xử lý lỗi khi gửi yêu cầu
                    console.error('Lỗi khi gửi yêu cầu cập nhật thông tin chi tiết hóa đơn:', error);
                });
        }

    });

});


function updatePriceAndTotal(productId, colorName, storageGb, discount, amount) {
    storageGb = parseInt(storageGb);
    fetchAmountProduct(productId, colorName, storageGb)
        .then(amountProduct => {
            document.getElementById('amount-product').innerText = amountProduct;
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

function input() {
    const productSelect = document.getElementById('name');
    const colorSelect = document.getElementById('color');
    const storageSelect = document.getElementById('storage');
    const newAmount = document.getElementById('amount').value;

    if (productSelect.value === '') {
        return "Thiếu sản phẩm!";
    } else if (colorSelect.value === '') {
        return "Thiếu màu!";
    } else if (storageSelect.value === '') {
        return "Thiếu dung lượng!";
    } else if (newAmount === '') {
        return "Thiếu số lượng!";
    } else {
        return true;
    }
}

