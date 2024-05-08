import api from '../../Base-url/Url.js'
import formatDateTime from '../function/formatDateTime.js'
import formatMoney from '../function/formatMoneyVN.js'
console.log(api);
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
                idEmployeeCell.textContent = bill.customerId;
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
                // if (bill.status !== 1 ||bill.status !== 4 ) {
                //     editButton.disabled = true;
                // } else{
                //     editButton.onclick = function (e) {
                //         e.stopPropagation();
                      
                //         if (bill.status === 4) {
                //             const confirmation = confirm("Đơn hàng này đã bị hủy. Bạn có muốn tiếp tục sửa đổi không?");
                //             if (confirmation) {
                //                 window.location.href = `../../../pages/Bill/Bill-edit.html?id=${bill.billId}`;
                //             }
                //         } else {
                //             window.location.href = `../../../pages/Bill/Bill-edit.html?id=${bill.billId}`;
                //         }
                //     }
                // }
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

        //Phần sử lý tìm kiếm
        // Lắng nghe sự kiện khi người dùng nhập vào trường tìm kiếm
        // const searchInput = document.querySelector('.form-control');
        // searchInput.addEventListener('input', function () {
        //     const searchValue = this.value.toLowerCase(); // Lấy giá trị nhập vào và chuyển thành chữ thường
        //     const Bills = document.querySelectorAll('.table tbody tr'); // Danh sách các Bill

        //     Bills.forEach(Bill => {
        //         const BillName = Bill.querySelector('td:first-child').textContent.toLowerCase(); // Lấy tên Bill

        //         // So sánh tên Bill với giá trị tìm kiếm
        //         if (BillName.includes(searchValue)) {
        //             Bill.style.display = 'table-row'; // Hiển thị Bill nếu tên chứa từ khóa tìm kiếm
        //         } else {
        //             Bill.style.display = 'none'; // Ẩn Bill nếu không chứa từ khóa tìm kiếm
        //         }
        //     });
        // });

        // Khởi tạo
        renderBills(currentPage);
        createPaginationButtons();
        // updatePaginationUI();
    })
    .catch(error => {
        console.error('Đã xảy ra lỗi khi lấy danh sách hóa đơn:', error);
    });


