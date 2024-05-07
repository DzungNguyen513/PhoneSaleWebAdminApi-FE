import api from '../../Base-url/Url.js'
import currentDateTime from '../function/currentDateTime.js'
import fetchAmountProduct from '../function/fetchAmountProduct.js'
import calculatePrice from '../function/calculatePrice.js'
const urlParams = new URLSearchParams(window.location.search);
const billId = urlParams.get('id');
let productId = null;
let colorName = null;
let storageGb = null;
let discount = 0;
let amount = 0;
document.addEventListener('DOMContentLoaded', function () {

    // Lấy dữ liệu product từ URL và đổ vào trường lựa chọn 'product'
    const productSelect = document.getElementById('name');
    fetch('https://localhost:7244/api/Product/GetProducts')
        .then(response => response.json())
        .then(data => {
            // Duyệt qua dữ liệu trả về để tạo các tùy chọn cho trường lựa chọn product
            data.forEach(product => {
                const optionElement = document.createElement('option');
                optionElement.value = product.productId;
                optionElement.textContent = product.productId;
                productSelect.appendChild(optionElement);
            });
            // Chọn storageGb từ dữ liệu ban đầu
            productSelect.value = storageGb;
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
            storageSelect.value = storageGb;
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
        amount = this.value;
        updatePriceAndTotal(productId, colorName, storageGb, discount, amount);
    });

    const form = document.getElementById('form-add-bill-detail');
    form.addEventListener('submit', function (event) {

    });
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

