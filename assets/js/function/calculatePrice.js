import api from '../../Base-url/Url.js'

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


export default calculatePrice