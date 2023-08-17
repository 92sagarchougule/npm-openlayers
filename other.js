// Maximum or To Date setting

window.onload = function() {
    var today = new Date().toISOString().split("T")[0];
    document.getElementById("dateInput").setAttribute("max", today);
};


