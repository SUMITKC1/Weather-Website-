const apiKey = "c3cda732d5591c76eb3a85fc97a1164b";
const searchBox = document.getElementById("search-box");
const temperatureEl = document.querySelector(".temperature");
const cityEl = document.querySelector(".city");
const dateEl = document.querySelector(".date");
const conditionEl = document.querySelector(".condition");
const cloudinessEl = document.getElementById("cloudiness");
const humidityEl = document.getElementById("humidity");
const windSpeedEl = document.getElementById("wind-speed");
const rainfallEl = document.getElementById("rainfall");
const recentLocationsEl = document.getElementById("recent-locations");
const mainSection = document.querySelector(".main");
const body = document.body;
const weatherDetailsEl = document.querySelector(".weather-details");

let recentLocations = [];

// Fetch Weather Data
async function fetchWeather(location) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`
    );
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();
    updateWeather(data);
  } catch (error) {
    alert(error.message);
  }
}

// Update Weather UI
function updateWeather(data) {
  const {
    name,
    main: { temp, humidity },
    weather,
    clouds: { all: cloudiness },
    wind: { speed },
    rain,
  } = data;

  const condition = weather[0].main;
  const timeOfDay = weather[0].icon.includes("d") ? "day" : "night";

  // Update Main Section
  temperatureEl.textContent = `${Math.round(temp)}°`;
  cityEl.textContent = name;
  conditionEl.textContent = condition;
  cloudinessEl.textContent = `${cloudiness}%`;
  humidityEl.textContent = `${humidity}%`;
  windSpeedEl.textContent = `${speed} km/h`;
  rainfallEl.textContent = rain ? `${rain["1h"] || 0} mm` : `0 mm`;

  // Update Date
  const now = new Date();
  dateEl.textContent = now.toLocaleString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  // Update Background and Main Section
  const bgImage = `url('images/${timeOfDay}/${condition.toLowerCase()}-${timeOfDay}.jpg')`;
  mainSection.style.backgroundImage = bgImage;
  body.style.backgroundImage = bgImage;

  // Update Colors Based on Time of Day
  const isDay = timeOfDay === "day";
  document.querySelector(".weather-info").style.color = isDay ? "black" : "white";
  document.querySelector(".weather-details").style.color = isDay ? "black" : "white";
  document.querySelector(".sidebar").style.color = isDay ? "black" : "white";
  document.querySelector(".sidebar").style.backgroundColor = isDay
    ? "rgba(255, 255, 255, 0.8)"
    : "rgba(0, 0, 0, 0.8)";

   

  // Update Weather Details Colors
  weatherDetailsEl.style.color = isDay ? "black" : "white";

  // Update Recent Locations
  if (!recentLocations.includes(name)) {
    if (recentLocations.length === 4) recentLocations.pop();
    recentLocations.unshift(name);
    renderRecentLocations();
  }
}

// Render Recent Locations
function renderRecentLocations() {
  recentLocationsEl.innerHTML = recentLocations
    .map((location) => `<li>${location}</li>`)
    .join("");
}

// Search Box Event Listener
searchBox.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && searchBox.value.trim()) {
    fetchWeather(searchBox.value.trim());
    searchBox.value = "";
  }
});
