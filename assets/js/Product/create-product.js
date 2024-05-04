import api from '../../Base-url/Url.js'
const apiUrl = api
        // Get Vendor
        fetch(`${apiUrl}Vendors/GetVendors`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch vendors');
                }
                return response.json();
            })
            .then(data => {
                const vendorSelect = document.getElementById('vendorId');
                data.forEach(vendor => {
                    const option = document.createElement('option');
                    option.value = vendor.vendorId
                    option.textContent = vendor.vendorName;
                    vendorSelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error fetching vendors:', error);
            });

        // Get Categories
        fetch(`${apiUrl}Categories/GetCategories`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch Categories');
                }
                return response.json();
            })
            .then(data => {
                const categorySelect = document.getElementById('categoryId');
                data.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.categoryId;
                    option.textContent = category.categoryName;
                    categorySelect.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });

            

            


            document.getElementById('createProductForm').addEventListener('submit', async function (event) {
                event.preventDefault();
                const vendorId = document.getElementById('vendorId').value;
                const categoryId = document.getElementById('categoryId').value;
                const productName = document.getElementById('productName').value
                const price = document.getElementById('price').value
                const discount = document.getElementById('discount').value
                const detail = document.getElementById('detail').value
                const status = document.getElementById('status').value
                const formData = {
                    productName: productName,
                    price: price,
                    discount: discount,
                    categoryId: categoryId,
                    vendorId: vendorId,
                    detail: detail,
                    status: status

                }

                fetch(`${apiUrl}Product/CreateProductAdmin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)// biến thằng object thành JSON
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to create product');
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Xử lý dữ liệu trả về nếu cần
                        console.log('Product created successfully:', data);
                        alert('Thêm sản phẩm thành công');
                    })
                    .catch(error => {
                        console.error('Error creating product:', error);
                        alert('Lỗi không thể tạo được sản phẩm');
                    });
            });


