let apiUrl = "https://api.openweathermap.org/data/2.5/";
let myAPIKey = "667698b894a9bf1f7e520b305829fe4b";

//---------------------apikey-url------------------------//

let iconsEL = document.querySelector("#icon");
let searchEL = document.querySelector("#search-form");
let cityNameEl = document.querySelector("#city-name");
let historyEl = document.querySelector("#search-history");



function viewCitiesSaved() {
    historyEl.innerHTML = "";
    if (localStorage.getItem("saved")) {
        citySaved = JSON.parse(localStorage.getItem("saved"));
        for (let i = 0; i < citySaved.length; i++) {
            let liEl = document.createElement("li");
            liEl.setAttribute("class", "list-group-item list-group-item-info");
            historyEl.appendChild(liEl);
            liEl.textContent = citySaved[i];
        }
    }
}
let thisDayEL = document.querySelector("#todays-date");
let windsEL = document.querySelector("#wind");
let temperatureEL = document.querySelector("#temp");
let humidityEL = document.querySelector("#humidity");
let uvIndexEL = document.querySelector("#uv-index");

function searchACity(query) {
    weatherApi = apiUrl + "weather?q=" + query + "&appid=" + myAPIKey;

    fetch(weatherApi)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let cityName = data.name;
            cityNameEl.textContent = cityName;

            if(localStorage.getItem("saved")) {
                saved = JSON.parse(localStorage.getItem("saved"));
            }
            if(!saved.includes(cityName)) {
                saved.push(cityName);
                localStorage.setItem("saved", JSON.stringify(saved));
            }
            viewCitiesSaved();


            let lat = data.coord.lat;
            let lon = data.coord.lon;
            let onecallApi = apiUrl + "onecall?lat=" + lat + "&lon=" + lon + "&units=imperial" + "&appid=" + myAPIKey;
            return fetch(onecallApi);
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let today = new Date(data.current.dt * 1000);
            let todaysDate = today.toDateString();
            thisDayEL.textContent = todaysDate;

            let iconId = data.current.weather[0].icon;
            let iconSrc = "https://openweathermap.org/img/wn/" + iconId + "@2x.png";
            iconsEL.setAttribute("src", iconSrc);

            temperatureEL.textContent = data.current.temp + " °F";

            windsEL.textContent = data.current.wind_speed + " MPH";

            humidityEL.textContent = data.current.humidity + " %";

            let uvi = data.current.uvi;
            uvIndexEL.textContent = uvi;
            if (uvi < 3) {
                uvIndexEL.setAttribute("style", "padding: 2px 4px; color: white; background-color: green;");
            } else if (3 <= uvi < 6) {
                uvIndexEL.setAttribute("style", "padding: 2px 4px; color: black; background-color: yellow;");
            } else if (6 <= uvi < 8) {
                uvIndexEL.setAttribute("style", "padding: 2px 4px; color: white; background-color: orange;");
            } else if (8 <= uvi < 11) {
                uvIndexEL.setAttribute("style", "padding: 2px 4px; color: white; background-color: red;");
            } else if (uvi >= 11) {
                uvIndexEL.setAttribute("style", "padding: 2px 4px; color: white; background-color: purple;");
            }

            let lat = data.lat;
            let lon = data.lon;
            let forecastApi = apiUrl + "forecast?lat=" + lat + "&lon=" + lon + "&units=imperial" + "&appid=" + myAPIKey;
            return fetch(forecastApi);
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            let j = 1;
            for (let i = 3; i <= 35; i += 8) {
                let day = data.list[i];
                let date = day.dt_txt.split(" ");
                let dateEl = document.querySelector("#h5-day-" + j);
                
                dateEl.textContent = date[0].slice(5);

                
                let iconId = day.weather[0].icon;
                let smalliconsEL = document.querySelector("#img-day-" + j);
                let iconSrc = "https://openweathermap.org/img/wn/" + iconId + ".png";
                
                smalliconsEL.setAttribute("src", iconSrc);

                let tempLiEl = document.querySelector("#temp-day-" + j);
                let windLiEl = document.querySelector("#wind-day-" + j);
                let humidLiEl = document.querySelector("#humid-day-" + j);

                tempLiEl.textContent = "Temperature: " + day.main.temperature + " °F";
                windLiEl.textContent = "Wind: " + day.wind.speed + " MPH";
                humidLiEl.textContent = "Humidity: " + day.main.humidity + " %"; j++;
            }
        })
        .catch(function (err) {
          
        });
}


let citySaved = [];
let saved = [];

viewCitiesSaved();
searchEL.addEventListener("submit", submitSearch);
historyEl.addEventListener("click", function (event) {
    if (event.target.matches("li")) {
        let savedQuery = event.target.textContent;
        searchACity(savedQuery);
    }
});

function submitSearch(event) {
    event.preventDefault();

    let query = document.querySelector("#search-input").value;
    if (!query) {
        alert("Enter search criteria");
        return;
    }
    searchACity(query);
}
