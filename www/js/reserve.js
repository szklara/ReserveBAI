$(document).ready(function () {
    $('#dateButton').text(findGetParameter('date'));
    $('#input_datepicker').val(findGetParameter('date'));
    $('.datepicker').pickadate({
        selectMonths: true,
        selectYears: 2,
        min: true,
        format: 'yyyy-mm-dd',
    });
    db = initializeDb();
    getPlaceSchedule(findGetParameter('place'), findGetParameter('date'));
});