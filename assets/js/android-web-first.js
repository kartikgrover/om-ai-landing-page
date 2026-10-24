// Android visitors on Hindi SEO pages: 50/50 test of web chat vs Google Play as the main button (2026-10-23).
(function () {
  if (!/android/i.test(navigator.userAgent || '')) return;
  var page = (location.pathname.split('/').pop() || 'index').replace(/\.html$/, '').replace(/-/g, '_');
  var href = '/ask.html?lang=hi&utm_source=website&utm_medium=referral&utm_campaign=seo_page&utm_content=hi_' + page + '_android_web';
  var KEY = 'om_hi_cta_arm';
  var arm = null;
  function assign() {
    try { arm = localStorage.getItem(KEY); } catch (e) {}
    if (arm !== 'web' && arm !== 'play') {
      arm = Math.random() < 0.5 ? 'web' : 'play';
      try { localStorage.setItem(KEY, arm); } catch (e) {}
    }
  }
  function webButton(cls, label) {
    var a = document.createElement('a');
    a.href = href;
    a.className = cls;
    a.textContent = label;
    a.addEventListener('click', function () {
      try { gtag('event', 'web_ask_click', { event_category: 'Web MVP', event_label: 'hi_' + page + '_android_web' }); } catch (e) {}
    });
    return a;
  }
  // The arm rides the Play referrer's utm_content so the app's firebase_campaign event can split installs.
  function tagPlay(a) {
    try {
      var u = new URL(a.href);
      var r = new URLSearchParams(u.searchParams.get('referrer') || '');
      r.set('utm_content', (r.get('utm_content') || 'hi_' + page) + '_' + arm + 'first');
      u.searchParams.set('referrer', r.toString());
      a.href = u.toString();
    } catch (e) {}
  }
  function run() {
    var plays = document.querySelectorAll('a.btn--primary[href*="play.google.com"]');
    if (!plays.length) return;
    assign();
    try { gtag('event', 'experiment_exposure', { exp_name: 'hi_android_cta', exp_arm: arm, exp_surface: 'hi_' + page }); } catch (e) {}
    document.querySelectorAll('a[href*="play.google.com"]').forEach(tagPlay);
    if (arm !== 'web') return;
    plays.forEach(function (play) {
      var bar = play.closest('.mobile-cta-bar');
      play.parentNode.insertBefore(webButton(play.className, bar ? 'मुफ़्त सवाल पूछें' : 'ब्राउज़र में पहला सवाल मुफ़्त पूछें'), play);
      play.classList.remove('btn--primary');
      play.classList.add('btn--outline');
      if (bar) bar.querySelectorAll('a[href*="apps.apple.com"]').forEach(function (ios) { ios.style.display = 'none'; });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
