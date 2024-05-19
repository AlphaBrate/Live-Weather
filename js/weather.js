var user = {
    location: ''
}

// browser

var uap = new UAParser();
const ua = uap.getResult();
const browser = ua.browser.name;

const weather_const = {
    backgrounds: {
        clear: {
            noon: 'linear-gradient(180deg, #4581BF 0%, #6CA4DF 100%)',
            rs: 'linear-gradient(180deg, #4581BF 26.5%, #00FFB3 100%)',
            night: 'linear-gradient(180deg, #0A0A1F 26.5%, #29344F 100%)'
        },
        precipitation: {
            noon: 'linear-gradient(180deg, #6D7E90 0%, #485566 100%)',
            rs: 'linear-gradient(180deg, #486662 0%, #6D8C90 100%)',
            night: 'linear-gradient(180deg, #180909 0%, #3D3D3D 100%)'
        },
        cloudy: {
            noon: 'linear-gradient(180deg, #486662 0%, #6D8C90 100%)'
        }
    },
    clouds: {
        clear: {
            light: [
                '8918172',
                '8918198',
                '8918187',
                '8918176',
                '23422',
                '23428',
                '23429',
                '23437'
            ],
            medium: [
                '8918172',
                '8918198',
                '8918187',
                '8918176',
                '8918202',
                '8918191',
                '8918181',
                '12655465',
                '23422',
                '23428',
                '23429',
                '23437'
            ],
            heavy: [
                '8918172',
                '8918198',
                '8918187',
                '8918176',
                '8918202',
                '8918191',
                '8918181',
                '12655465',
                '23422',
                '23428',
                '23429',
                '23437'
            ]
        },
        cloudy: {
            light: [
                '8918172',
                '8918198',
                '8918187',
                '8918176',
                '23422',
                '23428',
                '23429',
                '23437'
            ],
            medium: [
                '8918172',
                '8918198',
                '8918187',
                '8918176',
                '8918202',
                '8918191',
                '8918181',
                '12655465',
                '23422',
                '23428',
                '23429',
                '23437'
            ],
            heavy: [
                '8918172',
                '8918198',
                '8918187',
                '8918176',
                '8918202',
                '8918191',
                '8918181',
                '12655465',
                '23422',
                '23428',
                '23429',
                '23437'
            ]
        },
        precipitation: {
            light: [
                '8918172',
                '8918198',
                '8918187',
                '8918176',
                '23422',
                '23428',
                '23429',
                '23437'
            ],
            medium: [
                '8918172',
                '8918198',
                '8918187',
                '8918176',
                '8918202',
                '8918191',
                '8918181',
                '12655465',
                '23422',
                '23428',
                '23429',
                '23437'
            ],
            heavy: [
                '8918172',
                '8918198',
                '8918187',
                '8918176',
                '8918202',
                '8918191',
                '8918181',
                '12655465',
                '23422',
                '23428',
                '23429',
                '23437'
            ]
        }
    }
}

const weather_actions = {
    precipitation: () => {
        try { $('.sun').remove(); } catch { }
        try { $('.moon').remove(); } catch { }

        clearAllClouds();
        // Add heavy clouds
        addClouds(50, {
            height: 20
        });
        $('.cloud', true).forEach(cloud => {
            // half the opacity
            cloud.style.opacity = cloud.style.opacity / 2;

            // randomly darken the cloud
            if (Math.random() > 0.4) {
                // 0.1 ~ 0.3
                cloud.style.filter = 'brightness(' + (Math.random() * 0.2 + 0.1) + ')';
                cloud.style.WebkitFilter = cloud.style.filter;
            }
        });

        // Add rain
        let precipitation = document.createElement('div');
        precipitation.className = 'precipitation';
        document.body.appendChild(precipitation);

        setInterval(() => {
            let number = weightedRandom([10, 150], { '70-100': 50 });
            for (let i = 0; i < number; i++) {
                let drop = document.createElement('div');
                drop.className = weather.precipitation + '-drop';
                drop.style.left = Math.random() * 100 + '%';
                let duration = Math.random() * 2 + 1;
                let delay = Math.random() * 2;
                drop.style.animationDuration = duration + 's';
                drop.style.animationDelay = delay + 's';
                // random --rain-height, must be between 5px and 30px
                drop.style.setProperty('--rain-height', Math.random() * 25 + 5 + 'px');
                precipitation.appendChild(drop);
                setTimeout(() => {
                    drop.remove();
                }, (duration + delay) * 1000);
            }
        }, 2000);
    },
    cloudy: () => {
        try { $('.moon').remove(); } catch { }

        clearAllClouds();

        // Add heavy clouds
        addClouds(100, {
            height: 20
        });

        $('.cloud', true).forEach(cloud => {
            // half the opacity
            cloud.style.opacity = cloud.style.opacity / 2;
            // randomly darken the cloud
            if (Math.random() > 0.5) {
                // 0.27 ~ 0.3
                cloud.style.filter = 'brightness(' + (Math.random() * 0.03 + 0.26) + ')';
                cloud.style.WebkitFilter = cloud.style.filter;
            }
        });


    }
}

var wallpaper = {
    animation: {
        speed: 1,
        will_fraze: false, // false or seconds
        infinite: true
    }
}

const apis = {
    'HK': {
        sun_rise_set: 'https://data.weather.gov.hk/weatherAPI/opendata/opendata.php?dataType=SRS&lang=en&rformat=json&year={YEAR}',
        moon_rise_set: 'https://data.weather.gov.hk/weatherAPI/opendata/opendata.php?dataType=MRS&lang=en&rformat=json&year={YEAR}',
        weather: 'https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en'
    }
}

var date = new Date();

const today = {
    'YYYY-MM-DD': date.toISOString().split('T')[0],
}

async function fetchApi(t, l) {
    return new Promise((resolve, reject) => {
        switch (t) {
            case 'srs':
                if (Object.keys(apis).includes(l)) {
                    let url = apis[l].sun_rise_set.replace('{YEAR}', new Date().getFullYear());
                    fetch(url)
                        .then(response => response.json())
                        .then(data => {
                            data.data.forEach(d => {
                                if (d[0] == [today['YYYY-MM-DD']]) {
                                    let D = {
                                        rise: d[1],
                                        transit: d[2],
                                        set: d[3]
                                    }
                                    resolve(D);
                                }
                            });

                        });
                }
                break;
            case 'mrs':
                if (Object.keys(apis).includes(l)) {
                    let url = apis[l].moon_rise_set.replace('{YEAR}', new Date().getFullYear());
                    fetch(url)
                        .then(response => response.json())
                        .then(data => {
                            data.data.forEach(d => {
                                if (d[0] == [today['YYYY-MM-DD']]) {
                                    let D = {
                                        rise: d[1],
                                        transit: d[2],
                                        set: d[3]
                                    }
                                    resolve(D);
                                }
                            });

                        });
                }
                break;
            case 'weather':
                if (Object.keys(apis).includes(l)) {
                    let url = apis[l].weather;
                    fetch(url)
                        .then(response => response.json())
                        .then(data => {
                            resolve(data);
                        });
                }
                break;
        }
    });
}

function addClouds(c = 1, d = { height: 10 }) {
    let clouds = weather_const.clouds[weather.condition][weather.clouds];
    for (let i = 0; i < c; i++) {
        let cloud = document.createElement('div');
        cloud.className = 'cloud';
        let cloudUrl = clouds[Math.floor(Math.random() * clouds.length)];
        // if cloudUrl contains a extension, use it, otherwise use .webp
        cloud.style.backgroundImage = `url(/assets/clouds/${cloudUrl}.${cloudUrl.includes('.') ? '' : 'webp'})`;
        // random top, must be between -10% and d.height
        cloud.style.top = Math.floor(Math.random() * d.height * 2) - d.height - 5 + '%';
        // random left, must be between 10% and 90%
        cloud.style.left = weightedRandom([-20, 120], { '40-60': 50 }) + 50 + '%';

        // random size, must be between 40% and 70%, width > height
        let size = weightedRandom([40, 70], { '50-70': 70 });
        cloud.style.width = `${size}%`;
        cloud.style.height = `${size * 0.8}%`;

        // random z-index
        cloud.style.zIndex = Math.floor(Math.random() * 10);
        $('.clouds').appendChild(cloud);

        // random rotation, must be between -3 and 3
        cloud.style.transform = `rotate(${Math.random() * 6 - 3}deg)`;

        // random opacity, must be between 0.1 and 1
        // more 0.1 to 0.6, in less 0.7 to 1
        cloud.style.opacity = Math.random() > 0.6 ? Math.random() * 0.3 + 0.7 : Math.random() * 0.5 + 0.1;

        // random animation, whether it goes left or right
        cloud.style.animation = `cloud-${Math.random() > 0.5 ? 'left' : 'right'} linear infinite`;

        // random animation duration, calculated by size, z-index and the viewport width, > 200s per 1000px, wind speed considered
        let viewportWidth = window.innerWidth;
        let duration = (size * cloud.style.zIndex) / viewportWidth * 200;
        // wind speed
        duration = duration / (weather.wind / 200);
        cloud.style.animationDuration = `${duration}s`;

        // random horiz filp, either true of false
        cloud.style.transform += Math.random() > 0.5 ? ' scaleX(-1)' : '';

        // if the cloud will fraze, stop the animation after a while
        if (wallpaper.animation.will_fraze) {
            setTimeout(() => {
                // set the animation to paused after a slow smooth slow down, making the duration longer and longer until 400% of the original
                // 
                cloud.style.animationPlayState = 'paused';

            }, wallpaper.animation.will_fraze * 1000);
        }
    }

    return c;
}

function clearAllClouds() {
    let clouds = 0;
    $('.cloud', true).forEach(cloud => {
        cloud.remove();
        clouds++;
    });
    return clouds;
}

function addStars(c = 1) {
    let stars = 0;
    for (let i = 0; i < c; i++) {
        let star = document.createElement('div');
        star.className = 'star';
        // random top, must be between -10% and 10
        star.style.top = Math.floor(Math.random() * 100) + '%';
        // random left, must be between 10% and 90%
        star.style.left = Math.floor(Math.random() * 100) + '%';
        // random size, must be between 40% and 70%, width > height
        let size = Math.random() * 2;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        // random opacity, must be between .8 ~ 1, more .8 ~ .95
        star.style.opacity = weightedRandom([80, 100], { '80-95': 95 }) / 100;
        // random box-shadow, 0 0 10px 1px rgba(255, 255, 255, A);
        star.style.boxShadow = `0 0 10px 1px rgba(255, 255, 255, ${star.style.opacity - 0.7})`;

        $('.stars').appendChild(star);
        stars++;
    }
}

function lightning() {
    // light up the sky random time infinitely
    function flash() {
        let flash = document.createElement('div');
        flash.className = 'flash';
        document.body.appendChild(flash);
        setTimeout(() => {
            flash.remove();
        }, Math.random() * 200);
        // random select a cloud with opacity > .2 to be lighten up
        let cloud = $('.cloud', true)[Math.floor(Math.random() * $('.cloud', true).length)];

        let opacity = parseFloat(cloud.style.opacity);
        if (opacity < 0.1) return;
        cloud.style.opacity = opacity * 10;
        cloud.style.filter = 'brightness(150%)';
        cloud.style.WebkitFilter = cloud.style.filter;
        // get the location of the cloud
        let rect = cloud.getBoundingClientRect();
        // get the center of the cloud
        let center = [rect.x + rect.width / 2, rect.y + rect.height / 2];
        // thunder from the center of the cloud
        let TT = Math.random() * 500;
        thunder(center);

        setTimeout(() => {
            cloud.style.filter = '';
            cloud.style.WebkitFilter = '';
            cloud.style.opacity = opacity;
        }, TT + 1000);
    }
    setInterval(flash, Math.random() * 5000);
}

let t = 0;

function thunder(l) {
    // l = [x, y], the lightning will start at xpx and ypx
    // random angle toward bottom 60 ~ 120
    let angle = Math.random() * 60 + 60;
    // random length, must be between 150 and 250
    let length = Math.random() * 100 + 150;
    // thunder 1, the first line
    let Thunder = document.createElement('div');
    Thunder.className = 'thunder';
    Thunder.style.left = l[0] + 6 + 'px';
    Thunder.style.top = l[1] + 6 + 'px';
    Thunder.style.width = length + 'px';
    Thunder.style.maxWidth = '250px';
    // random --color
    // let color = `rgb(255, 224, ${Math.random() * 100 + 100})`;
    let color = `white`
    Thunder.style.setProperty('--color', color);
    Thunder.style.transform = `rotate(${angle}deg)`;
    Thunder.style.transformOrigin = '0 0';
    document.body.appendChild(Thunder);

    let end_coords = [l[0] + Math.cos(angle * Math.PI / 180) * length, l[1] + Math.sin(angle * Math.PI / 180) * length];

    t++;

    if (t >= 5) {
        let end_time = Math.random() * 1000;
        setTimeout(() => {
            t = 0;
            $('.thunder', 'true').forEach(thunder => {
                thunder.style.opacity = 0;
                setTimeout(() => {
                    thunder.remove();
                }, 300);
            });
        }, end_time);
    } else {
        setTimeout(() => {
            thunder(end_coords);
        }, Math.random() * 100);
    }

}

function updateWeather() {
    // Background
    $('body').style.backgroundImage = weather_const.backgrounds[weather.condition][weather.time];

    // clean all
    clearAllClouds();

    let clouds = 0;
    // clear: 0-4, light: 6 - 15, heavy: 20 - 35
    switch (weather.clouds) {
        case 'none':
            break;
        case 'clear':
            clouds = addClouds(Math.floor(Math.random() * 5));
            break;
        case 'light':
            clouds = addClouds(Math.floor(Math.random() * 10) + 6);
            break;
        case 'medium':
            clouds = addClouds(Math.floor(Math.random() * 16) + 10);
            break;
        case 'heavy':
            clouds = addClouds(Math.floor(Math.random() * 16) + 20);
            break;
    }

    // Apply the brightness to the sun element
    let sun = document.createElement('div');
    sun.className = 'sun';

    document.body.appendChild(sun);

    fetchApi('srs', user.location).then(data => {
        weather.sun = data;

        let currentTime = new Date();
        // let currentTime = new Date(`2024-01-01T19:00:00`);
        let sunriseTime = new Date(`2024-01-01T${weather.sun.rise}:00`);
        let sunsetTime = new Date(`2024-01-01T${weather.sun.set}:00`);

        // Convert the times to minutes past midnight
        let currentTimeMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
        let sunriseTimeMinutes = sunriseTime.getHours() * 60 + sunriseTime.getMinutes();
        let sunsetTimeMinutes = sunsetTime.getHours() * 60 + sunsetTime.getMinutes();

        // Calculate the current position of the sun as a percentage of the day
        let sunPosition;
        if (currentTimeMinutes < sunriseTimeMinutes) {
            sunPosition = 0;
        } else if (currentTimeMinutes > sunsetTimeMinutes) {
            sunPosition = 1;
        } else {
            sunPosition = (currentTimeMinutes - sunriseTimeMinutes) / (sunsetTimeMinutes - sunriseTimeMinutes);
        }

        // Calculate the brightness of the sun based on its position
        // sun position 0 ~ 1, brightness 0 ~ 1, sp>0.5, 1-sp
        let brightness = (sunPosition < 0.5 ? sunPosition : 1 - sunPosition) * 40;
        sun.style.opacity = brightness;

        // Calculate the angle of the sun based on its position
        // sun position 0 ~ 1, angle -45 ~ 45
        let angle = (sunPosition - 0.5) * 90;
        // set --rotate-angle of .sun
        sun.style.setProperty('--rotate-angle', `${angle}deg`);

        // Move the sun from left to right over the course of the day
        sun.style.left = `${sunPosition * 120}%`;
        // Move the sun up and down, lower in the morning and evening, higher at noon
        sun.style.top = `${(Math.abs(sunPosition - 0.5) * 2) * 10}%`;

        // If time is before sunrise or after sunset, remove the sun
        if (currentTimeMinutes < sunriseTimeMinutes || currentTimeMinutes > sunsetTimeMinutes) {
            sun.remove();
        }

        // Before and after sunrise and sunset of 25 minutes, change the background to a night
        if (currentTimeMinutes < sunriseTimeMinutes - 25 || currentTimeMinutes > sunsetTimeMinutes + 25) {
            $('body').style.background = weather_const.backgrounds[weather.condition].night;
            // All clouds' blend mode to soft-light
            $('.cloud', true).forEach(cloud => {
                cloud.style.mixBlendMode = 'soft-light';
                // cut half of the opacity
                devi = browser.includes('Safari') ? 1.5 : 2;
                cloud.style.opacity = cloud.style.opacity / devi;

                addStars(1);
            });
        } else {
            // Change the color of the sun near sunrise or sunset
            if (sunPosition < 0.1 || sunPosition > 0.9) {
                if (weather.condition == 'cloudy') {
                    weather.condition = 'clear';
                }
                sun.style.backgroundColor = '#e4e4cc';
                sun.style.boxShadow = '0 0 36px 40px #e4e4cc';
                // Make the cloud turns yellow in color
                $('.cloud', true).forEach(cloud => {
                    cloud.style.filter = 'sepia(25%) saturate(450%) hue-rotate(45deg)';
                    cloud.style.WebkitFilter = cloud.style.filter;
                });
                $('body').style.background = weather_const.backgrounds[weather.condition].rs;
                // Maximum opacity = .6
                sun.style.opacity = Math.min(brightness, 0.6);
            }
        }

        // Update the theme color
        updateThemeColor($('body').style.backgroundImage);

        fetchApi('mrs', user.location).then(data => {
            weather.moon = data;
            let image = '/assets/moon/' + getLunarPhase().toLowerCase().replace(' ', '_') + '.webp';
            let moon = document.createElement('div');
            moon.className = 'moon';
            moon.style.backgroundImage = `url(${image})`;
            document.body.appendChild(moon);

            try { weather_actions[weather.condition](); } catch { }

            localStorage.setItem('background', $('body').style.backgroundImage);
        });

        if (weather.lightning) lightning();
    });
}

// **: not implemented