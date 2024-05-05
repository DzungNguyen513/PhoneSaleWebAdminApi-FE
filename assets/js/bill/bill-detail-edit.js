document.addEventListener('DOMContentLoaded', function () {
    // Lấy thông tin sản phẩm từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const billId = urlParams.get('id');
    const productId = urlParams.get('productId');
    let colorName = urlParams.get('colorName');
    let storageGb = parseInt(urlParams.get('storageGb'));
    let discount = urlParams.get('discount');
    let amount = urlParams.get('amount');
    const price = urlParams.get('price');
    const total = urlParams.get('total');
    //console.log(getFilteredBillDetails(billId, productId, colorName, storageGb))

    //storageGb = parseInt(storageGb)
    // console.log(billId)

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
    document.getElementById('amount').value = amount;
    document.getElementById('price').value = price;
    document.getElementById('discount').value = discount;
    document.getElementById('total').value = total;

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


    // Thêm sự kiện submit vào form
    const form = document.getElementById('form-edit-bill-detail');
    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const newAmount = document.getElementById('amount').value;
        const newPrice = document.getElementById('price').value;
        const newTotal = document.getElementById('total').value;
        const newColor = document.getElementById('color').value;
        const newStorage = document.getElementById('storage').value;
        const newDiscount = document.getElementById('discount').value;
        console.log(newColor, newStorage, newAmount, newPrice, newTotal)
        // Tạo object chứa dữ liệu cập nhật
        const updatedBillDetailData = {
            // billId: billId,
            // productId: productId,
            colorName: newColor,
            storageGb: newStorage,
            amount: newAmount,
            price: newPrice,
            discount: newDiscount,
            total: newTotal
        };
        fetch(`https://localhost:7244/api/BillDetail/filter?billId=${billId}&productId=${productId}&colorName=${colorName}&storageGb=${storageGb}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedBillDetailData)
        })
            .then(response => {
                if (response.ok) {
                    // Xử lý thành công
                    console.log('Thông tin chi tiết hóa đơn đã được cập nhật thành công.');
                } else {
                    // Xử lý lỗi
                    console.error('Đã xảy ra lỗi khi cập nhật thông tin chi tiết hóa đơn:', response.status);
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
    let productPricePromise = fetch(`https://localhost:7244/api/Product/GetProduct/${productId}`)
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

    let colorPricePromise = fetch(`https://localhost:7244/api/Colors/${colorName}`)
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

    let storagePricePromise = fetch(`https://localhost:7244/api/Storages/${storageGb}`)
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

function fetchAmountProduct(productId, colorName, storageGb) {
    return fetch(`https://localhost:7244/api/Product/GetALLProductDetails`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Có lỗi khi lấy số lượng sản phẩm tồn kho.');
            }
            return response.json();
        })
        .then(data => {

            const filteredProducts = data.filter(product =>
                product.productId === productId &&
                product.colorName === colorName &&
                product.storageGb === storageGb
            );

            // Nếu không có sản phẩm nào sau khi lọc, trả về 0
            if (filteredProducts.length === 0) {
                return 0;
            }

            // Trả về số lượng của sản phẩm đã lọc
            return filteredProducts[0].amount;
        })
        .catch(error => {
            console.error('Lỗi khi lấy số lượng sản phẩm tồn kho:', error);
            return 0;
        });
}


