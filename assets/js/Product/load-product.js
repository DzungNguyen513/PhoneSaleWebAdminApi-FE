import api from '../../Base-url/Url.js'
import formatMoney from '../function/formatMoneyVN.js'

const apiUrl = api
        let allProducts = []; // Mảng chứa tất cả các sản phẩm
        let filteredProducts = []; // Mảng chứa sản phẩm đã lọc
        fetch(`${apiUrl}Product/GetProducts`)
            .then(response => response.json())
            .then(data => {
                allProducts = data; // Lưu trữ tất cả sản phẩm
                const tableBody = document.querySelector('.table tbody');
                const itemsPerPage = 5; // Số sản phẩm trên mỗi trang
                const totalPages = Math.ceil(data.length / itemsPerPage); // Tổng số trang
                let currentPage = 1; // Trang hiện tại

                // Hàm hiển thị sản phẩm trên trang hiện tại
                function renderProducts(page) {
                    tableBody.innerHTML = ''; // Xóa nội dung cũ
                    const startIndex = (page - 1) * itemsPerPage;
                    const endIndex = page * itemsPerPage;
                    const productsToShow = data.slice(startIndex, endIndex);

                    productsToShow.forEach(product => {
                        const row = document.createElement('tr');

                      

                        const nameCell = document.createElement('td');
                        nameCell.textContent = product.productName;
                        row.appendChild(nameCell);

                        row.addEventListener('mouseover', function () {
                            row.style.cursor = 'pointer';
                        });

                        // Thêm sự kiện mouseout để trả lại con trỏ chuột khi di chuột ra khỏi dòng
                        row.addEventListener('mouseout', function () {
                            row.style.cursor = 'default';
                        });
                        // Thêm sự kiện click vào dòng
                        row.addEventListener('click', function () {
                            window.location.href = `http://127.0.0.1:5500/pages/ui-features/product-details.html?id=${product.productId}`;
                        });

                        const priceCell = document.createElement('td');
                        priceCell.textContent = `${formatMoney(product.price)}`;
                        row.appendChild(priceCell);

                        const discountCell = document.createElement('td');
                        discountCell.textContent = `${product.discount}%`;
                        row.appendChild(discountCell)

                        const detailCell = document.createElement('td');
                        detailCell.textContent = product.detail
                        detailCell.style.whiteSpace = 'pre-wrap';
                        row.appendChild(detailCell);

                        const imgCell = document.createElement('td');
                        const imgElement = document.createElement('img');
                        imgElement.src = '../../assets/images/dashboard/Iphone15.png';
                        imgElement.alt = product.productName;
                        imgElement.className = 'img-fluid';
                        imgCell.appendChild(imgElement);
                        row.appendChild(imgCell);

                        const statusCell = document.createElement('td');
                        statusCell.textContent = product.status === 1 ? 'Đang kinh doanh' : 'Đã ngừng kinh doanh';
                        statusCell.style.color = product.status === 1 ? 'green' : 'red';
                        statusCell.style.fontWeight = 'bold'                         
                        row.appendChild(statusCell);
                        tableBody.appendChild(row);


                        // Tạo thẻ td để chứa các nút bấm
                        const actionCell = document.createElement('td');

                        // Tạo nút Edit
                        const editButton = document.createElement('button');
                        editButton.textContent = 'Edit';
                        editButton.className = 'btn btn-primary mr-2';
                        editButton.innerHTML += '&nbsp;';
                        editButton.onclick = function (e) {
                            e.stopPropagation();
                            window.location.href = `http://127.0.0.1:5500/pages/ui-features/edit-product.html?id=${product.productId}`;
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
                            // Hiển thị hộp thoại xác nhận
                            e.stopPropagation();
                            const confirmDelete = confirm('Bạn có muốn xóa sản phẩm này không?');

                            // Nếu người dùng đồng ý xóa sản phẩm
                            if (confirmDelete) {
                                // Gọi fetch API phương thức DELETE
                                fetch(`${apiUrl}Product/${product.productId}`, {
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
                        const deleteIcon = document.createElement('i');
                        deleteIcon.className = 'mdi mdi-delete';
                        deleteButton.appendChild(deleteIcon);
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
                            renderProducts(currentPage);
                            updatePaginationUI();
                        });
                        pageItem.appendChild(pageLink);
                        pagination.appendChild(pageItem);
                    }

                    document.querySelector('#productInfo').appendChild(pagination);
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
                renderProducts(currentPage);
                createPaginationButtons();
                updatePaginationUI();
            })
            .catch(error => {
                console.error('Đã xảy ra lỗi khi lấy danh sách sản phẩm:', error);
            });