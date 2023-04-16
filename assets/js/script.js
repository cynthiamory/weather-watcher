// VARIABLES FOR SEARCH HISTORY
var lastSearched = ""
var searchHistory = []
    
// OPENWEATHER API CALL WITH API KEY
var getCityWeather = function(city) {
var callAPI = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=7625ef1742f636a13458c7866275f60a&units=imperial";

// FETCH METHOD TO REQUEST DATE FROM SERVER SIDE API
    fetch(callAPI)
       
// .THEN (PROMISE) TO MAKE A CALL BACK RETURN FUNCTION
    .then(function(response) {

    // POSITIVE RESPONSE
        if (response.ok) {response.json().then(function(data) {weatherDisplay(data);});

    // NEGATIVE RESPONSE
        } else {alert("Error: " + response.statusText);}})  

    // CATCH AN ERROR AND TRIGGER ALERT IF THERE IS NO RESPONSE FROM OPENWEATHER
        .catch(function(error) {alert("Error connecting to OpenWeather");})
    };

//SUBMIT FORM HANDLER
var searchHandler = function(event) {
    
// PREVENT THE WEBPAGE FROM REFRESHING
    event.preventDefault();

// RETRIEVE THE DATA FROM THE SEARCHED CITY
    var theCity = $("#thecity").val().trim();

// IF THE THE USER ENTERED A CITY TO SEARCH FIELD SECTION
    if(theCity) {
        
// PASS THE VALUE OF THE SEARCH ENTED TO THE FUNCTION BELOW
    getCityWeather(theCity);

// THEN CLEAR THE ENTRY FIELD
    $("#thecity").val("");

 // OR ELSE, IF NOTHING WAS ENTERED IN THE SEARCH FORM, TRIGGER AN ALERT PROMPT TO LET USER KNOW TO ENTER A CITY    
    } else {
        alert("Please Enter A City of Choice");
    }
};

// CODE FOR THE DATA COLLECTED FROM OPENWEATHER
var weatherDisplay = function(weatherData) {

// DISPLAY THE DATA IN THIS FORMAT
    $("#main-city-name").text(weatherData.name + " (" + dayjs(weatherData.dt * 1000).format("MM-D-YYYY") + ") ").append(`<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png"></img>`);
    $("#main-city-temp").text("Temperature: " + weatherData.main.temp.toFixed(1) + "°F");
    $("#main-city-humid").text("Humidity: " + weatherData.main.humidity + "%"); 
    $("#main-city-wind").text("Wind Speeds: " + weatherData.wind.speed.toFixed(1) + " mph");

// FETCH THE LATITUDE AND LONGITUDE FOR UV INDEX CALL REQUEST
    fetch("https://api.openweathermap.org/data/2.5/uvi?lat=" + weatherData.coord.lat + "&lon="+ weatherData.coord.lon + "&appid=7625ef1742f636a13458c7866275f60a")
    
 //PROMISE FUNCTION TO GET RESPONSE   
    .then(function(response) {
            response.json().then(function(data) {

// DATA INFO FOR UV INDEX 
    $("#uv-box").text(data.value);

// UV INDEX DATA VALUE - TO BE COLOUR CODED IN THE HIGHLIGHTED #HEXCODE DEPENDENT ON IF STATEMENT
    if(data.value >= 11) {
        $("#uv-box").css("background-color", "green")
    } else if (data.value < 11 && data.value >= 8) {
        $("#uv-box").css("background-color", "#yellow")
    } else if (data.value < 8 && data.value >= 6) {
        $("#uv-box").css("background-color", "blue")
    } else if (data.value < 6 && data.value >= 3) {
        $("#uv-box").css("background-color", "red")
    } else {
        $("#uv-box").css("background-color", "purple")
    }      
         })
    });

// FETCH DATA FROM API CALL TO GET THE 5 DAY FORCAST INFORMATION
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + weatherData.name + "&appid=7625ef1742f636a13458c7866275f60a&units=imperial")

//PROMISE FUNCTION TO GET RESPONSE      
    .then(function(response) {
        response.json().then(function(data) {

// CODE TO CLEAR ANY PREVIOUS DATA IN THE 5 DAY FORCAST
    $("#five-day").empty();

// FOR LOOP TO RETRIEVE DATA EVERY 24 HRS FROM THE API CALL
    for(i = 7; i <= data.list.length; i += 8){

// 5 DAY FORCAST CARD TEMPLATE TO BE FILLED WITH THE CORRESPONDING DATA
    var fiveDayCard =`
        <div class="col-md-2 card text-white bg-dark">
            <div class="card-body p-1">
                <h5 class="card-title">` + dayjs(data.list[i].dt * 1000).format("MM-DD-YYYY") + `</h5>
                <img src="https://openweathermap.org/img/wn/` + data.list[i].weather[0].icon + `.png" alt="rain">
                <p class="card-text">Temp: ` + data.list[i].main.temp + `</p>
                <p class="card-text">Humidity: ` + data.list[i].main.humidity + `</p>
            </div>
        </div>
        `;

// APPEND THE 5 DAY FORCAST WITH THE DAY
            $("#five-day").append(fiveDayCard);
        }
    })
});

// LOCAL STORAGE SECTION
// TO SAVE THE LAST SEARCHED CITY
    lastSearched = weatherData.name;

 // USE THE APIs NAME VALUE TO SAVE SEACH HISTORY      
    saveSearchHistory(weatherData.name);
    
};

// SAVE SEARCH HISTORY IN LOCAL STORAGE FUNCTION
var saveSearchHistory = function (city) {
    if(!searchHistory.includes(city)){
        searchHistory.push(city);
        $("#search-history").append("<a href='#' class='list-group-item list-group-item-action' id='" + city + "'>" + city + "</a>")
    } 

// HAVE THE ARRAY OF THE SEACH HISTORY SAVED IN TO THE LOCAL STORAGE
    localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));

// TO SAVE THE LAST SEARCH ITEM IN THE LOCAL STORAGE
    localStorage.setItem("lastSearched", JSON.stringify(lastSearched));

//DISPLAY OR LOAD THE SEARCHED HISTORY ARRAY
    loadSearchHistory();
};

// LOAD SAVED CITY HISTORY FROM THE LOCAL STORAGE FUNCITON
var loadSearchHistory = function() {
    searchHistory = JSON.parse(localStorage.getItem("weatherSearchHistory"));
    lastSearched = JSON.parse(localStorage.getItem("lastSearched"));
  
// THIS WILL ALLOW FOR AN EMPTY SEARCH HISTORY ARRAY AND LAST SEARCHED STRING IF NOTING IS IN THE LOCATL STORAGE.
    if (!searchHistory) {
        searchHistory = []
    }

    if (!lastSearched) {
        lastSearched = ""
    }

// CLEAR ALL PREVIOUS SEARCH HISTORY ITEMS FROM ITS LIST 
    $("#search-history").empty();

// THIS IS A FOR LOOP THAT WILL LOOP THROUGH ALL THE CITIES IN THE ARRAY
    for(i = 0 ; i < searchHistory.length ;i++) {

// THE CITIES IN THE SEARCH HISTORY LIST WILL BE A LINK IN WHICH YOU CAN CLICK TO RETIVE ITS WEATHER DATA
        $("#search-history").append("<a href='#' class='list-group-item list-group-item-action' id='" + searchHistory[i] + "'>" + searchHistory[i] + "</a>");
    }
  };

// LOAD THE SEARCHED HISTORY FROM THE LOCAL STORAGE
loadSearchHistory();

// IF THERE IS AN LAST CITY SEARCHED STRING, PULL THE DATA FOR THE LAST CITY AND DISPLAY
if (lastSearched != ""){
    getCityWeather(lastSearched);
}
// AN EVENT HANDLER TO GET THE ID VALUE OF THE LINKS, AND PASS ITS VALUE TO THE GETCITYWEATHER FUNCTION
$("#search-form").submit(searchHandler);
$("#search-history").on("click", function(event){
    var lastCity = $(event.target).closest("a").attr("id");
    getCityWeather(lastCity);
});