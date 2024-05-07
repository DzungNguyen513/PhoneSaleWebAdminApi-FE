
import api from '../../Base-url/Url.js'
import formatDateTime from '../function/formatDateTime.js'

const apiUrl = api

async function getCategoryImage(categoryId) {
 try {
     const response = await fetch(`${apiUrl}Categories/GetCategoryImage/${categoryId}`);
     if (!response.ok) {
         throw new Error('Failed to get category image');
     }
     const imageData = await response.blob();
     return URL.createObjectURL(imageData);
 } catch (error) {
     console.error('Error getting category image:', error);
     throw error;
 }
}
let allCategories = []; // Mảng chứa tất cả các danh mục
fetch(`${apiUrl}Categories/GetCategories`)
.then(response => response.json())
.then(data => {
   allCategories = data; // Lưu trữ tất cả các danh mục
   const tableBody = document.querySelector('.table-category tbody');
   const itemsPerPageCategory = 2; // Số danh mục trên mỗi trang
   const totalPagesCategory = Math.ceil(data.length / itemsPerPageCategory); // Tổng số trang
   let currentPageCategory = 1; // Trang hiện tại

   // Hàm hiển thị danh mục trên trang hiện tại
  async function renderCategory(page) {
       tableBody.innerHTML = ''; // Xóa nội dung cũ
       const startIndex = (page - 1) * itemsPerPageCategory;
       const endIndex = page * itemsPerPageCategory;
       const categoriesToShow = data.slice(startIndex, endIndex);

       categoriesToShow.forEach( async category => {
           const row = document.createElement('tr');
           const categoryID = document.createElement('td');
           categoryID.textContent = category.categoryId; // Sử dụng categoryID thay vì categoryId
           row.appendChild(categoryID);

           const categoryName = document.createElement('td');
           categoryName.textContent = category.categoryName; 
           row.appendChild(categoryName);

           const categoryImage = document.createElement('td');
           if (category.categoryImage) { // Kiểm tra nếu có ảnh màu
               const image = document.createElement('img');
               try {
                   const imageUrl = await getCategoryImage(category.categoryId); // Lấy đường dẫn hình ảnh màu
                   image.src = imageUrl;
               } catch (error) {
                   console.error('Error getting category image:', error);
                   image.src = 'placeholder_image_url.jpg'; // Sử dụng ảnh mặc định hoặc placeholder
               }
               image.alt = "category Image";
               image.style.maxWidth = "100px";
               categoryImage.appendChild(image);
           } else {
               categoryImage.textContent = "No Image"; // Hiển thị thông báo nếu không có ảnh
           }
           row.appendChild(categoryImage);


           const categoryStatus = document.createElement('td');
           categoryStatus.textContent = category.status === 1 ? 'Đang hợp tác' : 'Đã ngừng hợp tác';
           categoryStatus.style.color = category.status === 1 ? 'green' : 'red';
           categoryStatus.style.fontWeight = 'bold'    
           row.appendChild(categoryStatus);

           const createAt = document.createElement('td');
           createAt.textContent = formatDateTime(category.createAt); 
           row.appendChild(createAt);

           const updateAt = document.createElement('td');
           updateAt.textContent = formatDateTime(category.updateAt); 
           row.appendChild(updateAt);

           // Tạo thẻ td để chứa các nút bấm
           const actionCell = document.createElement('td');

           // Tạo nút Edit
           const editLink = document.createElement('a');
           editLink.href = `http://127.0.0.1:5500/pages/ui-features/edit-category.html?id=${category.categoryId}`;
        
           editLink.className = 'Primary';
           const editIcon = document.createElement('i');
           editIcon.className = 'mdi mdi-pencil';
           editLink.appendChild(editIcon);
           actionCell.appendChild(editLink);

           // Tạo nút Delete
           const deleteLink = document.createElement('a');
           deleteLink.href = '#'; // Đặt href theo ý của bạn
           deleteLink.className = 'Danger';
           const deleteIcon = document.createElement('i');
           deleteIcon.className = 'mdi mdi-delete ml-3';
           deleteLink.appendChild(deleteIcon);
           deleteLink.addEventListener('click', function (event) {
               event.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>
               const confirmDelete = confirm('Bạn có muốn xóa danh mục này không?');
               if (confirmDelete) {
                   fetch(`${apiUrl}Categories/${category.categoryId}`, {
                       method: 'DELETE'
                   })
                       .then(response => {
                           if (!response.ok) {
                               throw new Error('Failed to delete category');
                           }
                           console.log('Category deleted successfully');
                           window.location.reload();
                       })
                       .catch(error => {
                           console.error('Error deleting category:', error);
                       });
               }
           });
           actionCell.appendChild(deleteLink);

           // Thêm cell vào hàng
           row.appendChild(actionCell);

           tableBody.appendChild(row);
       });
   }

   // Hàm tạo nút phân trang
   function createCategoryPaginationButtons() {
       const pagination = document.createElement('ul');
       pagination.className = 'pagination';

       for (let i = 1; i <= totalPagesCategory; i++) {
           const pageItem = document.createElement('li');
           pageItem.className = 'page-item';
           const pageLink = document.createElement('a');
           pageLink.className = 'page-link category';
           pageLink.textContent = i;
           pageLink.addEventListener('click', () => {
               currentPageCategory = i;
               renderCategory(currentPageCategory);
               updateCategoryPaginationUI();
           });
           pageItem.appendChild(pageLink);
           pagination.appendChild(pageItem);
       }

       document.querySelector('#categoryInfo').appendChild(pagination);
   }

   // Hàm cập nhật giao diện phân trang
   function updateCategoryPaginationUI() {
       const pageLinks = document.querySelectorAll('.page-link.category');
       pageLinks.forEach((link, index) => {
           if (index + 1 === currentPageCategory) {
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
   renderCategory(currentPageCategory);
   createCategoryPaginationButtons();
   updateCategoryPaginationUI();

})
.catch(error => {
   console.error('Đã xảy ra lỗi khi lấy danh sách danh mục:', error);
});


// danh mục màu

async function getColorImage(colorId) {
try {
   const response = await fetch(`${apiUrl}Colors/GetColorImage/${colorId}`);
   if (!response.ok) {
       throw new Error('Failed to get color image');
   }
   const imageData = await response.blob();
   return URL.createObjectURL(imageData);
} catch (error) {
   console.error('Error getting color image:', error);
   throw error;
}
}

fetch(`${apiUrl}Colors/GetColors`)
.then(response => response.json())
.then(data => {
   const tableBody = document.querySelector('.table-color tbody');
   const itemsPerPage = 5; // Số màu trên mỗi trang
   const totalPagesColor = Math.ceil(data.length / itemsPerPage); // Tổng số trang
   let currentPageColor = 1; // Trang hiện tại

   // Hàm hiển thị màu trên trang hiện tại
 async function renderColor(page) {
       tableBody.innerHTML = ''; // Xóa nội dung cũ
       const startIndex = (page - 1) * itemsPerPage;
       const endIndex = page * itemsPerPage;
       const colorsToShow = data.slice(startIndex, endIndex);

       colorsToShow.forEach(async color => {
           const row = document.createElement('tr');
           const colorID = document.createElement('td');
           colorID.textContent = color.colorName; // Sử dụng colorId thay vì colorId
           row.appendChild(colorID);

           const colorImage = document.createElement('td');
           if (color.colorImage) { // Kiểm tra nếu có ảnh màu
               const image = document.createElement('img');
               try {
                   const imageUrl = await getColorImage(color.colorName); // Lấy đường dẫn hình ảnh màu
                   image.src = imageUrl;
               } catch (error) {
                   console.error('Error getting color image:', error);
                   image.src = 'placeholder_image_url.jpg'; // Sử dụng ảnh mặc định hoặc placeholder
               }
               image.alt = "Color Image";
               image.style.maxWidth = "100px";
               colorImage.appendChild(image);
           } else {
               colorImage.textContent = "No Image"; // Hiển thị thông báo nếu không có ảnh
           }
           row.appendChild(colorImage);

           const colorPrice = document.createElement('td');
           colorPrice.textContent = color.colorPrice; 
           row.appendChild(colorPrice);

           const createAt = document.createElement('td');
           createAt.textContent = formatDateTime(color.createAt); 
           row.appendChild(createAt);

           const updateAt = document.createElement('td');
           updateAt.textContent = formatDateTime(color.updateAt); 
           row.appendChild(updateAt);

           // Tạo thẻ td để chứa các nút bấm
           const actionCell = document.createElement('td');

           // Tạo nút Edit
           const editLink = document.createElement('a');
           editLink.href = `http://127.0.0.1:5500/pages/ui-features/edit-color.html?id=${color.colorName}`;
           editLink.className = 'Primary';
           const editIcon = document.createElement('i');
           editIcon.className = 'mdi mdi-pencil';
           editLink.appendChild(editIcon);
           actionCell.appendChild(editLink);

           // Tạo nút Delete
           const deleteLink = document.createElement('a');
           deleteLink.href = '#'; // Đặt href theo ý của bạn
           deleteLink.className = 'Danger';
           const deleteIcon = document.createElement('i');
           deleteIcon.className = 'mdi mdi-delete ml-3';
           deleteLink.appendChild(deleteIcon);
           deleteLink.addEventListener('click', function (event) {
               event.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>
               const confirmDelete = confirm('Bạn có muốn xóa màu này không?');
               if (confirmDelete) {
                   fetch(`${apiUrl}Colors/${color.colorName}`, {
                       method: 'DELETE'
                   })
                       .then(response => {
                           if (!response.ok) {
                               throw new Error('Failed to delete color');
                           }
                           console.log('Color deleted successfully');
                           window.location.reload();
                       })
                       .catch(error => {
                           console.error('Error deleting color:', error);
                       });
               }
           });
           actionCell.appendChild(deleteLink);

           // Thêm cell vào hàng
           row.appendChild(actionCell);

           tableBody.appendChild(row);
       });
   }

   // Hàm tạo nút phân trang
   function createColorPaginationButtons() {
       const pagination = document.createElement('ul');
       pagination.className = 'pagination';

       for (let i = 1; i <= totalPagesColor; i++) {
           const pageItem = document.createElement('li');
           pageItem.className = 'page-item color';
           const pageLink = document.createElement('a');
           pageLink.className = 'page-link color';
           pageLink.textContent = i;
           pageLink.addEventListener('click', () => {
               currentPageColor = i;
               renderColor(currentPageColor);
               updateColorPaginationUI();
           });
           pageItem.appendChild(pageLink);
           pagination.appendChild(pageItem);
       }

       document.querySelector('#colorInfo').appendChild(pagination);
   }

   // Hàm cập nhật giao diện phân trang
   function updateColorPaginationUI() {
     const pageLinks = document.querySelectorAll('.page-link.color');
       pageLinks.forEach((link, index) => {
           if (index + 1 === currentPageColor) {
               link.classList.add('activeColor');
               link.style.backgroundColor = '#007bff';
               link.style.color = '#fff';
           } else {
               link.classList.remove('activeColor');
               link.style.backgroundColor = '';
               link.style.color = '';
           }
       });
   }

   //Khởi tạo
   renderColor(currentPageColor);
   createColorPaginationButtons();
   updateColorPaginationUI();
})
.catch(error => {
   console.error('Đã xảy ra lỗi khi lấy danh sách màu:', error);
});

//Danh mục dung lượng
fetch(`${apiUrl}Storages/GetStorages`)
.then(response => response.json())
.then(data => {
   const tableBody = document.querySelector('.table-storage tbody');
   const itemsPerPage = 3; // Số màu trên mỗi trang
   const totalPageStorage = Math.ceil(data.length / itemsPerPage); // Tổng số trang
   let currentPageStorage = 1; // Trang hiện tại

   // Hàm hiển thị màu trên trang hiện tại
   function renderStorage(page) {
       tableBody.innerHTML = ''; // Xóa nội dung cũ
       const startIndex = (page - 1) * itemsPerPage;
       const endIndex = page * itemsPerPage;
       const storageToShow = data.slice(startIndex, endIndex);

       storageToShow.forEach(storage => {
           const row = document.createElement('tr');
           const storageGB = document.createElement('td');
           storageGB.textContent = storage.storageGb; // Sử dụng colorId thay vì colorId
           row.appendChild(storageGB);

           const storagePrice = document.createElement('td');
           storagePrice.textContent = storage.storagePrice; 
           row.appendChild(storagePrice);

           const createAt = document.createElement('td');
           createAt.textContent = formatDateTime(storage.createAt); 
           row.appendChild(createAt);

           const updateAt = document.createElement('td');
           updateAt.textContent = formatDateTime(storage.updateAt); 
           row.appendChild(updateAt);

           // Tạo thẻ td để chứa các nút bấm
           const actionCell = document.createElement('td');

           // Tạo nút Edit
           const editLink = document.createElement('a');
           editLink.href = `http://127.0.0.1:5500/pages/ui-features/edit-storage.html?id=${storage.storageGb}`;
           editLink.className = 'Primary';
           const editIcon = document.createElement('i');
           editIcon.className = 'mdi mdi-pencil';
           editLink.appendChild(editIcon);
           actionCell.appendChild(editLink);

           // Tạo nút Delete
           const deleteLink = document.createElement('a');
           deleteLink.href = '#'; // Đặt href theo ý của bạn
           deleteLink.className = 'Danger';
           const deleteIcon = document.createElement('i');
           deleteIcon.className = 'mdi mdi-delete ml-3';
           deleteLink.appendChild(deleteIcon);
           deleteLink.addEventListener('click', function (event) {
               event.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>
               const confirmDelete = confirm('Bạn có muốn xóa Dung lượng này không?');
               if (confirmDelete) {
                   fetch(`${apiUrl}Storages/${storage.storageGb}`, {
                       method: 'DELETE'
                   })
                       .then(response => {
                           if (!response.ok) {
                               throw new Error('Failed to delete color');
                           }
                           console.log('Color deleted successfully');
                           window.location.reload();
                       })
                       .catch(error => {
                           console.error('Error deleting color:', error);
                       });
               }
           });
           actionCell.appendChild(deleteLink);

           // Thêm cell vào hàng
           row.appendChild(actionCell);

           tableBody.appendChild(row);
       });
   }

   // Hàm tạo nút phân trang
   function createStoragePaginationButtons() {
       const pagination = document.createElement('ul');
       pagination.className = 'pagination';

       for (let i = 1; i <= totalPageStorage; i++) {
           const pageItem = document.createElement('li');
           pageItem.className = 'page-item storage';
           const pageLink = document.createElement('a');
           pageLink.className = 'page-link storage';
           pageLink.textContent = i;
           pageLink.addEventListener('click', () => {
               currentPageStorage = i;
               renderStorage(currentPageStorage);
               updateStoragePaginationUI();
           });
           pageItem.appendChild(pageLink);
           pagination.appendChild(pageItem);
       }

       document.querySelector('#storageInfo').appendChild(pagination);
   }

   // Hàm cập nhật giao diện phân trang
   function updateStoragePaginationUI() {
     const pageLinks = document.querySelectorAll('.page-link.storage');
       pageLinks.forEach((link, index) => {
           if (index + 1 === currentPageStorage) {
               link.classList.add('activeStorage');
               link.style.backgroundColor = '#007bff';
               link.style.color = '#fff';
           } else {
               link.classList.remove('activeStorage');
               link.style.backgroundColor = '';
               link.style.color = '';
           }
       });
   }

   //Khởi tạo
   renderStorage(currentPageStorage);
   createStoragePaginationButtons();
   updateStoragePaginationUI();
})
.catch(error => {
   console.error('Đã xảy ra lỗi khi lấy danh sách màu:', error);
});

// nhà cung cấp
fetch(`${apiUrl}Vendors/GetVendors`)
.then(response => response.json())
.then(data => {
   const tableBody = document.querySelector('.table-vendor tbody');
   const itemsPerPage = 3; // Số màu trên mỗi trang
   const totalPageVendor = Math.ceil(data.length / itemsPerPage); // Tổng số trang
   let currentPageVendor = 1; // Trang hiện tại

   // Hàm hiển thị màu trên trang hiện tại
   function renderVendor(page) {
       tableBody.innerHTML = ''; // Xóa nội dung cũ
       const startIndex = (page - 1) * itemsPerPage;
       const endIndex = page * itemsPerPage;
       const vendorToShow = data.slice(startIndex, endIndex);

       vendorToShow.forEach(vendor => {
           const row = document.createElement('tr');
           const VendorID = document.createElement('td');
           VendorID.textContent = vendor.vendorId; // Sử dụng colorId thay vì colorId
           row.appendChild(VendorID);

           const VendorName = document.createElement('td');
           VendorName.textContent = vendor.vendorName; 
           row.appendChild(VendorName);

           const VendorAddress = document.createElement('td');
           VendorAddress.textContent = vendor.address; 
           row.appendChild(VendorAddress);

           const VendorPhone = document.createElement('td');
           VendorPhone.textContent = vendor.phoneNumber; 
           row.appendChild(VendorPhone);

           const VendorStatus = document.createElement('td');
           VendorStatus.textContent = vendor.status === 1 ? 'Đang hợp tác' : 'Đã ngừng hợp tác';
           VendorStatus.style.color = vendor.status === 1 ? 'green' : 'red';
           VendorStatus.style.fontWeight = 'bold'    
           row.appendChild(VendorStatus);

           const createAt = document.createElement('td');
           createAt.textContent = formatDateTime(vendor.createAt)
           row.appendChild(createAt);

           const updateAt = document.createElement('td');
           updateAt.textContent = formatDateTime(vendor.updateAt); 
           row.appendChild(updateAt);

           // Tạo thẻ td để chứa các nút bấm
           const actionCell = document.createElement('td');

           // Tạo nút Edit
           const editLink = document.createElement('a');
           editLink.href = `http://127.0.0.1:5500/pages/ui-features/edit-vendor.html?id=${vendor.vendorId}`;
           editLink.className = 'Primary';
           const editIcon = document.createElement('i');
           editIcon.className = 'mdi mdi-pencil';
           editLink.appendChild(editIcon);
           actionCell.appendChild(editLink);

           // Tạo nút Delete
           const deleteLink = document.createElement('a');
           deleteLink.href = '#'; // Đặt href theo ý của bạn
           deleteLink.className = 'Danger';
           const deleteIcon = document.createElement('i');
           deleteIcon.className = 'mdi mdi-delete ml-3';
           deleteLink.appendChild(deleteIcon);
           deleteLink.addEventListener('click', function (event) {
               event.preventDefault(); // Ngăn chặn hành động mặc định của thẻ <a>
               const confirmDelete = confirm('Bạn có muốn xóa nhà cung cấp này không?');
               if (confirmDelete) {
                   fetch(`${apiUrl}Vendors/${vendor.vendorId}`, {
                       method: 'DELETE'
                   })
                       .then(response => {
                           if (!response.ok) {
                               throw new Error('Failed to delete color');
                           }
                           console.log('Color deleted successfully');
                           window.location.reload();
                       })
                       .catch(error => {
                           console.error('Error deleting color:', error);
                       });
               }
           });
           actionCell.appendChild(deleteLink);

           // Thêm cell vào hàng
           row.appendChild(actionCell);

           tableBody.appendChild(row);
       });
   }

   // Hàm tạo nút phân trang
   function createVendorPaginationButtons() {
       const pagination = document.createElement('ul');
       pagination.className = 'pagination';

       for (let i = 1; i <= totalPageVendor; i++) {
           const pageItem = document.createElement('li');
           pageItem.className = 'page-item vendor';
           const pageLink = document.createElement('a');
           pageLink.className = 'page-link vendor';
           pageLink.textContent = i;
           pageLink.addEventListener('click', () => {
               currentPageVendor = i;
               renderVendor(currentPageVendor);
               updateVendorPaginationUI();
           });
           pageItem.appendChild(pageLink);
           pagination.appendChild(pageItem);
       }

       document.querySelector('#vendorInfo').appendChild(pagination);
   }

   // Hàm cập nhật giao diện phân trang
   function updateVendorPaginationUI() {
     const pageLinks = document.querySelectorAll('.page-link.vendor');
       pageLinks.forEach((link, index) => {
           if (index + 1 === currentPageVendor) {
               link.classList.add('activeVendor');
               link.style.backgroundColor = '#007bff';
               link.style.color = '#fff';
           } else {
               link.classList.remove('activeVendor');
               link.style.backgroundColor = '';
               link.style.color = '';
           }
       });
   }

   //Khởi tạo
   renderVendor(currentPageVendor);
   createVendorPaginationButtons();
   updateVendorPaginationUI();
})
.catch(error => {
   console.error('Đã xảy ra lỗi khi lấy danh sách màu:', error);
});
