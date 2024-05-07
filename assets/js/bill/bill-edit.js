import api from '../../Base-url/Url.js'
import statusText from '../function/statusText.js'
import currentDateTime from '../function/currentDateTime.js'

// Lấy billId từ URL
const urlParams = new URLSearchParams(window.location.search);
const billId = urlParams.get('id');
const billUrl = `${api}Bill/${billId}`;

// Fetch dữ liệu hóa đơn từ API và điền vào form
fetch(billUrl)
    .then(response => response.json())
    .then(data => {
        // Lấy customerId từ dữ liệu hóa đơn
        const customerId = data.customerId;
        const dateBill = data.dateBill;
        const totalBill = data.totalBill;


        // Xử lý dữ liệu hóa đơn đã nhận được và điền vào các trường nhập của form
        document.getElementById('name').value = data.customerName;
        document.getElementById('delivery').value = data.deliveryAddress;
        document.getElementById('phone').value = data.customerPhone;
        document.getElementById('note').value = data.note;

        const statusSelect = document.getElementById('status');
        statusText.forEach((status, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = status;
            statusSelect.appendChild(option);
        });
        statusSelect.value = data.status;

        // Sự kiện submit của form
        document.getElementById('form-edit-bill').addEventListener('submit', function (event) {
            event.preventDefault();
            const value = input();
            if (value !== true) {
                alert(value);
                return;
            } 
            const name = document.getElementById('name').value;
            const delivery = document.getElementById('delivery').value;
            const phone = document.getElementById('phone').value;
            const selectedIndex = document.getElementById('status').selectedIndex;
            const note = document.getElementById('note').value;

            // Tạo đối tượng chứa dữ liệu hóa đơn đã chỉnh sửa
            const editedBill = {
                billId: billId,
                customerId: customerId,
                customerName: name,
                deliveryAddress: delivery,
                customerPhone: phone,
                dateBill: dateBill,
                status: selectedIndex,
                note: note,
                totalBill: totalBill,
                updateAt: currentDateTime(),

            };

            // Gửi yêu cầu PUT để cập nhật hóa đơn
            fetch(billUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editedBill)
            })
                .then(response => {
                    if (response.ok) {
                        alert("Bạn đã sửa thông tin đơn hàng thành công")
                        window.location.href = '../Bill/Bill-management.html';
                    } else {
                        console.error('Đã xảy ra lỗi khi cập nhật hóa đơn:', response.status);
                    }
                })
                .catch(error => {
                    console.error('Đã xảy ra lỗi khi cập nhật hóa đơn:', error);
                });
        });
    })
    .catch(error => {
        console.error('Đã xảy ra lỗi khi lấy thông tin hóa đơn:', error);
    });
function input() {
    const customerName = document.getElementById('name').value;
    const deliveryAddress = document.getElementById('delivery').value;
    const customerPhone = document.getElementById('phone').value;

    if (customerName === '') {
        return "Thiếu tên khách hàng!";
    } else if (deliveryAddress === '') {
        return "Thiếu địa chỉ!";
    } else if (customerPhone === '') {
        return "Thiếu số điện thoại khách hàng!";
    } else {
        return true;
    }
}