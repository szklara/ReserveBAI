$(document).ready(function () {
    db = initializeDb();
    getPlaceDetails(findGetParameter('place'), findGetParameter('date'));

});