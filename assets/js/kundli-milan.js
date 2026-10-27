// Kundli milan widget for /kundli-matching.html and /hi/kundli-milan.html (GET /api/public/kundli-milan).
(function () {
    var API = 'https://om-ai-backend-4f29d7469ff6.herokuapp.com';
    var TIMEOUT_MS = 20000;

    var $ = function (id) { return document.getElementById(id); };
    var goEl = $('km-go'), errEl = $('km-error'), resEl = $('km-result'), outEl = $('km-out');
    if (!goEl) return;
    var hi = document.documentElement.lang === 'hi';
    var HT = window.OMAI_HI;

    // [English, Hindi, lat, lon, tzOffsetHours, ianaZone?]: the kab pages' city table.
    var CITIES = [
        ['Delhi', 'दिल्ली', 28.6139, 77.2090, 5.5], ['Mumbai', 'मुंबई', 19.0760, 72.8777, 5.5],
        ['Kolkata', 'कोलकाता', 22.5726, 88.3639, 5.5], ['Chennai', 'चेन्नई', 13.0827, 80.2707, 5.5],
        ['Bengaluru', 'बेंगलुरु', 12.9716, 77.5946, 5.5], ['Hyderabad', 'हैदराबाद', 17.3850, 78.4867, 5.5],
        ['Pune', 'पुणे', 18.5204, 73.8567, 5.5], ['Ahmedabad', 'अहमदाबाद', 23.0225, 72.5714, 5.5],
        ['Jaipur', 'जयपुर', 26.9124, 75.7873, 5.5], ['Lucknow', 'लखनऊ', 26.8467, 80.9462, 5.5],
        ['Kanpur', 'कानपुर', 26.4499, 80.3319, 5.5], ['Nagpur', 'नागपुर', 21.1458, 79.0882, 5.5],
        ['Indore', 'इंदौर', 22.7196, 75.8577, 5.5], ['Bhopal', 'भोपाल', 23.2599, 77.4126, 5.5],
        ['Patna', 'पटना', 25.5941, 85.1376, 5.5], ['Ludhiana', 'लुधियाना', 30.9010, 75.8573, 5.5],
        ['Agra', 'आगरा', 27.1767, 78.0081, 5.5], ['Varanasi', 'वाराणसी', 25.3176, 82.9739, 5.5],
        ['Surat', 'सूरत', 21.1702, 72.8311, 5.5], ['Vadodara', 'वडोदरा', 22.3072, 73.1812, 5.5],
        ['Chandigarh', 'चंडीगढ़', 30.7333, 76.7794, 5.5], ['Amritsar', 'अमृतसर', 31.6340, 74.8723, 5.5],
        ['Jodhpur', 'जोधपुर', 26.2389, 73.0243, 5.5], ['Raipur', 'रायपुर', 21.2514, 81.6296, 5.5],
        ['Ranchi', 'रांची', 23.3441, 85.3096, 5.5], ['Guwahati', 'गुवाहाटी', 26.1445, 91.7362, 5.5],
        ['Bhubaneswar', 'भुवनेश्वर', 20.2961, 85.8245, 5.5], ['Coimbatore', 'कोयंबटूर', 11.0168, 76.9558, 5.5],
        ['Kochi', 'कोच्चि', 9.9312, 76.2673, 5.5], ['Thiruvananthapuram', 'तिरुवनंतपुरम', 8.5241, 76.9366, 5.5],
        ['Visakhapatnam', 'विशाखापत्तनम', 17.6868, 83.2185, 5.5], ['Vijayawada', 'विजयवाड़ा', 16.5062, 80.6480, 5.5],
        ['Madurai', 'मदुरै', 9.9252, 78.1198, 5.5], ['Mysuru', 'मैसूरु', 12.2958, 76.6394, 5.5],
        ['Nashik', 'नासिक', 19.9975, 73.7898, 5.5], ['Rajkot', 'राजकोट', 22.3039, 70.8022, 5.5],
        ['Jabalpur', 'जबलपुर', 23.1815, 79.9864, 5.5], ['Gwalior', 'ग्वालियर', 26.2183, 78.1828, 5.5],
        ['Meerut', 'मेरठ', 28.9845, 77.7064, 5.5], ['Prayagraj', 'प्रयागराज', 25.4358, 81.8463, 5.5],
        ['Dehradun', 'देहरादून', 30.3165, 78.0322, 5.5], ['Shimla', 'शिमला', 31.1048, 77.1734, 5.5],
        ['Srinagar', 'श्रीनगर', 34.0837, 74.7973, 5.5], ['Jammu', 'जम्मू', 32.7266, 74.8570, 5.5],
        ['Noida', 'नोएडा', 28.5355, 77.3910, 5.5], ['Gurugram', 'गुरुग्राम', 28.4595, 77.0266, 5.5],
        ['Ghaziabad', 'गाज़ियाबाद', 28.6692, 77.4538, 5.5], ['Thane', 'ठाणे', 19.2183, 72.9781, 5.5],
        ['Jamshedpur', 'जमशेदपुर', 22.8046, 86.2029, 5.5], ['Dhanbad', 'धनबाद', 23.7957, 86.4304, 5.5],
        ['Udaipur', 'उदयपुर', 24.5854, 73.7125, 5.5], ['Ajmer', 'अजमेर', 26.4499, 74.6399, 5.5],
        ['Bikaner', 'बीकानेर', 28.0229, 73.3119, 5.5], ['Kota', 'कोटा', 25.2138, 75.8648, 5.5],
        ['Bareilly', 'बरेली', 28.3670, 79.4304, 5.5], ['Aligarh', 'अलीगढ़', 27.8974, 78.0880, 5.5],
        ['Gorakhpur', 'गोरखपुर', 26.7606, 83.3732, 5.5], ['Jalandhar', 'जालंधर', 31.3260, 75.5762, 5.5],
        ['Panaji', 'पणजी', 15.4909, 73.8278, 5.5], ['Cuttack', 'कटक', 20.4625, 85.8828, 5.5],
        ['Salem', 'सेलम', 11.6643, 78.1460, 5.5], ['Tiruchirappalli', 'तिरुचिरापल्ली', 10.7905, 78.7047, 5.5],
        ['Warangal', 'वारंगल', 17.9689, 79.5941, 5.5], ['Guntur', 'गुंटूर', 16.3067, 80.4365, 5.5],
        ['Solapur', 'सोलापुर', 17.6599, 75.9064, 5.5], ['Kolhapur', 'कोल्हापुर', 16.7050, 74.2433, 5.5],
        ['Siliguri', 'सिलीगुड़ी', 26.7271, 88.3953, 5.5],
        ['Kathmandu', 'काठमांडू', 27.7172, 85.3240, 5.75, 'Asia/Kathmandu'],
        ['Dubai', 'दुबई', 25.2048, 55.2708, 4, 'Asia/Dubai'],
        ['Singapore', 'सिंगापुर', 1.3521, 103.8198, 8, 'Asia/Singapore'],
        ['London', 'लंदन', 51.5074, -0.1278, 0, 'Europe/London'],
        ['New York', 'न्यूयॉर्क', 40.7128, -74.0060, -5, 'America/New_York'],
        ['Toronto', 'टोरंटो', 43.6532, -79.3832, -5, 'America/Toronto'],
        ['Sydney', 'सिडनी', -33.8688, 151.2093, 10, 'Australia/Sydney']
    ];

    var EN = {
        who: { g: 'groom', b: 'bride' },
        whoCap: { g: 'Groom', b: 'Bride' },
        needDate: function (w) { return 'Please enter the ' + w + '\'s date of birth.'; },
        needTime: function (w) { return 'Please enter the ' + w + '\'s time of birth. Manglik dosha is read from the Lagna, which needs it.'; },
        needCity: function (w) { return 'Please pick the ' + w + '\'s place of birth from the list.'; },
        adult: function (w) { return 'This calculator is for adults (18+), and the ' + w + '\'s date of birth is less than 18 years ago. Please check the date.'; },
        adultServer: 'This calculator is for adults (18+). Please check both dates of birth.',
        badField: function (w) { return 'Please check the ' + w + '\'s birth details: date, time and place.'; },
        badInput: 'We could not cast a chart from these details. Please check both dates, times and places.',
        busy: 'The calculator is busy right now. Please try again in a minute.',
        server: 'We could not match these kundlis just now. Please try again in a little while.',
        network: 'We could not reach the calculator. Check your connection and try again.',
        timeout: 'The calculator is taking too long to answer. Please try again in a moment.',
        loading: 'Matching…',
        go: 'Match Kundlis',
        meter: function (t) { return t + ' of 36 points; 18 is the usual minimum'; },
        framing: 'This is the traditional Gun Milan of two birth charts. It is one part of reading a match, not a judgement of your relationship.',
        kootsHead: 'The eight koots',
        cols: ['Koot', 'Groom', 'Bride', 'Points'],
        total: 'Total',
        koot: { Varna: 'Varna', Vashya: 'Vashya', Tara: 'Tara', Yoni: 'Yoni', Maitri: 'Graha Maitri', Gan: 'Gana', Bhakut: 'Bhakoot', Nadi: 'Nadi' },
        values: {
            Chatu: 'Chatushpad (four-legged)', Manav: 'Manav (human)', Vanch: 'Vanchar (wild)', Jalch: 'Jalchar (water)', Keeta: 'Keet (insect)',
            Ashva: 'Ashva (horse)', Gaja: 'Gaja (elephant)', Mesha: 'Mesha (sheep)', Sarpa: 'Sarpa (serpent)', Shwan: 'Shwan (dog)',
            Marjar: 'Marjar (cat)', Mushak: 'Mushak (rat)', Mahish: 'Mahish (buffalo)', Vyaghra: 'Vyaghra (tiger)', Mriga: 'Mriga (deer)',
            Markat: 'Markat (monkey)', Nakul: 'Nakul (mongoose)', Simha: 'Simha (lion)', Gau: 'Gau (cow)',
            Devta: 'Deva', Rakshas: 'Rakshasa'
        },
        doshaTag: { Nadi: 'Nadi dosha', Bhakut: 'Bhakoot dosha' },
        eased: ', exception applies',
        cancelled: {
            Nadi: 'Nadi dosha: a classical exception applies (the two Moons share a sign but not a nakshatra, or share a nakshatra in a different sign or pada), so most astrologers do not count it as a dosha. The Nadi points stay at 0.',
            Bhakoot: 'Bhakoot dosha: a classical exception applies, so most astrologers do not count it as a dosha. The Bhakoot points stay at 0.'
        },
        mHead: 'Manglik dosha',
        mStatus: { Absent: 'Not Manglik', Present: 'Manglik', 'Present (cancelled)': 'Manglik, cancelled', Unknown: 'Could not be read' },
        mGrade: {
            mild: 'Mild: Mars is in a Manglik house counted from the Lagna or from the Moon, not both.',
            strong: 'Strong: Mars is in a Manglik house counted from both the Lagna and the Moon.'
        },
        mWhy: 'Cancelled (BPHS Ch.80 Sl.47) because:',
        mCancel: {
            'Jupiter sits with Mars in the same sign, softening its harsher impulses': 'Jupiter sits in the same sign as Mars.',
            'Jupiter\'s grace-aspect falls on Mars\'s house, lifting the dosha': 'Jupiter aspects Mars.',
            'Venus sits with Mars in the same sign, sweetening its aggression': 'Venus sits in the same sign as Mars.',
            'Venus faces Mars from the opposite sign, sweetening its aggression': 'Venus is in the sign opposite Mars.',
            'Mercury faces Mars from the opposite sign, tempering its sharpness': 'Mercury is in the sign opposite Mars.',
            'The waxing Moon sits with Mars, cushioning its fire with emotional balance': 'A waxing Moon sits in the same sign as Mars.',
            'Moon\'s opposition to Mars cushions its fire with emotional balance': 'The Moon is in the sign opposite Mars.'
        },
        mSouth: 'Some South Indian traditions also count Mars in the 2nd house, or count from Venus. By that wider count, Mars falls in one of those places.',
        mPair: {
            mutual: 'Both of you have an active Manglik dosha. BPHS Ch.80 Sl.48-49 says that when both partners have it, it ceases to have effect.',
            one_sided: function (w) { return 'Only the ' + w + ' has an active Manglik dosha, so classically it stands for this match. Astrologers weigh it with both full charts, not on its own.'; },
            neither: 'Neither of you has an active Manglik dosha.'
        },
        mRule: {
            conventional: 'Mars is counted from the Lagna and from the Moon.',
            classical: 'Mars is counted from the Lagna, as BPHS Ch.80 Sl.47 does.'
        }
    };

    var HI_S = {
        who: { g: 'वर', b: 'कन्या' },
        whoCap: { g: 'वर', b: 'कन्या' },
        needDate: function (w) { return w + ' की जन्म तिथि भरें।'; },
        needTime: function (w) { return w + ' का जन्म समय भरें। मांगलिक दोष लग्न से देखा जाता है, जिसके लिए समय चाहिए।'; },
        needCity: function (w) { return 'सूची में से ' + w + ' का जन्म स्थान चुनें।'; },
        adult: function (w) { return 'यह कैलकुलेटर वयस्कों (18+) के लिए है, और ' + w + ' की जन्म तिथि के हिसाब से उम्र 18 साल से कम है। कृपया तिथि जाँच लें।'; },
        adultServer: 'यह कैलकुलेटर वयस्कों (18+) के लिए है। कृपया दोनों की जन्म तिथि जाँच लें।',
        badField: function (w) { return w + ' का जन्म विवरण (तिथि, समय और स्थान) जाँच लें।'; },
        badInput: 'इन विवरणों से कुंडली नहीं बन सकी। दोनों की तिथि, समय और स्थान जाँच लें।',
        busy: 'अभी बहुत लोग कैलकुलेटर चला रहे हैं। एक मिनट बाद दोबारा कोशिश करें।',
        server: 'अभी मिलान नहीं हो सका। थोड़ी देर में दोबारा कोशिश करें।',
        network: 'कैलकुलेटर तक पहुँच नहीं बनी। अपना इंटरनेट जाँचकर दोबारा कोशिश करें।',
        timeout: 'कैलकुलेटर से जवाब आने में बहुत देर हो रही है। थोड़ी देर में दोबारा कोशिश करें।',
        loading: 'मिलान हो रहा है…',
        go: 'कुंडली मिलाएँ',
        meter: function (t) { return '36 में से ' + t + ' गुण; सामान्य न्यूनतम 18'; },
        band: { excellent: 'उत्तम', very_good: 'बहुत अच्छा', acceptable: 'अच्छा', below_minimum: 'सामान्य 18 गुण की सीमा से कम' },
        framing: 'यह दो कुंडलियों का पारंपरिक गुण मिलान है। यह मिलान को पढ़ने का एक हिस्सा है, आपके रिश्ते पर फ़ैसला नहीं।',
        kootsHead: 'आठ कूट',
        cols: ['कूट', 'वर', 'कन्या', 'गुण'],
        total: 'कुल',
        koot: { Varna: 'वर्ण', Vashya: 'वश्य', Tara: 'तारा', Yoni: 'योनि', Maitri: 'ग्रह मैत्री', Gan: 'गण', Bhakut: 'भकूट', Nadi: 'नाड़ी' },
        values: {
            Chatu: 'चतुष्पद', Manav: 'मानव', Vanch: 'वनचर', Jalch: 'जलचर', Keeta: 'कीट',
            Ashva: 'अश्व', Gaja: 'गज', Mesha: 'मेष', Sarpa: 'सर्प', Shwan: 'श्वान', Marjar: 'मार्जार', Mushak: 'मूषक',
            Mahish: 'महिष', Vyaghra: 'व्याघ्र', Mriga: 'मृग', Markat: 'मर्कट', Nakul: 'नकुल', Simha: 'सिंह', Gau: 'गौ',
            Devta: 'देव', Manushya: 'मनुष्य', Rakshas: 'राक्षस',
            Adi: 'आदि', Madhya: 'मध्य', Antya: 'अंत्य'
        },
        doshaTag: { Nadi: 'नाड़ी दोष', Bhakut: 'भकूट दोष' },
        eased: ', अपवाद लागू',
        cancelled: {
            Nadi: 'नाड़ी दोष: शास्त्रीय अपवाद लागू है (दोनों के चंद्र एक राशि में पर अलग नक्षत्र में हैं, या एक नक्षत्र में पर अलग राशि या चरण में), इसलिए ज़्यादातर ज्योतिषी इसे दोष नहीं गिनते। नाड़ी के गुण 0 ही रहते हैं।',
            Bhakoot: 'भकूट दोष: शास्त्रीय अपवाद लागू है, इसलिए ज़्यादातर ज्योतिषी इसे दोष नहीं गिनते। भकूट के गुण 0 ही रहते हैं।'
        },
        mHead: 'मांगलिक दोष',
        mStatus: { Absent: 'मांगलिक नहीं', Present: 'मांगलिक', 'Present (cancelled)': 'मांगलिक, पर दोष रद्द', Unknown: 'पढ़ा नहीं जा सका' },
        mGrade: {
            mild: 'हल्का: मंगल लग्न या चंद्र में से एक से गिनने पर मांगलिक भाव में है।',
            strong: 'तेज़: मंगल लग्न और चंद्र, दोनों से गिनने पर मांगलिक भाव में है।'
        },
        mWhy: 'दोष रद्द (बृहत् पाराशर होरा शास्त्र, अध्याय 80, श्लोक 47), क्योंकि:',
        mCancel: {
            'Jupiter sits with Mars in the same sign, softening its harsher impulses': 'गुरु उसी राशि में मंगल के साथ बैठे हैं।',
            'Jupiter\'s grace-aspect falls on Mars\'s house, lifting the dosha': 'मंगल पर गुरु की दृष्टि है।',
            'Venus sits with Mars in the same sign, sweetening its aggression': 'शुक्र उसी राशि में मंगल के साथ बैठे हैं।',
            'Venus faces Mars from the opposite sign, sweetening its aggression': 'शुक्र मंगल से सातवीं (सामने की) राशि में हैं।',
            'Mercury faces Mars from the opposite sign, tempering its sharpness': 'बुध मंगल से सातवीं (सामने की) राशि में हैं।',
            'The waxing Moon sits with Mars, cushioning its fire with emotional balance': 'बढ़ता चंद्र उसी राशि में मंगल के साथ है।',
            'Moon\'s opposition to Mars cushions its fire with emotional balance': 'चंद्र मंगल से सातवीं (सामने की) राशि में है।'
        },
        mSouth: 'कुछ दक्षिण भारतीय परंपराएँ दूसरे भाव को भी गिनती हैं, या शुक्र से भी गिनती करती हैं। उस गिनती से मंगल ऐसे एक स्थान में आता है।',
        mPair: {
            mutual: 'दोनों में सक्रिय मांगलिक दोष है। बृहत् पाराशर होरा शास्त्र (अध्याय 80, श्लोक 48-49) के अनुसार जब वर और कन्या दोनों में यह योग हो, तो इसका प्रभाव नहीं रहता।',
            one_sided: function (w) { return 'सिर्फ़ ' + w + ' में सक्रिय मांगलिक दोष है, इसलिए शास्त्रीय रूप से यह इस मिलान में बना रहता है। ज्योतिषी इसे अकेले नहीं, दोनों की पूरी कुंडली के साथ तौलते हैं।'; },
            neither: 'दोनों में से किसी में सक्रिय मांगलिक दोष नहीं है।'
        },
        mRule: {
            conventional: 'मंगल लग्न और चंद्र, दोनों से गिना गया है।',
            classical: 'मंगल लग्न से गिना गया है (बृहत् पाराशर होरा शास्त्र, अध्याय 80, श्लोक 47)।'
        }
    };

    var S = hi ? HI_S : EN;
    var label = function (c) { return hi ? c[1] + ' / ' + c[0] : c[0]; };
    var norm = function (s) { return String(s || '').trim().toLowerCase(); };

    var list = $('km-cities');
    CITIES.forEach(function (c) {
        var o = document.createElement('option');
        o.value = label(c);
        list.appendChild(o);
    });
    var findCity = function (v) {
        var n = norm(v);
        if (!n) return null;
        for (var i = 0; i < CITIES.length; i++) {
            var c = CITIES[i];
            if (n === norm(label(c)) || n === norm(c[0]) || n === norm(c[1])) return c;
        }
        return null;
    };

    var today = new Date();
    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var todayIso = today.getFullYear() + '-' + pad(today.getMonth() + 1) + '-' + pad(today.getDate());

    var person = function (k) {
        var p = { key: k, date: $('km-' + k + '-date'), time: $('km-' + k + '-time'), city: $('km-' + k + '-city'), tz: $('km-' + k + '-tz') };
        p.date.max = todayIso;
        // A known city fixes its timezone; asking twice invites a mismatch that shifts the lagna.
        p.city.addEventListener('change', function () {
            var c = findCity(p.city.value);
            if (c) p.tz.value = String(c[4]);
        });
        [p.date, p.time, p.city].forEach(function (el) {
            el.addEventListener('input', function () { el.removeAttribute('aria-invalid'); });
        });
        return p;
    };
    var people = [person('g'), person('b')];

    function zoneOffsetAt(zone, ms) {
        var g = {};
        new Intl.DateTimeFormat('en-US', { timeZone: zone, hourCycle: 'h23', year: 'numeric', month: 'numeric',
            day: 'numeric', hour: 'numeric', minute: 'numeric' }).formatToParts(new Date(ms))
            .forEach(function (x) { g[x.type] = +x.value; });
        return (Date.UTC(g.year, g.month - 1, g.day, g.hour, g.minute) - Math.floor(ms / 60000) * 60000) / 3600000;
    }
    // Foreign cities keep DST or changed offset historically, so their offset comes from the birth date.
    function birthOffset(city, picked, y, mo, d, h, mi) {
        var manual = parseFloat(picked);
        if (!city[5] || picked !== String(city[4])) return manual;
        try {
            var wall = Date.UTC(y, mo - 1, d, h, mi);
            return zoneOffsetAt(city[5], wall - zoneOffsetAt(city[5], wall) * 3600000);
        } catch (e) { return manual; }
    }

    var under18 = function (y, m, d) {
        var cut = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        return new Date(y, m - 1, d) > cut;
    };

    var esc = function (s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    };
    var num = function (n) { return esc(String(n)); };

    var fail = function (msg, el) {
        errEl.textContent = msg;
        errEl.hidden = false;
        resEl.hidden = true;
        if (el) {
            el.setAttribute('aria-invalid', 'true');
            el.focus();
        }
    };
    var shown = function (msg) { var e = new Error(msg); e.shown = true; return e; };

    var errorFor = function (status, msg) {
        msg = String(msg || '');
        if (status === 429) return S.busy;
        if (status === 400) {
            if (/18\+|adult/i.test(msg)) return S.adultServer;
            if (/^groom/i.test(msg)) return S.badField(S.who.g);
            if (/^bride/i.test(msg)) return S.badField(S.who.b);
            return S.badInput;
        }
        return S.server;
    };

    var fetchJson = function (url) {
        return new Promise(function (resolve, reject) {
            var ctrl = window.AbortController ? new AbortController() : null;
            var over = false;
            var timer = setTimeout(function () {
                over = true;
                if (ctrl) ctrl.abort();
                reject(shown(S.timeout));
            }, TIMEOUT_MS);
            fetch(url, ctrl ? { signal: ctrl.signal } : undefined)
                .then(function (r) {
                    return r.json().catch(function () { return {}; }).then(function (b) {
                        if (!r.ok) throw shown(errorFor(r.status, b && b.error));
                        return b;
                    });
                })
                .then(function (b) { clearTimeout(timer); if (!over) resolve(b); },
                      function (e) { clearTimeout(timer); if (!over) reject(e); });
        });
    };

    var value = function (koot, v) {
        if (koot === 'Varna') return '—';
        if (v === null || v === undefined) return '';
        if (hi && HT) {
            if (koot === 'Tara') return HT.nakshatra(v);
            if (koot === 'Maitri') return HT.planet(v);
            if (koot === 'Bhakut') return HT.sign(v);
        }
        return S.values[v] || v;
    };

    var mangalSide = function (who, s) {
        var h = '<div class="km-mcard"><p class="km-mwho">' + esc(who) + '</p>'
              + '<p class="km-mstatus">' + esc(S.mStatus[s.status] || s.status) + '</p>';
        if (s.grade && S.mGrade[s.grade]) h += '<p class="km-mnote">' + esc(S.mGrade[s.grade]) + '</p>';
        if (s.cancellations && s.cancellations.length) {
            h += '<p class="km-mnote">' + esc(S.mWhy) + '</p><ul class="km-mlist">';
            s.cancellations.forEach(function (c) { h += '<li>' + esc(S.mCancel[c] || c) + '</li>'; });
            h += '</ul>';
        }
        if (s.southIndianNote) h += '<p class="km-mnote">' + esc(S.mSouth) + '</p>';
        return h + '</div>';
    };

    var render = function (d) {
        var g = d.guna || {};
        var max = Number(g.max) || 36;
        var total = Number(g.total);
        var band = hi ? (S.band[g.band] || g.bandLabel) : g.bandLabel;
        var eased = d.doshasCancelled || [];

        var h = '<div class="km-score">'
              + '<p class="km-total"><span class="km-big">' + num(total) + '</span><span class="km-of">/' + num(max) + '</span>'
              + (band ? '<span class="km-band">' + esc(band) + '</span>' : '') + '</p>'
              + '<div class="km-meter" role="img" aria-label="' + esc(S.meter(total)) + '">'
              + '<span class="km-fill" style="width:' + Math.max(0, Math.min(100, total / max * 100)) + '%"></span>'
              + '<span class="km-mark" style="left:' + (18 / max * 100) + '%"><span>18</span></span></div>';
        h += '<p class="km-frame">' + esc(S.framing) + '</p></div>';

        h += '<h3 class="km-h">' + esc(S.kootsHead) + '</h3><div class="km-table-wrap"><table class="km-table"><thead><tr>'
           + S.cols.map(function (c, i) { return '<th scope="col"' + (i === 3 ? ' class="km-n"' : '') + '>' + esc(c) + '</th>'; }).join('')
           + '</tr></thead><tbody>';
        (d.koots || []).forEach(function (k) {
            var pts = Number(k.points), kmax = Number(k.max);
            var tag = '';
            if ((k.name === 'Nadi' || k.name === 'Bhakut') && pts === 0) {
                var off = eased.indexOf(k.name === 'Nadi' ? 'Nadi' : 'Bhakoot') > -1;
                tag = '<span class="km-tag' + (off ? ' is-eased' : '') + '">' + esc(S.doshaTag[k.name] + (off ? S.eased : '')) + '</span>';
            }
            var cls = pts === 0 ? ' is-zero' : pts >= kmax ? ' is-full' : '';
            h += '<tr><th scope="row">' + esc(S.koot[k.name] || k.name) + tag + '</th>'
               + '<td>' + esc(value(k.name, k.groom)) + '</td><td>' + esc(value(k.name, k.bride)) + '</td>'
               + '<td class="km-n"><span class="km-pts' + cls + '">' + num(pts) + '</span>/' + num(kmax) + '</td></tr>';
        });
        h += '</tbody><tfoot><tr><th scope="row" colspan="3">' + esc(S.total) + '</th><td class="km-n">' + num(total) + '/' + num(max) + '</td></tr></tfoot></table></div>';

        eased.forEach(function (n) {
            if (S.cancelled[n]) h += '<p class="km-eased">' + esc(S.cancelled[n]) + '</p>';
        });

        var m = d.manglik;
        if (m && m.groom && m.bride) {
            h += '<h3 class="km-h">' + esc(S.mHead) + '</h3><div class="km-mangal">'
               + mangalSide(S.whoCap.g, m.groom) + mangalSide(S.whoCap.b, m.bride) + '</div>';
            var pair = m.pair === 'one_sided'
                ? S.mPair.one_sided(m.groom.status === 'Present' ? S.who.g : S.who.b)
                : S.mPair[m.pair];
            if (pair) h += '<p class="km-pair">' + esc(pair) + '</p>';
            if (S.mRule[m.rule]) h += '<p class="km-mnote">' + esc(S.mRule[m.rule]) + '</p>';
        }

        outEl.innerHTML = h;
        errEl.hidden = true;
        resEl.hidden = false;
        var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        resEl.scrollIntoView({ behavior: still ? 'auto' : 'smooth', block: 'start' });
        resEl.focus({ preventScroll: true });
    };

    var cache = {};

    goEl.addEventListener('click', function () {
        errEl.hidden = true;
        var parts = [];
        for (var i = 0; i < people.length; i++) {
            var p = people[i], w = S.who[p.key];
            var d = p.date.value, t = p.time.value, city = findCity(p.city.value);
            if (!d) return fail(S.needDate(w), p.date);
            if (!t) return fail(S.needTime(w), p.time);
            if (!city) return fail(S.needCity(w), p.city);
            var a = d.split('-'), b = t.split(':');
            if (under18(+a[0], +a[1], +a[2])) return fail(S.adult(w), p.date);
            var tz = birthOffset(city, p.tz.value, +a[0], +a[1], +a[2], +b[0], +b[1]);
            var dob = new Date(Date.UTC(+a[0], +a[1] - 1, +a[2], +b[0], +b[1]) - tz * 3600000).toISOString();
            var pre = p.key === 'g' ? 'groom' : 'bride';
            parts.push(pre + 'Dob=' + encodeURIComponent(dob), pre + 'Lat=' + city[2], pre + 'Lon=' + city[3]);
        }
        var url = API + '/api/public/kundli-milan?' + parts.join('&');

        var done = function (data) {
            cache[url] = data;
            render(data);
            if (window.gtag) window.gtag('event', 'kundli_milan_calculated', { band: (data.guna && data.guna.band) || 'unknown' });
        };
        // Same details give the same answer for the day, so a resubmit spends nothing from the per-IP budget.
        if (cache[url]) return done(cache[url]);

        goEl.disabled = true;
        goEl.setAttribute('aria-busy', 'true');
        goEl.textContent = S.loading;

        fetchJson(url)
            .then(done)
            .catch(function (e) { fail(e && e.shown ? e.message : S.network); })
            .then(function () {
                goEl.disabled = false;
                goEl.removeAttribute('aria-busy');
                goEl.textContent = S.go;
            });
    });
})();
