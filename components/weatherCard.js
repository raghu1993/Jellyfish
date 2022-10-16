import React, { useState, useEffect } from "react";
import Select from 'react-select'
import cityList from "../cities-fr.json"
const CITY_LIST = cityList;
const API_KEY = '83b60ddee5e09c76847f6f28a20d1b24';


const Weather = () => {

    const [selectedOption, setOption] = useState(CITY_LIST[0]);
    const [selectedWeather, setCurrentWeather] = useState({});
    const [selectedForecastWeather, setForecastWeather] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchResponse();
    },[])

    const WindSpeed = (speed) => {
        return <span className="speed-report"> {Math.ceil(speed.windProps.wind.speed)} &#176; </span>
    }
    const WindIcon = (icon) => {
        return <div className={`wi wi-icon-${icon.iconProps}  ${icon.isLargeIcon === 'true' ? "largeFont" : "smallFont"}`}> </div>
    }

    const Loader = () => {
        return <div style={{ 'text-align' : '-webkit-center'}}>
            <div className="loader"></div>
        </div>
    }

    const Content = () => {
        return <div key={'mainContent'}>
            {selectedWeather && selectedWeather.weather &&
                <div style={{ display: 'grid' }} className="icon-container">
                    <WindIcon isLargeIcon='true' iconProps={selectedWeather.weather[0].id} />
                    <WindSpeed windProps={selectedWeather} />
                </div>
            }

            {selectedForecastWeather && Object.keys(selectedForecastWeather).length &&
                <div>
                    <div style={{ display: 'flex', 'justifyContent': 'space-around' }} className="city mx-8">
                        {Object.entries(selectedForecastWeather).map(([weather, ind]) => {
                            return <span key={ind}> {new Date(weather).toString().substr(0, 3)} </span>
                        })
                        }

                    </div>
                    <div style={{ display: 'flex', 'justifyContent': 'space-around' }} className="icon-container">
                        {Object.entries(selectedForecastWeather).map(([objKey, value,position]) => (
                            <div style={{ 'marginLeft': '5px', 'marginRight': '5px' }} key={position}>
                                {value.map((item, index) => {
                                    return <div style={{ display: 'grid', 'justifyContent': 'space-around' }} key={index}>
                                        {index === 0 && <WindIcon isLargeIcon='false' iconProps={item.weather[0].id} />}
                                        <WindSpeed windProps={item} />
                                    </div>
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    }

    const fetchResponse = () => {
        apiWeather();
        apiForecast();
    }

    const handleChange = (selectedOption) => {
        setOption(selectedOption);
        console.log(`Option selected:`, selectedOption);
        fetchResponse();
        
    }
    const apiWeather = () => {
        setLoading(true);
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${selectedOption.lat}&lon=${selectedOption.lon}&appid=${API_KEY}`)
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
                setCurrentWeather(json);
            })
    }
    const apiForecast = () => {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${selectedOption.lat}&lon=${selectedOption.lon}&appid=${API_KEY}`)
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
                let groups = {};
                json.list.forEach((item) => {
                    let date = item.dt_txt.split(' ')[0];
                    if (date in groups) {
                        if ( groups[date].length <= 1) groups[date].push(item);
                    } else if (new Date(date).getDate() != new Date().getDate() && Object.keys(groups).length <= 2) {
                        groups[date] = new Array(item);
                    }
                });
                console.log(groups);
                setForecastWeather(groups);
                setTimeout(() => {
                    setLoading(false); 
                }, 1200);
            })
    }
    return (
        <div className="card-width">
            <div className="card bg">
                <h4 className="text-white">Selectionner votre ville</h4>
                <Select
                    value={selectedOption}
                    onChange={handleChange}
                    options={CITY_LIST} />
                
                <div className="city mx-8"> {selectedOption.label} </div>

                {loading ? <Loader /> : <Content />}

            </div>
        </div>
    )
}

export default Weather

