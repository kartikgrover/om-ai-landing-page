// Free kundli tool on /free-kundli-online.html and /hi/free-kundli-online.html. Talks to /api/public/kundli;
// the birth-details widget follows the /hi/*-kab-* calculators. The Hindi page loads hi-terms.js first.
(function () {
    var API = 'https://om-ai-backend-4f29d7469ff6.herokuapp.com';
    var TIMEOUT_MS = 20000;

    var $ = function (id) { return document.getElementById(id); };
    var form = $('kt-form');
    if (!form) return;
    var dateEl = $('kt-date'), timeEl = $('kt-time'), cityEl = $('kt-city'), tzEl = $('kt-tz');
    var goEl = $('kt-go'), errEl = $('kt-error'), outEl = $('kt-result');

    var HI = document.documentElement.lang === 'hi';
    var HT = HI && window.OMAI_HI;
    var signName = function (s) { return HT ? HT.sign(s) : s; };
    var nakName = function (s) { return HT ? HT.nakshatra(s) : s; };
    var planetName = function (s) { return HT ? HT.planet(s) : s; };

    var T = HI ? {
        needDate: 'जन्म तिथि भरें।',
        needTime: 'जन्म समय भरें। इसके बिना लग्न और भाव तय नहीं होते।',
        needCity: 'सूची में से जन्म स्थान चुनें।',
        bad: 'इन जन्म विवरणों से कुंडली नहीं बन सकी। तिथि, समय और शहर जाँच लें।',
        busy: 'अभी बहुत लोग कुंडली बना रहे हैं। एक मिनट बाद दोबारा कोशिश करें।',
        slow: 'कुंडली बनने में सामान्य से ज़्यादा समय लग रहा है। कृपया एक बार फिर कोशिश करें।',
        offline: 'कुंडली सेवा तक पहुँच नहीं बनी। अपना इंटरनेट जाँचकर दोबारा कोशिश करें।',
        failed: 'अभी आपकी कुंडली नहीं बन सकी। थोड़ी देर में दोबारा कोशिश करें।',
        retry: 'फिर कोशिश करें',
        go: 'मेरी कुंडली बनाएँ',
        working: 'कुंडली बन रही है…',
        title: 'आपकी कुंडली',
        born: 'जन्म: {date}, {time}, {city}',
        lagna: 'लग्न', moon: 'चंद्र राशि', nak: 'जन्म नक्षत्र', sun: 'सूर्य राशि', pada: 'पद',
        chartLabel: 'उत्तर भारतीय शैली की लग्न कुंडली',
        chartCap: 'लग्न कुंडली (D1), उत्तर भारतीय शैली। ऊपर बीच वाला खाना पहला भाव है; छोटे अंक राशियाँ हैं, 1 मेष से 12 मीन।',
        lagnaMark: 'लग्न',
        thPlanet: 'ग्रह', thSign: 'राशि', thHouse: 'भाव', thDeg: 'अंश', thNak: 'नक्षत्र (पद)', thNakShort: 'नक्षत्र',
        retro: 'व', retroTitle: 'वक्री',
        legend: 'व = वक्री। राहु और केतु हमेशा उल्टी चाल चलते हैं, इसलिए उनके साथ हमेशा व दिखता है।',
        dashaH: 'चालू दशा', maha: 'महादशा', antar: 'अंतर्दशा', range: '{a} से {b} तक',
        noDasha: 'दशा की तारीख़ें अभी उपलब्ध नहीं हैं।',
        sadeH: 'साढ़ेसाती',
        phase: { rising: 'पहले', peak: 'दूसरे (शिखर)', setting: 'तीसरे' },
        running: 'अभी चल रही है: {since} से {phase} चरण में। यह {start} को शुरू हुई{end}।',
        endsAround: ' और लगभग {date} तक चलेगी',
        paused: 'आपकी साढ़ेसाती {start} को शुरू हुई थी और अभी रुकी हुई है। यह {resume} को फिर शुरू होगी{end}।',
        none: 'अभी नहीं चल रही।',
        dhaiyaUntil: ' शनि की ढैय्या (शनि आपकी चंद्र राशि से {nth} राशि में) {date} तक है।',
        dhaiyaNow: ' शनि की ढैय्या (शनि आपकी चंद्र राशि से {nth} राशि में) अभी चल रही है।',
        nth: { 'Kantaka Shani': 'चौथी', 'Ashtama Shani': 'आठवीं' },
        nextRange: ' अगली साढ़ेसाती: {a} से {b} तक।',
        nextFrom: ' अगली साढ़ेसाती {a} से शुरू होगी।',
        nextH: 'इस कुंडली पर सवाल पूछें',
        nextP: 'Om.AI से पूछें कि यह कुंडली आपके करियर, शादी या पैसे के बारे में क्या कहती है, और कब। पहला सवाल मुफ़्त है।',
        ask: 'इस कुंडली पर Om.AI से पूछें',
        askHref: '/ask.html?lang=hi&utm_source=website&utm_medium=referral&utm_campaign=seo_page&utm_content=hi_free_kundli_online_result_ask',
        askLabel: 'hi_free_kundli_online_result_ask',
        appLine: 'या ऐप में पूछें:',
        play: 'https://play.google.com/store/apps/details?id=com.omai.app&referrer=utm_source%3Dwebsite%26utm_medium%3Dreferral%26utm_campaign%3Dseo_page%26utm_content%3Dhindi_kundli',
        ios: 'https://apps.apple.com/us/app/om-ai/id6630366988?pt=127919347&ct=website_hindi_kundli&mt=8',
        abbr: { Sun: 'सू', Moon: 'चं', Mars: 'मं', Mercury: 'बु', Jupiter: 'गु', Venus: 'शु', Saturn: 'श', Rahu: 'रा', Ketu: 'के' }
    } : {
        needDate: 'Enter your date of birth.',
        needTime: 'Enter your time of birth. Without it the lagna and houses can’t be set.',
        needCity: 'Pick your place of birth from the list.',
        bad: 'We couldn’t make a chart from these details. Check the date, time and city.',
        busy: 'Lots of people are making kundlis right now. Try again in a minute.',
        slow: 'Your kundli is taking longer than usual. Please try again.',
        offline: 'Couldn’t reach the kundli service. Check your internet and try again.',
        failed: 'Your kundli couldn’t be made just now. Please try again in a moment.',
        retry: 'Try again',
        go: 'Make my kundli',
        working: 'Making your kundli…',
        title: 'Your kundli',
        born: 'Born {date}, {time}, {city}',
        lagna: 'Lagna', moon: 'Moon sign (rashi)', nak: 'Birth nakshatra', sun: 'Sun sign', pada: 'pada',
        chartLabel: 'North Indian lagna chart',
        chartCap: 'Lagna chart (D1), North Indian style. House 1 is the top centre diamond; the small numbers are signs, 1 Aries to 12 Pisces.',
        lagnaMark: 'Lagna',
        thPlanet: 'Planet', thSign: 'Sign', thHouse: 'House', thDeg: 'Degree', thNak: 'Nakshatra (pada)', thNakShort: 'nakshatra',
        retro: 'R', retroTitle: 'Retrograde',
        legend: 'R = retrograde. Rahu and Ketu always move backward, so they always show R.',
        dashaH: 'Current dasha', maha: 'Mahadasha', antar: 'Antardasha', range: '{a} to {b}',
        noDasha: 'Dasha dates aren’t available right now.',
        sadeH: 'Sade Sati',
        phase: { rising: 'first', peak: 'middle (peak)', setting: 'last' },
        running: 'Running now, in its {phase} phase since {since}. It began on {start}{end}.',
        endsAround: ' and ends around {date}',
        paused: 'Your Sade Sati began on {start} and is paused now. It resumes on {resume}{end}.',
        none: 'Not running now.',
        dhaiyaUntil: ' Shani dhaiya (Saturn {nth} from your Moon sign) runs until {date}.',
        dhaiyaNow: ' Shani dhaiya (Saturn {nth} from your Moon sign) is running now.',
        nth: { 'Kantaka Shani': '4th', 'Ashtama Shani': '8th' },
        nextRange: ' Next Sade Sati: {a} to {b}.',
        nextFrom: ' Next Sade Sati begins {a}.',
        nextH: 'Ask about this chart',
        nextP: 'Ask Om.AI what this chart says about your career, marriage or money, and when. Your first question is free.',
        ask: 'Ask Om.AI about this chart',
        askHref: '/ask.html?utm_source=website&utm_medium=referral&utm_campaign=seo_page&utm_content=free_kundli_result_ask',
        askLabel: 'free_kundli_result_ask',
        appLine: 'Or ask in the app:',
        play: 'https://play.google.com/store/apps/details?id=com.omai.app&referrer=utm_source%3Dwebsite%26utm_medium%3Dreferral%26utm_campaign%3Dseo_page%26utm_content%3Dkundli',
        ios: 'https://apps.apple.com/us/app/om-ai/id6630366988?pt=127919347&ct=website_kundli&mt=8',
        abbr: { Sun: 'Su', Moon: 'Mo', Mars: 'Ma', Mercury: 'Me', Jupiter: 'Ju', Venus: 'Ve', Saturn: 'Sa', Rahu: 'Ra', Ketu: 'Ke' }
    };

    // [English, Hindi, lat, lon, tzOffsetHours, ianaZone?]: the kab calculators' list. India has no DST,
    // so a fixed +5:30 is exact; foreign cities carry a zone because their offset depends on the date.
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
    var list = $('kt-cities');
    CITIES.forEach(function (c) {
        var label = HI ? c[1] + ' / ' + c[0] : c[0];
        byLabel[label] = { name: HI ? c[1] : c[0], lat: c[2], lon: c[3], tz: c[4], zone: c[5] };
        var o = document.createElement('option');
        o.value = label;
        list.appendChild(o);
    });

    // A known city fixes its own offset; asking twice invites a mismatch that silently shifts the lagna.
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
    // Seconds sit in their own span so the narrow-screen table can drop them.
    var fmtDms = function (dms) {
        var m = String(dms || '').match(/^(\d+°\d+)'(\d+)"$/);
        if (!m) return esc(String(dms || '').replace(/'/g, '′').replace(/"/g, '″'));
        return esc(m[1]) + '′<span class="kt-sec">' + esc(m[2]) + '″</span>';
    };

    var ZODIAC = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    // Centre of each house in a 100x100 North Indian diamond; house 1 is the top centre, then counter-clockwise.
    var HOUSE_XY = { 1: [50, 27], 2: [25, 9], 3: [9, 26], 4: [26, 50], 5: [9, 74], 6: [25, 91], 7: [50, 73], 8: [75, 91], 9: [91, 74], 10: [74, 50], 11: [91, 26], 12: [75, 9] };

    function chartSvg(data) {
        var asc = ZODIAC.indexOf(data.lagna.sign);
        var occ = {};
        data.planets.forEach(function (p) {
            var h = p.house || ((ZODIAC.indexOf(p.sign) - asc + 12) % 12) + 1;
            (occ[h] = occ[h] || []).push(p);
        });
        var s = '<svg class="kt-svg" viewBox="0 0 100 100" role="img" aria-label="' + esc(T.chartLabel) + '">'
            + '<rect x="1" y="1" width="98" height="98" class="kt-frame"/>'
            + '<line x1="1" y1="1" x2="99" y2="99" class="kt-line"/><line x1="99" y1="1" x2="1" y2="99" class="kt-line"/>'
            + '<polygon points="50,1 99,50 50,99 1,50" class="kt-line"/>';
        for (var h = 1; h <= 12; h++) {
            var cx = HOUSE_XY[h][0], cy = HOUSE_XY[h][1];
            s += '<text x="' + cx + '" y="' + (cy - 5.5) + '" class="kt-signno">' + (((asc + h - 1) % 12) + 1) + '</text>';
            var items = (h === 1 ? [{ lagna: true }] : []).concat(occ[h] || []);
            var perLine = items.length > 3 ? 2 : 1;
            for (var i = 0, row = 0; i < items.length; i += perLine, row++) {
                s += '<text x="' + cx + '" y="' + (cy - 1.5 + row * 4.3) + '" class="kt-ptext">';
                var raised = false;
                items.slice(i, i + perLine).forEach(function (p, k) {
                    var at = (k ? ' dx="1.6"' : '') + (raised ? ' dy="1.4"' : '');
                    raised = false;
                    if (p.lagna) {
                        s += '<tspan class="kt-lagna"' + at + '>' + esc(T.lagnaMark) + '</tspan>';
                        return;
                    }
                    s += '<tspan' + at + '>' + esc(T.abbr[p.planet] || p.planet.slice(0, 2)) + '</tspan>';
                    // Relative dy keeps the row one text chunk, so text-anchor still centres it.
                    if (p.retrograde) {
                        s += '<tspan class="kt-rmark" dy="-1.4">' + esc(T.retro) + '</tspan>';
                        raised = true;
                    }
                });
                s += '</text>';
            }
        }
        return s + '</svg>';
    }

    function planetRows(data) {
        // Phones show the nakshatra under the sign (kt-nak-m) instead of in its own column.
        var row = function (name, sign, house, dms, nak, pada, retro) {
            var nakCell = esc(nakName(nak)) + (pada ? ' (' + esc(pada) + ')' : '');
            return '<tr><th scope="row">' + esc(name)
                + (retro ? ' <abbr class="kt-retro" title="' + esc(T.retroTitle) + '">' + esc(T.retro) + '</abbr>' : '')
                + '</th><td class="kt-sign">' + esc(signName(sign)) + '<span class="kt-nak-m">' + nakCell + '</span></td><td>' + esc(house)
                + '</td><td class="kt-deg">' + fmtDms(dms) + '</td><td class="kt-nak">' + nakCell + '</td></tr>';
        };
        var L = data.lagna;
        var html = row(T.lagna, L.sign, 1, L.dms, L.nakshatra, L.pada, false);
        data.planets.forEach(function (p) {
            html += row(planetName(p.planet), p.sign, p.house || '', p.dms, p.nakshatra, p.pada, p.retrograde);
        });
        return html;
    }

    function dashaHtml(dasha) {
        var line = function (label, d) {
            if (!d || !d.lord) return '';
            return '<p class="kt-dasha-row"><span class="kt-k">' + esc(label) + '</span> <strong>' + esc(planetName(d.lord)) + '</strong>'
                + '<span class="kt-dates">' + fill(T.range, { a: fmtDate(d.start), b: fmtDate(d.end) }) + '</span></p>';
        };
        var body = line(T.maha, dasha && dasha.mahadasha) + line(T.antar, dasha && dasha.antardasha);
        return body || '<p class="kt-dasha-row">' + esc(T.noDasha) + '</p>';
    }

    function sadeSatiText(ss) {
        if (!ss) return esc(T.none);
        var cur = ss.current;
        if (cur && cur.sadeSatiStartedAt) {
            return fill(T.running, {
                phase: esc(T.phase[cur.currentPhase] || cur.currentPhase || ''),
                since: fmtDate(cur.phaseStartedAt || cur.sadeSatiStartedAt),
                start: fmtDate(cur.sadeSatiStartedAt),
                end: cur.estimatedEnd ? fill(T.endsAround, { date: fmtDate(cur.estimatedEnd) }) : ''
            });
        }
        var next = ss.next;
        if (next && next.paused) {
            return fill(T.paused, {
                start: fmtDate(next.sadeSatiStartedAt),
                resume: fmtDate(next.resumesOn),
                end: next.estimatedEnd ? fill(T.endsAround, { date: fmtDate(next.estimatedEnd) }) : ''
            });
        }
        var text = esc(T.none);
        var dh = ss.dhaiya;
        if (dh && T.nth[dh.type]) {
            text += dh.phaseEndsOn
                ? fill(T.dhaiyaUntil, { nth: esc(T.nth[dh.type]), date: fmtDate(dh.phaseEndsOn) })
                : fill(T.dhaiyaNow, { nth: esc(T.nth[dh.type]) });
        }
        if (next && next.nextWindowStart) {
            text += next.nextWindowEnd
                ? fill(T.nextRange, { a: fmtDate(next.nextWindowStart), b: fmtDate(next.nextWindowEnd) })
                : fill(T.nextFrom, { a: fmtDate(next.nextWindowStart) });
        }
        return text;
    }

    function render(data, birth) {
        var L = data.lagna, M = data.moon || {};
        var fact = function (k, v, sub) {
            return '<div class="kt-fact"><dt>' + esc(k) + '</dt><dd>' + v + (sub ? '<span>' + sub + '</span>' : '') + '</dd></div>';
        };
        var html = '<div class="container" style="max-width:960px;"><div class="kt-res">'
            + '<h2 id="kt-res-title" class="kt-res-title" tabindex="-1">' + esc(T.title) + '</h2>'
            + '<p class="kt-born">' + fill(T.born, { date: fmtDate(birth.date), time: esc(birth.time), city: esc(birth.city) }) + '</p>'
            + '<dl class="kt-facts">'
            + fact(T.lagna, esc(signName(L.sign)), fmtDms(L.dms))
            + fact(T.moon, esc(signName(M.rashi)))
            + fact(T.nak, esc(nakName(M.nakshatra)), M.pada ? esc(T.pada) + ' ' + esc(M.pada) : '')
            + fact(T.sun, esc(signName(data.sun && data.sun.rashi)))
            + '</dl>'
            + '<div class="kt-body">'
            + '<figure class="kt-chart">' + chartSvg(data) + '<figcaption>' + esc(T.chartCap) + '</figcaption></figure>'
            + '<div class="kt-planets"><div class="kt-table-wrap"><table class="kt-table"><thead><tr>'
            + '<th scope="col">' + esc(T.thPlanet) + '</th><th scope="col">' + esc(T.thSign) + '<span class="kt-nak-m"> / ' + esc(T.thNakShort) + '</span></th><th scope="col">' + esc(T.thHouse)
            + '</th><th scope="col">' + esc(T.thDeg) + '</th><th scope="col" class="kt-nak">' + esc(T.thNak) + '</th>'
            + '</tr></thead><tbody>' + planetRows(data) + '</tbody></table></div>'
            + '<p class="kt-legend">' + esc(T.legend) + '</p></div>'
            + '</div>'
            + '<div class="kt-twin">'
            + '<div class="kt-block"><h3>' + esc(T.dashaH) + '</h3>' + dashaHtml(data.dasha) + '</div>'
            + '<div class="kt-block"><h3>' + esc(T.sadeH) + '</h3><p class="kt-sade">' + sadeSatiText(data.sadeSati) + '</p></div>'
            + '</div>'
            + '<div class="kt-next">'
            + '<h3>' + esc(T.nextH) + '</h3><p>' + esc(T.nextP) + '</p>'
            + '<a id="kt-ask" class="btn btn--primary btn-lg kt-ask" href="' + esc(T.askHref) + '">' + esc(T.ask) + '</a>'
            + '<p class="kt-applabel">' + esc(T.appLine) + '</p>'
            + '<div class="d-flex justify-content-center gap-3 flex-wrap">'
            + '<a href="' + esc(T.play) + '" class="btn btn--outline px-4" rel="noopener noreferrer" target="_blank"><i class="fab fa-google-play me-2" aria-hidden="true"></i>Google Play</a>'
            + '<a href="' + esc(T.ios) + '" class="btn btn--outline px-4" rel="noopener noreferrer" target="_blank"><i class="fab fa-apple me-2" aria-hidden="true"></i>App Store</a>'
            + '</div></div>'
            + '</div></div>';
        outEl.innerHTML = html;
        outEl.hidden = false;
        errEl.hidden = true;
        $('kt-ask').addEventListener('click', function () {
            try { gtag('event', 'web_ask_click', { event_category: 'Web MVP', event_label: T.askLabel }); } catch (e) {}
        });
        var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        outEl.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
        $('kt-res-title').focus({ preventScroll: true });
    }

    function showError(msg, canRetry) {
        errEl.innerHTML = esc(msg) + (canRetry ? ' <button type="button" class="kt-retry">' + esc(T.retry) + '</button>' : '');
        errEl.hidden = false;
        outEl.hidden = true;
        var b = errEl.querySelector('.kt-retry');
        if (b) b.addEventListener('click', submit);
    }

    // Status decides the visitor's words; the API's own error strings are internal English.
    var errorFor = function (status) {
        if (status === 429) return T.busy;
        if (status === 400) return T.bad;
        return T.failed;
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
        var url = API + '/api/public/kundli?dob=' + encodeURIComponent(dob) + '&lat=' + city.lat + '&lon=' + city.lon;
        var birth = { date: d, time: t, city: city.name };

        var done = function (data) {
            cache[url] = data;
            render(data, birth);
            if (window.gtag) window.gtag('event', 'kundli_calculated');
        };
        // Same details give the same chart for the day, so a re-submit doesn't spend the per-IP budget.
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
                    if (!r.ok || !b || !b.lagna || !b.planets) {
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
