import api from '../../Base-url/Url.js'
import fetchAmountProduct from '../function/fetchAmountProduct.js'
import editAmountProduct from '../function/editAmoutProduct.js'

import formatDateTime from '../function/formatDateTime.js'

import formatMoney from '../function/formatMoneyVN.js'
import statusText from '../function/statusText.js'

console.log(api);
const urlParams = new URLSearchParams(window.location.search);
const billId = urlParams.get('id');
const billDetail = `${api}BillDetail/${billId}`
const billUrl = `${api}Bill/${billId}`;

let statusCheck
// Lấy chi tiết hóa đơn
fetch(billUrl)
    .then(response => response.json())
    .then(data => {
        statusCheck = data.status
        const headDetailDiv = document.getElementById('head-detail');
        // Bắt sự kiện khi nhấp vào nút "Thêm sản phẩm"
        document.querySelector('.add-product-detail').addEventListener('click', function (event) {
            event.preventDefault();
            window.location.href = `./Bill-detail-add.html?id=${billId}`;
        });

        if (data.status !== 0 ) { // Nếu trạng thái là "Đã hủy"
            document.querySelector('.add-product-detail').setAttribute('disabled', true);
        }



        // Hiển thị thông tin khách hàng và hóa đơn
        const customerName = document.createElement('p');
        const deliveryAddress = document.createElement('p');
        const customerPhone = document.createElement('p');
        const billID = document.createElement('p');
        const status = document.createElement('p');
        const date = document.createElement('p');
        const note = document.createElement('p');
        const total = document.getElementById('total-bill')

        // Đặt nội dung cho các phần tử
        //Tên khách hàng
        customerName.innerHTML = `<b>Tên khách hàng :</b> ${data.customerName}`;

        //Địa chỉ khách hàng
        deliveryAddress.innerHTML = `<b>Địa chỉ giao hàng:</b> ${data.deliveryAddress}`;
        //Số điện thoại khách hagnf
        customerPhone.innerHTML = `<b>Số điện thoại:</b> ${data.customerPhone}`;

        billID.innerHTML = `<b>Mã hóa đơn:</b> ${data.billId}`;

        status.innerHTML = `<b>Trạng thái:</b> ${statusText[data.status]}`;

        date.innerHTML = `<b>Ngày tạo đơn:</b> ${formatDateTime(data.dateBill)}`;

        note.innerHTML = `<b>Ghi chú:</b> ${data.note}`;

        total.textContent = `${formatMoney(data.totalBill)}`

        // Thêm các phần tử vào div có id "head-detail"
        headDetailDiv.appendChild(customerName);
        headDetailDiv.appendChild(deliveryAddress);
        headDetailDiv.appendChild(customerPhone);
        headDetailDiv.appendChild(billID);
        headDetailDiv.appendChild(status);
        headDetailDiv.appendChild(date);
        headDetailDiv.appendChild(note);
    })
    .catch(error => {
        console.error('Error fetching bill details:', error);
    });


fetch(billDetail)
    .then(response => response.json())
    .then(data => {
        const tableBody = document.querySelector('.table tbody');
        tableBody.innerHTML = ''; // Xóa nội dung cũ
        // Duyệt qua các dữ liệu chi tiết và thêm chúng vào bảng
        data.forEach(detail => {

            const row = document.createElement('tr');

            const billIdCell = document.createElement('td');
            billIdCell.textContent = detail.billId;
            row.appendChild(billIdCell);

            // Lấy tên sản phẩm
            getProductName(detail.productId)
                .then(productName => {
                    const productNameCell = document.createElement('td');
                    productNameCell.setAttribute('data-product-id', detail.productId);
                    productNameCell.textContent = productName;
                    row.appendChild(productNameCell);

                    //Thêm trường colorName
                    const colorNameCell = document.createElement('td');
                    colorNameCell.setAttribute('data-color-id', detail.colorName);
                    colorNameCell.textContent = detail.colorName || ''; //Nếu không có giá trị, sẽ hiển thị chuỗi rỗng
                    row.appendChild(colorNameCell);

                    //Thêm trường storageGb
                    const storageGbCell = document.createElement('td');
                    storageGbCell.setAttribute('data-storageGb-id', detail.storageGb);
                    storageGbCell.textContent = detail.storageGb || ''; //Nếu không có giá trị, sẽ hiển thị chuỗi rỗng
                    row.appendChild(storageGbCell);

                    // Thêm các ô dữ liệu khác sau khi đã có tên sản phẩm
                    const amountCell = document.createElement('td');
                    amountCell.textContent = detail.amount;
                    row.appendChild(amountCell);

                    const priceCell = document.createElement('td');
                    priceCell.textContent = `${formatMoney(detail.price)}`;
                    row.appendChild(priceCell);

                    const discountCell = document.createElement('td');
                    discountCell.textContent = `${detail.discount}%`;
                    row.appendChild(discountCell);

                    const totalCell = document.createElement('td');
                    totalCell.textContent = `${formatMoney(detail.total)}`;
                    row.appendChild(totalCell);

                    // Tạo thẻ td để chứa các nút bấm
                    const actionCell = document.createElement('td');


                    // Lấy thông tin sản phẩm cần chỉnh sửa khi ấn nút Edit
                    const editButton = document.createElement('button');
                    editButton.textContent = 'Edit';
                    editButton.className = 'btn btn-primary mr-2';
                    editButton.innerHTML += '&nbsp;';

                    editButton.onclick = function (e) {
                        // Lấy thông tin từ dòng hiện tại
                        const productId = detail.productId;
                        const colorName = detail.colorName;
                        const storageGb = detail.storageGb;
                        const amount = detail.amount;
                        const price = detail.price;
                        const discount = detail.discount;
                        const total = detail.total;
                        // Chuyển hướng sang trang chỉnh sửa và truyền thông tin sản phẩm
                        window.location.href = `../../../pages/Bill/Bill-detail-edit.html?id=${detail.billId}&productId=${productId}&colorName=${colorName}&storageGb=${storageGb}&amount=${amount}&price=${price}&discount=${discount}&total=${total}`;
                    };

                    const editIcon = document.createElement('i');
                    editIcon.className = 'mdi mdi-pencil';
                    editButton.appendChild(editIcon);
                    actionCell.appendChild(editButton);


                    // Tạo nút Delete
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.className = 'btn btn-danger';
                    deleteButton.onclick = function (e) {
                        e.stopPropagation();
                        const productId = detail.productId;
                        const colorName = detail.colorName;
                        const storageGb = detail.storageGb;
                        const amount = detail.amount;
                        
                        const confirmation = confirm(`Bạn có chắc chắn muốn xóa sản phẩm ${productName}-${colorName}-${storageGb} ?`);
                        if (confirmation) {
                            fetch(`${api}BillDetail/${detail.billId}/${productId}/${colorName}/${storageGb}`, {
                                method: 'DELETE'
                            })
                                //Cập nhật tổng tiền bill
                                .then(response => {
                                    if (response.ok) {
                                        return fetch(`${api}Bill/CalculateTotalBill/${billId}`, {
                                            method: 'GET',
                                            headers: {
                                                'Content-Type': 'application/json'
                                            }
                                        });
                                    } else {
                                        console.error('Đã xảy ra lỗi khi cập nhật thông tin chi tiết hóa đơn:', response.status);
                                        throw new Error('Có lỗi khi cập nhật thông tin chi tiết hóa đơn.');
                                    }
                                })
                                //Cập nhập số lượng sản phẩm
                                .then(response => {
                                    if (response.ok) {
                                        fetchAmountProduct(productId, colorName, storageGb)
                                            .then(amountProduct => {
                                                editAmountProduct(productId, storageGb, colorName, amountProduct + amount);
                                            })
                                            .catch(error => {
                                                console.error('Lỗi khi lấy số lượng sản phẩm từ cơ sở dữ liệu:', error);
                                            });
                                    } else {
                                        alert('số lượng sản phẩm không cập nhật được ', response.status);
                                        throw new Error('Có lỗi khi cập nhật thông tin chi tiết hóa đơn.');
                                    }
                                })
                                z``
                                .then(response => {
                                    if (response.ok) {
                                        alert(`Bạn đã xóa sản phẩm thành công`)
                                        location.reload();
                                    } else {
                                        // Nếu có lỗi trong quá trình xóa, thông báo cho người dùng
                                        alert('Đã xảy ra lỗi khi xóa sản phẩm.');
                                    }
                                })
                                .catch(error => {
                                    console.error('Đã xảy ra lỗi khi gọi API xóa sản phẩm:', error);
                                    alert('Đã xảy ra lỗi khi gọi API xóa sản phẩm.');
                                });
                        }
                    };;
                    const deleteIcon = document.createElement('i');
                    deleteIcon.className = 'mdi mdi-delete';
                    deleteButton.appendChild(deleteIcon);
                    actionCell.appendChild(deleteButton);

                    if (statusCheck !== 0) {
                        editButton.disabled = true;
                        deleteButton.disabled = true;
                    }
                    // // Thêm cell vào hàng
                    row.appendChild(actionCell);

                    tableBody.appendChild(row);
                });
        });

    })
    .catch(error => {
        console.error('Đã xảy ra lỗi khi lấy chi tiết hóa đơn:', error);
    });
const getProductName = (productId) => {
    return fetch(`${api}Product/GetProduct/${productId}`)
        .then(response => response.json())
        .then(data => {
            return data.productName;
        })
        .catch(error => {
            console.error('Error fetching product details:', error);
            return 'Product Name Not Found'; // Trả về một giá trị mặc định nếu có lỗi
        });
}

