import {useState} from "react"
import "./App.css"
import PropTypes from "prop-types"

/*IMAGES*/
import sunIcon from './assets/images/sun.jpg'
import moonIcon from './assets/images/moon.png'
import mistIcon from './assets/images/mist.png'
import thunderIcon from './assets/images/thunder.png'
import brokenCloudIcon from './assets/images/brokenclouds.png'
import cloudIcon from './assets/images/cloud.png'
import rainIcon from './assets/images/rain1.png'
import rainnIcon from './assets/images/rain2.png'
import showerRainIcon from './assets/images/showerrain.png'
import snowIcon from './assets//images/snow1.png'
import fewCloudIcon from './assets/images/fewclouds.png'
import feewCloudsIcon from './assets//images/feewclouds.png'


import humidIcon from './assets/images/humid.png'
import windIcon from './assets//images/wind.png'
import searchIcon from './assets/images/search.png'




const WeatherDetails = ({icon, temp, city, country, lat, log, humidity, wind, timezone}) =>{

  const getTime = (timezone) => {
    const currentDate = new Date();
    const utc = currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000);
    const localTime = new Date(utc + (1000 * timezone));
    return localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getDate = (timezone) => {
    const currentDate = new Date();
    const utc = currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000);
    const localDate = new Date(utc + (1000 * timezone));
    return localDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const time = getTime(timezone);
  const date = getDate(timezone);

return (<>
    <div className="image"> 
      <img src={icon} alt="Image" />
    </div>
    <div className="temp">{temp}°C</div>
    <div className="location">{city}</div>
    <div className="country">{country}</div>
    
    <div className="element  date">
        <p>Date:<span>{date}</span></p>
        <p>TIme:<span>{time}</span></p>
      </div>
    <div className="cord">
      <div>
        <span className="lat">Latitude </span>
        <span>{lat}</span>
      </div>
      <div>
        <span className="log">Longitude </span>
        <span>{log}</span>
        </div>
    </div>

    <div className="data-container">
      <div className="element">
        <img src={humidIcon} alt="Humidity" className="icon" />
        <div className="data">
          <div className="humidity-percent">{humidity}%</div>
          <div className="text">Humidity</div>
        </div>
      </div>

      <div className="element">
        <img src={windIcon} alt="Wind" className="icon" />
        <div className="data">
          <div className="wind-percent">{wind} km/h</div>
          <div className="text">Wind Speed</div>
        </div>
      </div>
      
    </div>
  </>)
}



WeatherDetails.propTypes = {
  icon : PropTypes.string.isRequired,
  temp : PropTypes.number.isRequired,
  city : PropTypes.string.isRequired,
  country : PropTypes.string.isRequired,
  humidity : PropTypes.number.isRequired,
  wind : PropTypes.number.isRequired,
  lat : PropTypes.number.isRequired,
  log : PropTypes.number.isRequired
}

export const App = () => {
let api_key = "7ad1f7c00f3955fc087a9357db7978d6"

const [text, setText] = useState("")

const [icon, setIcon] = useState(sunIcon);
const [temp, setTemp] = useState(0)
const [city, setCity] = useState("")
const [country, setCountry] = useState("IN")
const [lat, setLat] = useState(0)
const [log, setLog] = useState(0)
const [timezone, setTimeZone] = useState()

const [humidity, setHumidity] = useState(0)
const [wind, setWind] = useState(0)

const [cityNotFound, setCityNotFound] = useState(false)
const [loading, setLoading] = useState(false)

const [error, setError] = useState(null)

const weatherIconMap ={
  "01d" : sunIcon,
  "01n" : moonIcon,
  "02d" : fewCloudIcon,
  "02n" : feewCloudsIcon,
  "03d" : cloudIcon,
  "03n" : cloudIcon,
  "04d" : brokenCloudIcon,
  "04n" : brokenCloudIcon,
  "09d" : showerRainIcon,
  "09n" : showerRainIcon,
  "10d" : rainIcon,
  "10n" : rainnIcon,
  "11d" : thunderIcon,
  "11n" : thunderIcon,
  "13d" : snowIcon,
  "13n" : snowIcon,
  "50d" : mistIcon,
  "50n" : mistIcon
}

const search = async () =>{

  setLoading(true)

  let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`
  console.log(url)


  try{
    let res = await fetch(url)
    let data = await res.json()
    
    if(data.cod === "404"){
      console.log("City not found")

      setCityNotFound(true)
      setLoading(false)
      return
    }

    setHumidity(data.main.humidity)
    setWind(data.wind.speed)
    setTemp(Math.floor(data.main.temp))
    setCity(data.name)
    setCountry(data.sys.country)
    setLat(data.coord.lat)
    setLog(data.coord.lon)
    const weatherIconCode = data.weather[0].icon
    setIcon(weatherIconMap[weatherIconCode] || clearIcon)
    setCityNotFound(false)
    setTimeZone(data.timezone)

  } catch (error){
    console.error("An error occured:", error.message)
    setError("An error occured while fetching weather data...")
  } finally{
    setLoading(false)
  }
}

  const handleCity = (e) =>{
    setText(e.target.value)
  }

  const handleKeyDown = (e) =>{
    if (e.key === "Enter"){
      search();
    }
  }

  return (
    <>
      <div className="container">
        <div className="input-container">
          <input type="text" className="city-input" placeholder="Search City" onChange={handleCity} value={text} onKeyDown={handleKeyDown} />
          <div className=" search-icon">
            <img src={searchIcon} alt="Search" width="20px" onClick={() => search()} />
          </div>
        </div>
        
        { loading && <div className="loading-message">Loading...</div>}
        { error && <div className="error-message">{error}</div>}
        { cityNotFound && <div className="city-not-found">City not found</div>}
        
        { !loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} wind={wind} humidity={humidity} timezone={timezone} />}
        
      
        <p className="copyright"> Designed by <span>Benzz</span></p>
      </div>
    </>
  )
}


