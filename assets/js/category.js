import api from '../../Base-url/Url.js'

fetch(`${api}Categories`)
    .then(response => response.json())
    .then(data => {
        const categoryList = document.getElementById('categoryList');
        data.forEach(category => {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.textContent = category.categoryName;
            link.href = '#';
            li.appendChild(link);
            categoryList.appendChild(li);
        });
    })
    .catch(error => {
        console.error('Đã xảy ra lỗi khi lấy danh sách category:', error);
    });