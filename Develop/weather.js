var currDate = moment().format('LL');  // current date
var currCity = "03801,us";       // current city (Portsmouth is the default, if nothing in local storage)
var currTemp;                           // current temperature for current city
var currHumid;                           // current humidity for current city
var currWind;                           // current wind speed for current city
var currLongitude;                    // coordinates for current city
var currLatitude;                   // coordinates for current city
var currIconURL;                    // url for icon of current weather conditions
var currUV;                           // current UV for current city
var cityHistory;                           // array of of cities previously searched  from localStorage 
var queryWeather;                   // string to query the weather api for current weather conditions
var queryUV;                   // string to query the weather api for UV
var appid = "19331ece68ee955fab0ad85c4df262c4";  // for queries to openweathermap.org

// for testing
// localStorage.clear();
cityHistory = {
    weather: ["03801,us", "10570,us"]
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



// **** This uses zip code.  Will need to be changed.
//  queryWeather = `https://api.openweathermap.org/data/2.5/weather?q=${currCity}&units=imperial&APPID=${appid}`;
queryWeather = `https://api.openweathermap.org/data/2.5/weather?zip=${currCity}&units=imperial&APPID=${appid}`;

// get current weather.  Need longitude & lattitude to get UV; separate query for weather icon.
$.ajax({
    url: queryWeather,
    method: "GET"
}).then(function (response) {
    console.log(currCity + ":  " + response);
    // retrieve all data needed
    currTemp = response.main.temp;
    currHumid = response.main.humidity;
    currWind = response.wind.speed;
    currLongitude = response.coord.lon;
    currLatitude = response.coord.lat;
    currIconURL = `https://openweathermap.org/img/w/${response.weather[0].icon}.png`

    // query for uv
    queryUV = `https://api.openweathermap.org/data/2.5/uvi?lat=${currLatitude}&lon=${currLongitude}&APPID=${appid}`;
    $.ajax({
        url: queryUV,
        method: "GET"
    }).then(function (uvResponse) {
        // retrieve UV from response
        currUV = uvResponse.value;
    });

});




