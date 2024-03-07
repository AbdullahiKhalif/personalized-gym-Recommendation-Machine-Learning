$("#printStatement").on("click",function(){
    printStatement();
})
$("#exportStatement").on("click",function(event){
    var file = new Blob([$("#printArea").html()], {type: "application/vnd.ms-excel"});
    var url = URL.createObjectURL(file);
    var a = $("<a />", {
        href: url,
        download: "Personal Recommendation.xls"
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

var btnOpenModal = document.querySelector("#btnOpenModal")
var formModal = document.querySelector("#formModal")
$("#btnOpenModal").on("click" ,function(){
    $("#formModal").modal("show");
    $(".modal-title").html("Enter Your Preferences 😍");
})

$("#userForm").on("submit", (e) =>{
    e.preventDefault();

    var age = $("#age").val();
    var height = $("#height").val();
    var weight = $("#weight").val();

        if(age === ""){

            displayMessage("error", "Age is required please!")

        return;
    }
    else if(age < 14){

              displayMessage("error", "Age must be range (14-63)")

        return;
    }
    else if(age < 1){

            displayMessage("error", "Invalid Age. Please enter valid age!")

        return;
    }

      else if(height === ""){

             displayMessage("error", "Height is required please!")

        return;
    }
      else if(height < 1){

             displayMessage("error", "Impossible height please enter valid height!")

        return;
    }
    else if(height > 2){

              displayMessage("error", "Impossible height please enter valid height! (Mater)")
        return;
    }
      else if(weight === ""){

              displayMessage("error", "Weight is required Please!)")

        return;
    }
      else if(weight < 30){

             displayMessage("error", "Sorry You cannot use this system because your less then 30")

        return;
    }else{
    // Set the form action and method
        $("#userForm").attr("action", "/predict");
        $("#userForm").attr("method", "POST");

    // Submit the form
    $("#userForm")[0].submit();
    displayMessage("success", "Successfully ✔ Show the recommendation😍")
    }
})

function displayMessage (type,message){
    var success = document.querySelector(".alert-success");
    var error = document.querySelector(".alert-danger");

    if(type == "success"){
        error.classList = "alert alert-danger d-none";
        success.classList = "alert alert-success";
        success.innerHTML = message;
        setTimeout(() =>{
            success.classList = "alert alert-success d-none";
            $("#userForm")[0].reset();
            $("#formModal").modal("hide");
        },2000)
    }else{
        error.classList = "alert alert-danger";
        error.innerHTML = message;
        setTimeout(function() {
            error.classList = "alert alert-danger d-none";
        },5000)
    }
}