// Android visitors on Hindi SEO pages: web chat becomes the main button, Google Play the second (2026-10-02 user-loss read).
(function () {
  if (!/android/i.test(navigator.userAgent || '')) return;
  var page = (location.pathname.split('/').pop() || 'index').replace(/\.html$/, '').replace(/-/g, '_');
  var href = '/ask.html?lang=hi&utm_source=website&utm_medium=referral&utm_campaign=seo_page&utm_content=hi_' + page + '_android_web';
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
  function run() {
    document.querySelectorAll('a.btn--primary[href*="play.google.com"]').forEach(function (play) {
      var bar = play.closest('.mobile-cta-bar');
      play.parentNode.insertBefore(webButton(play.className, bar ? 'मुफ़्त सवाल पूछें' : 'ब्राउज़र में पहला सवाल मुफ़्त पूछें'), play);
      play.classList.remove('btn--primary');
      play.classList.add('btn--outline');
      if (bar) bar.querySelectorAll('a[href*="apps.apple.com"]').forEach(function (ios) { ios.style.display = 'none'; });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
