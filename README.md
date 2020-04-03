# Weather dashboard
Deployed app: https://mauraslavin.github.io/Weather
Github page:  https://github.com/MauraSlavin/Weather

## Description

Traveler who wants to check weather before embarking on a trip can use this app to see the current weather of any major city in the world along with the five day forecast for that city.  They will also see a list of cities they have previously searched.

## Technologies and tools used

- jQuery
- Javascript
- Bootstrap
- Openweathermap API
- local storage
- popper
- moment

## New Users

The first time the app is opened at https://mauraslavin.github.io/Weather, the screen looks like:

[first time user](Assets/BeginScreen.png)

The default city that is displayed is Boston.


## Returning Users

There is a search box on the top left corner.  When a city is entered (just the city name) and the submit button is pressed, the current weather for that location is displayed.  That city's name is added to the top of the list of cities searched (located directly under the search box).

If a traveler searched Cleveland, San Francisco, and London, (in that order), here is what the page then looks like:

[after a few searches](Assets/LaterScreen.png)


## Information Displayed

The information shown for the current city is:
- City name,
- Current date,
- Weather icon for the current weather conditions,
- Wind speed, and
- UV index.

The forecast for the next 5 days shows (for each day):
- Date,
- Weather icon for the expected weather that day,
- High temperature forecasted for the day, and
- Highest humidity forecasted for the day.

When a traveler leaves the website and comes back, the weather conditions for the city they most recently searched is displayed, along with the cities they have searched (with the most recently searched city at the top of the list).