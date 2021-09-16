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
// const weatherBtn = document.querySelector('.weather-btn');
const forecastBtn = document.querySelector('.forecast-btn');
// const card = document.getElementById('card');
const setIcon = document.querySelector('.icon');
const city = document.querySelector('.city');
const sunriseText = document.querySelector('.sunrise');
const sunsetText = document.querySelector('.sunset');
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
                    // convert the date to string, display only the hour and the minutes
                    sunriseText.textContent = `${sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                    sunsetText.textContent = `${sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                    // Set the icon
                    setIcons(icon, setIcon);

                    // Change between celsius and fahrenheit
                    degree.addEventListener('click', () => {
                        if (degree.textContent == celsius + ` \xB0C`) {
                            degree.textContent = fahrenheit + ` \xB0F`;
                        } else {
                            degree.textContent = celsius + ` \xB0C`;
                        }
                    });

                    // initMap()
                })
        });
    };

});


form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchForACity = searchInput.value;
    const api = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=metric&q=${searchForACity}`;
    // console.log(api);
    fetch(api)
        .then((response) => {
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
            // convert the date to string, display only the hour and the minutes
            sunriseText.textContent = `${sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            sunsetText.textContent = `${sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            // Set the icon
            setIcons(icon, setIcon);
            searchInput.value = '';


        })
});

forecastBtn.addEventListener('click', () => {
    const searchForACity = searchInput.value;
    const api = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&units=metric&q=${searchForACity}`;
    fetch(api)
        .then((response) => {
            return response.json();
        })
        .then((data) => {

        })
});

// function to set the icon and background image
const setIcons = (icon, iconId) => {
    const skycons = new Skycons({ color: 'white' });
    let currentIcon;
    if (icon === '01d') {
        currentIcon = "CLEAR_DAY";
        container.style.backgroundImage = `url('./css/images/${currentIcon}.jpg')`;
    } else if (icon === '01n') {
        currentIcon = 'CLEAR_NIGHT';
        container.style.backgroundImage = `url('./css/images/${currentIcon}.jpg')`;
    } else if (icon === '02d') {
        currentIcon = 'PARTLY_CLOUDY_DAY';
        container.style.backgroundImage = `url('./css/images/${currentIcon}.jpg')`;
    } else if (icon === '02n') {
        currentIcon = 'PARTLY_CLOUDY_NIGHT';
        container.style.backgroundImage = `url('./css/images/${currentIcon}.jpg')`;
    } else if (icon === '03d' || icon === '03n' || icon === '04d' || icon === '04n') {
        currentIcon = 'CLOUDY';
        container.style.backgroundImage = `url('./css/images/${currentIcon}.jpg')`;
    } else if (icon === '09d' || icon === '09n' || icon === '10d' || icon === '10n' || icon === '11d' || icon === '11n') {
        currentIcon = 'RAIN';
        container.style.backgroundImage = `url('./css/images/${currentIcon}.jpg')`;
    } else if (icon === '13d' || icon === '13n') {
        currentIcon = 'SNOW';
        container.style.backgroundImage = `url('./css/images/${currentIcon}.jpg')`;
    } else if (icon === '50d' || icon === '50n') {
        currentIcon = 'FOG';
        container.style.backgroundImage = `url('./css/images/${currentIcon}.jpg')`;
    }
    // start the animation
    skycons.play()
    // return the icon to the DOM in the canvas
    return skycons.set(iconId, Skycons[currentIcon]);
}

const initMap = () => {
    let location = { latitude: 46.771210, longitude: 23.623634 };
    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: location
    })
}


//  Create Small Icons for sunrise and sunset
let skycons = new Skycons({ color: "white" });
skycons.set("clear_day", Skycons.CLEAR_DAY);
skycons.set("clear_night", Skycons.CLEAR_NIGHT);
skycons.play();
