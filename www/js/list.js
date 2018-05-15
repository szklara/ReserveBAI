$(document).ready(function () {
    updateCityName();
    db = initializeDb();

    $('.datepicker').pickadate({
        selectMonths: true,
        selectYears: 2,
        min: true,
        format: 'yyyy-mm-dd',
    });
    $('.timepicker').pickatime({
        format: "HH:i",
        min: [6, 0],
        max: [22, 0],
        interval: 60
    })


});