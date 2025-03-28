$(document).ready(function () {
    toastr.options = {
        "closeButton": true,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "timeOut": "2000", // 2 seconds
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
                if (response.token) {
                    localStorage.setItem("jwtToken", response.token);
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
});