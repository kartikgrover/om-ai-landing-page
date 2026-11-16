// "Your 2027" on /your-2027.html and /hi/your-2027.html. Talks to /api/public/year-forecast; the birth form follows kundli-tool.js.
(function () {
    var API = 'https://om-ai-backend-4f29d7469ff6.herokuapp.com';
    var TIMEOUT_MS = 20000;

    var $ = function (id) { return document.getElementById(id); };
    var form = $('yf-form');
    if (!form) return;
    var dateEl = $('yf-date'), timeEl = $('yf-time'), cityEl = $('yf-city'), tzEl = $('yf-tz');
    var goEl = $('yf-go'), errEl = $('yf-error'), outEl = $('yf-result');

    var HI = document.documentElement.lang === 'hi';
    var AREAS = ['marriage', 'career', 'wealth', 'property'];
    var ICON = { marriage: 'fa-ring', career: 'fa-briefcase', wealth: 'fa-coins', property: 'fa-home' };
    var UTM = 'utm_source=website&utm_medium=referral&utm_campaign=your2027&utm_content=';

    // Each question routes to its topic with a 2027-wide asked window, so the app's answer reads the same windows as the cards.
    var T = HI ? {
        needDate: 'जन्म तिथि भरें।',
        needTime: 'जन्म समय भरें। इसके बिना लग्न और भाव तय नहीं होते।',
        needCity: 'सूची में से जन्म स्थान चुनें।',
        bad: 'इन जन्म विवरणों से 2027 का समय नहीं निकल सका। तिथि, समय और शहर जाँच लें।',
        busy: 'अभी बहुत लोग अपना 2027 देख रहे हैं। एक मिनट बाद दोबारा कोशिश करें।',
        slow: 'जवाब आने में सामान्य से ज़्यादा समय लग रहा है। कृपया एक बार फिर कोशिश करें।',
        offline: 'सेवा तक पहुँच नहीं बनी। अपना इंटरनेट जाँचकर दोबारा कोशिश करें।',
        failed: 'अभी आपका 2027 नहीं निकल सका। थोड़ी देर में दोबारा कोशिश करें।',
        retry: 'फिर कोशिश करें',
        go: 'मेरा 2027 देखें',
        working: 'आपकी कुंडली देखी जा रही है…',
        title: 'आपका 2027 राशिफल',
        born: 'जन्म: {date}, {time}, {city} · {lagna} लग्न',
        intro: 'हर क्षेत्र के लिए वे महीने जो आपकी कुंडली में खुलते हैं। कुछ समय 2027 से पहले शुरू होते हैं या उसके बाद तक चलते हैं, इसलिए पूरे दिखाए गए हैं।',
        area: { marriage: 'शादी', career: 'करियर और नौकरी', wealth: 'पैसा', property: 'घर' },
        strongest: 'सबसे मज़बूत',
        allYear: 'पूरा 2027 {area} के समय में आता है ({range})',
        inLine: { marriage: 'आपकी शादी', career: 'आपके करियर', wealth: 'आपके धन लाभ', property: 'आपके घर' },
        homeFold: 'घर: करियर वाले ही महीने',
        legend: 'इन महीनों में आपकी चल रही दशा और ग्रहों का गोचर, दोनों इस क्षेत्र की ओर इशारा करते हैं।',
        empty: '2027 में इसके लिए आपकी कुंडली में कोई साफ़ समय नहीं दिखता।',
        minor: 'शादी का समय केवल 18 वर्ष या उससे अधिक उम्र वालों के लिए दिखाया जाता है।',
        whyBtn: 'कारण पूछें',
        whyH: 'कारण पूछें',
        whyP: 'ये तारीख़ें आपकी कुंडली से निकली हैं। Om.AI आपकी अपनी कुंडली से हर समय का कारण बताता है, हिंदी या English में। पहला सवाल मुफ़्त है।',
        pickLabel: 'किस बारे में पूछना है?',
        year: 'पूरा साल',
        askThisApp: 'ऐप में यह सवाल पूछें:',
        askThisWeb: 'यह सवाल पूछें:',
        q: {
            year: '2027 मेरे लिए कैसा रहेगा?',
            marriage: '2027 में मेरी शादी के लिए कौन सा समय अच्छा है?',
            career: '2027 में मेरे करियर के लिए कौन सा समय अच्छा है?',
            wealth: '2027 में धन लाभ के लिए कौन सा समय अच्छा है?',
            property: '2027 में घर या प्रॉपर्टी के लिए कौन सा समय अच्छा है?'
        },
        ask: 'पहला सवाल मुफ़्त पूछें',
        appNote: 'Om.AI ऐप खुलेगा, या ऐप न हो तो उसका स्टोर पेज। ऊपर वाला सवाल अपने पहले सवाल के रूप में पूछें।',
        webAlt: 'या ब्राउज़र में पूछें',
        signin: 'पूछने से पहले Google, Apple, ईमेल या फ़ोन से साइन-इन करें, ताकि आपकी कुंडली और जवाब सेव रहें।',
        appLine: 'या ऐप में पूछें:',
        askHref: '/ask.html?lang=hi&' + UTM + 'hi_your2027_',
        appHref: '/r?lang=hi&' + UTM + 'hi_',
        play: 'https://play.google.com/store/apps/details?id=com.omai.app&referrer=utm_source%3Dwebsite%26utm_medium%3Dreferral%26utm_campaign%3Dyour2027%26utm_content%3Dhi_your2027',
        ios: 'https://apps.apple.com/us/app/om-ai/id6630366988?pt=127919347&ct=website_hi_your2027&mt=8'
    } : {
        needDate: 'Enter your date of birth.',
        needTime: 'Enter your time of birth. Without it the lagna and houses can’t be set.',
        needCity: 'Pick your place of birth from the list.',
        bad: 'We couldn’t read 2027 from these details. Check the date, time and city.',
        busy: 'Lots of people are checking their 2027 right now. Try again in a minute.',
        slow: 'This is taking longer than usual. Please try again.',
        offline: 'Couldn’t reach the service. Check your internet and try again.',
        failed: 'Your 2027 couldn’t be read just now. Please try again in a moment.',
        retry: 'Try again',
        go: 'Show my 2027',
        working: 'Reading your chart…',
        title: 'Your 2027',
        born: 'Born {date}, {time}, {city} · {lagna} lagna',
        intro: 'The months your chart opens for each area. Some windows begin before 2027 or run past it, so they are shown in full.',
        area: { marriage: 'Marriage', career: 'Career', wealth: 'Money', property: 'Home' },
        strongest: 'Strongest',
        allYear: 'All of 2027 is inside your {area} window ({range})',
        inLine: { marriage: 'marriage', career: 'career', wealth: 'money', property: 'home' },
        homeFold: 'Home: same months as career',
        legend: 'Your running dasha and the planets’ transits both point to this area in these months.',
        empty: 'Your chart shows no clear window for this in 2027.',
        minor: 'Marriage timing is shown only for people 18 or older.',
        whyBtn: 'Ask why',
        whyH: 'Ask why',
        whyP: 'These dates come from your chart. Om.AI explains the reason behind each window from your own chart, in English or Hindi. Your first question is free.',
        pickLabel: 'What do you want to ask about?',
        year: 'Whole year',
        askThisApp: 'Ask this in the app:',
        askThisWeb: 'Ask this:',
        q: {
            year: 'What does 2027 hold for me?',
            marriage: 'What does 2027 hold for my marriage?',
            career: 'What does 2027 hold for my career?',
            wealth: 'What does 2027 hold for my money?',
            property: 'What does 2027 hold for buying a home?'
        },
        ask: 'Ask your first question free',
        appNote: 'Opens the Om.AI app, or its store page if you don’t have it yet. Ask the question above as your first one.',
        webAlt: 'Or ask in your browser',
        signin: 'You’ll sign in with Google, Apple, email or phone first, so your chart and answers are saved.',
        appLine: 'Or ask in the app:',
        askHref: '/ask.html?' + UTM + 'your2027_',
        appHref: '/r?' + UTM + 'en_',
        play: 'https://play.google.com/store/apps/details?id=com.omai.app&referrer=utm_source%3Dwebsite%26utm_medium%3Dreferral%26utm_campaign%3Dyour2027%26utm_content%3Dyour2027',
        ios: 'https://apps.apple.com/us/app/om-ai/id6630366988?pt=127919347&ct=website_your2027&mt=8'
    };

    // [English, Hindi, lat, lon, tzOffsetHours, ianaZone?]: copied from kundli-tool.js.
    var CITIES = [
        ['Delhi', 'दिल्ली', 28.6139, 77.2090, 5.5],
        ['Mumbai', 'मुंबई', 19.0760, 72.8777, 5.5],
        ['Kolkata', 'कोलकाता', 22.5726, 88.3639, 5.5],
        ['Chennai', 'चेन्नई', 13.0827, 80.2707, 5.5],
        ['Bengaluru', 'बेंगलुरु', 12.9716, 77.5946, 5.5],
        ['Hyderabad', 'हैदराबाद', 17.3850, 78.4867, 5.5],
        ['Pune', 'पुणे', 18.5204, 73.8567, 5.5],
        ['Ahmedabad', 'अहमदाबाद', 23.0225, 72.5714, 5.5],
        ['Jaipur', 'जयपुर', 26.9124, 75.7873, 5.5],
        ['Lucknow', 'लखनऊ', 26.8467, 80.9462, 5.5],
        ['Kanpur', 'कानपुर', 26.4499, 80.3319, 5.5],
        ['Nagpur', 'नागपुर', 21.1458, 79.0882, 5.5],
        ['Indore', 'इंदौर', 22.7196, 75.8577, 5.5],
        ['Bhopal', 'भोपाल', 23.2599, 77.4126, 5.5],
        ['Patna', 'पटना', 25.5941, 85.1376, 5.5],
        ['Ludhiana', 'लुधियाना', 30.9010, 75.8573, 5.5],
        ['Agra', 'आगरा', 27.1767, 78.0081, 5.5],
        ['Varanasi', 'वाराणसी', 25.3176, 82.9739, 5.5],
        ['Surat', 'सूरत', 21.1702, 72.8311, 5.5],
        ['Vadodara', 'वडोदरा', 22.3072, 73.1812, 5.5],
        ['Chandigarh', 'चंडीगढ़', 30.7333, 76.7794, 5.5],
        ['Amritsar', 'अमृतसर', 31.6340, 74.8723, 5.5],
        ['Jodhpur', 'जोधपुर', 26.2389, 73.0243, 5.5],
        ['Raipur', 'रायपुर', 21.2514, 81.6296, 5.5],
        ['Ranchi', 'रांची', 23.3441, 85.3096, 5.5],
        ['Guwahati', 'गुवाहाटी', 26.1445, 91.7362, 5.5],
        ['Bhubaneswar', 'भुवनेश्वर', 20.2961, 85.8245, 5.5],
        ['Coimbatore', 'कोयंबटूर', 11.0168, 76.9558, 5.5],
        ['Kochi', 'कोच्चि', 9.9312, 76.2673, 5.5],
        ['Thiruvananthapuram', 'तिरुवनंतपुरम', 8.5241, 76.9366, 5.5],
        ['Visakhapatnam', 'विशाखापत्तनम', 17.6868, 83.2185, 5.5],
        ['Vijayawada', 'विजयवाड़ा', 16.5062, 80.6480, 5.5],
        ['Madurai', 'मदुरै', 9.9252, 78.1198, 5.5],
        ['Mysuru', 'मैसूरु', 12.2958, 76.6394, 5.5],
        ['Nashik', 'नासिक', 19.9975, 73.7898, 5.5],
        ['Rajkot', 'राजकोट', 22.3039, 70.8022, 5.5],
        ['Jabalpur', 'जबलपुर', 23.1815, 79.9864, 5.5],
        ['Gwalior', 'ग्वालियर', 26.2183, 78.1828, 5.5],
        ['Meerut', 'मेरठ', 28.9845, 77.7064, 5.5],
        ['Prayagraj', 'प्रयागराज', 25.4358, 81.8463, 5.5],
        ['Dehradun', 'देहरादून', 30.3165, 78.0322, 5.5],
        ['Shimla', 'शिमला', 31.1048, 77.1734, 5.5],
        ['Srinagar', 'श्रीनगर', 34.0837, 74.7973, 5.5],
        ['Jammu', 'जम्मू', 32.7266, 74.8570, 5.5],
        ['Noida', 'नोएडा', 28.5355, 77.3910, 5.5],
        ['Gurugram', 'गुरुग्राम', 28.4595, 77.0266, 5.5],
        ['Ghaziabad', 'गाज़ियाबाद', 28.6692, 77.4538, 5.5],
        ['Thane', 'ठाणे', 19.2183, 72.9781, 5.5],
        ['Jamshedpur', 'जमशेदपुर', 22.8046, 86.2029, 5.5],
        ['Dhanbad', 'धनबाद', 23.7957, 86.4304, 5.5],
        ['Udaipur', 'उदयपुर', 24.5854, 73.7125, 5.5],
        ['Ajmer', 'अजमेर', 26.4499, 74.6399, 5.5],
        ['Bikaner', 'बीकानेर', 28.0229, 73.3119, 5.5],
        ['Kota', 'कोटा', 25.2138, 75.8648, 5.5],
        ['Bareilly', 'बरेली', 28.3670, 79.4304, 5.5],
        ['Aligarh', 'अलीगढ़', 27.8974, 78.0880, 5.5],
        ['Gorakhpur', 'गोरखपुर', 26.7606, 83.3732, 5.5],
        ['Jalandhar', 'जालंधर', 31.3260, 75.5762, 5.5],
        ['Panaji', 'पणजी', 15.4909, 73.8278, 5.5],
        ['Cuttack', 'कटक', 20.4625, 85.8828, 5.5],
        ['Salem', 'सेलम', 11.6643, 78.1460, 5.5],
        ['Tiruchirappalli', 'तिरुचिरापल्ली', 10.7905, 78.7047, 5.5],
        ['Warangal', 'वारंगल', 17.9689, 79.5941, 5.5],
        ['Guntur', 'गुंटूर', 16.3067, 80.4365, 5.5],
        ['Solapur', 'सोलापुर', 17.6599, 75.9064, 5.5],
        ['Kolhapur', 'कोल्हापुर', 16.7050, 74.2433, 5.5],
        ['Siliguri', 'सिलीगुड़ी', 26.7271, 88.3953, 5.5],
        ['Kathmandu', 'काठमांडू', 27.7172, 85.3240, 5.75, 'Asia/Kathmandu'],
        ['Dubai', 'दुबई', 25.2048, 55.2708, 4, 'Asia/Dubai'],
        ['Singapore', 'सिंगापुर', 1.3521, 103.8198, 8, 'Asia/Singapore'],
        ['London', 'लंदन', 51.5074, -0.1278, 0, 'Europe/London'],
        ['New York', 'न्यूयॉर्क', 40.7128, -74.0060, -5, 'America/New_York'],
        ['Toronto', 'टोरंटो', 43.6532, -79.3832, -5, 'America/Toronto'],
        ['Sydney', 'सिडनी', -33.8688, 151.2093, 10, 'Australia/Sydney']
    ];

    var byLabel = {};
    var list = $('yf-cities');
    CITIES.forEach(function (c) {
        var label = HI ? c[1] + ' / ' + c[0] : c[0];
        byLabel[label] = { name: HI ? c[1] : c[0], lat: c[2], lon: c[3], tz: c[4], zone: c[5] };
        var o = document.createElement('option');
        o.value = label;
        list.appendChild(o);
    });

    cityEl.addEventListener('change', function () {
        var c = byLabel[cityEl.value];
        if (c) tzEl.value = String(c.tz);
    });

    function zoneOffsetAt(zone, ms) {
        var g = {};
        new Intl.DateTimeFormat('en-US', { timeZone: zone, hourCycle: 'h23', year: 'numeric', month: 'numeric',
            day: 'numeric', hour: 'numeric', minute: 'numeric' }).formatToParts(new Date(ms))
            .forEach(function (x) { g[x.type] = +x.value; });
        return (Date.UTC(g.year, g.month - 1, g.day, g.hour, g.minute) - Math.floor(ms / 60000) * 60000) / 3600000;
    }
    function birthOffset(city, picked, y, mo, d, h, mi) {
        var manual = parseFloat(picked);
        if (!city.zone || picked !== String(city.tz)) return manual;
        try {
            var wall = Date.UTC(y, mo - 1, d, h, mi);
            return zoneOffsetAt(city.zone, wall - zoneOffsetAt(city.zone, wall) * 3600000);
        } catch (e) { return manual; }
    }

    var esc = function (s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    };
    var fill = function (tpl, vals) {
        return tpl.replace(/\{(\w+)\}/g, function (_, k) { return vals[k] == null ? '' : vals[k]; });
    };
    var dateFmt = null;
    try {
        dateFmt = new Intl.DateTimeFormat(HI ? 'hi-IN' : 'en-IN', { day: 'numeric', month: HI ? 'long' : 'short', year: 'numeric', timeZone: 'UTC' });
    } catch (e) {}
    var fmtDate = function (iso) {
        var p = String(iso || '').split('-');
        if (p.length !== 3 || !dateFmt) return esc(iso);
        return esc(dateFmt.format(new Date(Date.UTC(+p[0], +p[1] - 1, +p[2]))));
    };
    var lang = HI ? 'hi' : 'en';
    // iPadOS reports itself as a Mac; touch points give it away.
    var onPhone = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    function cardHtml(key, wins, homeFolded) {
        var head = '<h3><i class="fas ' + ICON[key] + '" aria-hidden="true"></i>' + esc(T.area[key]) + '</h3>';
        if (wins === null) return '<article class="yf-card yf-card--off">' + head + '<p class="yf-empty">' + esc(T.minor) + '</p></article>';
        var body = wins.length
            ? '<ul class="yf-wins">' + wins.map(function (w) {
                var range = w.label && w.label[lang];
                var when = w.allYear
                    ? '<span class="yf-when yf-when--year">' + esc(fill(T.allYear, { area: T.inLine[key], range: range })) + '</span>'
                    : '<span class="yf-when">' + esc(range) + '</span>';
                return '<li>' + when + (w.tier === 'strongest' ? '<span class="yf-pill">' + esc(T.strongest) + '</span>' : '') + '</li>';
            }).join('') + '</ul>'
            : '<p class="yf-empty">' + esc(T.empty) + '</p>';
        var fold = homeFolded ? '<p class="yf-fold"><i class="fas ' + ICON.property + '" aria-hidden="true"></i>' + esc(T.homeFold) + '</p>' : '';
        return '<article class="yf-card">' + head + body + fold
            + '<button type="button" class="yf-why-btn" data-area="' + key + '">' + esc(T.whyBtn) + ' &rarr;</button></article>';
    }

    function render(data, birth) {
        var A = data.areas;
        var folded = data.propertySameAsCareer === true;
        var shown = AREAS.filter(function (k) { return !(folded && k === 'property'); });
        var anyStrongest = AREAS.some(function (k) { return (A[k] || []).some(function (w) { return w.tier === 'strongest'; }); });
        var topics = ['year'].concat(AREAS.filter(function (k) { return A[k] !== null; }));
        var html = '<div class="container" style="max-width:960px;"><div class="kt-res">'
            + '<h2 id="yf-res-title" class="kt-res-title" tabindex="-1">' + esc(T.title) + '</h2>'
            + '<p class="kt-born">' + fill(T.born, { date: fmtDate(birth.date), time: esc(birth.time), city: esc(birth.city), lagna: esc(data.lagna && data.lagna[lang]) }) + '</p>'
            + '<p class="yf-intro">' + esc(T.intro) + '</p>'
            + '<div class="yf-grid">' + shown.map(function (k) { return cardHtml(k, A[k], folded && k === 'career'); }).join('') + '</div>'
            + (anyStrongest ? '<p class="yf-legend"><span class="yf-pill">' + esc(T.strongest) + '</span>' + esc(T.legend) + '</p>' : '')
            + '<div class="kt-next yf-why" id="yf-why" tabindex="-1">'
            + '<h3>' + esc(T.whyH) + '</h3><p>' + esc(T.whyP) + '</p>'
            + '<div class="yf-ask">'
            + '<p class="mw-label" id="yf-pick-label">' + esc(T.pickLabel) + '</p>'
            + '<div class="kt-chips" role="radiogroup" aria-labelledby="yf-pick-label">' + topics.map(function (k) {
                return '<button type="button" class="kt-chip yf-topic" role="radio" data-area="' + k + '">' + esc(k === 'year' ? T.year : T.area[k]) + '</button>';
            }).join('') + '</div>'
            + '<p class="mw-label">' + esc(onPhone ? T.askThisApp : T.askThisWeb) + '</p>'
            + '<p class="yf-q" id="yf-q"></p>'
            + (onPhone
                ? '<a id="yf-app" class="btn btn--primary btn-lg kt-ask" href="#">' + esc(T.ask) + '</a>'
                    + '<p class="kt-signin">' + esc(T.appNote) + '</p>'
                    + '<p class="yf-alt"><button type="button" id="yf-web" class="yf-link">' + esc(T.webAlt) + ' &rarr;</button></p>'
                : '<button type="button" id="yf-web" class="btn btn--primary btn-lg kt-ask">' + esc(T.ask) + '</button>'
                    + '<p class="kt-signin">' + esc(T.signin) + '</p>')
            + '</div>'
            + (onPhone ? '' : '<p class="kt-applabel">' + esc(T.appLine) + '</p>'
                + '<div class="d-flex justify-content-center gap-3 flex-wrap">'
                + '<a href="' + esc(T.play) + '" class="btn btn--outline px-4" rel="noopener noreferrer" target="_blank"><i class="fab fa-google-play me-2" aria-hidden="true"></i>Google Play</a>'
                + '<a href="' + esc(T.ios) + '" class="btn btn--outline px-4" rel="noopener noreferrer" target="_blank"><i class="fab fa-apple me-2" aria-hidden="true"></i>App Store</a>'
                + '</div>')
            + '</div>'
            + '</div></div>';
        outEl.innerHTML = html;
        outEl.hidden = false;
        errEl.hidden = true;

        var topic = 'year';
        var qEl = $('yf-q'), appEl = $('yf-app');
        var pick = function (k) {
            topic = k;
            qEl.textContent = T.q[k];
            outEl.querySelectorAll('.yf-topic').forEach(function (b) {
                var on = b.getAttribute('data-area') === k;
                b.classList.toggle('is-on', on);
                b.setAttribute('aria-checked', on ? 'true' : 'false');
            });
            if (appEl) appEl.href = T.appHref + k;
        };
        pick('year');
        outEl.querySelectorAll('.yf-topic').forEach(function (b) {
            b.addEventListener('click', function () { pick(b.getAttribute('data-area')); });
        });
        var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        outEl.querySelectorAll('.yf-why-btn').forEach(function (b) {
            b.addEventListener('click', function () {
                pick(b.getAttribute('data-area'));
                var why = $('yf-why');
                why.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
                why.focus({ preventScroll: true });
            });
        });
        if (appEl) appEl.addEventListener('click', function () {
            try { gtag('event', 'download_click', { event_category: 'App Downloads', event_label: /Android/i.test(navigator.userAgent) ? 'android' : 'ios', value: 1 }); } catch (err) {}
        });
        // ask.html reads this to prefill onboarding and the composer; it never sends on its own.
        $('yf-web').addEventListener('click', function () {
            try {
                sessionStorage.setItem('omai-handoff', JSON.stringify({ dob: birth.date, time: birth.time, place: birth.city,
                    lat: birth.lat, lon: birth.lon, cc: birth.cc, q: T.q[topic], ts: Date.now() }));
            } catch (err) {}
            try { gtag('event', 'web_ask_click', { event_category: 'Web MVP', event_label: (HI ? 'hi_' : '') + 'your2027_' + topic, has_question: 1 }); } catch (err) {}
            location.href = T.askHref + topic;
        });
        outEl.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
        $('yf-res-title').focus({ preventScroll: true });
    }

    function showError(msg, canRetry) {
        errEl.innerHTML = esc(msg) + (canRetry ? ' <button type="button" class="kt-retry">' + esc(T.retry) + '</button>' : '');
        errEl.hidden = false;
        outEl.hidden = true;
        var b = errEl.querySelector('.kt-retry');
        if (b) b.addEventListener('click', submit);
    }

    var errorFor = function (status) {
        if (status === 429) return T.busy;
        if (status === 400) return T.bad;
        return T.failed;
    };
    var valid = function (b) {
        return b && b.areas && AREAS.every(function (k) { return b.areas[k] === null || Array.isArray(b.areas[k]); });
    };

    var cache = {};
    var pending = false;

    function submit(e) {
        if (e && e.preventDefault) e.preventDefault();
        if (pending) return;
        var d = dateEl.value, t = timeEl.value, city = byLabel[cityEl.value];
        if (!d) return showError(T.needDate);
        if (!t) return showError(T.needTime);
        if (!city) return showError(T.needCity);

        var p = d.split('-'), q = t.split(':');
        var tz = birthOffset(city, tzEl.value, +p[0], +p[1], +p[2], +q[0], +q[1]);
        var dob = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2], +q[0], +q[1]) - tz * 3600000).toISOString();
        var url = API + '/api/public/year-forecast?dob=' + encodeURIComponent(dob) + '&lat=' + city.lat + '&lon=' + city.lon;
        var birth = { date: d, time: t, city: city.name, lat: city.lat, lon: city.lon, cc: city.zone ? null : 'in' };

        var done = function (data) {
            cache[url] = data;
            render(data, birth);
            if (window.gtag) window.gtag('event', 'year_forecast_calculated');
        };
        if (cache[url]) return done(cache[url]);

        pending = true;
        goEl.disabled = true;
        goEl.textContent = T.working;
        errEl.hidden = true;

        var timer, timedOut = false;
        var ctrl = typeof AbortController === 'function' ? new AbortController() : null;
        var deadline = new Promise(function (_, reject) {
            timer = setTimeout(function () {
                timedOut = true;
                if (ctrl) ctrl.abort();
                reject(new Error('timeout'));
            }, TIMEOUT_MS);
        });

        Promise.race([fetch(url, ctrl ? { signal: ctrl.signal } : undefined), deadline])
            .then(function (r) {
                return r.json().catch(function () { return null; }).then(function (b) {
                    if (!r.ok || !valid(b)) {
                        var err = new Error(r.ok ? T.failed : errorFor(r.status));
                        err.shown = true;
                        err.retry = r.status !== 400;
                        throw err;
                    }
                    return b;
                });
            })
            .then(done)
            .catch(function (err) {
                if (timedOut) return showError(T.slow, true);
                if (err && err.shown) return showError(err.message, err.retry);
                showError(T.offline, true);
            })
            .finally(function () {
                clearTimeout(timer);
                pending = false;
                goEl.disabled = false;
                goEl.textContent = T.go;
            });
    }

    form.addEventListener('submit', submit);
})();
