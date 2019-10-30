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
var query5Day;                   // string to query the weather api for the 5 day forecast
var icons5Day = [];              // array with 5 days of weather icons
var temps5Day = [];                // array with 5 days of temperatures
var humids5Day = [];                // array with 5 days of humidity

var day = {                     // info for a day in the forecast
    dt: "",                     // date of forecast
    ic: "",                     // icon for this day's forecast
    temp: 0,                     // high temp for this day's forecast
    humid: 0                     // high humidity for this day's forecast
};

var days = [];                     // array of day objects, one for each day of the forecast

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
    currTemp = Math.round(response.main.temp);
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
    },  // ******  check this!! 
        // if ajax request failed
        function (a, b, c) {
            //    console.log("a: " + a + "\nb:  " + b + "\nc:  " + c);
            $("#dataUV").text("Not available");  // if not found on weather API
        });

});

// query to get weather info for current city
query5Day = `https://api.openweathermap.org/data/2.5/forecast?q=${currCity},us&units=imperial&appid=${appid}`;
//              api.openweathermap.org/data/2.5/forecast?q=$
// get current weather.  Need longitude & lattitude to get UV; separate query for weather icon.
$.ajax({
    url: query5Day,
    method: "GET"
}).then(function (response) {
    var d = -1;   // index into days array
    console.log("begin... day: " + day + ";  days: " + days);
    response.list.forEach(function (forecast3Hr, index) {   // for each 3 hour forecast retrieved
        var thisDate = forecast3Hr.dt_txt;                  // get the date of the forecast for this record
        thisDate = thisDate.substring(0, thisDate.indexOf(" "));
        if (moment().format("YYYY-MM-DD") != thisDate) {  // skip if it's a forecast for later "today"
            if (thisDate != day.dt) {   // if a new date
                if (d != -1) {                      // if not the first
                    var pushDay = {};
                    pushDay.dt = day.dt;               // push copy of object, not reference to object
                    pushDay.ic = day.ic;
                    pushDay.temp = Math.round(day.temp);
                    pushDay.humid = day.humid;
                    days.push(pushDay);                 // push the day object onto the days array
                };  // end of if not the first day
                d++;                            // increment the count of which forecast day you are on
                day.dt = thisDate;                  // initialize date for this forecast date
                day.ic = `http://openweathermap.org/img/wn/${forecast3Hr.weather[0].icon}@2x.png`;  // set the icon
                day.temp = Math.round(forecast3Hr.main.temp);   // set the temp
                day.humid = forecast3Hr.main.humidity;  // set the humidity
            }  // of if different date
            else {                                  // if we've hit a new date
                if (forecast3Hr.main.temp > day.temp) {   // replace the temp if the new one is higher
                    day.temp = forecast3Hr.main.temp;
                };
                if (forecast3Hr.main.humidity > day.humid) {    // replace the humidity if the new one is higher
                    day.humid = forecast3Hr.main.humidity;
                };
                console.log("thisDate: " + thisDate + ";  d: " + d + "; day: " + day + ";  days: " + days);

            };  // of else (same date)
        };   // of if forecast for later today (moment = currDate)
    });  // of forEach 3 hour forecast object from the API
    var pushDay = {};
    pushDay.dt = day.dt;               // push copy of object, not reference to object
    pushDay.ic = day.ic;
    pushDay.temp = Math.round(day.temp);
    pushDay.humid = day.humid;
    days.push(pushDay);                 // push the day object onto the days array
    console.log("days: " + days);

    days.forEach(function (day, i) {
        $(`#fore5date${i}`).text(days[i].dt);
        $(`#iconDay${i}`).attr("src", days[i].ic);
        $(`#fore5temp${i}`).text(`Max temp:  ${days[i].temp} \u00B0F`);
        $(`#fore5humid${i}`).text(`Max humidity:  ${days[i].humid}%`);

    });
});

