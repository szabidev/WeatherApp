const apiKey = 'e3d1330544a411ece3ab810cf8b51ce5';
// Get the current day
const currentDay = new Date().toLocaleString('en-us', { weekday: 'long' });
// Get current time
const today = new Date();
const dayDate = String(today.getDate()).padStart(2, '0');
const month = String(today.getMonth() + 1).padStart(2, '0') // + 1 because January is 0
const year = today.getFullYear();
const currentDate = `${dayDate}/${month}/${year}`

// DOM elements
const container = document.querySelector('.container');
const form = document.querySelector('.form-control');
const searchInput = document.querySelector('.form-input');
const weatherBtn = document.querySelector('.weather-btn');
const forecastBtn = document.querySelector('forecast-btn');
const card = document.getElementById('card');
const setIcon = document.querySelector('.icon');
const city = document.querySelector('.city');
const countryText = document.querySelector('.country');
// make it clickable to change from celsius to fahrenheit
const degree = document.querySelector('.degree');
const unit = document.querySelector('.unit');
const descriptionText = document.querySelector('.description');
const day = document.querySelector('.day');
const date = document.querySelector('.date');
const googleMap = document.querySelector('.google-map-container');


// add an event listener to display the current weather for the users location
window.addEventListener('load', () => {
    // declare longitude and latitude
    let lat;
    let long;

    if (navigator.geolocation) {
        // Get the users longitude and latitude and store it in variables
        navigator.geolocation.getCurrentPosition((position) => {
            lat = position.coords.latitude;
            long = position.coords.longitude;
            const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`;
            // console.log(api);

            fetch(api)
                .then((response) => {
                    // Converts the response into JSON object
                    // console.log(response.json());
                    return response.json();
                })
                .then((data) => {
                    // Extract the valuse from the data object
                    const name = data.name;
                    const celsius = Math.round(data.main.temp);
                    // convert celsius to fahrenheit
                    const fahrenheit = (celsius * 9) / 5 + 32;
                    const country = data.sys.country;
                    const description = data.weather[0].description;
                    // Convert the two dates to GMT 
                    const sunrise = new Date(data.sys.sunrise * 1000);
                    const sunset = new Date(data.sys.sunset * 1000);
                    // console.log(name, temperature, country, description);
                    // console.log(sunrise, sunset);
                    const icon = data.weather[0].icon;
                    // Update the DOM with the informations I got back
                    city.textContent = name;
                    countryText.textContent = country;
                    degree.textContent = celsius + ` \xB0C`;
                    descriptionText.textContent = description;
                    day.textContent = currentDay;
                    date.textContent = currentDate;
                    console.log(icon);
                    // Set the icon
                    setIcons(icon, setIcon);

                })
        });
    };

    // function to set the icon
    const setIcons = (icon, iconId) => {
        const skycons = new Skycons({ color: 'white' });
        let currentIcon;
        if (icon === '1d') {
            currentIcon = "CLEAR_DAY"
        } else if (icon === '1n') {
            currentIcon = 'CLEAR_NIGHT'
        } else if (icon === '02d') {
            currentIcon = 'PARTLY_CLOUDY_DAY'
        } else if (icon === '02n') {
            currentIcon = 'PARTLY_CLOUDY_NIGHT'
        } else if (icon === '03d' || icon === '03n' || icon === '04d' || icon === '04n') {
            currentIcon = 'CLOUDY'
        } else if (icon === '09d' || icon === '09n' || icon === '10d' || icon === '10n' || icon === '11d' || icon === '11n') {
            currentIcon = 'RAIN'
        } else if (icon === '13d' || icon === '13n') {
            currentIcon = 'SNOW'
        } else {
            currentIcon = 'FOG'
        }
        // start the animation
        skycons.play()
        // return the icon to the DOM in the canvas
        return skycons.set(iconId, Skycons[currentIcon]);
    }
});

// Function for background change