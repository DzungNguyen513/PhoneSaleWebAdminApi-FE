import api from '../../Base-url/Url.js'
import formatDateTime from '../function/formatDateTime.js'
import formatMoney from '../function/formatMoneyVN.js'
const apiUrl = api
const urlParams = new URLSearchParams(window.location.search)
const productId = urlParams.get('id')

document.addEventListener('DOMContentLoaded', function () {
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

fetch(`${apiUrl}Product/GetProduct/${productId}`)
.then(response => {
    if (!response.ok) {
        throw new Error('Failed to fetch product details');
    }
    return response.json();
})
.then(product => {
    document.getElementById('productId').textContent = product.productId;
    document.getElementById('productName').textContent = product.productName;
    document.getElementById('price').textContent = formatMoney(product.price);
    document.getElementById('discount').textContent = product.discount;
    document.getElementById('categoryId').textContent = product.categoryId;
    document.getElementById('vendorId').textContent = product.vendorId;
    document.getElementById('detail').textContent = product.detail;
    document.getElementById('status').textContent = product.status;
    document.getElementById('createdAt').textContent = formatDateTime(product.createAt);
    document.getElementById('updatedAt').textContent = formatDateTime(product.updateAt)
})
.catch(error => {
    console.error('Error fetching product details:', error);
});
});

document.addEventListener('DOMContentLoaded', function () {
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

fetch(`${apiUrl}Product/GetProductDetails/${productId}`)
.then(response => {
    if (!response.ok) {
        throw new Error('Failed to fetch product details');
    }
    return response.json();
})
.then(product => {
    const colorName = product.colorName;
    const storageGb = product.storageGb;
    const amount = product.amount;

    const tableBody = document.querySelector('.table tbody');

    const row = document.createElement('tr');

    const storageGbCell = document.createElement('td');
    storageGbCell.textContent = storageGb;
    row.appendChild(storageGbCell);

    const colorNameCell = document.createElement('td');
    colorNameCell.textContent = colorName;
    row.appendChild(colorNameCell);

    const amountCell = document.createElement('td');
    amountCell.textContent = amount;
    row.appendChild(amountCell);
    

    tableBody.appendChild(row);
})
.catch(error => {
    console.error('Error fetching product details:', error);
});

fetchProductDetails(productId);
});

function fetchProductDetails(productId) {
fetch(`${apiUrl}Product/GetALLProductDetails`)
.then(response => response.json())
.then(data => {
    const tableBody = document.querySelector('.table tbody');

    data.forEach(product => {
        if (product.productId === productId) {
            const row = document.createElement('tr');

            const storageGbCell = document.createElement('td');
            storageGbCell.textContent = product.storageGb;
            row.appendChild(storageGbCell);

            const colorNameCell = document.createElement('td');
            colorNameCell.textContent = product.colorName;
            row.appendChild(colorNameCell);

            const amountCell = document.createElement('td');
            amountCell.textContent = product.amount;
            row.appendChild(amountCell);

            // Thêm nút Edit
            const editButtonCell = document.createElement('td');
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.classList.add('btn', 'btn-primary', 'btn-sm');
            editButton.addEventListener('click', function () {
                // Xử lý sự kiện khi click vào nút Edit
                // Điều hướng tới trang chỉnh sửa sản phẩm với productId
                window.location.href = `edit-productdetail.html?id=${productId}&colorName=${product.colorName}&storageGb=${product.storageGb}&amount=${product.amount}`;
            });
            editButtonCell.appendChild(editButton);
            row.appendChild(editButtonCell);

            // Thêm nút Delete
            const deleteButtonCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('btn', 'btn-danger', 'btn-sm');
            deleteButton.addEventListener('click', function () {
                const confirmDelete = confirm('Bạn có muốn xóa sản phẩm này không?');

                // Nếu người dùng đồng ý xóa sản phẩm
                if (confirmDelete) {
                    // Gửi yêu cầu xóa sản phẩm
                    fetch(`${apiUrl}Product/DeleteProductDetail/${product.productId}/${product.storageGb}/${product.colorName}`, {
                        method: 'DELETE'
                    })
                    .then(response => {
                        // Kiểm tra xem yêu cầu đã thành công hay không
                        if (!response.ok) {
                            throw new Error('Failed to delete product');
                        }
                        // Log ra console nếu xóa thành công
                        alert('Xóa sản phẩm thành công')
                        // Reload trang sau khi xóa
                        window.location.reload();
                    })
                    .catch(error => {
                        alert('Lỗi không thể xóa sản phẩm, vui lòng kiểm tra lại')
                        console.error('Error deleting product:', error);
                    });
                }
            });
            deleteButtonCell.appendChild(deleteButton);
            row.appendChild(deleteButtonCell);

            tableBody.appendChild(row);
        }
    });
})
.catch(error => {
    console.error('Error fetching product details:', error);
});
}
var btnCreateProductImages = document.querySelector(".createProductImages");
btnCreateProductImages.addEventListener('click', function() {
window.location.href = `http://127.0.0.1:5500/pages/ui-features/createProductImages.html?id=${productId}`
})
var btnEditProductImages = document.querySelector(".editProductImages");
btnEditProductImages.addEventListener('click', function() {
window.location.href = `http://127.0.0.1:5500/pages/ui-features/edit-productImages.html?id=${productId}`
})

var btnCreateProductDetails = document.querySelector(".createProductDetails");
btnCreateProductDetails.addEventListener('click', function() {
window.location.href = `http://127.0.0.1:5500/pages/ui-features/create-productdetail.html?id=${productId}`
})

//hiển thị ảnh lên silder
document.addEventListener('DOMContentLoaded', function () {

// Fetch đường dẫn ảnh từ backend
fetch(`${apiUrl}ProductImage/GetProductImagesByPath/${productId}`)
.then(response => {
    if (!response.ok) {
        throw new Error('Failed to fetch product images');
    }
    return response.json();
})
.then(imagePaths => {
    // Lặp qua mỗi đường dẫn ảnh và thêm vào src của thẻ img
    imagePaths.forEach(imagePath => {
        const img = document.createElement('img');
        const host = "http://192.168.1.4:7244/";
        img.src = host + imagePath; 

        console.log(imagePath)

        img.classList.add('d-block', 'w-100'); // Thêm các lớp CSS Bootstrap để điều chỉnh kích thước ảnh
        img.alt = 'Product Image';
        
        // Thêm thẻ img vào carousel-inner
        const carouselInner = document.querySelector('.carousel-inner');
        const carouselItem = document.createElement('div');
        carouselItem.classList.add('carousel-item');
        if (carouselInner.childElementCount === 0) {
            carouselItem.classList.add('active');
        }
        carouselItem.appendChild(img);
        carouselInner.appendChild(carouselItem);
    });
})
.catch(error => {
    console.error('Error fetching product images:', error);
});
});



