const apiKey = "2f6da859f534b1518d9e9dcc3ca31ded";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("city");
const weatherDiv = document.getElementById("weather");

searchBtn.addEventListener("click",async () => {
    const city = cityInput.value;

    if(city ===""){
        weatherDiv.innerHTML = "<p>Please enter a city name.</p>";
        return;
    }
    const url =`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    
    try{
        
        const response = await fetch(url);
        
        const data = await response.json();

    if(data.cod == "404"){
        weatherDiv.innerHTML="<p>City not found!</p>";
        return;

    }
     weatherDiv.innerHTML = ` 
    <h2>${data.name}</h2>
    <p> 🌡️ Temperature: ${Math.round(data.main.temp)} &degC</p>
    <p> ❄️ Humidity:${data.main.humidity}%</p>
    <p> 🍃 Wind Speed:${data.wind.speed}m/s</p>
    `;
}catch(error){
    weatherDiv.innerHTML = "<p>Something went wrong!</p>";

}
   

})