let Colors = {
    light: [
        ['linear-gradient(180deg, #4581BF 0%, #6CA4DF 100%)', 'black'],
        ['linear-gradient(180deg, #4581BF 26.5%, #00FFB3 100%)', 'black'],
        ['linear-gradient(180deg, #6D7E90 0%, #485566 100%)', 'black'],
        ['linear-gradient(180deg, #486662 0%, #6D8C90 100%)', 'black'],
    ],
    dark: [
        ['linear-gradient(180deg, #0A0A1F 26.5%, #29344F 100%)', 'white'],
        ['linear-gradient(180deg, #180909 0%, #3D3D3D 100%)', 'white'],
    ]
}

function randomColor() {
    let dark = window.matchMedia('(prefers-color-scheme: dark)').matches
    let colors = dark ? Colors.dark : Colors.light
    let random = Math.floor(Math.random() * colors.length)
    $('body').style.background = colors[random][0]
    $('body').style.setProperty('--text-color', colors[random][1])
    updateThemeColor($('body').style.background)
}

randomColor()

$('.sameheightasprev', true).forEach(e => {
    let prev = e.previousElementSibling
    let height = prev.clientHeight
    let top = window.getComputedStyle(prev).top
    let H = height + parseInt(top)

    e.style.height = H + 'px'
})

const footer_links = `
<div class="footer">
    <div class="rows">
        <div class="cols">
            <div class="col">
                <font class="footer-heading">
                    GitHub Accounts
                </font>
                <a href="https://github.com/rtzg">ReTrn - Developer</a>
                <a href="https://github.com/alphabrate">AlphaBrate - Officials</a>
                <a href="https://github.com/musicterms">Music Terms - Web App</a>
            </div>
            <div class="col">
                <font class="footer-heading">
                    Official Accounts
                </font>
                <a href="https://x.com/AlphaBrate_Team">X</a>
                <a href="https://www.youtube.com/@alphabrate">YouTube</a>
                <a href="https://www.instagram.com/alphabrate/">Instagram</a>
            </div>
        </div>
        <div class="cols">
            <div class="col">
                <font class="footer-heading" style="display: flex; gap: .3rem;"><a style="margin:0;" href="https://alphabrate.github.io/about">About</a> AlphaBrate</font>
                <a href="https://alphabrate.github.io/about/support.html">Seek Support</a>
                <a href="https://alphabrate.github.io/about/downloads.html">Downloads</a>
                <a href="https://alphabrate.github.io/projects">Projects</a>
                <a href="https://alphabrate.github.io/donate-to-us-thank-you-very-much/">Donate</a>
                <a href="https://alphabrate.github.io/articles">Articles</a>
                <a href="https://alphabrate.github.io/about/policies/">Policies & Terms</a>
                <a href="https://alphabrate.github.io/apps">App Gallery</a>
            </div>
        </div>
    </div>
    <div class="space-break" data-height="2"></div>
</div>`

const copyright_info = `
<p class="color-gray">&copy; AlphaBrate 2024 under APEL License.</p>
<p class="color-lighter-gray f10px">All rights to the designs and photographs <span class="nowrap">displayed on this site are reserved.</span>
<br>By using, browsing, sharing, or redistributing our services, products,
    or projects, you agree to our <span class="nowrap"><a href="https://alphabrate.github.io/about/policies">Privacy Terms</a> and <a href="https://alphabrate.github.io/about/policies">Terms of Service</a>.</span></p>`

const resize_init = () => {
    try {
        var as_above = document.querySelectorAll('.as')

        for (var i = 0; i < as_above.length; i++) {
            let data_as = as_above[i].getAttribute('data-as')
            let prev_element = document.querySelector(data_as)

            if (as_above[i].getAttribute('data-same') == 'width') {
                let width = prev_element.clientWidth
                as_above[i].style.width = width + 'px'
            }
        }
    } catch { }

    try {
        document.querySelector('.words.lowerright').style.opacity = 1
        document.querySelector('.words.lowerright').style.top = document.querySelector('.words.upperleft').clientHeight + 'px'

        let not_desktop = window.innerWidth < 1024

        if (not_desktop) {
            let reversed = document.querySelectorAll('.reversed-in-mobile')

            reversed.forEach((element) => {
                let first_child = element.firstElementChild
                let last_child = element.lastElementChild
                element.insertBefore(last_child, first_child)

                element.classList.remove('reversed-in-mobile')
                element.classList.add('reversed-in-desktop')
            });

            let nowrap_on_mobile = document.querySelectorAll('.nowrap-on-desktop')

            nowrap_on_mobile.forEach((element) => {
                element.style.whiteSpace = 'normal'
            });

        }
        else {
            let reversed = document.querySelectorAll('.reversed-in-desktop')

            reversed.forEach((element) => {
                let first_child = element.firstElementChild
                let last_child = element.lastElementChild
                element.insertBefore(last_child, first_child)

                element.classList.remove('reversed-in-desktop')
                element.classList.add('reversed-in-mobile')
            });

            let nowrap_on_desktop = document.querySelectorAll('.nowrap-on-desktop')

            nowrap_on_desktop.forEach((element) => {
                element.style.whiteSpace = 'nowrap'
            });

        }
    } catch { }
}

window.onload = () => {

    try {
        document.getElementById('footer-links').innerHTML = footer_links
        document.getElementById('copyright').innerHTML = copyright_info
        resize_init()
    } catch { }

    try {
        document.querySelector('.top.section.shorter').classList.add('pwa')
    } catch { }

    try {
        var spaces = document.querySelectorAll('.space-break')
        for (var i = 0; i < spaces.length; i++) {
            spaces[i].style.marginBottom = spaces[i].getAttribute('data-height') + 'rem';
        }
    } catch { }

    document.body.style.opacity = 1

    let isInPWA = window.matchMedia('(display-mode: standalone)').matches
    if (isInPWA) {
        document.getElementById('footer-links').style.display = 'none'
        document.getElementById('copyright').style.display = 'none'

        // meta viewport
        document.head.innerHTML += `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">`

        const darkMode = (dark) => {
            if (dark) {
                document.querySelector('.logo>img').src = "/icons/light.alphabrate.svg"
            } else {
                document.querySelector('.logo>img').src = "/icons/alphabrate.svg"
            }
        }

        darkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);

        window.matchMedia('(prefers-color-scheme: dark)').addListener((e) => darkMode(e.matches));

    }
}

window.addEventListener('resize', resize_init)

// theme updated
window.matchMedia('(prefers-color-scheme: dark)').addListener(e => {
    randomColor()
})