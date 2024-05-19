if (localStorage.getItem('background')) {
    $('body').style.background = localStorage.getItem('background');
} else {
    $('body').style.background = 'linear-gradient(rgb(69, 129, 191) 0%, rgb(108, 164, 223) 100%)';
}

updateThemeColor($('body').style.background);

$('.e', true).forEach(e => {
    let a = () => {
        $('.e', true).forEach(e => e.classList.remove('active'));
        // Active the clicked element
        e.classList.add('active');

        $('.i-lock-filled', true, e.parentElement).forEach(e => {
            console.log(e);
            e.classList.remove('.i-lock-filled');
            e.classList.add('.i-lock');
            e.innerHTML = '<icon data-icon="lock"></icon>';
            icons();
        });
    }

    e.addEventListener('mousedown', a);
});

function show(page) {
    $('.page', true).forEach(p => p.style.display = 'none');
    $(`#${page}`).style.display = 'block';
}

let apikeys_locals = JSON.parse(localStorage.getItem('apikeys')) || {};

if (apikeys_locals['geocode.maps.co']) {
    $('#geocode').value = apikeys_locals['geocode.maps.co'];
}

let search = new URLSearchParams(window.location.search);
let tab = search.get('tab');
if (tab) {
    show(tab);

    let e = $(`#b-${tab}`);
    if (e) {
        $('.e', true).forEach(e => e.classList.remove('active'));
        e.classList.add('active');
    }

}

let to;

$('#geocode').addEventListener('input', () => {

    let apikey = $('#geocode').value;

    apikey = apikey.trim();

    if (apikey.length < 1) {
        $('#vt').innerHTML = 'API Key Cleared';
        let apikeys = JSON.parse(localStorage.getItem('apikeys')) || {};
        // remove the key
        delete apikeys['geocode.maps.co'];
        localStorage.setItem('apikeys', JSON.stringify(apikeys));
        return;
    }

    clearTimeout(to);

    to = setTimeout(() => {
        let url = `https://geocode.maps.co/reverse?lat=10&lon=100&api_key=${apikey}`;
        console.log(url);
        $('#vt').innerHTML = 'Verifying API Key...';
        fetch(url, {
            method: 'GET'
        }).then(response => response.json()).then(data => {
            console.log(data);
            if (data.error) {
                $('#vt').innerHTML = 'Invalid API Key';
            } else {
                $('#vt').innerHTML = 'API Key Verified & Saved';
                let apikeys = JSON.parse(localStorage.getItem('apikeys')) || {};
                apikeys['geocode.maps.co'] = apikey;
                localStorage.setItem('apikeys', JSON.stringify(apikeys));
            }
        }).catch(() => {
            $('#vt').innerHTML = 'Invalid API Key';
        });
    }, 1000);

});

function Location() {
    if ('geolocation' in navigator) {
        $('#lt').innerText = 'Retrieving Location...';
        navigator.geolocation.getCurrentPosition((position) => {
            $('#Loc').value = `${position.coords.latitude}, ${position.coords.longitude}`;
            $('#lt').innerText = '.';
        }, () => {
            $('#lt').innerText = 'Permission Denied, enable location services and try again.';
        });
    }
}

if (localStorage.getItem('place')) {
    $('#Loc').value = localStorage.getItem('place');
}

$('#Loc').addEventListener('input', () => {
    let loc = $('#Loc').value;
    loc = loc.trim();
    if (loc.length < 1) {
        $('#lt').innerHTML = 'Location Cleared';
        // set to localstorage>place
        localStorage.setItem('place', '');
        return;
    }
    $('#lt').innerText = 'Verifying Location...';
    let position = {
        coords: {
            latitude: parseFloat(loc.split(',')[0]),
            longitude: parseFloat(loc.split(',')[1])
        }
    };
    if (isNaN(position.coords.latitude) || isNaN(position.coords.longitude)) {
        $('#lt').innerText = 'Invalid Location';
        return;
    }
    let apikeys = JSON.parse(localStorage.getItem('apikeys')) || {
        'geocode.maps.co': '6647f58a9bd33364441261djv0cc141'
    };
    let url = `https://geocode.maps.co/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&api_key=${apikeys['geocode.maps.co']}`;
    fetch(url, {
        method: 'GET'
    }).then(response => response.json()).then(data => {
        console.log(data);
        if (data.error) {
            $('#lt').innerText = 'Invalid Location';
        } else {
            $('#lt').innerText = 'Location Verified & Saved';
            // set to localstorage>place
            localStorage.setItem('place', loc);
        }
    }).catch(() => {
        $('#lt').innerText = 'Invalid Location';
    });
});  