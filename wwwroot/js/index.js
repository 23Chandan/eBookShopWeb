$(() => {
    getProduct();
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
        url: "https://localhost:7232/api/products/"+Id,
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