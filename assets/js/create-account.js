document.getElementById('createAccountForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const userName = document.getElementById('userName').value;
    const passWord = document.getElementById('passWord').value;
    const status = document.getElementById('status').value
    const formData = {
        userName: userName,
        passWord: passWord,
        status: status
    }
    const confirmPassword = document.getElementById('confirmPassword').value;
    if(passWord === confirmPassword){
        fetch('https://localhost:7244/api/Account', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)// biến thằng object thành JSON
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create account');
            }
            return response.json();
        })
        .then(data => {
            // Xử lý dữ liệu trả về nếu cần
            console.log('Account created successfully:', data);
            alert('Thêm tài khoản thành công');
        })
        .catch(error => {
            console.error('Error creating account:', error);
            alert('Lỗi không thể tạo được tài khoản');
        });
    }
    else{
        alert('Nhập sai mật khẩu nhập lại');
    }
    
});

