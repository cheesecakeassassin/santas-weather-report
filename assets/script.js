// API KEY: 45065de73cc83fdca8eafdd1847f8287
// One Call API call: https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=45065de73cc83fdca8eafdd1847f8287
// Geocoding API call: http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid=45065de73cc83fdca8eafdd1847f8287

var cityFormEl = document.querySelector('#city-form');
var languageButtonsEl = document.querySelector('#language-buttons');
var cityInputEl = document.querySelector('#city');
var cityContainerEl = document.querySelector('#city-container');
var citySearchTerm = document.querySelector('#city-search-term');

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
    var language = event.target.getAttribute('data-language');

    if (language) {
        getFeaturedRepos(language);

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

    // make a get request to url
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
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

    // make a get request to url
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
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

var getFeaturedRepos = function (language) {
    // format the github api url
    var apiUrl =
        'https://api.github.com/search/repositories?q=' +
        language +
        '+is:featured&sort=help-wanted-issues';

    // make a get request to url
    fetch(apiUrl).then(function (response) {
        // request was successful
        if (response.ok) {
            response.json().then(function (data) {
                displayRepos(data.items, language);
            });
        } else {
            alert('Error: ' + response.statusText);
        }
    });
};

var displayWeather = function (weatherData, city) {
    // check if api returned any repos
    if (weatherData.length === 0) {
        cityContainerEl.textContent = 'No repositories found.';
        return;
    }

    citySearchTerm.textContent = city + " - " + new Date().toLocaleDateString();

    // loop over repos
    for (var i = 0; i < weatherData.length; i++) {
        // format repo name
        var repoName = repos[i].owner.login + '/' + repos[i].name;

        // create a link for each repo
        var repoEl = document.createElement('a');
        repoEl.classList =
            'list-item flex-row justify-space-between align-center';
        repoEl.setAttribute('href', './single-repo.html?repo=' + repoName);

        // create a span element to hold repository name
        var titleEl = document.createElement('span');
        titleEl.textContent = repoName;

        // append to container
        repoEl.appendChild(titleEl);

        // create a status element
        var statusEl = document.createElement('span');
        statusEl.classList = 'flex-row align-center';

        // check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML =
                "<i class='fas fa-times status-icon icon-danger'></i>" +
                repos[i].open_issues_count +
                ' issue(s)';
        } else {
            statusEl.innerHTML =
                "<i class='fas fa-check-square status-icon icon-success'></i>";
        }

        // append to container
        repoEl.appendChild(statusEl);

        // append container to the dom
        repoContainerEl.appendChild(repoEl);
    }
};

// add event listeners to form and button container
cityFormEl.addEventListener('submit', formSubmitHandler);
languageButtonsEl.addEventListener('click', buttonClickHandler);
