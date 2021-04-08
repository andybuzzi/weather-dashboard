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
  var uvUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=5e0f5983cb477cde1c391a7eaa38fce6`;

  //make a request to the url
  fetch(uvUrl).then(function (response) {
    response
      .json()
      .then(function (data) {
        displayUV(data, city);
        displayForecast(data, city);
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

var displayForecast = function (forecast) {
  //function to display forecast;

  var forecast = forecast.daily;
  console.log(forecast);

  for (var i = 0; i < 5; i++) {
    var dailyTemp = forecast[i].temp.day;
    var dailyWind = forecast[i].wind_speed;
    var dailyHum = forecast[i].humidity;
    var weatherIcon = forecast[i].weather[0].icon;
    var ndate = moment().add(i, "days").format("MM/DD/YYYY");
    if (ndate[i] === 0) {
      continue;
    }
    console.log(ndate);
    //forecast container
    var cards = document.querySelector("#forecast-container");

    //create div for cards
    var cardContainerEl = document.createElement("div");
    cardContainerEl.setAttribute("class", "daily-forecast");
    cardContainerEl.setAttribute("style", "display: block");
    // append cardContainer to cards div
    cards.appendChild(cardContainerEl);

    // create p for DATE
    dateEl = document.createElement("p");
    dateEl.textContent = `${ndate}`;
    // append date to cardContainerEl
    cardContainerEl.appendChild(dateEl);

    //create p for ICON
    iconEl = document.createElement("img");
    iconEl.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${weatherIcon}.png`
    );
    //append icon to cardContainerEl
    cardContainerEl.appendChild(iconEl);

    //create p for TEMPERATURE
    temperatureEl = document.createElement("p");
    temperatureEl.textContent = `Temp: ${dailyTemp}°F`;
    //append temperature to cardContainerEl
    cardContainerEl.appendChild(temperatureEl);

    //create p for WIND
    windEl = document.createElement("p");
    windEl.textContent = `Wind: ${dailyWind} MPH`;
    //append wind to cardContainerEl
    cardContainerEl.appendChild(windEl);

    //create p for HUMIDITY
    humidityEl = document.createElement("p");
    humidityEl.textContent = `Humidity: ${dailyHum}%`;
    //append humidity to cardContainerEl
    cardContainerEl.appendChild(humidityEl);
  }
};

userFormEl.addEventListener("submit", formSubmitHandler);
