/* Link de inscrição (checkout). Todos os botões de compra usam este endereço. */
window.CTL_CTA_URL = "https://pay.kiwify.com.br/HqXQ31y";

/* Repassa as UTMs do anúncio (utm_source, utm_campaign, src, fbclid...) do quiz para a landing e da landing para o checkout. */
(function () {
  try {
    if (!location.search || location.search.length < 2) return;
    var q = new URLSearchParams(location.search);
    var add = function (url) {
      var u = new URL(url, location.href);
      q.forEach(function (v, k) { if (!u.searchParams.has(k)) u.searchParams.set(k, v); });
      return u.toString();
    };
    window.CTL_CTA_URL = add(window.CTL_CTA_URL);
    window.CTL_WITH_UTM = add;
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      var h = a.getAttribute('href');
      if (/^(desafio\/?|\.\/|\.\.\/)$/.test(h) || /pay\.kiwify\.com\.br/.test(h)) a.href = add(a.href);
    }, true);
  } catch (e) {}
})();
