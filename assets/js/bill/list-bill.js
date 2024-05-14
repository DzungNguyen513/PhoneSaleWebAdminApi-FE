import api from '../../Base-url/Url.js'
import formatDateTime from '../function/formatDateTime.js'
import formatMoney from '../function/formatMoneyVN.js'
const bill = `${api}Bill`
let allBills = []; // Mảng chứa tất cả các Bill



fetch(bill)
    // fetch(`${api}Bill`)
    .then(response => response.json())
    .then(data => {
        allBills = data; // Lưu trữ tất cả Bill
        const tableBody = document.querySelector('.table tbody');
        const itemsPerPage = 5; // Số Bill trên mỗi trang
        const totalPages = Math.ceil(data.length / itemsPerPage); // Tổng số trang
        let currentPage = 1; // Trang hiện tại

        // Hàm hiển thị Bill trên trang hiện tại
        function renderBills(page) {
            const tableBody = document.querySelector('.table tbody');
            tableBody.innerHTML = ''; // Xóa nội dung cũ
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = page * itemsPerPage;
            const billsToShow = allBills.slice(startIndex, endIndex);

            billsToShow.forEach(bill => {
                const row = document.createElement('tr');

                const idBillCell = document.createElement('td');
                idBillCell.textContent = bill.billId;
                row.appendChild(idBillCell);
                // Thêm sự kiện mouseover để thay đổi con trỏ chuột thành hand
                row.addEventListener('mouseover', function () {
                    row.style.cursor = 'pointer';
                });

                // Thêm sự kiện mouseout để trả lại con trỏ chuột khi di chuột ra khỏi dòng
                row.addEventListener('mouseout', function () {
                    row.style.cursor = 'default';
                });
                // Thêm sự kiện click vào dòng
                row.addEventListener('click', function () {
                    window.location.href = `../../../pages/Bill/Bill-detail.html?id=${bill.billId}`;
                });

                const idEmployeeCell = document.createElement('td');
                idEmployeeCell.textContent = bill.customerName;
                row.appendChild(idEmployeeCell);

                const statusCell = document.createElement('td');
                const statusText = ['Chờ xác nhận', 'Chờ lấy hàng', 'Chờ giao hàng', 'Đã giao', 'Đã hủy'];
                statusCell.textContent = statusText[bill.status];
                statusCell.style.fontWeight = "bold"
                statusCell.classList.add('waiting-confirmation');

                const statusColors = {
                    0: 'Gold',
                    1: 'Chartreuse',
                    2: 'PaleTurquoise',
                    3: 'MediumBlue',
                    4: 'red'
                };

                statusCell.style.color = statusColors[bill.status];
                row.appendChild(statusCell);


                // Ngày tạo
                const dateBillCell = document.createElement('td');
                dateBillCell.textContent = formatDateTime(bill.dateBill);
                row.appendChild(dateBillCell);

                // Ngày sửa
                const updateBillCell = document.createElement('td');
                updateBillCell.textContent = formatDateTime(bill.updateAt);
                row.appendChild(updateBillCell);
                // Tổng tiền
                formatMoney
                const totalBillCell = document.createElement('td');
                totalBillCell.textContent = `${formatMoney(bill.totalBill)}`;
                row.appendChild(totalBillCell);


                tableBody.appendChild(row);

                // Tạo thẻ td để chứa các nút bấm
                const actionCell = document.createElement('td');

                // Tạo nút Edit
                const editButton = document.createElement('button');
                editButton.textContent = 'Sửa đơn';
                editButton.className = 'btn btn-primary mr-2';
                editButton.innerHTML += '&nbsp;';
                if (bill.status !== 0 && bill.status !== 4 ) {
                    editButton.disabled = true;
                } else{
                    editButton.onclick = function (e) {
                        e.stopPropagation();

                        if (bill.status === 4) {
                            const confirmation = confirm("Đơn hàng này đã bị hủy. Bạn có muốn tiếp tục sửa đổi không?");
                            if (confirmation) {
                                window.location.href = `../../../pages/Bill/Bill-edit.html?id=${bill.billId}`;
                            }
                        } else {
                            window.location.href = `../../../pages/Bill/Bill-edit.html?id=${bill.billId}`;
                        }
                    }
                }
                

                const editIcon = document.createElement('i');
                editIcon.className = 'mdi mdi-pencil';
                editButton.appendChild(editIcon);
                actionCell.appendChild(editButton);

                // Tạo nút Delete
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Hủy đơn';
                deleteButton.className = 'btn btn-danger';
                if (bill.status === 4) {
                    deleteButton.disabled = true;
                }
                deleteButton.onclick = function (e) {
                    e.stopPropagation();
                    const confirmation = confirm(`Bạn có chắc chắn muốn hủy đơn hàng này không`);
                    if (confirmation) {
                        fetch(`${api}Bill/${bill.billId}`, {
                            method: 'DELETE'
                        })
                            .then(response => {
                                if (response.ok) {
                                    alert(`Bạn đã hủy đơn hàng thành công`)
                                    location.reload();
                                } else {
                                    // Nếu có lỗi trong quá trình xóa, thông báo cho người dùng
                                    alert('Đã xảy ra lỗi khi hủy đơn hàng.');
                                }
                            })
                            .catch(error => {
                                console.error('Đã xảy ra lỗi khi gọi API hủy đơn hàng:', error);
                                alert('Đã xảy ra lỗi khi gọi API hủy đơn hàng.');
                            });
                    }
                };
                const deleteIcon = document.createElement('i');
                deleteIcon.className = 'mdi mdi-delete';
                deleteButton.appendChild(deleteIcon);
                actionCell.appendChild(deleteButton);

                // // Thêm cell vào hàng
                row.appendChild(actionCell);

                tableBody.appendChild(row);
            });
        }

        // Hàm tạo nút phân trang
        function createPaginationButtons() {
            const pagination = document.createElement('ul');
            pagination.className = 'pagination';

            for (let i = 1; i <= totalPages; i++) {
                const pageItem = document.createElement('li');
                pageItem.className = 'page-item';
                const pageLink = document.createElement('a');
                pageLink.className = 'page-link';
                pageLink.textContent = i;
                pageLink.addEventListener('click', () => {
                    currentPage = i;
                    renderBills(currentPage);
                    updatePaginationUI();
                });
                pageItem.appendChild(pageLink);
                pagination.appendChild(pageItem);
            }

            document.querySelector('#BillInfo').appendChild(pagination);
        }

        // Hàm cập nhật giao diện phân trang
        function updatePaginationUI() {
            const pageLinks = document.querySelectorAll('.page-link');
            pageLinks.forEach((link, index) => {
                if (index + 1 === currentPage) {
                    link.classList.add('active');
                    link.style.backgroundColor = '#007bff';
                    link.style.color = '#fff';
                } else {
                    link.classList.remove('active');
                    link.style.backgroundColor = '';
                    link.style.color = '';
                }
            });
        }


        // Khởi tạo
        renderBills(currentPage);
        createPaginationButtons();
    })
    .catch(error => {
        console.error('Đã xảy ra lỗi khi lấy danh sách hóa đơn:', error);
    });


// Lắng nghe sự kiện thay đổi của select
const filterSelect = document.getElementById('filterBill');
filterSelect.addEventListener('change', function () {
    const selectedStatus = this.value; // Lấy giá trị trạng thái được chọn
    let filteredBills = [];

    // Lọc danh sách hóa đơn dựa trên trạng thái được chọn
    if (selectedStatus === 'Tất cả') {
        // Nếu chọn Tất cả, sử dụng danh sách hóa đơn ban đầu
        filteredBills = allBills;
    } else {
        // Lọc danh sách hóa đơn theo trạng thái được chọn
        switch (selectedStatus) {
            case 'Chờ xác nhận':
                filteredBills = allBills.filter(bill => bill.status === 0);
                break;
            case 'Chờ lấy hàng':
                filteredBills = allBills.filter(bill => bill.status === 1);
                break;
            case 'Chờ giao hàng':
                filteredBills = allBills.filter(bill => bill.status === 2);
                break;
            case 'Đã giao':
                filteredBills = allBills.filter(bill => bill.status === 3);
                break;
            case 'Đã hủy':
                filteredBills = allBills.filter(bill => bill.status === 4);
                break;
            default:
                // Mặc định, sử dụng danh sách hóa đơn ban đầu
                filteredBills = allBills;
        }
    }

    renderBills(1, filteredBills);
});

// Lắng nghe sự kiện khi người dùng nhập vào input
const searchInput = document.querySelector('.btn-search');
searchInput.addEventListener('input', function (event) {
    const searchString = event.target.value.trim(); // Lấy giá trị từ input và loại bỏ khoảng trắng ở đầu và cuối

    console.log(searchString.toString())
    if (searchString !== '') {
        // Gọi đến API để lấy danh sách hóa đơn theo tên khách hàng
        fetch(`${api}Bill/SearchCustomerName/${searchString}`)
            .then(response => response.json())
            .then(data => {
                renderBills(1, data);
            })
            .catch(error => {
                console.error('Đã xảy ra lỗi khi tìm kiếm hóa đơn theo tên khách hàng:', error);
                // Xử lý lỗi nếu có
            });
    } else {
        // Nếu ô tìm kiếm trống, hiển thị lại toàn bộ danh sách hóa đơn
        renderBills(1);
        updatePaginationUI();

    }
});


// Hàm hiển thị Bill trên trang hiện tại với danh sách đã lọc (nếu có)
function renderBills(page, bills = allBills) {
    const tableBody = document.querySelector('.table tbody');
    tableBody.innerHTML = ''; // Xóa nội dung cũ
    const itemsPerPage = 5; // Số Bill trên mỗi trang
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;
    const billsToShow = bills.slice(startIndex, endIndex);

    billsToShow.forEach(bill => {
        const row = document.createElement('tr');

        // Tạo các ô và nội dung của từng hàng
        const idBillCell = document.createElement('td');
        idBillCell.textContent = bill.billId;
        row.appendChild(idBillCell);

        const idEmployeeCell = document.createElement('td');
        idEmployeeCell.textContent = bill.customerName;
        row.appendChild(idEmployeeCell);

        const statusCell = document.createElement('td');
        const statusText = ['Chờ xác nhận', 'Chờ lấy hàng', 'Chờ giao hàng', 'Đã giao', 'Đã hủy'];
        statusCell.textContent = statusText[bill.status];
        statusCell.style.fontWeight = "bold";
        statusCell.classList.add('waiting-confirmation');
        const statusColors = {
            0: 'Gold',
            1: 'Chartreuse',
            2: 'PaleTurquoise',
            3: 'MediumBlue',
            4: 'red'
        };
        statusCell.style.color = statusColors[bill.status];
        row.appendChild(statusCell);

        const dateBillCell = document.createElement('td');
        dateBillCell.textContent = formatDateTime(bill.dateBill);
        row.appendChild(dateBillCell);

        const updateBillCell = document.createElement('td');
        updateBillCell.textContent = formatDateTime(bill.updateAt);
        row.appendChild(updateBillCell);

        const totalBillCell = document.createElement('td');
        totalBillCell.textContent = `${formatMoney(bill.totalBill)}`;
        row.appendChild(totalBillCell);

        const actionCell = document.createElement('td');

        const editButton = document.createElement('button');
        editButton.textContent = 'Sửa đơn';
        editButton.className = 'btn btn-primary mr-2';
        if (bill.status !== 0 && bill.status !== 4) {
            editButton.disabled = true;
        } else {
            editButton.onclick = function (e) {
                e.stopPropagation();

                if (bill.status === 4) {
                    const confirmation = confirm("Đơn hàng này đã bị hủy. Bạn có muốn tiếp tục sửa đổi không?");
                    if (confirmation) {
                        window.location.href = `../../../pages/Bill/Bill-edit.html?id=${bill.billId}`;
                    }
                } else {
                    window.location.href = `../../../pages/Bill/Bill-edit.html?id=${bill.billId}`;
                }
            }
        }
        const editIcon = document.createElement('i');
        editIcon.className = 'mdi mdi-pencil';
        editButton.appendChild(editIcon);
        actionCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Hủy đơn';
        deleteButton.className = 'btn btn-danger';
        if (bill.status === 4) {
            deleteButton.disabled = true;
        }
        deleteButton.onclick = function (e) {
            e.stopPropagation();
            const confirmation = confirm(`Bạn có chắc chắn muốn hủy đơn hàng này không`);
            if (confirmation) {
                fetch(`${api}Bill/${bill.billId}`, {
                    method: 'DELETE'
                })
                    .then(response => {
                        if (response.ok) {
                            alert(`Bạn đã hủy đơn hàng thành công`);
                            location.reload();
                        } else {
                            alert('Đã xảy ra lỗi khi hủy đơn hàng.');
                        }
                    })
                    .catch(error => {
                        console.error('Đã xảy ra lỗi khi gọi API hủy đơn hàng:', error);
                        alert('Đã xảy ra lỗi khi gọi API hủy đơn hàng.');
                    });
            }
        };
        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'mdi mdi-delete';
        deleteButton.appendChild(deleteIcon);
        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });
}




