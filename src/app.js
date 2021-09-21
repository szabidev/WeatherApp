const apiKey = 'e3d1330544a411ece3ab810cf8b51ce5';
// Get the current day
const currentDay = new Date().toLocaleString('en-us', { weekday: 'long' });
// Get current time
const today = new Date();
const dayDate = String(today.getDate()).padStart(2, '0');
const month = String(today.getMonth() + 1).padStart(2, '0'); // + 1 because January is 0
const year = today.getFullYear();
const currentDate = `${dayDate}/${month}/${year}`;

// DOM elements
const container = document.querySelector('.container');
const form = document.querySelector('.form-control');
const searchInput = document.querySelector('.form-input');
const forecastBtn = document.querySelector('.forecast-btn');

const canvas = document.querySelector('.canvas');
const setIcon = document.querySelector('.icon');
const city = document.querySelector('.city');
const sunriseText = document.querySelector('.sunrise');
const sunsetText = document.querySelector('.sunset');
const countryText = document.querySelector('.country');
// make it clickable to change from celsius to fahrenheit
const degreeText = document.querySelector('.degree');
const descriptionText = document.querySelector('.description');
const day = document.querySelector('.day');
const date = document.querySelector('.date');

const forecastContainer = document.querySelector('.forecast-container');
const forecast = document.querySelector('.forecast');
const forecastDate = document.querySelector('.forecast-date');
const forecastTemp = document.querySelector('.forecast-temperature');
const forecastTime = document.querySelector('.time-string');

const googleMap = document.getElementById('map');

//  Create Small Icons for sunrise and sunset
let skycons = new Skycons({ color: "white" });
skycons.set("clear_day", Skycons.CLEAR_DAY);
skycons.set("clear_night", Skycons.CLEAR_NIGHT);
skycons.play();


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
                    // Extract the values from the data object
                    const name = data.name;
                    const celsius = Math.round(data.main.temp);
                    // convert celsius to fahrenheit
                    const fahrenheit = (celsius * 9) / 5 + 32;
                    const country = data.sys.country;
                    const description = data.weather[0].description;
                    // Convert the two dates to GMT 
                    const sunrise = new Date(data.sys.sunrise * 1000);
                    const sunset = new Date(data.sys.sunset * 1000);
                    const icon = data.weather[0].icon;
                    // Update the DOM with the informations I got back
                    city.textContent = name;
                    countryText.textContent = country;
                    degreeText.textContent = celsius + ` \xB0C`;
                    descriptionText.textContent = description;
                    day.textContent = currentDay;
                    date.textContent = currentDate;
                    // convert the date to string, display only the hour and the minutes
                    sunriseText.textContent = `${sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                    sunsetText.textContent = `${sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                    // Set the icon
                    setIcons(icon, setIcon);
                    // Set the background
                    changeBackground(icon);
                    // Change between celsius and fahrenheit
                    degreeText.addEventListener('click', () => {
                        if (degreeText.textContent == celsius + ` \xB0C`) {
                            degreeText.textContent = fahrenheit + ` \xB0F`;
                        } else {
                            degreeText.textContent = celsius + ` \xB0C`;
                        }
                    });
                });
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
            const name = data.name;
            const celsius = Math.round(data.main.temp);
            const country = data.sys.country;
            const description = data.weather[0].description;
            const sunrise = new Date(data.sys.sunrise * 1000);
            const sunset = new Date(data.sys.sunset * 1000);
            const icon = data.weather[0].icon;
            city.textContent = name;
            countryText.textContent = country;
            degreeText.textContent = celsius + ` \xB0C`;
            descriptionText.textContent = description;
            day.textContent = currentDay;
            date.textContent = currentDate;
            sunriseText.textContent = `${sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            sunsetText.textContent = `${sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
            setIcons(icon, setIcon);
            changeBackground(icon);
            searchInput.value = '';
            forecastContainer.innerHTML = '';
        });
});

forecastBtn.addEventListener('click', () => {
    const searchForACity = city.textContent;
    const api = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&units=metric&q=${searchForACity}`;
    forecastContainer.innerHTML = '';
    console.log(api);
    fetch(api)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            for (let i = 0; i < data.list.length; i++) {
                const icon = data.list[i].weather[0].icon;
                const temperature = Math.round(data.list[i].main.temp);
                // const fahrenheit = (temperature * 9) / 5 + 32;
                const description = data.list[i].weather[0].description;
                const today = new Date(data.list[0].dt * 1000).getDate();
                const timeString = data.list[i].dt_txt;
                const time = timeString.substring(11, 16);
                // use this date, date variable above gives incorrect date
                const date = timeString.substring(8, 10);
                const forecastIcon = document.querySelector('.forecast-icon');
                let output = document.createElement('div');
                output.classList.add('forecast');
                output.innerHTML = `
                <canvas class="forecast-icon" width="32" height="32" style="color: 'var(--dark-color)'"></canvas>
                <p class="forecast-date">${date}.</p>
                <p class="forecast-description">${description}</p>
                <p class="forecast-temperature">${temperature} \xB0C</p>
                <p class="time-string">${time}</p>
                `;

                if (date == today) {
                    output.style.gridRow = '1';
                } else if (date == today + 1) {
                    output.style.gridRow = '2';
                } else if (date == today + 2) {
                    output.style.gridRow = '3';
                } else if (date == today + 3) {
                    output.style.gridRow = '4';
                } else if (date == today + 4) {
                    output.style.gridRow = '5';
                } else if (date == today + 5) {
                    output.style.gridRow = '6';
                }
                forecastContainer.appendChild(output);
                setIcons(icon, forecastIcon);

                // degreeText.addEventListener('click', () => {
                //     if (forecastContainer) {
                //         if (forecastTemp.textContent == temperature + ` \xB0C`) {
                //             forecastTemp.textContent = fahrenheit + ` \xB0F`;
                //         } else {
                //             forecastTemp.textContent = temperature + ` \xB0C`;
                //         }
                //     }
                // });
            };
        });
});

const setIcons = (icon, iconId) => {
    const skycons = new Skycons({ color: 'white' });
    let currentIcon;
    if (icon === '01d') {
        currentIcon = "CLEAR_DAY";
    } else if (icon === '01n') {
        currentIcon = 'CLEAR_NIGHT';
    } else if (icon === '02d') {
        currentIcon = 'PARTLY_CLOUDY_DAY';
    } else if (icon === '02n') {
        currentIcon = 'PARTLY_CLOUDY_NIGHT';
    } else if (icon === '03d' || icon === '03n' || icon === '04d' || icon === '04n') {
        currentIcon = 'CLOUDY';
    } else if (icon === '09d' || icon === '09n' || icon === '10d' || icon === '10n' || icon === '11d' || icon === '11n') {
        currentIcon = 'RAIN';
    } else if (icon === '13d' || icon === '13n') {
        currentIcon = 'SNOW';
    } else if (icon === '50d' || icon === '50n') {
        currentIcon = 'FOG';
    }
    // start the animation
    skycons.play()
    // return the icon to the DOM in the canvas
    return skycons.set(iconId, Skycons[currentIcon]);
}

const changeBackground = (icon) => {
    if (icon === '01d') {
        container.style.backgroundImage = `url('./css/images/CLEAR_DAY.jpg')`;
        changeFontToBlack();
    } else if (icon === '01n') {
        container.style.backgroundImage = `url('./css/images/CLEAR_NIGHT.jpg')`;
        changeFontToGray();
    } else if (icon === '02d') {
        container.style.backgroundImage = `url('./css/images/PARTLY_CLOUDY_DAY.jpg')`;
        changeFontToBlack()
    } else if (icon === '02n') {
        container.style.backgroundImage = `url('./css/images/PARTLY_CLOUDY_NIGHT.jpg')`;
        changeFontToGray()
    } else if (icon === '03d' || icon === '03n' || icon === '04d' || icon === '04n') {
        container.style.backgroundImage = `url('./css/images/CLOUDY.jpg')`;
        changeFontToGray();
    } else if (icon === '09d' || icon === '09n' || icon === '10d' || icon === '10n' || icon === '11d' || icon === '11n') {
        container.style.backgroundImage = `url('./css/images/RAIN.jpg')`;
        changeFontToBlack();
    } else if (icon === '13d' || icon === '13n') {
        container.style.backgroundImage = `url('./css/images/SNOW.jpg')`;
        changeFontToGray();
    } else if (icon === '50d' || icon === '50n') {
        container.style.backgroundImage = `url('./css/images/FOG.jpg')`;
        changeFontToBlack();
    }
};

const changeFontToBlack = () => {
    city.style.color = 'var(--dark-color)';
    countryText.style.color = 'var(--dark-color)';
    degreeText.style.color = 'var(--dark-color)';
    descriptionText.style.color = 'var(--dark-color)';
    day.style.color = 'var(--dark-color)';
    date.style.color = 'var(--dark-color)';
    sunriseText.style.color = 'var(--dark-color)';
    sunsetText.style.color = 'var(--dark-color)';

}

const changeFontToGray = () => {
    city.style.color = 'var(--gray-color-3)'
    countryText.style.color = 'var(--gray-color-3)';
    degreeText.style.color = 'var(--gray-color-3)';
    descriptionText.style.color = 'var(--gray-color-3)';
    day.style.color = 'var(--gray-color-3)';
    date.style.color = 'var(--gray-color-3)';
    sunriseText.style.color = 'var(--gray-color-3)';
    sunsetText.style.color = 'var(--gray-color-3)';
    if (forecastContainer != null) {
        console.log(forecastContainer.querySelector('.forecast'));
    }
}


// const changeIconColor = (iconId) => {
//     const left = iconId.getBoundingClientRect().left;
//     const top = iconId.getBoundingClientRect().top;
//     const width = iconId.getBoundingClientRect().width;
//     const height = iconId.getBoundingClientRect().height;
//     const ctx = iconId.getContext('2d');
//     ctx.fillStyle = '#343A40';
//     ctx.fillRect(left, top, width, height);
//     console.log(left, top, width, height)
//     console.log(ctx);
// }


// Typing problem, ex. cluj napoca gives error - cluj-napoca works -resolve
// Problem adding google map to webpage
// DRY
// Problem changing Icon color
// On click on degree change the values to fahrenheit in forecast containers