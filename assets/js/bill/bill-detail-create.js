import api from '../../Base-url/Url.js'
import currentDateTime from '../function/currentDateTime.js'
import fetchAmountProduct from '../function/fetchAmountProduct.js'

const urlParams = new URLSearchParams(window.location.search);
// Lấy billId từ URL
const billId = urlParams.get('id');

// Bắt sự kiện khi bấm nút "Thêm sản phẩm"
document.querySelector('.add-product-detail').addEventListener('click', function (event) {
    event.preventDefault();

    // Chuyển hướng đến trang thêm chi tiết hóa đơn và truyền billId vào URL
    window.location.href = `./Bill-detail-add.html?id=${billId}`;

    fetchAmountProduct(productId, colorName, storageGb)
        .then(amount => {
            // Hiển thị số lượng sản phẩm tồn kho trên giao diện người dùng
            document.getElementById('amount-product').innerText = amount;
        })
        .catch(error => {
            console.error('Lỗi khi lấy số lượng tồn sản phẩm:', error);
        });

    document.getElementById('discount').addEventListener('input', function () {
        discount = this.value;
        updatePriceAndTotal(productId, colorName, storageGb, discount, amount);
    });

    document.getElementById('amount').addEventListener('input', function () {
        amount = this.value;
        updatePriceAndTotal(productId, colorName, storageGb, discount, amount);
    });
    // Lấy dữ liệu product từ URL và đổ vào trường lựa chọn 'product'
    const productSelect = document.getElementById('name');
    fetch('https://localhost:7244/api/Product/GetProducts')
        .then(response => response.json())
        .then(data => {
            // Duyệt qua dữ liệu trả về để tạo các tùy chọn cho trường lựa chọn product
            data.forEach(product => {
                const optionElement = document.createElement('option');
                optionElement.value = product.productId;
                optionElement.textContent = product.productName;
                productSelect.appendChild(optionElement);
            });
            // Chọn storageGb từ dữ liệu ban đầu
            //storageSelect.value = storageGb;
        })
        .catch(error => console.error('Error fetching storage data:', error));

    // Lấy dữ liệu storageGb từ URL và đổ vào trường lựa chọn 'storage'
    const storageSelect = document.getElementById('storage');
    fetch('https://localhost:7244/api/Storages/GetStorages')
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
            //storageSelect.value = storageGb;
        })
        .catch(error => console.error('Error fetching storage data:', error));

    // Lấy dữ liệu color từ URL và đổ vào trường lựa chọn 'color'
    const colorSelect = document.getElementById('color');
    fetch('https://localhost:7244/api/Colors/GetColors')
        .then(response => response.json())
        .then(data => {
            // Duyệt qua dữ liệu trả về để tạo các tùy chọn cho trường lựa chọn color
            data.forEach(color => {
                const optionElement = document.createElement('option');
                optionElement.value = color.colorName;
                optionElement.textContent = color.colorName;
                colorSelect.appendChild(optionElement);
            });
            //colorSelect.value = colorName;
        })
        .catch(error => console.error('Error fetching color data:', error));

});

function updatePriceAndTotal(productId, colorName, storageGb, discount, amount) {
    storageGb = parseInt(storageGb);
    fetchAmountProduct(productId, colorName, storageGb)
        .then(amountProduct => {
            // Hiển thị số lượng sản phẩm tồn kho trên giao diện người dùng
            document.getElementById('amount-product').innerText = amountProduct;
            console.log(amountProduct); // Debugging: Log new amount to console
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

function calculatePrice(productId, colorName, storageGb, discount) {
    let productPricePromise = fetch(`${api}Product/GetProduct/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Có lỗi khi lấy giá của sản phẩm.');
            }
            return response.json();
        })
        .then(data => data.price)
        .catch(error => {
            console.error('Lỗi khi lấy giá của sản phẩm:', error);
            return 0;
        });

    let colorPricePromise = fetch(`${api}Colors/${colorName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Có lỗi khi lấy giá của màu sắc.');
            }
            return response.json();
        })
        .then(data => data.colorPrice)
        .catch(error => {
            console.error('Lỗi khi lấy giá của màu sắc:', error);
            return 0;
        });

    let storagePricePromise = fetch(`${api}Storages/${storageGb}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Có lỗi khi lấy giá của dung lượng lưu trữ.');
            }
            return response.json();
        })
        .then(data => data.storagePrice)
        .catch(error => {
            console.error('Lỗi khi lấy giá của dung lượng lưu trữ:', error);
            return 0;
        });

    return Promise.all([productPricePromise, colorPricePromise, storagePricePromise])
        .then(([productPrice, colorPrice, storagePrice]) => {
            let totalPrice = (productPrice + colorPrice + storagePrice) * (1 - discount / 100);
            totalPrice = Math.round(totalPrice);
            return totalPrice;
        })
        .catch(error => {
            console.error('Lỗi khi tính toán giá mới:', error);
            return 0;
        });
}

