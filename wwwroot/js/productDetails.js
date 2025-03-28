$(document).ready(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (productId) {
        fetchProductDetails(productId);
    }
});

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