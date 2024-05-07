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
                    option.value = vendor.vendorId;
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

        var createAt;
        //get ID
        const urlParams = new URLSearchParams(window.location.search)
        const productId = urlParams.get('id')

        //Load by ID
        
        document.addEventListener('DOMContentLoaded', function () {
            fetch(`${apiUrl}Product/GetProduct/${productId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to fetch product details');
                    }
                    return response.json();
                })
                .then(product => {
                    document.getElementById('productName').value = product.productName;
                    document.getElementById('price').value = product.price;
                    document.getElementById('discount').value = product.discount;
                    document.getElementById('categoryId').value = product.categoryId;
                    document.getElementById('vendorId').value = product.vendorId;
                    document.getElementById('detail').value = product.detail;
                    document.getElementById('status').value = product.status;

                    createAt = product.createAt
                })
                .catch(error => {
                    console.error('Error fetching product details:', error);
                });


        })

        //edit product
        document.getElementById('editProductForm').addEventListener('submit', async function (event) {
            event.preventDefault();
            const vendorId = document.getElementById('vendorId').value;
            const categoryId = document.getElementById('categoryId').value;
            const productName = document.getElementById('productName').value
            const price = document.getElementById('price').value
            const discount = document.getElementById('discount').value
            const detail = document.getElementById('detail').value
            const status = document.getElementById('status').value
            const formData = {
                productId: productId,
                productName: productName,
                price: price,
                discount: discount,
                categoryId: categoryId,
                vendorId: vendorId,
                detail: detail,
                status: status,
                createAt: createAt
            }

            fetch(`${apiUrl}Product/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to update product');
                    }
                    if (response.status === 204) {
                        console.log('Product updated successfully');
                        alert('Sửa sản phẩm thành công');
                    } else {
                        return response.json();
                    }
                })
                .then(data => {
                    // Xử lý dữ liệu trả về nếu cần
                    console.log('Product updated successfully:', data);

                })
                .catch(error => {
                    console.error('Error updating product:', error);
                    alert('Lỗi không thể Sửa được sản phẩm');

                });
        })




