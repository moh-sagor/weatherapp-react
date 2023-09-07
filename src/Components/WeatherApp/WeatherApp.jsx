import React, { useState, useEffect } from 'react';
import './WeatherApp.css';
import search_icon from '../Assets/search.png';
import clear_icon from '../Assets/clear.png';
import cloud_icon from '../Assets/cloud.png';
import drizzle_icon from '../Assets/drizzle.png';
import rain_icon from '../Assets/rain.png';
import snow_icon from '../Assets/snow.png';
import wind_icon from '../Assets/wind.png';
import humidity_icon from '../Assets/humidity.png';

const WeatherApp = () => {
    let api_key = "5be9977166ac5309ba37f68a84fe71b2";
    const [wicon, setWicon] = useState(cloud_icon);
    const [localTime, setLocalTime] = useState("");
    const [localWeather, setLocalWeather] = useState({
        humidity: "64%",
        windSpeed: "18 km/h",
        temperature: "24°C",
        location: "Your Location"
    });

    const updateLocalTime = () => {
        const now = new Date();
        const formattedLocalTime = now.toLocaleTimeString(); // Adjust formatting as needed
        setLocalTime(formattedLocalTime);
    };
    useEffect(() => {
        updateLocalTime(); // Update initially
        // Set up an interval to update the time every second (adjust as needed)
        const intervalId = setInterval(() => {
            updateLocalTime();
        }, 1000); // Update every 1 second

        // Clean up the interval on component unmount
        return () => {
            clearInterval(intervalId);
        };
    }, []); // Empty dependency array to run the effect only once


    const fetchLocalWeather = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${api_key}`;
                    const response = await fetch(url);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.main) {
                            setLocalWeather({
                                humidity: `${data.main.humidity}%`,
                                windSpeed: `${data.wind.speed} km/h`,
                                temperature: `${data.main.temp}°C`,
                                location: data.name
                            });
                            if (data.weather[0].icon === "02d" || data.weather[0].icon === "02n") {
                                setWicon(cloud_icon);
                            }
                            else if (data.weather[0].icon === "01d" || data.weather[0].icon === "01n") {
                                setWicon(clear_icon);
                            }
                            else if (data.weather[0].icon === "03d" || data.weather[0].icon === "03n") {
                                setWicon(drizzle_icon);
                            }
                            else if (data.weather[0].icon === "04d" || data.weather[0].icon === "04n") {
                                setWicon(drizzle_icon);
                            }
                            else if (data.weather[0].icon === "09d" || data.weather[0].icon === "09n") {
                                setWicon(rain_icon);
                            }
                            else if (data.weather[0].icon === "10d" || data.weather[0].icon === "10n") {
                                setWicon(rain_icon);
                            }
                            else if (data.weather[0].icon === "13d" || data.weather[0].icon === "13n") {
                                setWicon(snow_icon);
                            }
                            else {
                                setWicon(clear_icon);
                            }
                        } else {
                            console.error("Weather data does not contain 'main' property.");
                        }
                    } else {
                        console.error(`Error fetching weather data: ${response.status} - ${response.statusText}`);
                    }
                } catch (error) {
                    console.error("An error occurred while fetching weather data:", error);
                }
            }, (error) => {
                console.error("Geolocation error:", error);
            });
        } else {
            console.error("Geolocation is not supported in this browser.");
        }
    };

    useEffect(() => {
        fetchLocalWeather(); // Fetch local weather data when the component mounts
    }, []);


    const search = async () => {
        let element = document.getElementById("cityInput");

        if (!element) {
            console.error("Input element with ID 'cityInput' not found.");
            return;
        }

        let inputValue = element.value.trim(); // Trim whitespace

        if (inputValue === "") {
            return;
        }

        try {
            let url = `https://api.openweathermap.org/data/2.5/weather?q=${inputValue}&units=metric&appid=${api_key}`;
            let response = await fetch(url);

            if (response.ok) {
                let data = await response.json();
                if (data.main) {
                    const humidity = document.getElementsByClassName("humidity-parcent");
                    const wind = document.getElementsByClassName("wind-rate");
                    const temperature = document.getElementsByClassName("weather-temp");
                    const location = document.getElementsByClassName("weather-location");

                    humidity[0].innerHTML = data.main.humidity + "%";
                    wind[0].innerHTML = data.wind.speed + " km/h";
                    temperature[0].innerHTML = data.main.temp + "°c";
                    location[0].innerHTML = data.name;


                    if (data.weather[0].icon === "02d" || data.weather[0].icon === "02n") {
                        setWicon(cloud_icon);
                    }
                    else if (data.weather[0].icon === "01d" || data.weather[0].icon === "01n") {
                        setWicon(clear_icon);
                    }
                    else if (data.weather[0].icon === "03d" || data.weather[0].icon === "03n") {
                        setWicon(drizzle_icon);
                    }
                    else if (data.weather[0].icon === "04d" || data.weather[0].icon === "04n") {
                        setWicon(drizzle_icon);
                    }
                    else if (data.weather[0].icon === "09d" || data.weather[0].icon === "09n") {
                        setWicon(rain_icon);
                    }
                    else if (data.weather[0].icon === "10d" || data.weather[0].icon === "10n") {
                        setWicon(rain_icon);
                    }
                    else if (data.weather[0].icon === "13d" || data.weather[0].icon === "13n") {
                        setWicon(snow_icon);
                    }
                    else {
                        setWicon(clear_icon);
                    }

                } else {
                    console.error("Weather data does not contain 'main' property.");
                }

            } else {
                console.error(`Error fetching weather data: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            console.error("An error occurred while fetching weather data:", error);
        }
    };

    return (
        <div className='container'>
            <div className="time">
                Your Time : {localTime}
            </div>
            <div className='top-bar'>
                <input type='text' className='cityInput' placeholder='Search' id='cityInput' />
                <div className='search-icon' onClick={() => { search() }}>
                    <img src={search_icon} alt='' />
                </div>
            </div>

            <div className="weather-image">
                <img src={wicon} alt="" />
            </div>
            <div className="weather-temp">{localWeather.temperature}</div> {/*alt+0176 = degree icon*/}
            <div className="weather-location">{localWeather.location}</div>
            <div className="data-container">
                <div className="element">
                    <img src={humidity_icon} alt=" " />
                    <div className="data">
                        <div className="humidity-parcent">{localWeather.humidity}</div>
                        <div className="text">Humidity</div>
                    </div>

                </div>
                <div className="element">
                    <img src={wind_icon} alt=" " />
                    <div className="data">
                        <div className="wind-rate">{localWeather.windSpeed}</div>
                        <div className="text">Wind Speed</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WeatherApp
