const getJulianDate = (date = new Date()) => {
    const time = date.getTime();
    const tzoffset = date.getTimezoneOffset()

    return (time / 86400000) - (tzoffset / 1440) + 2440587.5;
}

const LUNAR_MONTH = 29.530588853;
const getLunarAge = (date = new Date()) => {
    const percent = getLunarAgePercent(date);
    const age = percent * LUNAR_MONTH;
    return age;
}
const getLunarAgePercent = (date = new Date()) => {
    return normalize((getJulianDate(date) - 2451550.1) / LUNAR_MONTH);
}
const normalize = value => {
    value = value - Math.floor(value);
    if (value < 0)
        value = value + 1
    return value;
}

const getLunarPhase = (date = new Date()) => {
    const age = getLunarAge(date);
    if (age < 1.84566)
        return 'New Moon';
    else if (age < 5.53699)
        return 'Waxing Crescent';
    else if (age < 9.22831)
        return 'First Quarter';
    else if (age < 12.91963)
        return 'Waxing Gibbous';
    else if (age < 16.61096)
        return 'Full Moon';
    else if (age < 20.30228)
        return 'Waning Gibbous';
    else if (age < 23.99361)
        return 'Last Quarter';
    else if (age < 27.68493)
        return 'Waning Crescent';
    return 'New Moon';
}

var apikeys = {
    'geocode.maps.co': '6647f58a9bd33364441261djv0cc141'
}

if (localStorage.getItem('apikeys')) {
    let apikeys_locals = JSON.parse(localStorage.getItem('apikeys'));
    Object.keys(apikeys_locals).forEach(key => {
        apikeys[key] = apikeys_locals[key];
    });
}

if (localStorage.getItem('background')) {
    document.body.style.background = localStorage.getItem('background');
} else {
    document.body.style.background = 'linear-gradient(rgb(69, 129, 191) 0%, rgb(108, 164, 223) 100%)';
}

const places = {
    'HK': ['Central and Western District', 'Eastern District', 'Kwai Tsing', 'Islands District', 'North District', 'Sai Kung', 'Sha Tin', 'Southern District', 'Tai Po', 'Tsuen Wan', 'Tuen Mun', 'Wan Chai', 'Yuen Long', 'Yau Tsim Mong', 'Sham Shui Po', 'Kowloon City', 'Wong Tai Sin', 'Kwun Tong']
}

var weather = {
    condition: 'clear', // clear, precipitation, cloudy
    time: 'noon',
    precipitation: 'rain', // none, rain, **snow, sleet**
    clouds: 'medium', // none, clear, light,, medium, heavy
    wind: 10, // none, number in km/h
    lightning: false
}

function F(position) {
    let url = `https://geocode.maps.co/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&api_key=${apikeys['geocode.maps.co']}`;
    fetch(url, {
        method: 'GET'
    }).then(response => response.json()).then(data => {
        if (data.address.state == 'Hong Kong') {
            user.location = 'HK'
            user.address = data.address;
            places.HK.forEach((district) => {
                if (data.display_name.includes(district)) {
                    user.district = district;
                }
            });

            fetchApi('weather', 'HK').then(data => {
                if (data.uvindex.data[0].value < 4 && weather.condition == 'clear') {
                    weather.condition = 'cloudy';
                }
                data.rainfall.data.forEach((rainfall) => {
                    if (rainfall.place == user.district.replace('and', '&')) {
                        if (rainfall.max > 0) {
                            weather.condition = 'precipitation';
                            weather.precipitation = 'rain';
                        }
                    }
                });

                if (data.lightning) {
                    data.lightning.data.forEach((lightning) => {
                        if (lightning.place == user.district.replace('and', '&')) {
                            weather.lightning = lightning.occur;
                        }
                    });
                }

                fetch(`https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&current=wind_speed_10m`)
                    .then(response => response.json())
                    .then(data => {
                        weather.wind = data.current.wind_speed_10m;
                        $('.location').style.opacity = .05;
                        updateWeather();
                    });
            });

        } else {
            updateWeather();
        }
    }).catch(() => {
        $('.api').style.display = 'block';
    });
}

if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
        F(position);
    }, () => {
        console.log('Failed to retrieve location.');
        if (localStorage.getItem('place')) {
            $('.location').innerHTML = localStorage.getItem('place');
            let position = {
                coords: {
                    latitude: parseFloat(localStorage.getItem('place').split(',')[0]),
                    longitude: parseFloat(localStorage.getItem('place').split(',')[1])
                }
            };
            F(position);
            return;
        } else {
            $('.location').innerHTML = `
        <icon data-icon="pin"></icon>
        <span>
        Failed to retrieve location.
        <br>Please enable location services
        <br>or <a href="/settings/?tab=api" class="underlined">enter manually in Settings.</a>
        </span>`;
            $('.location').style.opacity = 1;
            $('.location').classList.add('error');
            icons();
        }
    });
} else {
    console.log('[Geolocation API not available]');
}

