$(document).ready(function () {
    var token;
    $('#language').selectpicker();
    getProduct();

    toastr.options = {
        "closeButton": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "timeOut": "2000",
        "showDuration": "300",
        "hideDuration": "1000",
        "extendedTimeOut": "1000"
    };

    $("#loginForm").submit(function (e) {
        e.preventDefault();

        let email = $("#email").val();
        let password = $("#password").val();
        let role = $("#hdUserRole").val();
        $.ajax({
            url: "https://localhost:7232/api/User/loginUser",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                email: email,
                password: password,
                confirmPassword: password,
                role: role
            }),
            success: function (response) {
                toastr.success("Login successful!");
                if (response.jwtToken) {
                    // Store the token in localStorage
                    localStorage.setItem("jwtToken", response.jwtToken);
                }
                setTimeout(() => {
                    if (role == "User") {
                        window.location.href = "/Home/Index";
                    }
                    else {
                        window.location.href = "/Admin/Index";
                    }
                }, 1000);
            },
            error: function (xhr) {
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    toastr.error(xhr.responseJSON.message);
                } else {
                    toastr.error("An unexpected error occurred.");
                }
            }
        });
    });

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        fetchProductDetails(productId);
    }

    $("#addProductForm").submit((e) => {
        e.preventDefault();

        let formData = new FormData();
        formData.append("Title", $("#title").val().trim());
        formData.append("Author", $("#author").val().trim());
        formData.append("Price", $("#price").val().trim());
        formData.append("Category", $("#category").val().trim());

        $('#language').selectpicker('val').forEach(language => {
            formData.append('Language', language);  
        });

        formData.append("StockQuantity", $("#stock").val().trim());
        formData.append("PageCount", $("#pageCount").val().trim());
        formData.append("IsBestSeller", $("#isBestSeller").is(":checked"));
        formData.append("Description", $("#description").val().trim());

        formData.append("ProductImage", $("#productImage")[0].files[0]);
        formData.append("ProductPdf", $("#productPdf")[0].files[0]);

        let token = localStorage.getItem("jwtToken");

        if (!token) {
            toastr.error("Please log in first.");
            return;
        }

        $.ajax({
            type: "POST",
            url: "https://localhost:7232/api/products/addproducts",
            headers: {
                'Authorization': 'Bearer ' + token
            },
            processData: false,  
            contentType: false,
            data: formData,
            dataType: 'json',
            
            success: (response) => {
                console.log(response);
                if (response.message === "Product added successfully") {
                    $("#toastMessage").show();
                    setTimeout(() => {
                        $("#toastMessage").hide();
                    }, 3000);
                }
            },
            error: (err) => {
                console.log("Error:", err);
                if (err.status === 401) {
                    toastr.error("Unauthorized access. Please log in again.");
                    window.location.href = "/Account/Login"; 
                } else {
                    toastr.error("An error occurred while adding the product.");
                }
            }
        });

    });

});

const getProduct = () => {
    $.ajax({
        method: "GET",
        url: "https://localhost:7232/api/products",
        contentType: "application/json",
        success: (response) => {
            console.log(response);
            displayProducts(response);
        },
        error: (err) => {
            console.log("Error:", err);
        }
    });
};

const displayProducts = (products) => {
    let productHtml = "";
    products.forEach(product => {
        productHtml += `
                            <div class="card">
                                <img src="${product.imageUrl}" alt="${product.title}">
                                <div class="title">${product.title}</div>
                                <div class="author">by ${product.author}</div>
                                <div class="price">$${product.price}</div>
                                <a href="Home/ProductDetails?id=${product.id}"  class="btn" target="_blank">
                                    <i class="fas fa-book"></i> Read Now
                                </a>
                            </div>
                        `;
    });
    $("#productContainer").html(productHtml);
};
const getProductDetailsById = (Id) => {
    $.ajax({
        method: "GET",
        url: "https://localhost:7232/api/products/" + Id,
        contentType: "application/json",
        success: (response) => {
            console.log(response);
            displayProducts(response);
        },
        error: (err) => {
            console.log("Error:", err);
        }
    });
};
function fetchProductDetails(id) {
    $.ajax({
        method: "GET",
        url: `https://localhost:7232/api/products/${id}`,
        contentType: "application/json",
        success: (product) => {
            $("#productImage").attr("src", product.imageUrl);
            $("#productTitle").text(product.title);
            $("#productAuthor").text("Author: " + product.author);
            $("#productCategory").text("Category: " + product.category);
            $("#productLanguage").text("Language: " + product.language);
            $("#productPageCount").text("Pages: " + product.pageCount);
            $("#productPrice").text("Price: ₹" + product.price);
            $("#productDescription").text(product.description);
            $("#productPdf").attr("href", product.pdfUrl);

            $("#addToCart").click(() => addToCart(product.id));
            $("#buyNow").click(() => buyNow(product.id));
        }
    });
}

function addToCart(productId) {
    alert(`Product ${productId} added to cart!`);
}

function buyNow(productId) {
    alert(`Proceeding to checkout for product ${productId}`);
}