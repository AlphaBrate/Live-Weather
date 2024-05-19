function weightedRandom(range, weight) {
    let totalWeight = 0;
    let weights = [];

    // Calculate total weight and create weights array
    for (let key in weight) {
        let [min, max] = key.split('-').map(Number);
        if (min >= range[0] && max <= range[1]) {
            totalWeight += weight[key];
            weights.push({ min, max, weight: totalWeight });
        }
    }

    // Add default weight for the rest of the range
    if (totalWeight < 100) {
        weights.push({ min: weights[weights.length - 1].max + 1, max: range[1], weight: 100 });
    }

    // Generate a random number between 0 and 100
    let randomNum = Math.random() * 100;

    // Find which range this random number falls into
    for (let i = 0; i < weights.length; i++) {
        if (randomNum <= weights[i].weight) {
            // Generate a random number within this range
            return Math.floor(Math.random() * (weights[i].max - weights[i].min + 1)) + weights[i].min;
        }
    }
}

function updateThemeColor(linear) {
    let color = linear.split('rgb')[1].split('(')[1].split(')')[0].split(',');
    let hex = '#';
    for (let i = 0; i < 3; i++) {
        hex += parseInt(color[i]).toString(16).padStart(2, '0');
    }
    document.body.style.backgroundColor = hex;
    document.querySelector('meta[name="theme-color"]').setAttribute('content', hex);
}

const $ = (s, a = false, b = document) => a ? b.querySelectorAll(s) : b.querySelector(s);

var loaded_icons = {};

// Replace all <icon> to <svg>
var icon_holders = document.getElementsByTagName('icon');
async function icons() {
    if (icon_holders.length == 0) {
        return;
    }
    var icon = icon_holders[0].getAttribute('data-icon');
    var icon_element = icon_holders[0];
    var icon_parent = icon_element.parentElement;
    var svgUrl = `/assets/icon/${icon}.svg`;
    if (loaded_icons[icon] == void 0) {
        await fetch(svgUrl)
            .then(response => response.text())
            .then(svg => {
                var span = document.createElement('span');
                span.innerHTML = svg;
                var icon_class = icon_element.getAttribute('class');
                span.setAttribute('class', icon_class);
                span.setAttribute('style', '--mask-i: url(' + svgUrl + ')');
                try { icon_parent.replaceChild(span, icon_element); } catch { }
                icons();
                loaded_icons[icon] = svg;
            });
    } else {
        var span = document.createElement('span');
        span.innerHTML = loaded_icons[icon];
        var icon_class = icon_element.getAttribute('class');
        span.setAttribute('class', icon_class);
        span.setAttribute('style', '--mask-i: url(' + svgUrl + ')');
        try { icon_parent.replaceChild(span, icon_element); } catch { }
        icons();
    }
}

icons();

function preloadIcon(icon) {
    if (loaded_icons[icon] == void 0) {
        fetch(`/assets/icon/${icon}.svg`)
            .then(response => response.text())
            .then(svg => {
                loaded_icons[icon] = svg;
            });
    }
}