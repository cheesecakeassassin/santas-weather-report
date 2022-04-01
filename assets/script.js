var cityFormEl = document.querySelector('#city-form');
var cityButtonsEl = document.querySelector('#city-buttons');
var cityInputEl = document.querySelector('#city');
var cityContainerEl = document.querySelector('#city-container');
var citySearchTerm = document.querySelector('#city-search-term');
var tempEl = document.createElement('p');
var windEl = document.createElement('p');
var humidityEl = document.createElement('p');
var uvEl = document.createElement('p');

var formSubmitHandler = function (event) {
    // prevent page from refreshing
    event.preventDefault();

    // get value from input element
    var city = cityInputEl.value.trim();

    if (city) {
        getGeocode(city);

        // clear old content
        cityContainerEl.textContent = '';
        cityInputEl.value = '';
    } else {
        alert('Please enter a city');
    }
};

var buttonClickHandler = function (event) {
    // get the language attribute from the clicked element
    var city = event.target.getAttribute('data-city');

    if (city) {
        getGeocode(city);

        // clear old content
        cityContainerEl.textContent = '';
    }
};

var getGeocode = function (city) {
    // Format the geocoding api url
    var apiUrl =
        'http://api.openweathermap.org/geo/1.0/direct?q=' +
        city +
        '&limit=1&appid=45065de73cc83fdca8eafdd1847f8287';

    // Make a get request to url
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    // Get lat/long
                    var latitude = data[0].lat;
                    var longitude = data[0].lon;
                    getWeatherData(latitude, longitude, city);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to get latitude/longitude data');
        });
};

var getWeatherData = function (latitude, longitude, city) {
    // Format the weather api url
    var apiUrl =
        'https://api.openweathermap.org/data/2.5/onecall?lat=' +
        latitude +
        '&lon=' +
        longitude +
        '&exclude={part}&appid=45065de73cc83fdca8eafdd1847f8287';

    // Make a get request to url
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    displayWeather(data, city);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to get latitude/longitude data');
        });
};

var displayWeather = function (weatherData, city) {
    if (weatherData.length === 0) {
        cityContainerEl.textContent = 'No weather data found.';
        return;
    }

    var temp = Math.floor(1.8 * (weatherData.current.temp - 273) + 32) + "°F";
    var wind = weatherData.current.wind_speed + " MPH";
    var humidity = weatherData.current.humidity + "%";
    var uvIndex = weatherData.current.uvi;
    var iconId = weatherData.current.weather[0].icon;
    var icon = document.createElement("img");

    // Gets URL of icon for its respective weather condition
    icon.src = `http://openweathermap.org/img/wn/${iconId}@2x.png`;
 
    citySearchTerm.textContent = city + " - " + new Date().toLocaleDateString();
    citySearchTerm.appendChild(icon);

    tempEl.textContent = "Temp: " + temp;
    windEl.textContent = "Wind: " + wind;
    humidityEl.textContent = "Humidity: " + humidity;
    uvEl.textContent = "UV Index: " + uvIndex;

    if (uvIndex < 3)
    {
        uvEl.setAttribute("style", "background-color:green");
    } else if (uvIndex >= 3 && uvIndex < 7)
    {
        uvEl.setAttribute("style", "background-color:yellow");
    } else 
    {
        uvEl.setAttribute("style", "background-color:red");
    }

    cityContainerEl.appendChild(tempEl);
    cityContainerEl.appendChild(windEl);
    cityContainerEl.appendChild(humidityEl);
    cityContainerEl.appendChild(uvEl);
};

// Add event listeners to form and button container
cityFormEl.addEventListener('submit', formSubmitHandler);
cityButtonsEl.addEventListener('click', buttonClickHandler);
