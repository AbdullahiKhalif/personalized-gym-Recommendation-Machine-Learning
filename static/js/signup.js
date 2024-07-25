$("#form").on("submit", function(event) {
            event.preventDefault();
            var fullName = $("#fullName").val();
            var address = $("#address").val();
            var email = $("#email").val();
            var password = $("#password").val();
            var confirmPassword = $("#confirmPassword").val();

            if(fullName == ""){
                showErrorToast("Your name is required! please enter.")
                return;
            }
            else if(address == ""){
                showErrorToast("Your address is required! please enter your address location.")
                return;
            }
            else if(email == ""){
                showErrorToast("Your email is required! please enter your email.")
                return;
            }
            else if(password == ""){
                showErrorToast("Password required! please enter.")
                return;
            }
            else if(confirmPassword != password){

                showErrorToast("Confirm password must match your password!")
                return;

            }

            $.ajax({
                type: 'POST',
                url: '/signup',
                data: $('#form').serialize(),
                success: function(response) {
                    if(response.error) {
                        const Toast = Swal.mixin({
                        toast: true,
                        position: "top-right",
                        showConfirmButton: false,
                        timer: 2000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.onmouseenter = Swal.stopTimer;
                            toast.onmouseleave = Swal.resumeTimer;
                        }
                    });
                    Toast.fire({
                        icon: "error",
                        title: response.error
                    });
                    return;
                    }
                    // redirect home page
                    window.location.href = "/login";
                },

       })
 });



function showErrorToast(message) {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-right",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        }
    });
    Toast.fire({
        icon: "error",
        title: message
    });
}