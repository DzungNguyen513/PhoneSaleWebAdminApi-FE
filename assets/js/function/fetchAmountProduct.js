import api from '../../Base-url/Url.js'

// function fetchAmountProduct(productId, colorName, storageGb) {
//     return fetch(`${api}Product/GetALLProductDetails`)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Có lỗi khi lấy số lượng sản phẩm tồn kho.');
//             }
//             return response.json();
//         })
//         .then(data => {

//             const filteredProducts = data.filter(product =>
//                 product.productId === productId &&
//                 product.colorName === colorName &&
//                 product.storageGb === storageGb
//             );

//             // Nếu không có sản phẩm nào sau khi lọc, trả về 0
//             if (filteredProducts.length === 0) {
//                 return 0;
//             }

//             // Trả về số lượng của sản phẩm đã lọc
//             return filteredProducts[0].amount;
//         })
//         .catch(error => {
//             console.error('Lỗi khi lấy số lượng sản phẩm tồn kho:', error);
//             return 0;
//         });
// }

function fetchAmountProduct(productId, colorName, storageGb) {
    return fetch(`${api}Product/AmountProduct/${productId}/${storageGb}/${colorName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Có lỗi khi lấy số lượng sản phẩm tồn kho.');
            }
            return response.json();
        })
        .then(amount => {
            return amount;
        })
        .catch(error => {
            console.error('Lỗi khi lấy số lượng sản phẩm tồn kho:', error);
            return 0;
        });
}

export default fetchAmountProduct