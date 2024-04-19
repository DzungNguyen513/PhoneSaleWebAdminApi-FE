
//----------------------------------------------------------------------------------
// Hàm gửi yêu cầu đăng nhập
async function loginUser(email, password) {
    try {
        const response = await fetch('https://localhost:7244/api/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        });

        const responseData = await response.json();

        if (response.ok) {
            window.location.href = 'http://127.0.0.1:5500/index.html';
        } else {
            alert('Đăng nhập thất bại: ' + responseData.message);
        }
    } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
        alert('Đã xảy ra lỗi khi đăng nhập');
    }
}

// Sự kiện khi người dùng gửi biểu mẫu đăng nhập
document.querySelector('#loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    loginUser(email, password);
});
