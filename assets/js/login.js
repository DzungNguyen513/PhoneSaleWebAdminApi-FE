    document.addEventListener('DOMContentLoaded', function () {
      const loginForm = document.getElementById('loginForm');
  
      loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();
  
        const userName = document.getElementById('userName').value;
        const password = document.getElementById('password').value;

        // Kiểm tra xem các ô đã được điền đầy đủ chưa
        if (userName.trim() === '' || password.trim() === '') {
          alert('Vui lòng nhập đầy đủ thông tin tài khoản và mật khẩu.');
          return; // Dừng việc xử lý đăng nhập nếu thông tin không hợp lệ
        }
  
        const formData = {
          UserName: userName,
          Password: password
        };
  
        try {
          const response = await fetch(`http://192.168.1.4:7244/api/Login/LoginAccount`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
  
          const data = await response.json();
  
          if (response.ok) {
            alert('Đăng nhập thành công');
            // Redirect or do something upon successful login
            window.location.href = 'http://127.0.0.1:5500/index.html';

          } else {
            alert(data.message || 'Đăng nhập thất bại do sai tài khoản hoặc mật khẩu');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Đã có lỗi xảy ra');
        }
      });
    });

