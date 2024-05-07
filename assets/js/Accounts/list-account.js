import api from '../../Base-url/Url.js'

const apiUrl = api;

let allAccounts = []; // Mảng chứa tất cả các tài khoản
let filteredAccount = []; // Mảng chứa tài khoản đã lọc
fetch(`${apiUrl}Account/GetAllAccounts`)
    .then(response => response.json())
    .then(data => {
        allAccounts = data; // Lưu trữ tất cả tài khoản
        const tableBody = document.querySelector('.table tbody');
        const itemsPerPage = 5; // Số tài khoản trên mỗi trang
        const totalPages = Math.ceil(data.length / itemsPerPage); // Tổng số trang
        let currentPage = 1; // Trang hiện tại

        // Hàm hiển thị tài khoản trên trang hiện tại
        function renderAccount(page) {
            tableBody.innerHTML = ''; // Xóa nội dung cũ
            const startIndex = (page - 1) * itemsPerPage;
            const endIndex = page * itemsPerPage;
            const accountsToShow = data.slice(startIndex, endIndex);

            accountsToShow.forEach(account => {
                const row = document.createElement('tr');
                const userName = document.createElement('td');
                userName.textContent = account.username; // Đổi tên thuộc tính từ "Username" thành "username"
                row.appendChild(userName);

                // Chưa có dữ liệu chưa dùng
                const loginCell = document.createElement('td');
                if (account.lastLogin) {
                    const Login = new Date(account.lastLogin);
                    // Xác định chuỗi AM/PM dựa vào giờ
                    const ampm = Login.getHours() >= 12 ? 'PM' : 'AM';
                    const lastLogin = `${Login.getDate()}/${Login.getMonth() + 1}/${Login.getFullYear()} ${Login.getHours() % 12}:${('0' + Login.getMinutes()).slice(-2)}:${('0' + Login.getSeconds()).slice(-2)} ${ampm}`;
                    loginCell.textContent = lastLogin;
                } else {
                    loginCell.textContent = 'Chưa từng đăng nhập';
                }
                
                row.appendChild(loginCell);
                // Có thì xóa
                // const lastLogin = document.createElement('td');
                // lastLogin.textContent = account.lastLogin;
                // row.appendChild(lastLogin);

                const status = document.createElement('td');
                status.textContent = account.status === 0 ? 'Đang bị khóa' : 'Đang hoạt động';
                status.style.color = account.status === 1 ? 'black' : 'red';
                row.appendChild(status);

                const createAtCell = document.createElement('td');
                const createWhen = new Date(account.createAt);
                // Xác định chuỗi AM/PM dựa vào giờ
                const ampm1 = createWhen.getHours() >= 12 ? 'PM' : 'AM';
                const createAt = `${createWhen.getDate()}/${createWhen.getMonth() + 1}/${createWhen.getFullYear()} ${createWhen.getHours() % 12}:${('0' + createWhen.getMinutes()).slice(-2)}:${('0' + createWhen.getSeconds()).slice(-2)} ${ampm1}`;
                createAtCell.textContent = createAt;
                row.appendChild(createAtCell);

                const updateAtCell = document.createElement('td');
                const updateWhen = new Date(account.updateAt);
                // Xác định chuỗi AM/PM dựa vào giờ
                const ampm2 = updateWhen.getHours() >= 12 ? 'PM' : 'AM';
                const updateAt = `${updateWhen.getDate()}/${updateWhen.getMonth() + 1}/${updateWhen.getFullYear()} ${updateWhen.getHours() % 12}:${('0' + updateWhen.getMinutes()).slice(-2)}:${('0' + updateWhen.getSeconds()).slice(-2)} ${ampm2}`;
                updateAtCell.textContent = updateAt;
                row.appendChild(updateAtCell);

                // Tạo thẻ td để chứa các nút bấm
                const actionCell = document.createElement('td');

                // Tạo nút Edit
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.className = 'btn btn-primary mr-2';
                editButton.onclick = function () {
                    window.location.href = `../../../pages/icons/edit-account.html?id=${account.accountId}`; // Sử dụng accountId thay vì productId
                };
                const editIcon = document.createElement('i');
                editIcon.className = 'mdi mdi-pencil';
                editButton.appendChild(editIcon);
                actionCell.appendChild(editButton);

                // Tạo nút khóa
                const toggleButton = document.createElement('button');
                toggleButton.textContent = account.status === 0 ? 'Unlock' : 'Lock';
                toggleButton.className = 'btn btn-primary mr-2';
                toggleButton.id = `toggleBtn_${account.accountId}`; // Thêm ID cho nút để xác định
                toggleButton.onclick = function () {
                    const newStatus = account.status === 0 ? 1 : 0; // Đảo ngược trạng thái
                    updateAccountStatus(account.accountId, newStatus); // Gọi hàm cập nhật trạng thái
                    window.location.reload();
                };
                toggleButton.innerHTML += '&nbsp;';
                const toggleIcon = document.createElement('i');
                const toggleIconClass = account.status === 0 ? 'mdi-lock' : 'mdi-lock-open';
                toggleIcon.className = `mdi ${toggleIconClass}`;
                toggleButton.appendChild(toggleIcon);
                actionCell.appendChild(toggleButton);

                // Thêm cell vào hàng
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
                    renderAccount(currentPage);
                    updatePaginationUI();
                });
                pageItem.appendChild(pageLink);
                pagination.appendChild(pageItem);
            }

            document.querySelector('#accountInfo').appendChild(pagination);
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

        //Khởi tạo
        renderAccount(currentPage);
        createPaginationButtons();
        updatePaginationUI();
    })
    .catch(error => {
        console.error('Đã xảy ra lỗi khi lấy danh sách tài khoản:', error);
    });

    // Hàm gửi yêu cầu cập nhật trạng thái tài khoản
    function updateAccountStatus(accountId, newStatus) {
        fetch(`${apiUrl}Account/updateAccountStatus/${accountId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update account status');
            }
            return response.json();
        })
        .then(data => {
            const toggleButton = document.querySelector(`#toggleBtn_${accountId}`);
            toggleButton.textContent = newStatus === 0 ? 'Unlock' : 'Lock';
            toggleButton.innerHTML += '&nbsp;';
            const toggleIconClass = newStatus === 0 ? 'mdi-lock' : 'mdi-lock-open';
            toggleButton.querySelector('i').className = `mdi ${toggleIconClass}`;
            })
        .catch(error => {
            console.error('Error updating account status:', error);
        });
    }

document.addEventListener('DOMContentLoaded', function() {
const apiUrl = api; 
let allAccounts = []; // Mảng chứa tất cả các khách hàng

// Lấy danh sách khách hàng từ API
fetch(`${apiUrl}Account/GetAllAccounts`)
    .then(response => response.json())
    .then(data => {
        allAccounts = data; // Lưu trữ tất cả khách hàng
    })
    .catch(error => {
    console.error('Đã xảy ra lỗi khi lấy danh sách tài khoản:', error);
    });

const resetPage = document.getElementById('resetPage')
resetPage.addEventListener('click', function(){
window.location.reload();
});


const filterLockedBtn = document.getElementById('filterLockedBtn');
filterLockedBtn.addEventListener('click', function() {
    // Lọc và hiển thị các tài khoản bị khóa
    const lockedAccounts = allAccounts.filter(account => account.status === 0);
    renderCustomerData(lockedAccounts); // Hiển thị tài khoản bị khóa
});

// Hàm hiển thị dữ liệu khách hàng trên trang
function renderCustomerData(account) {
    const tableBody = document.querySelector('.table tbody');
    tableBody.innerHTML = ''; // Xóa nội dung cũ

    account.forEach(account => {
        const row = document.createElement('tr');
        const userName = document.createElement('td');
        userName.textContent = account.username; // Đổi tên thuộc tính từ "Username" thành "username"
        row.appendChild(userName);

        // Chưa có dữ liệu chưa dùng
        const loginCell = document.createElement('td');
        if (account.lastLogin) {
            const Login = new Date(account.lastLogin);
            // Xác định chuỗi AM/PM dựa vào giờ
            const ampm = Login.getHours() >= 12 ? 'PM' : 'AM';
            const lastLogin = `${Login.getDate()}/${Login.getMonth() + 1}/${Login.getFullYear()} ${Login.getHours() % 12}:${('0' + Login.getMinutes()).slice(-2)}:${('0' + Login.getSeconds()).slice(-2)} ${ampm}`;
            loginCell.textContent = lastLogin;
        } else {
            loginCell.textContent = 'Chưa từng đăng nhập';
        }
        
        row.appendChild(loginCell);
        // Có thì xóa
        // const lastLogin = document.createElement('td');
        // lastLogin.textContent = account.lastLogin;
        // row.appendChild(lastLogin);

        const status = document.createElement('td');
        status.textContent = account.status === 0 ? 'Đang bị khóa' : 'Đang hoạt động';
        status.style.color = account.status === 1 ? 'black' : 'red';
        row.appendChild(status);

        const createAtCell = document.createElement('td');
        const createWhen = new Date(account.createAt);
        // Xác định chuỗi AM/PM dựa vào giờ
        const ampm1 = createWhen.getHours() >= 12 ? 'PM' : 'AM';
        const createAt = `${createWhen.getDate()}/${createWhen.getMonth() + 1}/${createWhen.getFullYear()} ${createWhen.getHours() % 12}:${('0' + createWhen.getMinutes()).slice(-2)}:${('0' + createWhen.getSeconds()).slice(-2)} ${ampm1}`;
        createAtCell.textContent = createAt;
        row.appendChild(createAtCell);

        const updateAtCell = document.createElement('td');
        const updateWhen = new Date(account.updateAt);
        // Xác định chuỗi AM/PM dựa vào giờ
        const ampm2 = updateWhen.getHours() >= 12 ? 'PM' : 'AM';
        const updateAt = `${updateWhen.getDate()}/${updateWhen.getMonth() + 1}/${updateWhen.getFullYear()} ${updateWhen.getHours() % 12}:${('0' + updateWhen.getMinutes()).slice(-2)}:${('0' + updateWhen.getSeconds()).slice(-2)} ${ampm2}`;
        updateAtCell.textContent = updateAt;
        row.appendChild(updateAtCell);

        // Tạo thẻ td để chứa các nút bấm
        const actionCell = document.createElement('td');

        // Đang bị khóa không edit mật khẩu được
        // Tạo nút Edit
        // const editButton = document.createElement('button');
        // editButton.textContent = 'Edit';
        // editButton.className = 'btn btn-primary mr-2';
        // editButton.onclick = function () {
        //     window.location.href = `/pages/icons/edit-account.html?id=${account.accountId}`; // Sử dụng accountId thay vì productId
        // };
        // const editIcon = document.createElement('i');
        // editIcon.className = 'mdi mdi-pencil';
        // editButton.appendChild(editIcon);
        // actionCell.appendChild(editButton);

        // Tạo nút khóa
        const toggleButton = document.createElement('button');
        toggleButton.textContent = account.status === 0 ? 'Unlock' : 'Lock';
        toggleButton.className = 'btn btn-primary mr-2';
        toggleButton.id = `toggleBtn_${account.accountId}`; // Thêm ID cho nút để xác định
        toggleButton.onclick = function () {
            const newStatus = account.status === 0 ? 1 : 0; // Đảo ngược trạng thái
            updateAccountStatus(account.accountId, newStatus); // Gọi hàm cập nhật trạng thái
            //window.location.reload();
        };
        toggleButton.innerHTML += '&nbsp;';
        const toggleIcon = document.createElement('i');
        const toggleIconClass = account.status === 0 ? 'mdi-lock' : 'mdi-lock-open';
        toggleIcon.className = `mdi ${toggleIconClass}`;
        toggleButton.appendChild(toggleIcon);
        actionCell.appendChild(toggleButton);

        // Thêm cell vào hàng
        row.appendChild(actionCell);

        tableBody.appendChild(row);
    });
}
});