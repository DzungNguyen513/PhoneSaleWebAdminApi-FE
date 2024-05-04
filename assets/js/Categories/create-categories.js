import api from '../../Base-url/Url.js'
const apiUrl = api

const showStorageFormBtn = document.getElementById('createStorage');
    showStorageFormBtn.addEventListener('click', async function(event) {
        // Dữ liệu của storage mới
        event.preventDefault();
        const formData = {
            storageGb: document.getElementById('storageGb').value, 
            storagePrice: document.getElementById('storagePrice').value 
        };

        // Thực hiện yêu cầu POST để tạo mới một lưu trữ
        fetch( `${apiUrl}Storages/AdminCreateStorage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                return response.json(); // Trả về phản hồi dưới dạng JSON
            } else {
                throw new Error('Failed to create new storage');
            }
        })
        .then(data => {
            console.log('New storage created:', data);
            alert('Thêm dung lượng thành công');

        })
        .catch(error => {
            console.error('Error creating new storage:', error);
            alert('thêm dung lượng thất bại vui lòng kiểm tra lại');
        });
    });

    //create color
    $(document).ready(function () {
            $('#colorForm').submit(function (event) {
                event.preventDefault();

                var formData = new FormData();
                formData.append('colorName', $('#colorName').val());
                formData.append('colorImage', $('#colorImage')[0].files[0]);
                formData.append('colorPrice', $('#colorPrice').val());


                $.ajax({
                    url: `${apiUrl}Colors/CreateColorDTO`,
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        alert('Thêm màu thành công');
                        $('#colorName').val('');
                        $('#colorImage').val('');
                        $('#colorPrice').val('');
                    },
                    error: function (error) {
                        console.error('Error uploading color:', error);
                        alert('Lỗi không thể thêm được màu, vui lòng kiểm tra lại');
                    }
                });
            });
        });
      
        //create category
        $(document).ready(function () {
            $('#categoryForm').submit(function (event) {
                event.preventDefault();

                var formData = new FormData();
                formData.append('categoryName', $('#categoryName').val());
                formData.append('categoryImage', $('#categoryImage')[0].files[0]);
                var status = $('input[name=status]:checked').val();
                formData.append('status', status);

                $.ajax({
                    url: `${apiUrl}Categories/CreateCategory`,
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        alert('Thêm danh mục thành công');
                        $('#categoryName').val('');
                        $('#categoryImage').val('');
                    },
                    error: function (error) {
                        console.error('Error uploading color:', error);
                        alert('Lỗi không thể thêm được màu, vui lòng kiểm tra lại');
                    }
                });
            });
        });
        // create vendor
        document.getElementById('vendorForm').addEventListener('submit', async function(event){
          event.preventDefault();
          const statusActive = document.getElementById('statusActive').checked;
          const statusInactive = document.getElementById('statusInactive').checked;
          
          // Kiểm tra xem radio button nào được chọn
          let status = ""; // Giá trị mặc định
          if (statusActive) {
            status = 0;
          } else if (statusInactive) {
            status = 1;
          }
          const formData = {
            vendorName: document.getElementById('vendorName').value,
            address: document.getElementById('address').value,
            phoneNumber: document.getElementById('phoneNumber').value,
            status: status
          };
          fetch(`${apiUrl}Vendors/AdminCreateVendor`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Failed to create vendor');
            }
            return response.json();
          })
          .then(data => {
            alert('Thêm nhà cung cấp thành công')
            console.log('Vendor created successfully:', data);
          })
          .catch(error => {
            alert('Không thể thêm mới nhà cung cấp vui lòng kiểm tra lại')
            console.error('Error creating vendor:', error);
          });
        })