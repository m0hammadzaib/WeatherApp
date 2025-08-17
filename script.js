
const searchInput = document.querySelector("input");
const searchBtn = document.querySelector("button");
const loader = document.querySelector(".loader");
const weatherCard = document.querySelector(".weather-card");
const errorMsg = document.querySelector(".error");

const weatherAssets = {
   "Clear": { icon: "assets/icons/normalicon.png", bg: "assets/backgrounds/clearsky.jpg" },
   "Clouds": { icon: "assets/icons/brokeicon.png", bg: "assets/backgrounds/partlyclouds1.jpg" },
   "Partly Cloudy": { icon: "assets/icons/cloudyicon.png", bg: "assets/backgrounds/partlyclouds1.jpg" },
   "Rain": { icon: "assets/icons/rainyicon.png", bg: "assets/backgrounds/rainy.jpg" },
   "Thunderstorm": { icon: "assets/icons/thunderstormicon.png", bg: "assets/backgrounds/thunderstorm.jpg" },
   "Snow": { icon: "assets/icons/snowicon.png", bg: "assets/backgrounds/snow.jpg" },
   "Fog": { icon: "assets/icons/fogicon.png", bg: "assets/backgrounds/foggy.jpg" },
   "Wind": { icon: "assets/icons/windicon.png", bg: "assets/backgrounds/thunderstorm.jpg" }
};


searchInput.addEventListener("keypress", (e) => {
   if (e.key === "Enter") {
      searchBtn.click(); 
   }
});

searchBtn.addEventListener("click", () => {


   const city = searchInput.value.trim();
   clearUI(); 
   if (city) {
      getWeather(city); 
   } else {
      showError("Please enter a city name!"); 
   }
});


function clearUI() {
   loader.style.display = "flex"; 
   errorMsg.textContent = "none";
   weatherCard.innerHTML = "none";
}


function showError(msg) {
   loader.style.display = "none";
   errorMsg.classList.remove("hidden");
   errorMsg.style.display = "inline-block";
   errorMsg.textContent = ` ${msg}`;
}


function getCondition(data1) {
   let condition = data1.weather[0].main;


   if (condition === "Clouds") {
      if (data1.weather[0].description.includes("few clouds") ||
         data1.weather[0].description.includes("scattered clouds")) {
         condition = "Partly Cloudy";
      }
   }

   else if (condition === "Drizzle" || condition === "Rain") {
      condition = "Rain";
   }

   else if (condition === "Mist" || condition === "Fog" || condition === "Haze") {
      condition = "Fog";
   }
   // Windy / rare
   else if (condition === "Squall" || condition === "Tornado" || condition === "Wind") {
      condition = "Wind";
   }
   else if (condition === "broken clouds" || condition === "partly clouds") {
      condition = "Partly Clouds";
   }


   if (!weatherAssets[condition]) condition = "Clear";

   return condition;
}

async function getWeather(city) {
   try {
      const apikey = `27e08b619503c3ed93aa97d2b3aa5f5d`;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok || data.cod != 200) {
         throw new Error(data.message);
      }

      const condition = getCondition(data);
      const asset = weatherAssets[condition];
      document.body.style.backgroundImage = `url('${asset.bg}')`;
      const iconUrl = asset.icon;


       reload();

      
      weatherCard.innerHTML = `
         <h2>${data.name}, ${data.sys.country}</h2>
         <p class="temp">${data.main.temp} °C</p>
         <p class="condition">${data.weather[0].description}</p>
         <p>Humidity: ${data.main.humidity}%</p>
         <p>Wind: ${data.wind.speed} m/s</p>
         <img src="${iconUrl}" alt="Weather Icon">
      `;

   } catch (err) {
      showError(err.message);
   } finally {
      loader.style.display = "none"; 
   }
}

function reload(){
    weatherCard.style.display = "none";  
      void weatherCard.offsetWidth; 
      weatherCard.style.display = "block";  
}