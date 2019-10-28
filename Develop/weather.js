var currDate = moment().format('L');  // current date
var currCity = "Boston,us";       // current city (Boston is the default, if nothing in local storage)
var currTemp;                           // current temperature for current city
var currHumid;                           // current humidity for current city
var currWind;                           // current wind speed for current city
var currLongitude;                    // coordinates for current city
var currLatitude;                   // coordinates for current city
var currWeatherIcon;               // icon for the current weather
var currUV;                           // current UV for current city
var cityHistory;                           // array of of cities previously searched  from localStorage 
var cityLine;                       // line on page w/ city, date, current weather icon
var queryWeather;                   // string to query the weather api for current weather conditions
var queryUV;                   // string to query the weather api for UV
var appid = "19331ece68ee955fab0ad85c4df262c4";  // for queries to openweathermap.org

// for testing
// localStorage.clear();
cityHistory = {
    weather: ["Boston", "New York"]
};
cityHistory = JSON.stringify(cityHistory);
localStorage.setItem("weather", cityHistory);
// console.log("history:  " + cityHistory);
// ***  end of test code


// get local Storage info
cityHistory = localStorage.getItem("weather");
cityHistory = JSON.parse(cityHistory);



// "working" cityHistory  is an array of previously searched cities
//  if nothing in local storage, defaults to what it was initialized to
if (cityHistory != null) {
    cityHistory = cityHistory.weather;        // set current city to most recent city, when page is first loaded.
    currCity = cityHistory[0];              // defaults to Portsmouth NH (in declaration)  
}
else {
    cityHistory = [];                   // set cityHistory to an empy array, if no previously searched cities in local Storage
};


// Put search history on page
cityHistory.forEach(function (city) {
    var cityListEl = $("<li>");
    cityListEl.addClass("list-option list-group-item");
    cityListEl.text(city);
    //   cityListEl.css("border", "1px solid");
    $(".list-group").prepend(cityListEl);

});


// put current city and date on website
cityLine = `${currCity}          (${currDate.toString()})     `
$("#cityLine").text(cityLine);


// query to get weather info for current city
queryWeather = `https://api.openweathermap.org/data/2.5/weather?q=${currCity}&units=imperial&appid=${appid}`;

// get current weather.  Need longitude & lattitude to get UV; separate query for weather icon.
$.ajax({
    url: queryWeather,
    method: "GET"
}).then(function (response) {

    // retrieve all data needed
    currTemp = response.main.temp;
    currHumid = response.main.humidity;
    currWind = response.wind.speed;
    currLongitude = response.coord.lon;
    currLatitude = response.coord.lat;

    // put data we have on the page
    $("#cityTemp").text(`Temperature:   ${currTemp} \xB0F`);
    $("#cityHumid").text(`Humidity:   ${currHumid} %`);
    $("#cityWind").text(`Wind Speed:   ${currWind} MPH`);
    // link to weather icon
    currWeatherIcon = `http://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
    // put on website
    $("#currWeatherIcon").attr("src", currWeatherIcon);

    // query for uv
    queryUV = `https://api.openweathermap.org/data/2.5/uvi?lat=${currLatitude}&lon=${currLongitude}&appid=${appid}`;
    $.ajax({
        url: queryUV,
        method: "GET"
    }).then(function (uvResponse) {
        // retrieve UV from response
        currUV = uvResponse.value.toString();
        $("#dataUV").text(currUV);  // put UV on website
    },
        // if ajax request failed
        function (a, b, c) {
            console.log("a: " + a + "\nb:  " + b + "\nc:  " + c);
            $("#dataUV").text("Not available");  // if not found on weather API
        });
    jqXHR.then(function (data, textStatus, jqXHR) { }, function (jqXHR, textStatus, errorThrown) { });
});




