import api from '../../Base-url/Url.js'

const apiUrl = api;

document.getElementById('createAccountForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const userName = document.getElementById('userName').value;
    const passWord = document.getElementById('passWord').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Kiểm tra xem các trường đều đã được nhập đúng cách
    if (userName.trim() === '' || passWord.trim() === '' || confirmPassword.trim() === '') {
        alert('Vui lòng nhập đủ thông tin');
        return; // Dừng hàm và không tiếp tục thực hiện yêu cầu tạo tài khoản
    }

    // Kiểm tra xem mật khẩu và xác nhận mật khẩu khớp nhau
    if (passWord !== confirmPassword) {
        alert('Mật khẩu và xác nhận mật khẩu không khớp nhau');
        return; // Dừng hàm và không tiếp tục thực hiện yêu cầu tạo tài khoản
    }

    // Tiếp tục thực hiện yêu cầu tạo tài khoản khi thông tin hợp lệ
    const formData = {
        userName: userName,
        passWord: passWord,
    };

    try {
        const response = await fetch(`${apiUrl}Account/CreateAccount`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Failed to create account');
        }

        const data = await response.json();
        console.log('Account created successfully:', data);
        alert('Thêm tài khoản thành công');
    } catch (error) {
        console.error('Error creating account:', error);
        alert('Lỗi không thể tạo được tài khoản');
    }
});
