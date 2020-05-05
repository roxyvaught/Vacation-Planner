var todayTemp = document.querySelector('#temperature'); //icon of todays weather
var todayConditions = document.querySelector('#conditions');//todays conditions
var forecast = document.querySelector('#forecastDiv'); //forecast
var todayImage = document.querySelector('#todayWeatherIcon');
var weatherApiKey =  '7f0033f9d596986b6d7fb538906b12a7';

// add current day
(function() {
    var now = moment().format('dddd, MMMM Do');
    var displayMoment = document.getElementById('currentDay');
    displayMoment.innerHTML = now;
  
    console.log(now);
  })();

//utility functions
var clearDiv =function(targetDiv){
    targetDiv.innerHTML='';
    //clears the div passed to it.
}

//creates URL from weather object
var iconUrl = function(code){
    var icode=code + '@2x.png';
    var urlstring = 'https://openweathermap.org/img/wn/' + icode;
    return(urlstring);
}

//takes text of float, converts to int.  Rounds. Converts back to text and returns
var roundTemp = function (tempString){
    var x = parseFloat(tempString);
    console.log(x);
    var x = Math.round(x);
    return(x.toString());

}
//takes unit time and returns Day of the week
var getDay =function (objdt){
    console.log(objdt);
    var a = new Date(objdt*1000);
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    var dayOfWeek = days[a.getDay()];
    return(dayOfWeek);
}


//populates html with data from weather fetch
var displayWeather  = function(weatherObj){
    console.log(weatherObj);
    
    clearDiv(todayTemp);
    clearDiv(todayConditions);
    clearDiv(todayImage);
    clearDiv(forecast);
    
    
    var iconsrc =iconUrl(weatherObj.current.weather[0].icon); 
    var todayIcon = document.createElement('img')
    todayIcon.setAttribute('src', iconsrc);
    todayIcon.setAttribute('id', 'todayTemp');
    todayImage.appendChild(todayIcon);
    todayTemp.innerText= roundTemp(weatherObj.current.temp) +' F';
    todayConditions.innerText=  weatherObj.current.weather[0].main ;

    var foreUl = document.createElement('ul');
    foreUl.setAttribute('style', 'list-style-type: none;');
    foreUl.className='foreCastUl';
        for(var i =1;i<4; i++){
        var li0 = document.createElement('li');
        var liImg = document.createElement('img');
        liImg.setAttribute('src',iconUrl(weatherObj.daily[i].weather[0].icon));
        li0.appendChild(liImg);
        var liP =document.createElement('p');
        liP.innerText= getDay(weatherObj.daily[i].dt) + ' ' + roundTemp(weatherObj.daily[i].temp.min) + '/' + roundTemp(weatherObj.daily[i].temp.max) +' F';
        li0.appendChild(liP);// 
        foreUl.appendChild(li0);
        }
    forecast.appendChild(foreUl);
}

var fetchLatLon = function (zipC){
    

    var endpointurl = "https://api.openweathermap.org/data/2.5/forecast?zip=" +zipC+"&appid="+weatherApiKey;

    
    fetch(endpointurl)
    .then(function(responce){ 
	return responce.json();
    })
    .then(function(responce){
        
        var citylat =  responce.city.coord.lat;
        var citylon =  responce.city.coord.lon;
	fetchWeather(citylat, citylon);
    })
    .catch (function(error){
    console.log(error) 
    })
}

var fetchWeather =function(lat, lon){
    
    var parkLat =lat;
    var parkLon = lon;
    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?";
    
    var weatherQ = '';
    
    weatherQ = weatherApiUrl +'lat=' + parkLat + '&lon=' + parkLon + '&appid=' + weatherApiKey +'&units=imperial';
   
   
    fetch(weatherQ)
    .then(function(res){
        return res.json();
    })
    .then(function(res){
        displayWeather(res);
    })
    .catch (function(error){
        console.log(error);
    })
}

$(document).foundation();
// Variables
var campgroundURL = "https://developer.nps.gov/api/v1/campgrounds?parkCode=bibe&api_key=VJ0LDmOeUdXZOUVYzYzkBagof6QaIk44zhLQ4jMo"
var natParks = [];
var writeLine = "";
var eventEl = document.getElementById("info-box-activities");
var stateModal = document.getElementById("choose-state");
var chosenState = document.getElementsByName("state");
var campGroundDiv = document.getElementById("campgroundInfo");

var displayCampGround =function(campObj){
    campGroundDiv.innerHTML='';
    if (campObj.data.length == 0){
        var noInfo = document.createElement('h4')
        noInfo.innerText="No campground information available.";
        campGroundDiv.appendChild(noInfo);
    }else {
        
        for (var i=0; i < campObj.data.length; i++){
            var campul =document.createElement('ul');
            campul.className='campUl';
            var campNameLi = document.createElement('li');
            var campName = document.createElement('h4');
            campName.innerText=campObj.data[i].name;
            campNameLi.appendChild(campName);
            campul.appendChild(campNameLi);
            campGroundDiv.appendChild(campul);
            var campdesc = document.createElement('li');
            campdesc.innerText = campObj.data[i].description;
            campul.appendChild(campdesc);
            var campfee = document.createElement('li');
            campfee.innerText= "Fees: " + campObj.data[i].fees[0].cost;
            campul.appendChild(campfee);
            console.log(campObj.data[i].reservationsurl)
            var campRes = document.createElement('li')
            if (campObj.data[i].reservationsurl == '' ){
                campRes.innerText = 'Reservation Link: Not available.';
                campul.appendChild(campRes);
            }
            else{
            var campRes = document.createElement('li');
              
            var liLink = document.createElement('a');
            var link = document.createTextNode("Reservation");
            liLink.appendChild(link);
            
            liLink.href = campObj.data[i].reservationsurl;
            liLink.setAttribute('target', "_blank");
            campRes.appendChild(liLink);
            
            campul.appendChild(campRes);


            }
        }

    }
}
var getPark = function(parkCode) {
    var parkURL = "https://developer.nps.gov/api/v1/parks?parkCode="+ parkCode +"&api_key=VJ0LDmOeUdXZOUVYzYzkBagof6QaIk44zhLQ4jMo&limit=500";

    $('#park-modal').foundation('close');
    
    fetch(parkURL)
        .then(function(response) {
            if (response.ok) {
                response.json()
                    .then(function(data) {
                        natParks = data.data;
                        console.log(data.data[0].images[0].url);
                        var theBody = document.getElementsByTagName("body");
                        //theBody.style = "background-image: url(" + data.data[0].images[0].url + ") no-repeat center center fixed;";
                        $('body').css("background-image", "url(" + data.data[0].images[0].url + ")");
                        //var theHeader = document.getElementsByTagName("header");
                        //theHeader.style = "background-image: url(" + data.data[0].images[0].url +");";
                    });
            }
        });
        

    var eventURL = "https://developer.nps.gov/api/v1/events?ParkCode=" + parkCode + "&api_key=VJ0LDmOeUdXZOUVYzYzkBagof6QaIk44zhLQ4jMo";
    fetch(eventURL)
        .then(function(response) {
            if (response.ok) {
                response.json()
                    .then(function(data) {
                        console.log(data.total);
                        if (data.total === '0') {
                            document.querySelector(".fi-mountains").innerHTML = "There are no events planned at this time."
                        }
                    });
            }
        });
   campgroundfetch = 'https://developer.nps.gov/api/v1/campgrounds?parkCode=' + parkCode + '&api_key=VJ0LDmOeUdXZOUVYzYzkBagof6QaIk44zhLQ4jMo';
   fetch(campgroundfetch)
        .then(function(response) {
           if (response.ok) {
              response.json()
                  .then(function(data2) {
                      displayCampGround(data2);
                     console.log(data2);
                  });
           }
        });

}




var stateModalHandler = function(event) {
    // cycle through all of the states and ...
    for (var i = 0; i < chosenState.length; i++) {
        // find out which one is maked and then...
        if (chosenState[i].checked) {
            // run the pullParksByState routine to populate the next modal
            pullParksByState(chosenState[i].value);
        }
    }
}

//getPark();
// listen to the 'Next' button on the stateModal form and fire stateModalHandler
stateModal.addEventListener("click", stateModalHandler);