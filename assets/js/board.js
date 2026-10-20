/* CTL, o jogo: ficha do jogador, moedas, casas com estrada e cartas (algumas com decisão),
   bifurcação com desvio, roleta, conta da recorrência, caixa do prêmio e resumo da partida. */
(function () {
  'use strict';
  var C = window.CTL_CONTENT || {};
  var board = C.board || [];
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var $ = function (id) { return document.getElementById(id); };
  var each = function (sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); };
  var brl = function (n) { return 'R$' + Math.round(n).toLocaleString('pt-BR'); };
  var buzz = function (p) { if (navigator.vibrate) { try { navigator.vibrate(p); } catch (e) {} } };

  /* ---------- Estado da partida (só nesta aba) ---------- */
  var S = { name: '', color: '#17150F', area: -1, coins: 0, started: false };
  try { var saved = JSON.parse(sessionStorage.getItem('ctl-game') || 'null'); if (saved) for (var k in saved) S[k] = saved[k]; } catch (e) {}
  try { if (!S.name && sessionStorage.getItem('ctl-name')) S.name = sessionStorage.getItem('ctl-name'); } catch (e) {}
  var save = function () { try { sessionStorage.setItem('ctl-game', JSON.stringify(S)); sessionStorage.setItem('ctl-name', S.name); } catch (e) {} };
  var stats = { cards: 0, good: 0, bad: 0, doubts: 0, visited: 0 };
  var nome = function () { return (S.name || '').trim().split(/\s+/)[0] || ''; };
  var tpl = function (t) {
    var n = esc(nome());
    t = String(t)
      .replace(/^\{nome\},\s*/, n ? n + ', ' : '')
      .replace(/,\s*\{nome\}/g, n ? ', ' + n : '')
      .replace(/\{nome\}/g, n || 'você');
    return t.replace(/^([a-zà-ú])/, function (c) { return c.toUpperCase(); });
  };

  function paint() {
    var n = nome(), i = n ? n.charAt(0).toUpperCase() : '★';
    each('.pawn-i', function (el) { el.textContent = i; });
    document.documentElement.style.setProperty('--pawn', S.color);
    document.documentElement.style.setProperty('--pawn-ink', S.color === '#C9A04A' ? '#17150F' : (S.color === '#17150F' ? '#C9A04A' : '#fff'));
    each('[data-tpl]', function (el) { el.innerHTML = tpl(el.getAttribute('data-tpl')); });
    each('.premio-t', function (el) { el.textContent = n ? 'O prêmio de ' + n : 'O seu prêmio'; });
  }
  window.CTL_paintPawns = paint;
  var nameInput = $('name-input');
  if (nameInput) nameInput.addEventListener('input', function () { S.name = nameInput.value; save(); paint(); });

  /* ---------- Toast ---------- */
  var toastEl = null, toastT = 0;
  function toast(msg, kind) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'bd-toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.className = 'bd-toast' + (kind ? ' is-' + kind : '');
    toastEl.innerHTML = msg; void toastEl.offsetWidth; toastEl.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 2800);
  }

  /* ---------- Moedas (só na conta final, sem contador flutuante) ---------- */
  function coins(n) { S.coins = Math.max(0, S.coins + n); save(); }
  window.CTL_coins = coins;

  /* ---------- Confete ---------- */
  function burst(box, count) {
    if (reduce || !box) return;
    box.innerHTML = '';
    var cols = ['#C9A04A', '#E9C46A', '#1F8B58', '#D23A2C', '#2E4A6E', '#F7F4EE'];
    for (var i = 0; i < (count || 28); i++) {
      var s = document.createElement('i'), a = Math.random() * Math.PI * 2, r = 60 + Math.random() * 140;
      s.style.setProperty('--dx', (Math.cos(a) * r).toFixed(0) + 'px');
      s.style.setProperty('--dy', (Math.sin(a) * r - 40).toFixed(0) + 'px');
      s.style.setProperty('--r', (Math.random() * 540 - 270).toFixed(0) + 'deg');
      s.style.background = cols[i % cols.length];
      s.style.animationDelay = (Math.random() * 120).toFixed(0) + 'ms';
      box.appendChild(s);
    }
  }

  var areas = C.areas || [];

  /* ---------- Casas (desligadas na landing: o tabuleiro no meio da página derruba a conversão) ---------- */
  var casas = [];
  var SHOW_CASAS = false;
  (SHOW_CASAS ? board : []).forEach(function (b) {
    var target = document.querySelector(b.before);
    if (!target) return;
    var n = casas.length + 1, left = n % 2 === 1;
    var x0 = left ? 18 : 82, x1 = left ? 82 : 18;
    var d = 'M' + x0 + ' -4 C' + x0 + ' 60 ' + x1 + ' 40 ' + x1 + ' 104';
    var kind = b.kind === 'real' ? 'real' : 'chance';
    var el = document.createElement('div');
    el.className = 'casa ' + (left ? 'casa-l' : 'casa-r') + (b.choice || b.fork ? ' casa-choice' : '');
    el.setAttribute('role', 'group');
    el.setAttribute('aria-label', 'Casa ' + n + ': ' + b.title);
    var choiceHtml = '';
    if (b.choice) choiceHtml = '<div class="casa-opts" role="group" aria-label="Sua decisão">' + b.choice.map(function (o, i) { return '<button type="button" class="opt' + (o.bad ? ' opt-bad' : ' opt-good') + '" data-i="' + i + '">' + esc(o.t) + '</button>'; }).join('') + '</div>';
    if (b.fork) choiceHtml = '<div class="casa-opts" role="group" aria-label="Escolha o caminho"><button type="button" class="opt opt-good" data-fork="go">É pra mim, sigo em frente</button><button type="button" class="opt opt-alt" data-fork="doubt">Ainda tenho dúvida</button></div>';
    el.innerHTML =
      '<svg class="casa-road" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">' +
        '<path class="rd-edge" d="' + d + '"/><path class="rd" d="' + d + '"/><path class="rd-line" d="' + d + '"/></svg>' +
      '<span class="road-pawn pawn" aria-hidden="true"><span class="pawn-i"></span></span>' +
      '<div class="wrap casa-in">' +
        '<div class="casa-tile" aria-hidden="true"><small>Casa</small><b>' + n + '</b><span class="dado" data-f="' + ((n % 6) + 1) + '"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span></div>' +
        '<div class="casa-side"><p class="casa-k">' + esc(b.title) + '</p>' +
          '<button type="button" class="carta carta-' + kind + '" aria-pressed="false" aria-label="' + esc(b.card) + ': toque para virar">' +
            '<span class="carta-in">' +
              '<span class="carta-f"><i aria-hidden="true">?</i><b>' + esc(b.card) + '</b><small>Toque para virar</small></span>' +
              '<span class="carta-b"><b>' + esc(b.card) + '</b><span data-tpl="' + esc(b.text) + '"></span></span>' +
            '</span></button>' +
          choiceHtml +
          '<p class="casa-res" aria-live="polite"></p>' +
        '</div>' +
      '</div>' +
      (b.fork ? '<div class="wrap desvio" hidden><p class="desvio-k">Desvio: as três dúvidas mais comuns</p><div class="desvio-cards">' +
        (C.forkDoubts || []).map(function (q, i) { return '<button type="button" class="dv" aria-pressed="false" data-i="' + i + '"><span class="dv-q">' + esc(q.q) + '</span><span class="dv-a">' + esc(q.a) + '</span></button>'; }).join('') +
        '</div><button type="button" class="btn btn-ink desvio-back" hidden>Voltar para a estrada</button></div>' : '') +
      '<span class="casa-burst" aria-hidden="true"></span>';
    target.parentNode.insertBefore(el, target);
    var card = el.querySelector('.carta');
    var c = { el: el, b: b, n: n, card: card, section: target, title: b.title, prize: b.before === '#entrega', path: el.querySelector('.rd'), pawn: el.querySelector('.road-pawn'), dado: el.querySelector('.dado'), off: 0, res: el.querySelector('.casa-res') };
    card.addEventListener('click', function () { card._user = true; var on = card.getAttribute('aria-pressed') !== 'true'; if (on) roll(c, function () { flip(c, true); }); else flip(c, false); });
    if (b.choice) el.querySelector('.casa-opts').addEventListener('click', function (e) { var o = e.target.closest('.opt'); if (o) decide(c, b.choice[+o.dataset.i], o); });
    if (b.fork) setupFork(c);
    casas.push(c);
  });
  window.CTL_CASAS = casas;

  function flip(c, on) {
    var card = c.card;
    card.setAttribute('aria-pressed', String(on));
    card.classList.toggle('is-flipped', on);
    if (on) c.el.classList.add('is-read');
    if (on && !card._got) {
      card._got = true; stats.cards++;
      coins(10);
      each('.bd-count', function (e) { e.textContent = stats.cards + '/' + casas.length; });
      if (stats.cards === casas.length) { toast('<b>Jogador completo!</b> Você virou as ' + casas.length + ' cartas.', 'gold'); burst(casas[casas.length - 1].el.querySelector('.casa-burst')); coins(30); }
    }
  }
  function roll(c, done) {
    if (c.rolling) return;
    if (reduce) { done(); return; }
    c.rolling = true;
    var d = c.dado, k = 0;
    d.classList.add('is-rolling');
    var t = setInterval(function () { d.dataset.f = 1 + Math.floor(Math.random() * 6); if (++k > 7) { clearInterval(t); d.classList.remove('is-rolling'); d.classList.add('is-landed'); setTimeout(function () { d.classList.remove('is-landed'); }, 500); c.rolling = false; done(); } }, 70);
    buzz([8, 40, 8]);
  }
  /* Decisão: errada faz voltar casas, certa faz avançar */
  function tweenOff(c, to, dur, then) {
    if (reduce) { c.off = 0; if (then) then(); return; }
    var from = c.off, t0 = performance.now();
    (function f(now) { var t = Math.min(1, (now - t0) / dur), e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; c.off = from + (to - from) * e; ride(); if (t < 1) requestAnimationFrame(f); else if (then) then(); })(t0);
  }
  function decide(c, o, btn) {
    if (c.decided) return;
    if (c.card.getAttribute('aria-pressed') !== 'true') flip(c, true);
    if (o.bad) {
      stats.bad++; coins(-10); buzz([30, 60, 30]);
      c.el.classList.remove('is-back'); void c.el.offsetWidth; c.el.classList.add('is-back');
      tweenOff(c, -0.45, 650, function () { setTimeout(function () { tweenOff(c, 0, 900); }, 500); });
      c.res.innerHTML = tpl(o.msg) + ' Tente de novo.';
      c.res.className = 'casa-res is-bad';
      btn.disabled = true; btn.classList.add('is-out');
      toast(tpl(o.msg), 'red');
    } else {
      c.decided = true; stats.good++; coins(20); buzz(15);
      Array.prototype.forEach.call(c.el.querySelectorAll('.opt'), function (b) { b.disabled = true; if (b !== btn) b.classList.add('is-out'); });
      btn.classList.add('is-picked');
      c.res.innerHTML = tpl(o.msg) + ' <span class="plus">+20 moedas</span>';
      c.res.className = 'casa-res is-good';
      tweenOff(c, 0.25, 600, function () { setTimeout(function () { tweenOff(c, 0, 800); }, 400); });
      burst(c.el.querySelector('.casa-burst'), 18);
    }
  }
  function setupFork(c) {
    var desvio = c.el.querySelector('.desvio'), back = c.el.querySelector('.desvio-back'), opts = c.el.querySelector('.casa-opts');
    var seen = 0;
    opts.addEventListener('click', function (e) {
      var o = e.target.closest('.opt'); if (!o || c.decided) return;
      if (c.card.getAttribute('aria-pressed') !== 'true') flip(c, true);
      if (o.dataset.fork === 'go') {
        c.decided = true; stats.good++; coins(20);
        Array.prototype.forEach.call(opts.children, function (b) { b.disabled = true; if (b !== o) b.classList.add('is-out'); });
        o.classList.add('is-picked'); desvio.hidden = true;
        c.res.innerHTML = '<b>Caminho escolhido.</b> Siga a estrada até o prêmio. <span class="plus">+20 moedas</span>'; c.res.className = 'casa-res is-good';
        burst(c.el.querySelector('.casa-burst'), 18); buzz(15);
      } else {
        desvio.hidden = false; c.el.classList.add('is-detour');
        c.res.innerHTML = 'Pegue o desvio. Toque em cada dúvida.'; c.res.className = 'casa-res';
        if (!reduce) desvio.animate([{ opacity: 0, transform: 'translateY(-12px)' }, { opacity: 1, transform: 'none' }], { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)' });
      }
    });
    desvio.addEventListener('click', function (e) {
      var d = e.target.closest('.dv'); if (!d || d.getAttribute('aria-pressed') === 'true') return;
      d.setAttribute('aria-pressed', 'true'); seen++; stats.doubts++; coins(5); buzz(8);
      if (seen === desvio.querySelectorAll('.dv').length) back.hidden = false;
    });
    back.addEventListener('click', function () {
      c.decided = true; stats.good++; coins(20);
      Array.prototype.forEach.call(opts.children, function (b) { b.disabled = true; });
      c.el.classList.remove('is-detour'); desvio.hidden = true;
      c.res.innerHTML = '<b>De volta à estrada.</b> Dúvida respondida vale moeda. <span class="plus">+20 moedas</span>'; c.res.className = 'casa-res is-good';
      c.el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    });
  }

  /* Peão anda pela estrada conforme a rolagem */
  var ticking = false;
  function ride() {
    ticking = false;
    var h = innerHeight;
    casas.forEach(function (c) {
      var r = c.el.getBoundingClientRect();
      if (r.bottom < -50 || r.top > h + 50) return;
      var p = Math.max(0, Math.min(1, (h * 0.8 - r.top) / (r.height + h * 0.45) + c.off));
      if (!c.len) { try { c.len = c.path.getTotalLength(); } catch (e) { c.len = 0; } }
      if (!c.len) return;
      var pt = c.path.getPointAtLength(p * c.len);
      var rh = c.path.ownerSVGElement.getBoundingClientRect().height || r.height;
      c.pawn.style.transform = 'translate(' + (pt.x / 100 * r.width).toFixed(1) + 'px,' + (pt.y / 100 * rh).toFixed(1) + 'px)';
    });
  }
  if (!reduce) {
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(ride); } }, { passive: true });
    addEventListener('resize', function () { casas.forEach(function (c) { c.len = 0; }); ride(); });
  }

  if (reduce || !hasIO) {
    casas.forEach(function (c) { c.el.classList.add('is-on'); flip(c, true); c.pawn.style.display = 'none'; });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        var c = casas.filter(function (x) { return x.el === en.target; })[0];
        if (!c || !en.isIntersecting || c.el.classList.contains('is-on')) return;
        c.el.classList.add('is-on'); stats.visited++;
        setTimeout(function () { if (!c.card._user) roll(c, function () { flip(c, true); }); }, 700);
        if (c.prize) setTimeout(function () { burst(c.el.querySelector('.casa-burst')); }, 500);
        buzz(12);
      });
    }, { rootMargin: '-30% 0px -30% 0px', threshold: 0 });
    casas.forEach(function (c) { io.observe(c.el); });
  }

  /* ---------- Dados das áreas ---------- */
  var chipsBox = $('area-chips');
  if (chipsBox && areas.length) {
    var N = areas.length;
    var pips = '<i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>';
    var rol = document.createElement('div');
    rol.className = 'roleta';
    rol.innerHTML =
      '<div class="roleta-dice" aria-hidden="true"><span class="roleta-die"><span class="dado" data-f="5">' + pips + '</span></span><span class="roleta-die is-b"><span class="dado" data-f="3">' + pips + '</span></span></div>' +
      '<div class="roleta-txt"><b>Não sabe por onde começar?</b>' +
        '<span class="roleta-res" aria-live="polite"></span>' +
        '<button type="button" class="btn btn-ink roleta-btn">Jogar os dados</button></div>';
    chipsBox.parentNode.insertBefore(rol, chipsBox);
    var stage = document.createElement('div');
    stage.className = 'dice-stage'; stage.setAttribute('aria-hidden', 'true');
    document.body.appendChild(stage);
    var rbtn = rol.querySelector('.roleta-btn'), res = rol.querySelector('.roleta-res');
    var throwing = false, thrown = 0, hold = 0, raf = 0, tossN = 0, faceTick = 0;
    var cardDice = rol.querySelectorAll('.roleta-die .dado');
    var showFaces = function (f1, f2) {
      if (cardDice[0]) cardDice[0].setAttribute('data-f', String(f1));
      if (cardDice[1]) cardDice[1].setAttribute('data-f', String(f2));
    };
    var makeDie = function () {
      var el = document.createElement('span');
      el.className = 'dado'; el.setAttribute('data-f', '1'); el.innerHTML = pips;
      return el;
    };
    var pick = function (i) {
      var chip = chipsBox.children[i];
      if (!chip) return;
      chip.click();
      if (chipsBox.scrollWidth > chipsBox.clientWidth) chipsBox.scrollTo({ left: chip.offsetLeft - chipsBox.offsetLeft - 16, behavior: reduce ? 'auto' : 'smooth' });
      chip.classList.remove('roleta-hit'); void chip.offsetWidth; chip.classList.add('roleta-hit');
    };
    var settle = function (d1, d2, i, a, b) {
      a.setAttribute('data-f', String(d1)); b.setAttribute('data-f', String(d2));
      clearInterval(faceTick); showFaces(d1, d2);
      rol.classList.remove('is-throw'); rol.classList.add('is-land');
      throwing = false; rbtn.disabled = false; rbtn.textContent = 'Jogar de novo';
      res.innerHTML = '<small>Caiu ' + d1 + ' e ' + d2 + '</small><strong>' + esc(areas[i].area) + '</strong>';
      pick(i); if (thrown++ < 3) coins(10); buzz([10, 40, 10]);
      hold = setTimeout(function () { stage.classList.add('is-out'); }, reduce ? 400 : 3000);
    };
    var put = function (p, floorY) {
      var sy = p.sq || 1, sx = 1 + (1 - sy) * 0.5;
      var lift = Math.max(0, (floorY || 0) - p.y);
      var drop = Math.min(26, 2 + lift * 0.04);
      p.el.style.transform = 'translate(' + p.x.toFixed(1) + 'px,' + p.y.toFixed(1) + 'px) scale(' + sx.toFixed(3) + ',' + sy.toFixed(3) + ') rotate(' + p.r.toFixed(1) + 'deg)';
      p.el.style.filter = 'drop-shadow(0 ' + drop.toFixed(1) + 'px ' + (3 + drop * 0.55).toFixed(1) + 'px rgba(23,21,15,' + (0.16 + Math.min(0.22, lift / 800)).toFixed(2) + '))';
    };
    /* Caem na tela de verdade, quicam e param encostados na borda de baixo. */
    var toss = function (a, b, d1, d2, i) {
      var id = ++tossN;
      cancelAnimationFrame(raf);
      var size = a.offsetWidth || 58;
      var W = stage.clientWidth, H = stage.clientHeight, pad = 4;
      var maxX = Math.max(pad, W - size - pad), maxY = Math.max(pad, H - size - 2);
      if (reduce || W < 40 || H < 40) {
        a.style.transform = 'translate(' + Math.round(maxX * 0.22) + 'px,' + maxY + 'px) rotate(-6deg)';
        b.style.transform = 'translate(' + Math.round(maxX * 0.62) + 'px,' + maxY + 'px) rotate(8deg)';
        a.classList.add('is-live'); b.classList.add('is-live');
        settle(d1, d2, i, a, b);
        return;
      }
      var spawn = function (el, face) {
        return {
          el: el, face: face, sq: 1,
          x: pad + Math.random() * Math.max(8, maxX - pad),
          y: -size - 8 - Math.random() * 90,
          vx: (Math.random() < 0.5 ? -1 : 1) * (120 + Math.random() * 260),
          vy: 30 + Math.random() * 80,
          r: (Math.random() - 0.5) * 30,
          vr: (Math.random() < 0.5 ? -1 : 1) * (160 + Math.random() * 200)
        };
      };
      var bodies = [spawn(a, d1), spawn(b, d2)];
      if (Math.abs(bodies[0].x - bodies[1].x) < size) bodies[1].x = Math.min(maxX, bodies[0].x + size + 12);
      var hitFace = function (p, speed) {
        if (Math.abs(speed) < 180) return;
        p.sq = Math.max(0.74, 1 - Math.min(0.26, Math.abs(speed) / 3200));
        p.el.setAttribute('data-f', String(1 + Math.floor(Math.random() * 6)));
      };
      bodies.forEach(function (p) { p.el.classList.add('is-live'); put(p, maxY); });
      var g = 2800, wall = 0.42, floor = 0.34;
      var last = performance.now(), started = last, done = false, easeAt = 0;
      var step = function (now) {
        if (id !== tossN || done) return;
        var dt = Math.min(0.032, (now - last) / 1000); last = now;
        maxX = Math.max(pad, stage.clientWidth - size - pad);
        maxY = Math.max(pad, stage.clientHeight - size - 2);
        if (!easeAt) {
          bodies.forEach(function (p) {
            p.vy += g * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.vr * dt;
            p.sq += (1 - p.sq) * Math.min(1, dt * 16);
            if (p.x < pad) { p.x = pad; hitFace(p, p.vx); p.vx = Math.abs(p.vx) * wall; p.vr = -p.vr * 0.55; }
            else if (p.x > maxX) { p.x = maxX; hitFace(p, p.vx); p.vx = -Math.abs(p.vx) * wall; p.vr = -p.vr * 0.55; }
            if (p.y < 0 && p.vy < 0) { p.y = 0; hitFace(p, p.vy); p.vy = Math.abs(p.vy) * wall; }
            if (p.y > maxY) {
              var impact = p.vy;
              p.y = maxY;
              if (impact < 170) p.vy = 0; else { hitFace(p, impact); p.vy = -impact * floor; }
              p.vx *= 0.58;
              p.vr = p.vx / size * 320;
            }
            if (p.y >= maxY - 0.4 && p.vy === 0) {
              p.y = maxY;
              var roll = p.vx / size * 360;
              p.vr += (roll - p.vr) * Math.min(1, dt * 12);
              p.vx *= Math.exp(-3.2 * dt);
              if (Math.abs(p.vx) < 14) { p.vx = 0; p.vr *= Math.exp(-10 * dt); }
            }
          });
          var A = bodies[0], B = bodies[1];
          var dx = B.x - A.x, dy = B.y - A.y, dist = Math.sqrt(dx * dx + dy * dy) || 0.001, min = size * 0.92;
          if (dist < min) {
            var nx = dx / dist, ny = dy / dist, overlap = (min - dist) / 2;
            A.x -= nx * overlap; B.x += nx * overlap; A.y -= ny * overlap; B.y += ny * overlap;
            var rel = (B.vx - A.vx) * nx + (B.vy - A.vy) * ny;
            if (rel < 0) {
              var j = rel * -0.72;
              A.vx -= j * nx; A.vy -= j * ny; B.vx += j * nx; B.vy += j * ny;
              A.vr += nx * 90; B.vr -= nx * 90;
            }
          }
        }
        var moving = false;
        bodies.forEach(function (p) {
          if (p.x < pad) p.x = pad; if (p.x > maxX) p.x = maxX;
          if (p.y > maxY) p.y = maxY;
          if (!easeAt && (Math.abs(p.vx) > 16 || Math.abs(p.vy) > 16 || p.y < maxY - 1)) moving = true;
          put(p, maxY);
        });
        if (!easeAt && moving && now - started < 4200) { raf = requestAnimationFrame(step); return; }
        if (!easeAt) {
          easeAt = now;
          bodies.forEach(function (p) {
            p.vx = 0; p.vy = 0; p.vr = 0; p.y = maxY;
            var ang = ((p.r % 360) + 360) % 360;
            if (ang > 180) ang -= 360;
            p.ease = Math.max(-12, Math.min(12, ang));
            p.el.setAttribute('data-f', String(p.face));
          });
        }
        var u = Math.min(1, (now - easeAt) / 260);
        bodies.forEach(function (p) {
          var diff = p.ease - p.r;
          while (diff > 180) diff -= 360;
          while (diff < -180) diff += 360;
          p.r += diff * 0.35; p.sq += (1 - p.sq) * 0.4; p.y = maxY;
          put(p, maxY);
        });
        if (u < 1) { raf = requestAnimationFrame(step); return; }
        done = true;
        settle(d1, d2, i, a, b);
      };
      raf = requestAnimationFrame(step);
    };
    rbtn.addEventListener('click', function () {
      if (throwing) return; throwing = true; rbtn.disabled = true;
      var d1 = 1 + Math.floor(Math.random() * 6), d2 = 1 + Math.floor(Math.random() * 6);
      var i = Math.round((d1 + d2 - 2) / 10 * (N - 1));
      clearTimeout(hold); cancelAnimationFrame(raf); clearInterval(faceTick);
      rol.classList.add('is-throw'); rol.classList.remove('is-land');
      res.innerHTML = '<em>Os dados estão caindo…</em>';
      faceTick = setInterval(function () { showFaces(1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)); }, 90);
      stage.classList.remove('is-out'); stage.innerHTML = '';
      var a = makeDie(), b = makeDie();
      stage.appendChild(a); stage.appendChild(b);
      buzz(10);
      toss(a, b, d1, d2, i);
    });
    /* Abre direto na área escolhida na ficha */
    var areasSec = $('areas'), opened = false;
    if (areasSec && hasIO) new IntersectionObserver(function (es, o) {
      if (!es[0].isIntersecting || opened) return; opened = true; o.disconnect();
      if (S.area >= 0 && S.area < N) { pick(S.area); res.innerHTML = '<small>Abrimos na sua área</small><strong>' + esc(areas[S.area].area) + '</strong>'; }
    }, { threshold: .15 }).observe(areasSec);
    var chipTaps = 0;
    chipsBox.addEventListener('click', function (e) { if (e.isTrusted && e.target.closest('.area-chip') && chipTaps++ < 3) coins(5); });
  }

  /* Moedas por se reconhecer */
  var checkList = $('check-list');
  if (checkList) checkList.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b && !b._paid) { b._paid = true; coins(5); } });

  /* ---------- A grana: conta da recorrência ---------- */
  var G = C.grana, calc = $('grana-calc');
  if (G && calc) {
    var price = G.price, clients = G.clients;
    var pricesBox = $('gc-prices'), range = $('gc-clients'), nEl = $('gc-n'), mrrEl = $('gc-mrr'), arrEl = $('gc-arr'), pile = $('gc-coins');
    range.max = G.max; range.value = clients;
    pricesBox.innerHTML = G.prices.map(function (p) { return '<button type="button" class="gc-price" role="radio" aria-checked="' + (p === price) + '" data-p="' + p + '">R$' + p + '</button>'; }).join('');
    var shown = { m: 0, a: 0 }, raf = 0;
    var animateTo = function (m) {
      cancelAnimationFrame(raf);
      var fm = shown.m, t0 = performance.now();
      if (reduce) { shown.m = m; mrrEl.textContent = brl(m); arrEl.textContent = brl(m * 12); return; }
      (function f(now) { var t = Math.min(1, (now - t0) / 500), e = 1 - Math.pow(1 - t, 3), v = fm + (m - fm) * e; shown.m = v; mrrEl.textContent = brl(v); arrEl.textContent = brl(v * 12); if (t < 1) raf = requestAnimationFrame(f); })(t0);
    };
    var update = function (user) {
      var m = price * clients;
      nEl.textContent = clients.toLocaleString('pt-BR');
      range.value = Math.min(clients, G.max);
      range.style.setProperty('--fill', (Math.min(clients, G.max) / G.max * 100).toFixed(1) + '%');
      animateTo(m);
      var stack = m <= 0 ? 0 : Math.min(18, Math.max(1, Math.round(Math.log10(m + 1) * 3.6)));
      var cur = pile.children.length;
      for (var i = cur; i < stack; i++) { var c = document.createElement('i'); c.style.setProperty('--k', i); pile.appendChild(c); }
      for (var j = cur - 1; j >= stack; j--) pile.removeChild(pile.children[j]);
    };
    pricesBox.addEventListener('click', function (e) { var b = e.target.closest('.gc-price'); if (!b) return; price = +b.dataset.p; Array.prototype.forEach.call(pricesBox.children, function (x) { x.setAttribute('aria-checked', String(x === b)); }); update(true); buzz(8); });
    range.addEventListener('input', function () { clients = +range.value; update(true); });
    Array.prototype.forEach.call(calc.querySelectorAll('.gc-add'), function (b) {
      b.addEventListener('click', function () {
        clients += +b.dataset.add; update(true); buzz(6);
        if (!reduce) { var f = document.createElement('span'); f.className = 'gc-fly'; f.textContent = '+' + brl(price * +b.dataset.add) + '/mês'; b.appendChild(f); setTimeout(function () { f.remove(); }, 900); }
      });
    });
    update(false);
  }

  /* ---------- Caixa do prêmio (seção de entrega) ---------- */
  var priceCard = document.querySelector('.price-card'), plist = $('price-list'), sumEl = $('price-sum');
  if (priceCard && plist) {
    var items = Array.prototype.slice.call(plist.children);
    var vals = items.map(function (li) { var v = li.querySelector('.pl-val'); return v ? parseInt(v.textContent.replace(/\D/g, ''), 10) || 0 : 0; });
    var surprise = document.createElement('li');
    surprise.className = 'pl-surprise';
    surprise.innerHTML = '<span class="pl-lock" aria-hidden="true"></span><span><b>Carta surpresa</b> Tem coisa que só quem entra no jogo vê.</span>';
    plist.appendChild(surprise);
    var premio = document.createElement('div');
    premio.className = 'premio is-open';
    premio.innerHTML =
      '<div class="caixa" aria-hidden="true"><img class="caixa-img" src="../assets/images/presente.png" alt="" width="819" height="819"><span class="caixa-glow"></span></div>' +
      '<p class="premio-t"></p><p class="premio-s">Tudo o que você precisa para jogar de verdade.</p>';
    plist.parentNode.insertBefore(premio, plist);
    priceCard.classList.add('is-revealed');
    items.forEach(function (li, i) {
      li.classList.add('pop');
      var val = li.querySelector('.pl-val');
      if (val) val.classList.add('is-in');
    });
    surprise.classList.add('pop');
    if (sumEl) {
      var total = vals.reduce(function (a, n) { return a + n; }, 0);
      if (total) sumEl.textContent = brl(total);
    }
  }

  /* ---------- Resumo da partida ---------- */
  var closing = SHOW_CASAS && document.querySelector('.closing');
  if (closing) {
    var sum = document.createElement('section');
    sum.className = 'partida'; sum.setAttribute('aria-labelledby', 'partida-title');
    sum.innerHTML =
      '<div class="wrap partida-in">' +
        '<p class="kicker">Fim da primeira partida</p>' +
        '<h2 id="partida-title" class="section-title" data-tpl="{nome}, você jogou <em>até o fim.</em>"></h2>' +
        '<div class="partida-board" aria-hidden="true">' + casas.map(function (c, i) { return '<span class="pb-casa" data-i="' + i + '"><b>' + (i + 1) + '</b></span>'; }).join('<i class="pb-road"></i>') + '<span class="pb-flag">🏁</span></div>' +
        '<div class="partida-stats">' +
          '<div><b id="ps-coins">0</b><span>moedas</span></div>' +
          '<div><b id="ps-cards">0</b><span>cartas viradas</span></div>' +
          '<div><b id="ps-good">0</b><span>boas decisões</span></div>' +
          '<div><b id="ps-casas">0</b><span>casas visitadas</span></div>' +
        '</div>' +
        '<p class="partida-lead">Aqui, as moedas são de mentira. Lá fora, cada cliente paga de verdade, todo mês. A próxima partida é na vida real.</p>' +
        '<a class="btn btn-gold partida-btn" href="' + esc(C.cta || '#') + '">Quero jogar de verdade</a>' +
      '</div>';
    closing.parentNode.insertBefore(sum, closing);
    var fill = function () {
      $('ps-coins').textContent = S.coins; $('ps-cards').textContent = stats.cards + '/' + casas.length;
      $('ps-good').textContent = stats.good; $('ps-casas').textContent = stats.visited + '/' + casas.length;
      casas.forEach(function (c, i) { var p = sum.querySelector('.pb-casa[data-i="' + i + '"]'); if (p) p.classList.toggle('on', c.el.classList.contains('is-on')); });
    };
    if (hasIO) new IntersectionObserver(function (es) { if (es[0].isIntersecting) { fill(); sum.classList.add('is-in'); } }, { threshold: .25 }).observe(sum);
    else fill();
  }

  paint();
  ride();
})();
