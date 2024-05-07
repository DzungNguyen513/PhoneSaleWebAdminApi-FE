 
import api from '../../Base-url/Url.js'

        const urlParams = new URLSearchParams(window.location.search)
        const productId = urlParams.get('id')
        const ColorName = urlParams.get('colorName')
        const StorageGb = urlParams.get('storageGb')
        const Amount = urlParams.get('amount')
        document.querySelector("#productId").value = productId;
        document.querySelector('.op-colorName').value = ColorName;
        document.querySelector('.op-colorName').textContent = ColorName;

        document.querySelector('.op-storageGb').value = StorageGb;
        document.querySelector('.op-storageGb').textContent = StorageGb;

        document.querySelector("#amount").value = Amount;

                
            const form = document.getElementById('edit-productdetail');
            form.addEventListener('submit', async function(event) {
                event.preventDefault();

                // Lấy dữ liệu từ form
                const formData = {
                    productId: document.getElementById('productId').value,
                    colorName: document.getElementById('colorName').value,
                    storageGb: parseInt(document.getElementById('storageGb').value),
                    amount: parseInt(document.getElementById('amount').value)
                    // Thêm các trường dữ liệu khác của sản phẩm ở đây nếu cần
                };

                // Thực hiện yêu cầu POST
                fetch(`${api}Product/EditProductDetails/${productId}/${StorageGb}/${ColorName}`, {
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
                        window.alert('Sửa chi tiết sản phẩm thành công');
                    } else {
                        return response.json();
                    }
                })
                .then(data => {
                    console.log('New product created:', data);
                    // Xử lý dữ liệu trả về nếu cần
                    
                })
                .catch(error => {
                    console.error('Error creating new product:', error);
                    window.alert('Đã sảy ra lỗi khi sửa, có thể đã có hoặc tồn tại');

                    // Xử lý lỗi, hiển thị thông báo hoặc thực hiện các hành động khác
                });
            });

        
            
            

