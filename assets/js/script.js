var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#city");

var formSubmitHandler = function (event) {
  event.preventDefault();

  //get value from input element
  var citySearch = cityInputEl.value.trim();

  if (citySearch) {
    getWeather(citySearch);
    cityInputEl.value = "";
  } else {
    alert("Please enter valid city");
  }
  console.log(event);
};

// get weather api
var getWeather = function (city) {
  // format the api url
  var apiUrl =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=5e0f5983cb477cde1c391a7eaa38fce6";

  //make a request to the url
  fetch(apiUrl).then(function (response) {
    response
      .json()
      .then(function (data) {
        displayWeather(data, city);
        getUv(data, city);
      })
      .catch(function (error) {
        alert("Unable to connect to openweather");
      });
  });
};

// get weather UV api
var getUv = function (uv) {
  //variables to get latitute and longitute
  var lat = uv.coord.lat;
  var lon = uv.coord.lon;

  // format the api url
  var uvUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=5e0f5983cb477cde1c391a7eaa38fce6`;

  //make a request to the url
  fetch(uvUrl).then(function (response) {
    response
      .json()
      .then(function (data) {
        displayUV(data, city);
        console.log(data);
      })
      .catch(function (error) {
        alert("Unable to connect to openweather");
      });
  });
};

var displayWeather = function (weather, searchTerm) {
  console.log(weather);
  console.log(searchTerm);

  //display city name
  var cityName = weather.name;
  var cityNameEl = document.querySelector("#city-date");
  cityNameEl.textContent = cityName;
  console.log(cityName);

  //display temperature
  var temp = weather.main.temp;
  var tempEl = document.querySelector("#temp");
  tempEl.textContent = `Temperature: ${temp}°F`;

  //display humidity
  var humid = weather.main.humidity;
  var humidEl = document.querySelector("#humid");
  humidEl.textContent = `Humidity: ${humid}%`;
};

var displayUV = function (weatherUv) {
  //display weather uv
  var weatherUv = weatherUv.current.uvi;
  var weatherUvEl = document.querySelector("#uv-index");
  weatherUvEl.textContent = `UV Index: ${weatherUv}`;
  console.log(weatherUv);
};

userFormEl.addEventListener("submit", formSubmitHandler);
