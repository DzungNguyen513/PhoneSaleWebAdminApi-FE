
import api from '../../Base-url/Url.js'
const apiUrl = api
        const urlParams = new URLSearchParams(window.location.search)
        const productId = urlParams.get('id')
        document.querySelector("#productId").value = productId;

        $(document).ready(function () {
            $('#uploadForm').submit(function (event) {
                event.preventDefault();

                var formData = new FormData();
                formData.append('productId', $('#productId').val());
                formData.append('colorName', $('#colorName').val());
                formData.append('imageFile', $('#imageFile')[0].files[0]);

                $.ajax({
                    url: `${apiUrl}ProductImage/` + $('#productId').val(),
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        alert('Thêm ảnh thành công');
                        $('#productId').val('');
                        $('#colorName').val('');
                        $('#imageFile').val('');
                    },
                    error: function (error) {
                        console.error('Error uploading image:', error);
                        alert('Lỗi không thể thêm được ảnh, vui lòng kiểm tra lại');
                    }
                });
            });
        });