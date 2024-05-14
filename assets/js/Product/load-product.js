import api from '../../Base-url/Url.js'
import formatMoney from '../function/formatMoneyVN.js'

const apiUrl = api
function fetchAllProducts() {
        let allProducts = []; // Mảng chứa tất cả các sản phẩm
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
                // Khởi tạo
                renderProducts(currentPage);
                createPaginationButtons();
                updatePaginationUI();
            })
            .catch(error => {
                console.error('Đã xảy ra lỗi khi lấy danh sách sản phẩm:', error);
            });

        }
        fetchAllProducts()
            function removePaginationButtons() {
                const pagination = document.querySelector('.pagination');
                if (pagination) {
                  pagination.remove();
                }
              }


function searchProducts(searchString) {
    removePaginationButtons(); 
    fetch(`${apiUrl}Product/SearchProducts/${searchString}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(products => {
        const tableBody = document.querySelector('table tbody');
  
        // Clear previous search results
        tableBody.innerHTML = '';
  
        // Populate table with search results
        products.forEach(product => {
          const row = document.createElement('tr');
  
          // Populate table cells with product data
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
          row.appendChild(discountCell);
  
          const detailCell = document.createElement('td');
          detailCell.textContent = product.detail;
          detailCell.style.whiteSpace = 'pre-wrap';
          row.appendChild(detailCell);
  
          const statusCell = document.createElement('td');
          statusCell.textContent = product.status === 1 ? 'Đang kinh doanh' : 'Đã ngừng kinh doanh';
          statusCell.style.color = product.status === 1 ? 'green' : 'red';
          statusCell.style.fontWeight = 'bold';
          row.appendChild(statusCell);
  
          // Create cell to contain action buttons
          const actionCell = document.createElement('td');
  
          // Create Edit button
          const editButton = document.createElement('button');
          editButton.textContent = 'Edit';
          editButton.className = 'btn btn-primary mr-2';
          editButton.onclick = function (e) {
            e.stopPropagation();
            window.location.href = `http://127.0.0.1:5500/pages/ui-features/edit-product.html?id=${product.productId}`;
          };
          actionCell.appendChild(editButton);
  
          // Create Delete button
          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.className = 'btn btn-danger';
          deleteButton.onclick = function (e) {
            e.stopPropagation();
            const confirmDelete = confirm('Bạn có muốn xóa sản phẩm này không?');
            if (confirmDelete) {
              fetch(`${apiUrl}Product/${product.productId}`, {
                method: 'DELETE'
              })
                .then(response => {
                  if (!response.ok) {
                    throw new Error('Failed to delete product');
                  }
                  console.log('Product deleted successfully');
                  window.location.reload();
                })
                .catch(error => {
                  console.error('Error deleting product:', error);
                });
            }
          };
          actionCell.appendChild(deleteButton);
  
          // Add action cell to row
          row.appendChild(actionCell);
  
          // Append row to table body
          tableBody.appendChild(row);
        });
      })
      .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
      });
  }
  
  // Event listener for input change
  document.getElementById('searchInput').addEventListener('input', function(event) {
    const searchString = event.target.value.trim();
    if (searchString !== '') {
      searchProducts(searchString);
    } else {
      // Clear table if search string is empty
      const tableBody = document.querySelector('table tbody');
      tableBody.innerHTML = '';
      fetchAllProducts()
    }
  });