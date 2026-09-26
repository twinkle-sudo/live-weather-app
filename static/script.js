// ===============================
// GET HTML ELEMENTS
// ===============================

const cityInput = document.getElementById("city");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");
const weatherDiv = document.getElementById("weather");


// ===============================
// DISPLAY WEATHER
// ===============================

function displayWeather(data) {

    console.log("Weather data:", data);

    if (data.error) {

        weatherDiv.innerHTML = `
            <p>❌ ${data.error}</p>
        `;

        return;
    }


    weatherDiv.innerHTML = `

        <h2>📍 ${data.city}, ${data.country}</h2>

        <p>
            🌡️ Temperature:
            ${Number(data.temperature).toFixed(1)} °C
        </p>

        <p>
            🌡️ Feels Like:
            ${Number(data.feels_like).toFixed(1)} °C
        </p>

        <p>
            🌤️ Weather:
            ${data.weather}
        </p>

        <p>
            💧 Humidity:
            ${data.humidity}%
        </p>

        <p>
            💨 Wind Speed:
            ${data.wind_speed} m/s
        </p>

    `;
}


// ===============================
// SEARCH CITY
// ===============================

async function searchWeather() {

    const city = cityInput.value.trim();


    if (city === "") {

        alert("Please enter a city name.");

        return;
    }


    weatherDiv.innerHTML =
        "⏳ Loading weather...";


    try {

        const response = await fetch(
            `/weather?city=${encodeURIComponent(city)}`
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.error || "Unable to get weather."
            );
        }


        displayWeather(data);


    } catch (error) {

        console.error(error);


        weatherDiv.innerHTML = `
            <p>❌ ${error.message}</p>
        `;
    }
}


// ===============================
// USE MY LOCATION
// ===============================

function getMyLocation() {


    if (!navigator.geolocation) {

        weatherDiv.innerHTML =
            "❌ Geolocation is not supported.";

        return;
    }


    weatherDiv.innerHTML =
        "📍 Getting your location...";


    navigator.geolocation.getCurrentPosition(

        async function(position) {


            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            console.log(
                "Latitude:",
                latitude
            );

            console.log(
                "Longitude:",
                longitude
            );


            weatherDiv.innerHTML =
                "🌤️ Getting local weather...";


            try {


                const response = await fetch(
                    `/weather?lat=${latitude}&lon=${longitude}`
                );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.error ||
                        "Unable to get weather."
                    );
                }


                displayWeather(data);


            } catch (error) {

                console.error(error);


                weatherDiv.innerHTML = `
                    <p>❌ ${error.message}</p>
                `;
            }

        },


        function(error) {


            console.error(
                "Location error:",
                error
            );


            if (error.code === 1) {

                weatherDiv.innerHTML =
                    "❌ Location permission denied.";

            }

            else if (error.code === 2) {

                weatherDiv.innerHTML =
                    "❌ Location unavailable.";

            }

            else if (error.code === 3) {

                weatherDiv.innerHTML =
                    "❌ Location request timed out.";

            }

            else {

                weatherDiv.innerHTML =
                    "❌ Unable to get your location.";
            }

        },


        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }

    );
}


// ===============================
// BUTTONS
// ===============================

searchBtn.addEventListener(
    "click",
    searchWeather
);


locationBtn.addEventListener(
    "click",
    getMyLocation
);


// ===============================
// ENTER KEY
// ===============================

cityInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            searchWeather();

        }

    }
);