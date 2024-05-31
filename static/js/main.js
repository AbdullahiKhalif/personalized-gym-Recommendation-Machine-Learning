//let burger = document.querySelector(".fa-bars");
//let navigationBar = document.querySelector(".navigation-bar");
//burger.addEventListener("click", () => {
//    navigationBar.classList.toggle("active");
//});



$('#form').submit(function(event) {
    event.preventDefault();
    // Get form data
    var age = $("#age").val();
    var height = $("#height").val();
    var weight = $("#weight").val();
    var sex = $("#sex").val();
    var hypertension = $("#hypertension").val();
    var diabetes = $("#diabetes").val();
    var gender = "";
    var hasHypertension = "";
    var hasDiabetes = "";

    // Perform form validation
    if (age === "") {
        showErrorToast("Age is required please!");
        return;
    }
    else if (!Number.isInteger(age) && age <= 0) {
        showErrorToast("Invalid Age please enter valid age ");
        return;
    }

    else if (age < 14 || age > 63) {
        showErrorToast("Age must be between 14 and 63");
        return;
    } else if (height === "") {
        showErrorToast("Height is required please!");
        return;
    } else if (height < 1 || height > 2) {
        showErrorToast("Please enter a valid height (between 1 and 2 meters)");
        return;
    } else if (weight === "") {
        showErrorToast("Weight is required please!");
        return;
    } else if (weight < 30) {
        showErrorToast("Sorry, you cannot use this system because your weight is less than 30 kg");
        return;
    }
    if(sex == 0){
        gender = "Female";
    }
    if(sex == 1){
        gender = "Male";
    }
    if(hypertension == 0){
        hasHypertension = "Negative";
    }
    if(hypertension == 1){
        hasHypertension = "Positive";
    }
    if(hasDiabetes == 0){
        hasDiabetes = "Negative";
    }
    if(diabetes == 1){
        hasDiabetes = "Positive";
    }

    // If all validations pass, submit the form via AJAX
    $.ajax({
        type: 'POST',
        url: '/predict',
        data: $('#form').serialize(),
        success: function(response) {
            // Display the recommendation
            var html = `
             <div class="container-fluid p-4" style="background-color: #A75DB4; min-height: 80vh;">
                <h2 class="fw-bold p-2 display-6 text-center text-light">Report</h2>
             <div class="container p-2" style="background-color: #fff;">

        <div class="row">
             <div class="col-sm-12">

                                <div class="card" style="min-height:100vh;">
                                <div class="table-responsive p-1"  id="printArea">

                                    <table class="table" style="font-size: 15px;">
                                        <tbody>
                                            <tr>
                                                <td class="fw-bold">Your Name:</td>
                                                <td>${response.username}</td>
                                            </tr>
                                            <tr>
                                                <td class="fw-bold">Your Address:</td>
                                                <td>${response.address}</td>
                                            </tr>
                                            <tr>
                                                <td class="fw-bold">Your Email:</td>
                                                <td>${response.email}</td>
                                            </tr>

                                            <tr>
                                                <td class="fw-bold">Your Age:</td>
                                                <td>${age}</td>
                                            </tr>
                                            <tr>
                                                <td class="fw-bold">Your Height:</td>
                                                <td>${height}</td>
                                            </tr>
                                            <tr>
                                                <td class="fw-bold">Your Weight:</td>
                                                <td>${weight}</td>
                                            </tr>
                                            <tr>
                                                <td class="fw-bold">Your Sex:</td>
                                                <td>${gender}</td>
                                            </tr>
                                            <tr>
                                                <td class="fw-bold"> Hypertension?:</td>
                                                <td>${hasHypertension}</td>
                                            </tr>

                                            <tr>
                                                <td class="fw-bold">Diabetes?:</td>
                                                <td>${hasDiabetes}</td>
                                            </tr>


                                            <tr>
                                                <td class="fw-bold">Your BMI: </td>
                                                <td id="bmi"> ${response.bmi_prediction[0].toFixed(2)}</td>
                                            </tr>
                                            <tr>
                                                <td class="fw-bold">Your Standard Weight: </td>
                                                <td> ${response.bmi_prediction[1].toFixed(2)} (kg) -  ${response.bmi_prediction[2].toFixed(2) } (kg)</td>
                                            </tr>
                                            <tr>
                                                <td class="fw-bold">Your Level:</td>
                                                <td>${response.fitness_recommendation[0] }</td>
                                            </tr>
                                            <tr>
                                                <td class="fw-bold">Fat Percentage:</td>
                                                <td> ${response.bmi_prediction[3].toFixed(2) } </td>
                                            </tr>
                                            <tr>
                                                <td class="fw-bold">Your Fitness Gaol:</td>
                                                <td> ${response.fitness_recommendation[1]}</td>
                                            </tr>
                                            <tr>
                                                <td class="fw-bold">Your Fitness Type:</td>
                                                <td>${response.fitness_recommendation[2] }</td>
                                            </tr>
                                            <tr>
                                                <td class="fw-bold">Exercises: </td>
                                                <td>${response.fitness_recommendation[3] }</td>
                                            </tr>

                                            <tr>
                                                <td class="fw-bold">Equipment needed:</td>
                                                <td> ${response.fitness_recommendation[4] }</td>
                                            </tr>
                                            <tr>
                                                <td class="fw-bold">Diet:</td>
                                                <td>${response.fitness_recommendation[5] }</td>
                                            </tr>
                                            <tr>
                                                <td class="fw-bold">Conclusion and Recommendation: </td>
                                                <td>${response.fitness_recommendation[6] }</td>
                                            </tr>


                                        </tbody>
                                    </table>
                                </div>

                                </div>
                 <div class="mt-2 mb-2">
                     <button class="btn btn-success text-light" id="printStatement"><i class="fas fa-print text-light"></i> Print</button>
                     <button class="btn btn-info text-light" id="exportStatement"><i class="fas fa-file-excel text-light"></i> Export </button>
                 </div>
                            </div>
        </div>
        </div>
    </div>
            `;
           $('#result').html(html);
        },
        error: function(xhr, status, error) {
            // Handle error response
            showErrorToast("Error occurred during prediction: " + error);
        }
    });
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

$(document).on("click", "#printStatement", function(){
    printStatement();
});

$(document).on("click", "#exportStatement", function(event) {
    var file = new Blob([$("#printArea").html()], {type: "text/html"});
    var url = URL.createObjectURL(file);
    var a = $("<a />", {
        href: url,
        download: "Personal_Recommendation.xls"
    }).appendTo("body").get(0).click();
    event.preventDefault();
});


function printStatement(){
    let printArea = document.querySelector("#printArea");

    var newWindow = window.open("");
    newWindow.document.write(`<html><head><title>Report Recommendation Information</title>`);
    newWindow.document.write(`<style media="print">
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap');
    body{
        font-family: 'Poppins', sans-serif;
    }
    table{
        width: 100%;

    }
    h1{
        font-size: 22 !important;
        padding: 15px !important;
    }
    td.fw-bold{
//        background-color: #A75DB4 !important;
        color: #000 !important;
        font-size: 16px !important;
        font-weight: bold !important;
    }
    th , td{
        padding: 15px !important;
        text-align: left !important;
        border-bottom: 1px solid #ddd !important;
    }
    </style>`)
    newWindow.document.write(`</head><body>`)
    newWindow.document.write(printArea.innerHTML);
    newWindow.document.write(`</body></html>`);
    newWindow.print();
   newWindow.close();

}
