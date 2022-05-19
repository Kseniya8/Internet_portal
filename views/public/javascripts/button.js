function terms_changed(termsCheckBox) {
    //If the checkbox has been checked
    if(termsCheckBox.checked){
        //Set the disabled property to FALSE and enable the button.
        document.getElementById("form-button").disabled = false;
    } 
    else{
        //Otherwise, disable the submit button.
        document.getElementById("form-button").disabled = true;
    }
    }