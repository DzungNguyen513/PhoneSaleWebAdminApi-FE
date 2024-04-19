let allAccounts = []; // Mảng chứa tất cả các tài khoản
let filteredAccount = []; // Mảng chứa tài khoản đã lọc
fetch('https://localhost:7244/api/Account')
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
                userName.textContent = account.Username;
                row.appendChild(userName);

                const passWord = document.createElement('td');
                passWord.textContent = account.Password;
                row.appendChild(passWord);

                const lastLogin = document.createElement('td');
                lastLogin.textContent = account.Lastlogin;
                row.appendChild(lastLogin);

                const status = document.createElement('td');
                status.textContent = account.Status;
                row.appendChild(status);

                const createAt = document.createElement('td');
                createAt.textContent = account.CreateAt
                row.appendChild(createAt);

                const updateAt = document.createElement('td');
                updateAt.textContent = account.UpdateAt
                row.appendChild(updateAt);

                // Tạo thẻ td để chứa các nút bấm
                const actionCell = document.createElement('td');

                // Tạo nút Edit
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.className = 'btn btn-primary mr-2';
                editButton.onclick = function () {
                    window.location.href = `http://127.0.0.1:5500/pages/ui-features/edit-product.html?id=${product.productId}`;
                };
                actionCell.appendChild(editButton);

                // Tạo nút Details
                const detailsButton = document.createElement('button');
                detailsButton.textContent = 'Details';
                detailsButton.className = 'btn btn-info mr-2';
                detailsButton.onclick = function () {
                    window.location.href = `http://127.0.0.1:5500/pages/ui-features/product-details.html?id=${product.productId}`;
                };
                actionCell.appendChild(detailsButton);

                // Tạo nút Delete
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.className = 'btn btn-danger';
                deleteButton.onclick = function () {
                    // Hiển thị hộp thoại xác nhận
                    const confirmDelete = confirm('Bạn có muốn xóa sản phẩm này không?');

                    // Nếu người dùng đồng ý xóa sản phẩm
                    if (confirmDelete) {
                        // Gọi fetch API phương thức DELETE
                        fetch(`https://localhost:7244/api/Product/${product.productId}`, {
                            method: 'DELETE'
                        })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error('Failed to delete product');
                                }
                                // Xử lý phản hồi nếu cần
                                console.log('Product deleted successfully');
                                window.location.reload();
                            })
                            .catch(error => {
                                console.error('Error deleting product:', error);
                            });
                    }
                };
                actionCell.appendChild(deleteButton);

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
        //Phần sử lý tìm kiếm
        // Lắng nghe sự kiện khi người dùng nhập vào trường tìm kiếm
        const searchInput = document.querySelector('.form-control');
        searchInput.addEventListener('input', function () {
            const searchValue = this.value.toLowerCase(); // Lấy giá trị nhập vào và chuyển thành chữ thường
            const products = document.querySelectorAll('.table tbody tr'); // Danh sách các sản phẩm

            products.forEach(product => {
                const productName = product.querySelector('td:first-child').textContent.toLowerCase(); // Lấy tên sản phẩm

                // So sánh tên sản phẩm với giá trị tìm kiếm
                if (productName.includes(searchValue)) {
                    product.style.display = 'table-row'; // Hiển thị sản phẩm nếu tên chứa từ khóa tìm kiếm
                } else {
                    product.style.display = 'none'; // Ẩn sản phẩm nếu không chứa từ khóa tìm kiếm
                }
            });
        });




        // Khởi tạo
        renderAccount(currentPage);
        createPaginationButtons();
        updatePaginationUI();
    })
    .catch(error => {
        console.error('Đã xảy ra lỗi khi lấy danh sách tài khoản:', error);
    });


