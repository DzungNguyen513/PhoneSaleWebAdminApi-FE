import api from '../../Base-url/Url.js'

const apiUrl = api;

// Hàm gửi yêu cầu đăng ký tới API
async function registerCustomer(model) {
    try {
        const response = await fetch(`${apiUrl}Customer/Register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(model)
        });

        if (!response.ok) {
            alert('Đăng ký thất bại do đã tồn tại tài khoản')
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
        else {
            alert('đăng ký tài khoản thành công')
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error registering customer:', error.message);
        throw error;
    }
}

// Sử dụng hàm registerCustomer để đăng ký khách hàng mới
const registerButton = document.querySelector('#signUp');

registerButton.addEventListener('click', async function() {
    const emailInput = document.getElementById('exampleInputEmail1').value;
    const passwordInput = document.getElementById('exampleInputPassword1').value;

    const registerModel = {
        email: emailInput,
        password: passwordInput
    };

    try {
        const registrationResult = await registerCustomer(registerModel);
        console.log('Registration successful:', registrationResult);
    } catch (error) {
        console.error('Registration failed:', error.message);
    }
});