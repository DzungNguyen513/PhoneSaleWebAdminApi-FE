
import api from '../../Base-url/Url.js'
const apiUrl = api
const urlParams = new URLSearchParams(window.location.search)
const productId = urlParams.get('id')
document.querySelector("#productId").value = productId;

// Get Colors
fetch(`${apiUrl}Colors/GetColors`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch Colors');
        }
        return response.json();
    })
    .then(data => {
        const colorSelect = document.getElementById('colorName'); // Thay đổi ID nếu cần
        data.forEach(color => {
            const option = document.createElement('option');
            option.value = color.colorName; // Thay đổi giá trị value tùy theo dữ liệu trả về
            option.textContent = color.colorName; // Thay đổi trường dữ liệu hiển thị tùy theo dữ liệu trả về
            colorSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error fetching colors:', error);
    });

// Get Storage Options
fetch(`${apiUrl}Storages/GetStorages`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch Storage options');
        }
        return response.json();
    })
    .then(data => {
        const storageSelect = document.getElementById('storageGb'); // Thay đổi ID nếu cần
        data.forEach(storage => {
            const option = document.createElement('option');
            option.value = storage.storageGb; // Thay đổi giá trị value tùy theo dữ liệu trả về
            option.textContent = storage.storageGb; // Thay đổi trường dữ liệu hiển thị tùy theo dữ liệu trả về
            storageSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error fetching storage options:', error);
    });

const form = document.getElementById('create-productdetail');
form.addEventListener('submit', async function (event) {
    event.preventDefault();

    // Lấy dữ liệu từ form
    const formData = {
        productId: document.getElementById('productId').value,
        colorName: document.getElementById('colorName').value,
        storageGb: document.getElementById('storageGb').value,
        amount: document.getElementById('amount').value
        // Thêm các trường dữ liệu khác của sản phẩm ở đây nếu cần
    };

    // Thực hiện yêu cầu POST
    fetch(`${apiUrl}Product/CreateProductDetails`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create new product');
            }
            return response.json();
        })
        .then(data => {
            console.log('New product created:', data);
            // Xử lý dữ liệu trả về nếu cần
            window.alert('Thêm dữ liệu thành công!');
        })
        .catch(error => {
            console.error('Error creating new product:', error);
            window.alert('Đã sảy ra lỗi khi tạo mới, có thể đã có hoặc tồn tại');

            // Xử lý lỗi, hiển thị thông báo hoặc thực hiện các hành động khác
        });
});
