/* Scroll interativo: títulos palavra por palavra, itens entrando em sequência,
   soma do preço subindo e cards que crescem com a rolagem. */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window)) return;
  var doc = document.documentElement;

  /* 1. Títulos palavra por palavra */
  var titles = document.querySelectorAll('main section:not(.hero) h2, .demo-more h3, .closing h2');
  Array.prototype.forEach.call(titles, function (h) {
    var n = 0;
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var frag = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach(function (w) {
            if (!w) return;
            if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
            var s = document.createElement('span'); s.className = 'sp-w'; s.style.setProperty('--w', n++);
            s.textContent = w; frag.appendChild(s);
          });
          node.replaceChild(frag, c);
        } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
      });
    };
    walk(h); h.classList.add('sp-title');
  });

  /* 3. Itens que entram em sequência */
  var groups = [
    '.numbers .section-lead', '.stat', '.numbers-note',
    '.check .section-lead', '.check-list > *', '.check-result',
    '.horizon .section-lead', '.horizon-panel, #horizon-panel', '.milestones > li',
    '.areas .section-lead', '.area-chip', '.saas-phone', '.saas-info', '.demo-more-copy > p', '.demo-more-list li',
    '.days .section-lead', '.track-nodes > li', '.journey',
    '.founder-copy > p', '.shot', '.testimonial',
    '.fit-col', '.fit-col li',
    '.price .section-lead', '.price-card', '.faq-list details', '.closing-lead', '.closing .btn'
  ];
  var seen = new Set(), items = [];
  groups.forEach(function (sel) {
    Array.prototype.forEach.call(document.querySelectorAll(sel), function (el) {
      if (seen.has(el)) return; seen.add(el); items.push(el);
    });
  });
  items.forEach(function (el) {
    var p = el.parentNode, sib = 0;
    if (p) { var kids = Array.prototype.filter.call(p.children, function (k) { return seen.has(k); }); sib = Math.max(0, kids.indexOf(el)); }
    el.classList.add('sp-rv'); el.style.setProperty('--d', Math.min(sib, 8) * 70 + 'ms');
  });

  /* 4. Preço: cada entregável aparece e a soma sobe */
  var plist = document.getElementById('price-list'), sumEl = document.getElementById('price-sum');
  var priceItems = plist ? Array.prototype.slice.call(plist.children) : [];
  var vals = priceItems.map(function (li) { var v = li.querySelector('.pl-val'); return v ? parseInt(v.textContent.replace(/\D/g, ''), 10) || 0 : 0; });
  var total = vals.reduce(function (a, b) { return a + b; }, 0), shown = 0, running = 0;
  var fmt = function (n) { return 'R$' + n.toLocaleString('pt-BR'); };
  var bump = function (to) {
    if (!sumEl) return;
    var from = running; running = to;
    if (reduce) { sumEl.textContent = fmt(to); return; }
    var t0 = performance.now();
    (function f(now) { var t = Math.min(1, (now - t0) / 380); sumEl.textContent = fmt(Math.round(from + (to - from) * t)); if (t < 1) requestAnimationFrame(f); })(t0);
    sumEl.classList.remove('sp-pop'); void sumEl.offsetWidth; sumEl.classList.add('sp-pop');
  };
  if (priceItems.length && total && !reduce && !document.querySelector('.premio')) {
    sumEl.textContent = fmt(0);
    priceItems.forEach(function (li) { li.classList.add('sp-pl'); });
    var card = document.querySelector('.price-card');
    var pio = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        pio.unobserve(en.target); en.target.classList.add('sp-on');
        shown += vals[priceItems.indexOf(en.target)];
        bump(shown);
        if (shown >= total && card) setTimeout(function () { card.classList.add('sp-done'); }, 400);
      });
    }, { rootMargin: '0px 0px -18% 0px', threshold: 0 });
    priceItems.forEach(function (li) { pio.observe(li); });
  }

  if (reduce) { doc.classList.add('sp-static'); }
  else {
    doc.classList.add('sp-ready');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        var t = en.target, par = t.parentNode;
        var row = par && par.matches && par.matches('.stats, .area-chips, .gallery-track') ? Array.prototype.slice.call(par.children) : [t];
        row.forEach(function (x) { if (x.classList.contains('sp-rv') || x === t) { x.classList.add('sp-in'); io.unobserve(x); } });
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
    Array.prototype.forEach.call(document.querySelectorAll('.sp-title'), function (el) { io.observe(el); });
  }

  /* 4. Cards que crescem e fotos com profundidade, conforme a rolagem */
  if (reduce) return;
  var scrub = Array.prototype.slice.call(document.querySelectorAll('.demo-more, .price-card, .closing-inner'));
  var shots = Array.prototype.slice.call(document.querySelectorAll('.shot img'));
  var ticking = false;
  var frame = function () {
    ticking = false;
    var h = innerHeight;
    scrub.forEach(function (el) {
      var r = el.getBoundingClientRect(), p = Math.max(0, Math.min(1, (h - r.top) / (h * 0.6)));
      el.style.setProperty('--sp', p.toFixed(3));
    });
    shots.forEach(function (img) {
      var r = img.parentNode.getBoundingClientRect(); if (r.bottom < 0 || r.top > h) return;
      var p = (r.top + r.height / 2 - h / 2) / h;
      img.style.transform = 'translateY(' + (p * -24).toFixed(1) + 'px) scale(1.08)';
    });
  };
  var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  frame();
})();
