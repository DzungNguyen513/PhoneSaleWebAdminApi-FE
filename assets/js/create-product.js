document.getElementById('createProductForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const storageGB = document.getElementById('storageGb').value;
    const colorName = document.getElementById('colorName').value;
    const vendorId = document.getElementById('vendorId').value;
    const categoryId = document.getElementById('categoryId').value;
    const productName = document.getElementById('productName').value
    const amount = document.getElementById('amount').value
    const price = document.getElementById('price').value
    const discount = document.getElementById('discount').value
    const detail = document.getElementById('detail').value
    const status = document.getElementById('status').value
    const formData = {
        productName: productName,
        storageGB: storageGB,
        colorName: colorName,
        amount: amount,
        price: price,
        discount: discount,
        categoryId: categoryId,
        vendorId: vendorId,
        detail: detail,
        status: status

    }

    fetch('https://localhost:7244/api/Product/CreateProductAdmin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
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

