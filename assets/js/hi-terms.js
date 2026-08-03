/* Devanagari names for the astro vocabularies the backend emits in English.
 *
 * The daily-horoscope/panchang API returns zodiac signs, nakshatras, tithis and tithi-quality
 * labels in English only (there is no _hi twin for them the way there is for the AI-written
 * summary and insights). Without this map the Hindi pages rendered "तिथि: Panchami",
 * "चंद्र राशि: Pisces" and "शनि — Pisces · Revati पाद 2" — Hindi labels wrapping English data.
 *
 * Every key here is copied from the value the backend actually produces, not transliterated by
 * eye: signs and nakshatras from NAKSHATRA_BOUNDARIES in jobs/helper.js, tithis and the five
 * quality labels from getTithi()/getTithiQuality() in jobs/classical-strength.js. If a new
 * value ever appears the lookup falls through to the English string rather than blanking.
 */
window.OMAI_HI = (function () {
  var SIGNS = {
    Aries: 'मेष', Taurus: 'वृषभ', Gemini: 'मिथुन', Cancer: 'कर्क',
    Leo: 'सिंह', Virgo: 'कन्या', Libra: 'तुला', Scorpio: 'वृश्चिक',
    Sagittarius: 'धनु', Capricorn: 'मकर', Aquarius: 'कुंभ', Pisces: 'मीन'
  };

  var NAKSHATRAS = {
    Ashwini: 'अश्विनी', Bharani: 'भरणी', Krittika: 'कृत्तिका', Rohini: 'रोहिणी',
    Mrigashira: 'मृगशिरा', Ardra: 'आर्द्रा', Punarvasu: 'पुनर्वसु', Pushya: 'पुष्य',
    Ashlesha: 'आश्लेषा', Magha: 'मघा', 'Purva Phalguni': 'पूर्वा फाल्गुनी',
    'Uttara Phalguni': 'उत्तरा फाल्गुनी', Hasta: 'हस्त', Chitra: 'चित्रा',
    Swati: 'स्वाति', Vishakha: 'विशाखा', Anuradha: 'अनुराधा', Jyeshta: 'ज्येष्ठा',
    Mula: 'मूल', 'Purva Ashadha': 'पूर्वाषाढ़ा', 'Uttara Ashadha': 'उत्तराषाढ़ा',
    Shravana: 'श्रवण', Dhanishta: 'धनिष्ठा', Shatabhisha: 'शतभिषा',
    'Purva Bhadrapada': 'पूर्वा भाद्रपदा', 'Uttara Bhadrapada': 'उत्तरा भाद्रपदा',
    Revati: 'रेवती'
  };

  var TITHIS = {
    Pratipada: 'प्रतिपदा', Dwitiya: 'द्वितीया', Tritiya: 'तृतीया', Chaturthi: 'चतुर्थी',
    Panchami: 'पंचमी', Shashthi: 'षष्ठी', Saptami: 'सप्तमी', Ashtami: 'अष्टमी',
    Navami: 'नवमी', Dashami: 'दशमी', Ekadashi: 'एकादशी', Dwadashi: 'द्वादशी',
    Trayodashi: 'त्रयोदशी', Chaturdashi: 'चतुर्दशी', Purnima: 'पूर्णिमा', Amavasya: 'अमावस्या'
  };

  var PAKSHA = { 'Shukla Paksha': 'शुक्ल पक्ष', 'Krishna Paksha': 'कृष्ण पक्ष' };

  // The five muhurta groups getTithiQuality() collapses to.
  var QUALITY = {
    Auspicious: 'शुभ',
    'Moderately Auspicious': 'मध्यम शुभ',
    Inauspicious: 'अशुभ',
    Special: 'विशेष',
    Neutral: 'सामान्य'
  };

  var PLANETS = {
    Sun: 'सूर्य', Moon: 'चंद्र', Mars: 'मंगल', Mercury: 'बुध', Jupiter: 'गुरु',
    Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु'
  };

  var lookup = function (table) {
    return function (v) {
      if (v === null || v === undefined || v === '') return '';
      return table[v] || String(v);   // unknown value → show the English rather than nothing
    };
  };

  return {
    sign: lookup(SIGNS),
    nakshatra: lookup(NAKSHATRAS),
    tithi: lookup(TITHIS),
    paksha: lookup(PAKSHA),
    quality: lookup(QUALITY),
    planet: lookup(PLANETS)
  };
})();
