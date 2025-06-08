const cityInput = document.querySelector("#city_name");
const searchBtn = document.querySelector("#searchBtn");
const locationBtn = document.querySelector("#locationBtn");
const city = document.querySelector("#city");
let citys = JSON.parse(localStorage.getItem("citys")) || [];
const renderCity = document.querySelector("#renderCity");
const renderDate = document.querySelector("#renderDate");
const renderTemp = document.querySelector("#renderTemp");
const renderCloude = document.querySelector("#renderCloude");
const weatherData = document.querySelector("#weatherData");
const wetherPhoto = document.querySelector("#wetherPhoto");
const mainContener = document.querySelector("#mainContener");
const mainCrenderFiveDayForcastontener = document.querySelector(
  "#renderFiveDayForcast"
);

const API_key = "8012e74eb25fefcf886f782905ca49e6";

function setDropdownData(data) {
  console.log(data);
  let option = "";
  option += `<option value="Previous Search" >Previous Search</option>`;
  for (const element of data) {
    option += `<option value="${element}" >${element}</option>`;
  }
  //   console.log(option);

  city.innerHTML = option;
}

function renderFiveDaysForecast(fiveDaysForecast) {
  let box = "";
  for (const element of fiveDaysForecast) {
    let date = element.dt_txt.split(" ")[0];
    let parts = date.split("-");
    date = `${parts[2]}-${parts[1]}-${parts[0]}`;

    console.log(date);

    console.log(element.main.temp_max);

    console.log();
    box += `<div>
            <p class="font-semibold text-md text-gray-300">${date}</p>
            <img  src="https://openweathermap.org/img/wn/${
              element.weather[0].icon
            }@2x.png" class="w-15 mx-auto my-1" />
            <p class="text-gray-300">${Math.round(
              element.main.temp - 273.15
            )}°C</p>
            <p class="text-gray-300 text-xs">${element.weather[0].description}</p>
          </div>`;
  }
  mainCrenderFiveDayForcastontener.innerHTML = box;
}

async function getWeatherDetails(lat, lon) {
  const UURRENT_WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`;

  const currentResponse = await fetch(UURRENT_WEATHER_API_URL);
  const currentData = await currentResponse.json();
  console.log("currentData", currentData);

  const name = currentData.name;
  const temp = Math.round(currentData.main.temp - 273.15);
  const cloud = currentData.weather[0].description;
  //   console.log(cloud)
  renderCity.innerHTML = name;
  mainContener.innerHTML = `
        <div id="wetherPhoto" class=" md:w-50 md:ml-[1%] m-auto my-1" >
         <img src="https://openweathermap.org/img/wn/${
           currentData.weather[0].icon
         }@4x.png"  class="md:w-50 w-45 mx-auto my-1" />
        </div>
        <div class="text-center">
          <h2
            id="renderTemp"
            class="text-7xl mt-2 md:text-9xl font-bold text-gray-300"
          >
             ${temp}<sup class="text-5xl md:text-6xl">°C</sup>
          </h2>
          <p
            id="renderCloude"
            class="md:text-2xl text-xl mb-2.5 font-bold text-gray-300"
          >
            ${cloud}
          </p>
        </div>
        <div id="weatherData"
          class="text-gray-300 text-md md:text-lg p-3 bg-[rgba(0,0,0,0.5)] ml-[2%] w-[96%] md:w-[25%] rounded-xl mb-3"
        >
          <h2 class="text-[23px] font-bold text-gray-300">Weather Data</h2>
          <div class="m-1">🌡️ Feels like: <span id="feelsLike">${Math.round(
            currentData.main.feels_like - 273.15
          )}°C</span></div>
          <div class="m-1">💧Outdoor Humidity : <span id="humidity">${
            currentData.main.humidity
          }%</span></div>
          <div class="m-1">💨 Wind Speed: <span id="wind">${Math.round(
            currentData.wind.speed * 3.6
          )} km/h</span></div>
        </div>
      `;

  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_key}`;
  const response = await fetch(WEATHER_API_URL);
  const data = await response.json();
  console.log("data ye hai", data);

  const uniqueForecastDays = [];
  const fiveDaysForecast = data.list.filter((forecast) => {
    const forecastDate = new Date(forecast.dt_txt).getDate();
    if (!uniqueForecastDays.includes(forecastDate)) {
      return uniqueForecastDays.push(forecastDate);
    }
  });
  fiveDaysForecast.pop();
  renderFiveDaysForecast(fiveDaysForecast);
  console.log(fiveDaysForecast);

  console.log(name, lat, lon);

  setInterval(() => {
    let date = new Date();
    console.log(date.getDate());
    renderDate.innerHTML = date;
  }, 1000);
  let date = new Date();
  console.log(date.getDate());
  renderDate.innerHTML = date;

  citys.push(name);
  localStorage.setItem("citys", JSON.stringify(citys));
  let uniqueCitys = [...new Set(citys)];
  setDropdownData(uniqueCitys);
}

async function handleSearchClick() {
  const city_name = cityInput.value.trim();
  cityInput.value = "";
  if (city_name === "") return;
  try {
    const URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city_name}&appid=${API_key}`;
    const response = await fetch(URL);
    const data = await response.json();
    console.log("data is", data);
    const arr = Array.from(Object.entries(data));
    if (!arr.length) return alert(`No coordinates found for ${city_name}`);
    const lon = data.city.coord.lon;
    const lat = data.city.coord.lat;
    getWeatherDetails(lat, lon);
  } catch (error) {
    alert("An error occurred while fetching the coordinates!");
  }
}

function handleLocationClick() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      getWeatherDetails(latitude, longitude);
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        alert(
          "Geolocation request denied. Please reset location permission to grant access again."
        );
      } else {
        alert("Geolocation request error. Please reset location permission.");
      }
    }
  );
}

let uniqueCitys = [...new Set(citys)];
setDropdownData(uniqueCitys);
searchBtn.addEventListener("click", handleSearchClick);
locationBtn.addEventListener("click", handleLocationClick);
cityInput.addEventListener(
  "keyup",
  (e) => e.key === "Enter" && handleSearchClick()
);
