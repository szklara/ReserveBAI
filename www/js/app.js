function displayServices() {

    $.getJSON("data/services.json", function (data) {
        var items = [];
        $.each(data, function (key, val) {
            items.push("<div class=\"col-lg-4 col-md-6 mb-2\">\n" +
                "        <div class=\"view\">\n" +
                "            <a href=\"list.html?service=" + val.id + "&city=" + getActiveCity() + "\">\n" +
                "            <img src=\"" + val.img + "\" class=\"img-fluid\" alt=\"service logo\">\n" +
                "            <div class=\"mask flex-center waves-effect waves-light rgba-teal-light\">\n" +
                "                <p class=\"white-text\">" + val.name + "</p>\n" +
                "            </div>\n" +
                "            </a>\n" +
                "        </div>\n" +
                "    </div>");
        });

        $(items.join("")).appendTo("#services");
    });
}

function updateCityName() {

    var activeCity = getActiveCity();

    $.getJSON("data/cities.json", function (data) {
        var items = [];
        $.each(data, function (key, val) {
            if (val.id == activeCity) {
                $('#cityPicker').text(val.name);
            }
            items.push('<a class="dropdown-item" href="#" onclick="changeCity(' + val.id + ')">' + val.name + '</a>');
        });
        $(items.join("")).appendTo("#cityDropdownList");

    });
}

function changeCity(id) {
    window.location.replace(updateURLParameter(window.location.href, 'city', id));
}
function changeDate() {
    var date = $('#input_datepicker').val();
    window.location.replace(updateURLParameter(window.location.href, 'date', date));
}


function getActiveCity() {
    var city = findGetParameter('city');
    return city ? city : 1;
}

function redirectToMain() {
    window.location.replace('index.html?city=' + getActiveCity());
}

function ratePlace(){
    var place_id = $('#formPlaceID').val();
    var rating = $('#formRating').val();
    if(rating > 5 || rating < 1){
        alert('Wybierz ocenę z przedziału od 1 do 5');
        return false;
    }
    var placeRef = db.collection('places').doc(place_id);
     placeRef.get().then((collection) => {
        place = Object.values([collection].reduce((res, item) => ({...res, [item.id]: item.data()}), {}));
        var new_rating = ((place[0].rating*place[0].votes)+ parseInt(rating)) / (place[0].votes + 1);
        placeRef.set({
            rating: new_rating,
            votes: place[0].votes + 1
        }, {merge: true}).then(function() {
            alert('Ocena została dodana');
            location.reload();

        })
    })

}



function showRateModal(){
    var place_id = findGetParameter('place');
    $('#formPlaceID').val(place_id);
    $('#modalRate').modal('show');
}



function showReserveModal(place_id, date, time){
    $('#formPlaceID').val(place_id);
    $('#formDate').val(date);
    $('#formTime').val(time);
    $('#modalReserve').modal('show');
}

function getPlaceSchedule(place_id, date){
    db.collection("schedules").where("date", "==", date).where("place_id", "==", place_id).get().then((collection) => {
        renderSchedule(collection.docs.reduce((res, item) => ({...res, [item.id]: item.data()}), {}), date, place_id);
    })
}

function reserve(){
    var place_id =  $('#formPlaceID').val();
    var date =  $('#formDate').val();
    var time =  $('#formTime').val();
    var name =  $('#formName').val();
    var email =  $('#formEmail').val();
    if (name === '' || email === '') {
        alert('Podaj imię oraz nazwisko')
    } else {
        db.collection("schedules").add({
            date: date,
            time: time,
            place_id: place_id,
            name: name,
            email: email
        })
            .then(function (docRef) {
                alert('Dokonano rezerwacji');
                console.log("Document written with ID: ", docRef.id);
                location.reload();
            })
            .catch(function (error) {
                alert("Błąd podczas dodawania rezerwacji");
            });
    }
}

function renderSchedule(data, date, place_id) {
    var key = Object.keys(data);
    var results = Object.values(data);
    var i;
    var items = [];

    for(i=8; i<=20; i++) {
        var prefix = '';
        if(i < 10){
           prefix = '0'
        }
        if(findObjectByKey(results, 'time', prefix+i+':00')){
            items.push('<tr>\n' +
                '                <td>'+prefix+i+':00</td>\n' +
                '                <td class="text-center">---</td>\n' +
                '            </tr>')
        }else{
            items.push('<tr>\n' +
                '                <td>'+ prefix+i+':00</td>\n' +
                '                <td class="td-btn text-center">\n' +
                '                    <button type="button" class="btn btn-sm btn-primary" onclick="showReserveModal(\''+place_id+'\', \''+ date +'\', \''+ prefix+i+':00\')">Rezerwuj</button>\n' +
                '                </td>\n' +
                '            </tr>')
        }
    }
    $("#schedule").html(items.join(""));


}

function getPlaceDetails(place_id, date){
    db.collection("places").doc(place_id).get().then((collection) => {
        renderPlace([collection].reduce((res, item) => ({...res, [item.id]: item.data()}), {}), date);
    })
}

function renderPlace(data, date) {
    var key = Object.keys(data);
    var place =  Object.values(data);
    var items = [];

    items.push('<div class="container text-center">\n' +
        '        <h3>'+ place[0].name + '</h3>\n' +
        '       <h6 class="grey-text py-2">'+ parseFloat(place[0].rating).toFixed(1) +' - '+ place[0].votes +' opinii</h6>\n' +
        '        <p><i class="fas fa-map-marker"></i> '+ place[0].address+'</p>\n' +
        '    </div>\n' +
        '    <div class="view">\n' +
        '        <img src="'+ place[0].img +'"\n' +
        '             class="img-fluid" alt="placeholder">\n' +
        '    </div>\n' +
        '\n' +
        '    <div class="container text-center">\n' +
        '\n' +
        '        <hr/>\n' +
        '        <h5>Usługi</h5>\n' +
        '        <hr/>\n' +
        '\n' +
        '        <table class="table">\n' +
        '\n' +
        '            <!--Table head-->\n' +
        '            <thead>\n' +
        '            <tr>\n' +
        '                <th>Nazwa</th>\n' +
        '                <th>Cena</th>\n' +
        '            </tr>\n' +
        '            </thead>\n' +
        '            <!--Table head-->\n' +
        '            <!--Table body-->\n' +
        '            <tbody>');

    $.each(place[0].services, function (key, val) {
        items.push('<tr>\n' +
            '                <td>'+ val.name +'</td>\n' +
            '                <td>'+ val.price +' zł</td>\n' +
            '            </tr>');

    });

    items.push('</tbody>\n' +
        '        </table>\n' +
        '        <a href="reserve.html?place='+ key[0] +'&date='+date+'"><button type="button" class="btn btn-primary">Rezerwuj</button></a> </div>');

    $("#placeDetails").html(items.join(""));
}


function findPlaces() {
    var city = getActiveCity();
    var date = $('#input_datepicker').val();
    var time = $('#input_starttime').val();
    var category_id = findGetParameter('service');
    var places = {};

    if (time === '' || date === '') {
        alert('Podaj datę oraz czas')
    } else {
        // initialize spinner
        $("#searchResults").html('<i class="fas fa-circle-notch fa-spin"></i>');
        // https://stackoverflow.com/a/49000491
        db.collection("places").where("city", "==", city).where("category", "==", category_id).get().then((collection) => {
            places = collection.docs.reduce((res, item) => ({...res, [item.id]: item.data()}), {});
        db.collection("schedules").where("date", "==", date).where("time", "==", time).get().then((collection) => {
            var schedules = collection.docs.reduce((res, item) => ({...res, [item.id]: item.data()}), {});

            const countPlaces = Object.values(places).length;
            const countSchedules = Object.values(schedules).length;
            if(!countSchedules){
                renderPlaces(places, city, date);
            }else{
                Object.keys(places).forEach(function(key,index) {
                    if(findObjectByKey(Object.values(schedules), 'place_id', key)){
                        delete places[key];
                        if(index == countPlaces - 1){
                           renderPlaces(places, city, date);
                        }
                    }
                });
            }
    })
    })
    }
}
function renderPlaces(places, city, date){
    if($.isEmptyObject(places)){
        $("#searchResults").text("Brak wyników wyszukiwania");
    }else{
        var items = [];
        $.each(places, function (key, val) {
            items.push('<div class="card">\n' +
                '        <a href="details.html?city='+ city +'&date='+ date +'&place='+ key +'">\n' +
                '            <!-- Card image -->\n' +
                '            <img class="card-img-top"\n' +
                '                 src="'+val.img+'"\n' +
                '                 alt="Card image cap">\n' +
                '        </a>\n' +
                '            <!-- Card content -->\n' +
                '            <div class="card-body">\n' +
                '\n' +
                '                <!-- Title -->\n' +
                '                <h6 class="card-title"><a class="black-text" href="details.html?city='+ city +'&date='+ date +'&place='+ key +'">'+ val.name +'</a> <span class="grey-text py-2">('+  parseFloat(val.rating).toFixed(1) +' - ' + val.votes +' opinii)</span></h6>\n' +
                '                <!-- Text -->\n' +
                '                <p class="card-text"><i class="fas fa-map-marker"></i> '+ val.address +'</p>\n' +
                '                <!-- Button -->\n' +
                '            </div>\n' +
                '        </a>\n' +
                '    </div>');
        });
        $("#searchResults").html(items.join(""));
    }
}

function initializeDb(){
    var config = {
        apiKey: "AIzaSyBS87PlmLxHd0Quw29nvfGFdqftw72fcnI",
        authDomain: "moj-niesamowity-projekt-3c989.firebaseapp.com",
        databaseURL: "https://moj-niesamowity-projekt-3c989.firebaseio.com",
        projectId: "moj-niesamowity-projekt-3c989",
        storageBucket: "moj-niesamowity-projekt-3c989.appspot.com",
        messagingSenderId: "322177020460"
    };
    firebase.initializeApp(config);
    var db = firebase.firestore();
    return db
}



function findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
}


// https://stackoverflow.com/a/5448595
function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    }
    return result;
}

// https://stackoverflow.com/a/10997390
function updateURLParameter(url, param, paramVal) {
    var TheAnchor = null;
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";

    if (additionalURL) {
        var tmpAnchor = additionalURL.split("#");
        var TheParams = tmpAnchor[0];
        TheAnchor = tmpAnchor[1];
        if (TheAnchor)
            additionalURL = TheParams;

        tempArray = additionalURL.split("&");

        for (var i = 0; i < tempArray.length; i++) {
            if (tempArray[i].split('=')[0] != param) {
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }
    else {
        var tmpAnchor = baseURL.split("#");
        var TheParams = tmpAnchor[0];
        TheAnchor = tmpAnchor[1];

        if (TheParams)
            baseURL = TheParams;
    }

    if (TheAnchor)
        paramVal += "#" + TheAnchor;

    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}