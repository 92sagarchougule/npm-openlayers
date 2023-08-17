
// function getoption() {
//     console.log("get!");
//     // Get Value and Text of Select Taluka
//     var taluka = document.querySelector("#taluka");
//     var value_taluka = taluka.value;
//     console.log('Selected Taluka Code is : '+ value_taluka)
    
//     var crop_name = document.querySelector("#crop_name");
//     var text = crop_name.value;
//     var value_crop_name = crop_name.value;
//     console.log('Selected Crop Name is : '+ value_crop_name)
    
//     var from_date = document.querySelector("#from-date");
//     var value_from_date = from_date.value;
//     console.log('From date value is : '+ value_from_date)
    
//     var to_date = document.querySelector("#to-date");
//     var value_to_date = to_date.value;
//     console.log('To date value is : '+ value_to_date);
// }

// // Attach the function to the global object (window)
// export { value_taluka, value_crop_name, value_from_date, value_to_date };

function getoption() {
    // Get Value and Text of Select Taluka
    var taluka = document.querySelector("#taluka");
    var value_taluka = taluka.value;
    
    var crop_name = document.querySelector("#crop_name");
    var text = crop_name.value;
    var value_crop_name = crop_name.value;
    
    var from_date = document.querySelector("#from-date");
    var value_from_date = from_date.value;
    
    var to_date = document.querySelector("#to-date");
    var value_to_date = to_date.value;
    
    // Return an object containing the values
    return {
        value_taluka,
        value_crop_name,
        value_from_date,
        value_to_date
    };
}

// Export the function
export { getoption };