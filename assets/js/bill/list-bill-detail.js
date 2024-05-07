import api from '../../Base-url/Url.js'
import formatDateTime from '../function/formatDateTime.js'
import formatMoney from '../function/formatMoneyVN.js'
import statusText from '../function/statusText.js'

console.log(api);
const urlParams = new URLSearchParams(window.location.search);
const billId = urlParams.get('id');
const billDetail = `${api}BillDetail/${billId}`
const billUrl = `${api}Bill/${billId}`;

// Bắt sự kiện khi nhấp vào nút "Thêm sản phẩm"
document.querySelector('.add-product-detail').addEventListener('click', function (event) {
    event.preventDefault();

    // Lấy billId từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const billId = urlParams.get('id');

    // Chuyển hướng đến trang thêm chi tiết hóa đơn và truyền billId vào URL
    window.location.href = `./Bill-detail-add.html?id=${billId}`;
});
// Lấy chi tiết hóa đơn
fetch(billUrl)
    .then(response => response.json())
    .then(data => {
        const headDetailDiv = document.getElementById('head-detail');

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

                    // Tạo nút Edit
                    // const editButton = document.createElement('button');
                    // editButton.textContent = 'Edit';
                    // editButton.className = 'btn btn-primary mr-2';
                    // editButton.innerHTML += '&nbsp;';
                    // editButton.onclick = function (e) {
                    //     // e.stopPropagation();
                    //     window.location.href = `http://127.0.0.1:5500/pages/Bill/Bill-detail-edit.html?id=${detail.billId}`;
                    // };
                    // const editIcon = document.createElement('i');
                    // editIcon.className = 'mdi mdi-pencil';
                    // editButton.appendChild(editIcon);
                    // actionCell.appendChild(editButton);

                    // Lấy thông tin sản phẩm cần chỉnh sửa khi ấn nút Edit
                    const editButton = document.createElement('button');
                    editButton.textContent = 'Edit';
                    editButton.className = 'btn btn-primary mr-2';
                    editButton.innerHTML += '&nbsp;';
                    editButton.onclick = function (e) {
                        // Lấy thông tin từ dòng hiện tại
                        const productId= detail.productId;
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
                        window.location.href = `../../../pages/Bill/Bill-delete.html?id=${detail.billId}`;
                    };
                    const deleteIcon = document.createElement('i');
                    deleteIcon.className = 'mdi mdi-delete';
                    deleteButton.appendChild(deleteIcon);
                    actionCell.appendChild(deleteButton);

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
