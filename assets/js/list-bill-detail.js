
const urlParams = new URLSearchParams(window.location.search);
const billId = urlParams.get('id');
fetch(`https://localhost:7244/api/BillDetail/${billId}`)
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

            const productIdCell = document.createElement('td');
            productIdCell.textContent = detail.productId;
            row.appendChild(productIdCell);

            const amountCell = document.createElement('td');
            amountCell.textContent = detail.amount;
            row.appendChild(amountCell);

            const priceCell = document.createElement('td');
            priceCell.textContent = detail.price;
            row.appendChild(priceCell);

            const discountCell = document.createElement('td');
            discountCell.textContent = detail.discount;
            row.appendChild(discountCell);

            const totalCell = document.createElement('td');
            totalCell.textContent = detail.total;
            row.appendChild(totalCell);


            // Tạo thẻ td để chứa các nút bấm
            const actionCell = document.createElement('td');

            // Tạo nút Edit
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.className = 'btn btn-primary mr-2';
            editButton.innerHTML += '&nbsp;';
            editButton.onclick = function (e) {
                e.stopPropagation();
                window.location.href = `http://127.0.0.1:5500/pages/Bill/Bill-edit.html?id=${bill.billId}`;
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
                window.location.href = `http://127.0.0.1:5500/pages/Bill/Bill-delete.html?id=${bill.billId}`;
            };
            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'mdi mdi-delete';
            deleteButton.appendChild(deleteIcon);
            actionCell.appendChild(deleteButton);

            // // Thêm cell vào hàng
            row.appendChild(actionCell);
            
            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Đã xảy ra lỗi khi lấy chi tiết hóa đơn:', error);
    });

