
import api from '../../Base-url/Url.js'

function start() {
    handleCreateAccount()//tạo tk
    //GetProducts(RenderProducts)
}
start()
//tạo tài khoản-------------------------------------------------------------------------
var apiURL = `${api}Register/register`
function CreateAccount(data, callback) {
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }
    fetch(apiURL, options)
        .then(function (response) {
            return response.json()
        })
        .then(callback)

}

function handleCreateAccount() {
    var btnCreate = document.querySelector('#signUp')
    btnCreate.onclick = function () {
        var username = document.querySelector('#exampleInputUsername1').value
        var password = document.querySelector("#exampleInputPassword1").value
        var data = {
            username: username,
            password: password
        }
        CreateAccount(data, function (response) {
            alert(response); // Hiển thị phản hồi từ máy chủ
        });
    }
}
//------------------------------------------------------------------------------------------------
// lấy sản phẩm và hiển thị
// console.log('ok')
// alert('ok')
// function startProducts() {
//     GetProducts(RenderProducts);
// }

// startProducts();

// var productURL = `${api}Product`;
// function GetProducts(callback) {
//     fetch(productURL)
//         .then(function (response) {
//             return response.json();
//         })
//         .then(callback)
//         .catch(function (error) {
//             console.error('Error fetching product data:', error);
//         });
// }

// function RenderProducts(listProducts) {
//     var products = document.querySelector('#list-products');
//     var htmls = listProducts.map(function (product) {
//         return `
//             <div class="product">
//                 <h2>${product.ProductName}</h2>
//                 <p>Storage: ${product.StorageGB}GB</p>
//                 <p>Color: ${product.ColorName}</p>
//                 <p>Amount: ${product.Amount}</p>
//                 <p>Price: ${product.Price}</p>
//                 <p>Category ID: ${product.CategoryId}</p>
//                 <p>Vendor ID: ${product.VendorId}</p>
//                 <p>Detail: ${product.Detail}</p>
//                 <p>Status: ${product.Status}</p>
//             </div>
//         `;
//     });
//     products.innerHTML = htmls.join('');
// }

