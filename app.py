from flask import Flask, render_template, request, jsonify
import requests
import os

app = Flask(__name__)

# Put your OpenWeather API key here
API_KEY =  os.environ.get("API_KEY")


# ===============================
# HOME PAGE
# ===============================

@app.route("/")
def home():
    return render_template("index.html")


# ===============================
# WEATHER API
# ===============================

@app.route("/weather")
def weather():

    city = request.args.get("city")
    lat = request.args.get("lat")
    lon = request.args.get("lon")

    # Check whether we received either
    # city OR latitude + longitude
    if not city and not (lat and lon):
        return jsonify({
            "error": "Please enter a city name or use your location."
        }), 400


    # OpenWeather API
    url = "https://api.openweathermap.org/data/2.5/weather"


    # Basic parameters
    params = {
        "appid": API_KEY,
        "units": "metric"
    }


    # ===============================
    # SEARCH BY LOCATION
    # ===============================

    if lat and lon:

        params["lat"] = lat
        params["lon"] = lon

    else:

        params["q"] = city


    try:

        # Request weather from OpenWeather
        response = requests.get(
            url,
            params=params,
            timeout=10
        )


        # Convert response to JSON
        data = response.json()


        print("OpenWeather response:")
        print(data)


        # Check OpenWeather error
        if response.status_code != 200:

            return jsonify({
                "error": data.get(
                    "message",
                    "Unable to get weather."
                )
            }), response.status_code


        # ===============================
        # EXTRACT WEATHER DATA
        # ===============================

        temperature = data["main"]["temp"]

        feels_like = data["main"]["feels_like"]

        humidity = data["main"]["humidity"]

        wind_speed = data["wind"]["speed"]

        weather_description = data["weather"][0]["description"]

        weather_main = data["weather"][0]["main"]

        location_name = data["name"]

        country = data["sys"]["country"]


        # ===============================
        # SEND CLEAN DATA TO JAVASCRIPT
        # ===============================

        return jsonify({

            "city": location_name,

            "country": country,

            "temperature": temperature,

            "feels_like": feels_like,

            "humidity": humidity,

            "wind_speed": wind_speed,

            "weather": weather_description,

            "weather_main": weather_main

        })


    except requests.exceptions.RequestException as e:

        print("Request error:", e)

        return jsonify({
            "error": "Could not connect to weather service."
        }), 500


    except Exception as e:

        print("Error:", e)

        return jsonify({
            "error": "Something went wrong while getting weather data."
        }), 500


# ===============================
# RUN FLASK
# ===============================

if __name__ == "__main__":
    app.run(debug=True)