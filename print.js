var printButton = document.getElementById('print-button');
printButton.addEventListener('click', function() {
  // Call a function to start the print process
  printMap();
});

// Function to initiate the print process
function printMap() {
  // Create an image of the map using a print service
  var printServiceUrl = 'http://127.0.0.1:5500/index.html';
  var printRequest = new XMLHttpRequest();
  
  // Set up the request
  printRequest.open('GET', printServiceUrl, true);
  printRequest.responseType = 'blob';
  
  // Handle the response
  printRequest.onload = function() {
    if (printRequest.status === 200) {
      // Create a URL for the image blob
      var imageUrl = URL.createObjectURL(printRequest.response);
      
      // Open a new window or modal with the image
      var printWindow = window.open('', '_blank');
      printWindow.document.write('<img src="' + imageUrl + '">');
    } else {
      console.error('Print service request failed');
    }
  };
  
  // Send the request
  printRequest.send();
}