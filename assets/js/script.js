var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#city");
var currentDate = moment().format("MM/DD/YYYY");
var btn = document.querySelector("#submit");
// console.log(currentDate);
var cards = document.querySelector("#forecast-container");
var displayWeatherEl = document.querySelector("#dashboard");

cityArr = [];

// local storage
function init() {
  // Get stored todos from localStorage
  // Parsing the JSON string to an object
  var storedCities = JSON.parse(localStorage.getItem("cities"));
  console.log(storedCities);

  // If storedCities are not empty, update the todos array to it
  if (storedCities !== null) {
    cityArr = storedCities;
  }

  renderCities();
}

function storeCities() {
  // Stringify and set "cities" key in localStorage to todos array

  localStorage.setItem("cities", JSON.stringify(cityArr));
}

function renderCities() {
  searchHistory = document.querySelector(".search-history");

  searchHistory.textContent = "";
  // Render a new button for each city and append it to the div
  for (var i = 0; i < cityArr.length; i++) {
    // Create button element and make the todo text the text content
    var button = document.createElement("button");
    button.style.textTransform = "capitalize";
    button.setAttribute("class", "search-btn history");
    button.textContent = cityArr[i];
    button.setAttribute("value", cityArr[i]);
    button.addEventListener("click", historySearch);

    //Append the button the li before you append the li to the todoList
    searchHistory.appendChild(button);
  }
}

function historySearch(e) {
  try {
    console.log(e.target.value);
    getWeather(e.target.value);
  } catch (error) {
    console.log("error");
  }
}

var formSubmitHandler = function (event) {
  event.preventDefault();

  //get value from input element
  var citySearch = cityInputEl.value.trim();
  console.log(citySearch);
  getWeather(citySearch);
  if (citySearch === "") {
    alert("Please enter valid city");
    return;
  }

  // add city search to cityArr and clean input

  if (cityArr.indexOf(citySearch) === -1) {
    cityArr.push(citySearch);
  }

  console.log(cityArr);

  storeCities();
  renderCities();
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
        // console.log(data);

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
        // console.log(data);
      })
      .catch(function (error) {
        alert("Unable to connect to openweather");
      });
  });
};

var displayWeather = function (weather, searchTerm) {
  // clear html to load display new search
  displayWeatherEl.innerHTML = "";
  cards.innerHTML = "";

  // variables for display weather
  var cityName = weather.name;
  var temp = weather.main.temp;
  var wind = weather.wind.speed;
  var humidity = weather.main.humidity;
  var weatherIcon = weather.weather[0].icon;

  // display weather container
  // var displayWeatherEl = document.querySelector("#dashboard");

  // create div to display heading and icon
  var displayDivContainerEl = document.createElement("div");
  displayDivContainerEl.setAttribute("class", "main-heading");

  // append displayDivContainerEl to displayWeather div
  displayWeatherEl.appendChild(displayDivContainerEl);

  //create h1 for HEADING
  var cityNameEl = document.createElement("h1");
  cityNameEl.setAttribute("id", "city-date");
  cityNameEl.textContent = `${cityName} (${currentDate})`;

  // append cityNameEl to displayWeather div
  displayDivContainerEl.appendChild(cityNameEl);

  //create p for ICON
  iconEl = document.createElement("img");
  iconEl.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${weatherIcon}.png`
  );
  //append icon to cardContainerEl
  displayDivContainerEl.appendChild(iconEl);

  //create p for TEMPERATURE
  tempEl = document.createElement("p");
  tempEl.textContent = `Temp: ${temp}°F`;
  //append temperature to displayWeather
  displayWeatherEl.appendChild(tempEl);

  //create p for WIND
  windEl = document.createElement("p");
  windEl.textContent = `Wind: ${wind} MPH`;
  //append wind to displayWeather
  displayWeatherEl.appendChild(windEl);

  //create p for HUMIDITY
  humidityEl = document.createElement("p");
  humidityEl.textContent = `Humidity: ${humidity}%`;
  //append humidity to displayWeather
  displayWeatherEl.appendChild(humidityEl);
};

var displayUV = function (weatherUv) {
  // variable for weather uv
  var weatherUv = weatherUv.current.uvi;
  var displayWeather = document.querySelector("#dashboard");

  var weatherUvEl = document.createElement("p");
  weatherUvEl.textContent = `UV Index: `;

  // append weather UV to displayWeather
  displayWeather.appendChild(weatherUvEl);
  // console.log(weatherUv);

  //create span for styling
  var spanEl = document.createElement("span");
  spanEl.textContent = ` ${weatherUv}`;

  var uvNumber = parseFloat(spanEl.innerText);
  // console.log(uvNumber);

  // if else statement to validade color uv
  if (uvNumber >= 0 && uvNumber <= 2.99) {
    spanEl.setAttribute(
      "style",
      "font-size: 12px; font-weight: bold; color:#fff; padding: 4px 14px; border-radius: 5px; background-color: green;"
    );
  } else if (uvNumber >= 3 && uvNumber <= 5.99) {
    spanEl.setAttribute(
      "style",
      "font-size: 12px; font-weight: bold; color:#fff; padding: 4px 14px; border-radius: 5px; background-color: #ffea61;"
    );
  } else if (uvNumber >= 6 && uvNumber <= 7.99) {
    spanEl.setAttribute(
      "style",
      "font-size: 12px; font-weight: bold; color:#fff; padding: 4px 14px; border-radius: 5px; background-color: #ffa500;"
    );
  } else if (uvNumber >= 8 && uvNumber <= 10.99) {
    spanEl.setAttribute(
      "style",
      "font-size: 12px; font-weight: bold; color:#fff; padding: 4px 14px; border-radius: 5px; background-color: #9e1a1a;"
    );
  }
  // append span to displayWeather
  weatherUvEl.appendChild(spanEl);
};

var displayForecast = function (forecast) {
  //function to display forecast;
  var forecast = forecast.daily;
  // console.log(forecast);

  for (var i = 0; i < 5; i++) {
    var dailyTemp = forecast[i].temp.day;
    var dailyWind = forecast[i].wind_speed;
    var dailyHum = forecast[i].humidity;
    var weatherIcon = forecast[i].weather[0].icon;
    var ndate = moment().add(i, "days").format("MM/DD/YYYY");
    if (ndate[i] === 0) {
      continue;
    }

    //create div for cards
    var cardContainerEl = document.createElement("div");
    cardContainerEl.setAttribute("class", "daily-forecast");
    cardContainerEl.setAttribute("style", "display: block");
    // append cardContainer to cards div
    cards.appendChild(cardContainerEl);

    // create p for DATE
    dateEl = document.createElement("p");
    dateEl.textContent = `${ndate}`;
    dateEl.setAttribute("class", "date-text");
    dateEl.setAttribute("style", "font-weight: bold");
    dateEl.setAttribute("style", "font-size: 18px");

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
init();
