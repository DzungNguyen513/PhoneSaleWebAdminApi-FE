// fetch('https://localhost:7244/api/Product/GetProducts')
//     .then(response => response.json())
//     .then(data => {
//         const tableBody = document.querySelector('.table tbody');

//         data.forEach(product => {
//             const row = document.createElement('tr');

//             const nameCell = document.createElement('td');
//             nameCell.textContent = product.productName;
//             row.appendChild(nameCell);

//             const storageGbCell = document.createElement('td');
//             storageGbCell.textContent = product.storageGb;
//             row.appendChild(storageGbCell);

//             const colorNameCell = document.createElement('td');
//             colorNameCell.textContent = product.colorName;
//             row.appendChild(colorNameCell);

//             const amountCell = document.createElement('td');
//             amountCell.textContent = product.amount;
//             row.appendChild(amountCell);

//             const priceCell = document.createElement('td');
//             priceCell.textContent = product.price;
//             row.appendChild(priceCell);

//             const detailCell = document.createElement('td');
//             detailCell.textContent = product.detail
//             detailCell.classList.add('detail');
//             row.appendChild(detailCell);

//             const imgCell = document.createElement('td');
//             const imgElement = document.createElement('img');
//             imgElement.src = '../../assets/images/dashboard/Iphone15.png';
//             imgElement.alt = product.productName;
//             imgElement.className = 'img-fluid';
//             imgCell.appendChild(imgElement);
//             row.appendChild(imgCell);

//             const statusCell = document.createElement('td');
//             statusCell.textContent = product.status
//             row.appendChild(statusCell);

//             // Tạo thẻ td để chứa các nút bấm
//             const actionCell = document.createElement('td');

//             // Tạo nút Edit
//             const editButton = document.createElement('button');
//             editButton.textContent = 'Edit';
//             editButton.className = 'btn btn-primary mr-2';
//             editButton.onclick = function () {
//                 window.location.href = `http://127.0.0.1:5500/pages/ui-features/edit-product.html?id=${product.productId}`;
//             };
//             actionCell.appendChild(editButton);

//             // Tạo nút Details
//             const detailsButton = document.createElement('button');
//             detailsButton.textContent = 'Details';
//             detailsButton.className = 'btn btn-info mr-2';
//             detailsButton.onclick = function () {
//                 window.location.href = '/Details/' + product.productId;
//             };
//             actionCell.appendChild(detailsButton);

//             // Tạo nút Delete
//             const deleteButton = document.createElement('button');
//             deleteButton.textContent = 'Delete';
//             deleteButton.className = 'btn btn-danger';
//             deleteButton.onclick = function () {
//                 // Hiển thị hộp thoại xác nhận
//                 const confirmDelete = confirm('Bạn có muốn xóa sản phẩm này không?');

//                 // Nếu người dùng đồng ý xóa sản phẩm
//                 if (confirmDelete) {
//                     // Gọi fetch API phương thức DELETE
//                     fetch(`https://localhost:7244/api/Product/${product.productId}`, {
//                         method: 'DELETE'
//                     })
//                         .then(response => {
//                             if (!response.ok) {
//                                 throw new Error('Failed to delete product');
//                             }
//                             // Xử lý phản hồi nếu cần
//                             console.log('Product deleted successfully');
//                             window.location.reload();
//                         })
//                         .catch(error => {
//                             console.error('Error deleting product:', error);
//                         });
//                 }
//             };
//             actionCell.appendChild(deleteButton);

//             // Thêm cell vào hàng
//             row.appendChild(actionCell);


//             tableBody.appendChild(row);
//         });
//     })
//     .catch(error => {
//         console.error('Đã xảy ra lỗi khi lấy danh sách sản phẩm:', error);
//     });

fetch('https://localhost:7244/api/Product/GetProducts')
    .then(response => response.json())
    .then(data => {
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

                const storageGbCell = document.createElement('td');
                storageGbCell.textContent = product.storageGb;
                row.appendChild(storageGbCell);

                const colorNameCell = document.createElement('td');
                colorNameCell.textContent = product.colorName;
                row.appendChild(colorNameCell);

                const amountCell = document.createElement('td');
                amountCell.textContent = product.amount;
                row.appendChild(amountCell);

                const priceCell = document.createElement('td');
                priceCell.textContent = product.price;
                row.appendChild(priceCell);

                const detailCell = document.createElement('td');
                detailCell.textContent = product.detail
                detailCell.classList.add('detail');
                row.appendChild(detailCell);

                const imgCell = document.createElement('td');
                const imgElement = document.createElement('img');
                imgElement.src = '../../assets/images/dashboard/Iphone15.png';
                imgElement.alt = product.productName;
                imgElement.className = 'img-fluid';
                imgCell.appendChild(imgElement);
                row.appendChild(imgCell);

                const statusCell = document.createElement('td');
                statusCell.textContent = product.status
                row.appendChild(statusCell);

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
                    window.location.href = '/Details/' + product.productId;
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


