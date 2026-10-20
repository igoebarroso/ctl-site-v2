/* CTL — jogo do crachá.
   1. Passar o crachá da empresa (funciona).  2. Criar um segundo crachá: projeto próprio ou ideia dentro da empresa.
   3. Passar o seu crachá: a porta de oportunidades abre. */
(function () {
  'use strict';
  var game = document.getElementById('game');
  if (!game) return;
  var $ = function (id) { return document.getElementById(id); };
  var C = window.CTL_CONTENT || {};

  var stage = $('stage'), lanyard = $('lanyard'), strap = $('strap'), stitch = $('stitch');
  var reader = $('reader'), screen = $('reader-screen'), sparks = $('sparks');
  var corpEl = $('badge-corp'), ownEl = $('badge-own');
  var stepEl = $('game-step'), titleEl = $('game-title'), textEl = $('game-text'), live = $('game-live');
  var action = $('game-action'), cta = $('game-cta'), resetBtn = $('game-reset');
  var nameField = $('name-field'), nameInput = $('name-input'), ownName = $('own-name'), ownInitial = $('own-initial'), ownBand = $('own-band'), ownRole = $('own-role');
  var choices = $('path-choices');
  var door = $('door'), roomItems = $('room-items'), roomCount = $('room-count'), roomHello = $('room-hello'), roomBurst = $('room-burst');
  var anchorEl = stage.querySelector('.stage-anchor');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var PATHS = {
    fora: { band: 'Meu projeto', role: 'Fundador(a)', cta: 'Quero construir o meu', granted: 'Um projeto seu pode abrir portas que o salário sozinho não abre.', done: 'Crie uma solução que ajuda pessoas de verdade. O CTL te leva do zero até a primeira versão no ar, em 7 dias.' },
    dentro: { band: 'Projeto interno', role: 'Líder do projeto', cta: 'Quero tirar minha ideia do papel', granted: 'Uma ideia nova pode abrir portas dentro da própria empresa.', done: 'Uma solução que facilita a vida de colegas e clientes. O CTL te ajuda a tirar do papel em 7 dias.' }
  };
  var DOOR = C.doorItems || {};
  var ICONS = {
    heart: '<path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z"/>',
    people: '<circle cx="9" cy="8.5" r="3"/><path d="M3.5 19c.6-3 2.8-4.8 5.5-4.8s4.9 1.8 5.5 4.8"/><circle cx="17" cy="9.5" r="2.4"/><path d="M15.8 14.4c2.4-.3 4.3 1.2 4.8 4.1"/>',
    coin: '<circle cx="12" cy="12" r="8.5"/><path d="M14.6 9.2c-.5-.8-1.5-1.2-2.6-1.2-1.5 0-2.6.8-2.6 1.9 0 2.6 5.3 1.4 5.3 4.1 0 1.1-1.2 2-2.7 2-1.2 0-2.2-.5-2.7-1.3M12 6.5V8m0 8v1.5"/>',
    home: '<path d="M4 11.2L12 5l8 6.2V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z"/>',
    launch: '<path d="M12 3c3 2.2 5 5.4 5 9.2L15.2 15H8.8L7 12.2C7 8.4 9 5.2 12 3z"/><circle cx="12" cy="10" r="1.7"/><path d="M10 18.5L9 21M14 18.5l1 2.5"/>',
    key: '<circle cx="8" cy="15.5" r="4"/><path d="M11 12.5L19.5 4M16 7.5l2.2 2.2M13.8 9.7l2 2"/>',
    shield: '<path d="M12 3l7 3v5.2c0 4.6-3 8-7 9.8-4-1.8-7-5.2-7-9.8V6z"/><path d="M9 12.2l2.1 2.1L15.2 10"/>',
    idea: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.1V16h5v-.1c0-.8.4-1.6 1.1-2.1A6 6 0 0 0 12 3z"/>',
    star: '<path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>',
    growth: '<path d="M4 17l6-6 4 4 6-7"/><path d="M15 8h5v5"/>',
    learn: '<path d="M3 9.5L12 5l9 4.5-9 4.5z"/><path d="M7 11.5v4c0 1.4 2.2 2.8 5 2.8s5-1.4 5-2.8v-4"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>'
  };
  function svg(name) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || ICONS.check) + '</svg>'; }

  var W = 0, H = 0, bw = 0, bh = 0, hole = 15, anchorFrac = .32;
  var anchor = { x: 0, y: -2 }, home = { x: 0, y: 0 }, park = { x: 0, y: 0 };
  var step = 0, busy = false, snap = null, timers = [], nudged = false, path = null, onscreen = true;

  function body(el) { return { el: el, x: 0, y: 0, vx: 0, vy: 0, a: 0, s: 1, mode: 'hidden', attached: false, draggable: false, tw: null }; }
  var corp = body(corpEl), own = body(ownEl), active = corp;

  function later(fn, ms) { var t = setTimeout(fn, reduce ? Math.min(ms, 120) : ms); timers.push(t); return t; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function buzz(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }
  function rel(el) {
    var s = stage.getBoundingClientRect(), r = el.getBoundingClientRect();
    return { left: r.left - s.left, top: r.top - s.top, width: r.width, height: r.height };
  }

  function measure() {
    var r = stage.getBoundingClientRect(), cs = getComputedStyle(stage);
    W = r.width; H = r.height;
    bw = parseFloat(cs.getPropertyValue('--bw')) || 132;
    bh = parseFloat(cs.getPropertyValue('--bh')) || 198;
    hole = parseFloat(cs.getPropertyValue('--hole')) || 15;
    lanyard.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    anchor.x = Math.round(W * anchorFrac);
    anchorEl.style.left = anchor.x + 'px';
    home.x = anchor.x; home.y = Math.round(H * .16);
    park.x = Math.round(W * .2); park.y = Math.round(H * .5);
    if (corpEl.classList.contains('is-parked') && corp.mode === 'still') { corp.x = park.x; corp.y = park.y; render(corp); }
  }

  /* ---------- desenho ---------- */
  function render(b) {
    if (b.mode === 'hidden') { b.el.hidden = true; return; }
    b.el.hidden = false;
    b.el.style.transform = 'translate3d(' + (b.x - bw / 2).toFixed(1) + 'px,' + (b.y - hole).toFixed(1) + 'px,0) rotate(' + b.a.toFixed(2) + 'deg) scale(' + b.s.toFixed(3) + ')';
    b.el.style.setProperty('--tilt', b.a.toFixed(1));
  }
  function drawLanyard(now) {
    var end = null;
    if (active.attached && active.mode !== 'hidden') end = { x: active.x, y: active.y };
    else if (snap) {
      var t = clamp((now - snap.t0) / 320, 0, 1), e = 1 - Math.pow(1 - t, 3);
      end = { x: lerp(snap.x, anchor.x, e), y: lerp(snap.y, anchor.y, e) };
      if (t >= 1) snap = null;
    }
    if (!end) { strap.setAttribute('d', ''); stitch.setAttribute('d', ''); return; }
    var dx = end.x - anchor.x, dy = end.y - anchor.y, dist = Math.hypot(dx, dy);
    var rest = (home.y - anchor.y) * 1.1, sag = Math.max(0, rest - dist) * .55 + 4;
    var d = 'M' + anchor.x + ' ' + anchor.y + ' Q' + (anchor.x + dx * .5).toFixed(1) + ' ' + (anchor.y + dy * .5 + sag).toFixed(1) + ' ' + end.x.toFixed(1) + ' ' + end.y.toFixed(1);
    strap.setAttribute('d', d); stitch.setAttribute('d', d);
  }

  /* ---------- física ---------- */
  function physics(b, dt, now) {
    if (b.mode === 'tween') {
      var tw = b.tw, t = clamp((now - tw.t0) / tw.dur, 0, 1), e = ease(t);
      b.x = lerp(tw.x0, tw.x1, e); b.y = lerp(tw.y0, tw.y1, e) - Math.sin(Math.PI * t) * (tw.arc || 0);
      b.a = lerp(tw.a0, tw.a1, e); b.s = lerp(tw.s0, tw.s1, e);
      if (t >= 1) { b.tw = null; b.mode = tw.next || 'still'; b.vx = b.vy = 0; if (tw.done) tw.done(); }
      return true;
    }
    if (b.mode === 'hang') {
      if (reduce || !onscreen) { b.x = home.x; b.y = home.y; b.a = 0; b.vx = b.vy = 0; return false; }
      var sway = Math.sin(now / 980) * 10, bob = Math.sin(now / 640) * 2.6;
      var tx = home.x + sway, ty = home.y + bob, k = .045, c = .12;
      b.vx += ((tx - b.x) * k - b.vx * c) * dt;
      b.vy += ((ty - b.y) * k * 1.3 - b.vy * c) * dt;
      b.x += b.vx * dt; b.y += b.vy * dt;
      var ta = -Math.atan2(b.x - anchor.x, Math.max(8, b.y - anchor.y)) * 57.3 - b.vx * 1.1;
      b.a += (ta - b.a) * clamp(.22 * dt, 0, 1);
      return true;
    }
    if (b.mode === 'drag') {
      var lean = b.attached ? -Math.atan2(b.x - anchor.x, Math.max(8, b.y - anchor.y)) * 57.3 * .5 : 0;
      var tg = clamp(-b.vx * 1.6, -28, 28) + lean;
      b.a += (tg - b.a) * clamp(.25 * dt, 0, 1);
      b.vx *= .86; b.vy *= .86;
      return true;
    }
    return false;
  }

  var raf = 0, last = 0;
  function kick() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } }
  function tick(now) {
    var dt = clamp((now - last) / 16.67, .2, 2.2); last = now;
    var moving = false;
    [corp, own].forEach(function (b) { if (b.mode !== 'hidden' && physics(b, dt, now)) moving = true; render(b); });
    drawLanyard(now);
    if (snap) moving = true;
    raf = moving ? requestAnimationFrame(tick) : 0;
  }
  function tweenTo(b, o) {
    b.tw = { t0: performance.now(), dur: reduce ? 1 : (o.dur || 400), x0: b.x, y0: b.y, a0: b.a, s0: b.s, x1: o.x, y1: o.y, a1: o.a == null ? b.a : o.a, s1: o.s == null ? b.s : o.s, arc: o.arc || 0, next: o.next, done: o.done };
    b.mode = 'tween'; kick();
  }

  /* ---------- arrastar ---------- */
  function overlaps(b, el, pad) {
    var a = b.el.getBoundingClientRect(), t = el.getBoundingClientRect(); pad = pad || 0;
    return a.right > t.left - pad && a.left < t.right + pad && a.bottom > t.top - pad && a.top < t.bottom + pad;
  }
  function pointFrom(e) { var r = stage.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  function enableDrag(b) {
    var grab = null, lastT = 0;
    b.el.addEventListener('pointerenter', function () {
      if (!b.draggable || busy || b.mode !== 'hang' || reduce) return;
      b.vx += 1.6; kick();
    });
    b.el.addEventListener('pointerdown', function (e) {
      if (!b.draggable || busy || b.mode === 'tween' || (e.button && e.button !== 0)) return;
      e.preventDefault();
      try { b.el.setPointerCapture(e.pointerId); } catch (err) {}
      var p = pointFrom(e);
      grab = { x: p.x - b.x, y: p.y - b.y }; lastT = performance.now();
      b.mode = 'drag'; b.vx = b.vy = 0; b.el.classList.add('is-dragging'); nudged = true; kick();
    });
    b.el.addEventListener('pointermove', function (e) {
      if (b.mode !== 'drag' || !grab) return;
      var p = pointFrom(e), now = performance.now(), dtm = Math.max(1, now - lastT);
      var nx = clamp(p.x - grab.x, bw * .3, W - bw * .3), ny = clamp(p.y - grab.y, 6, H - bh * .45);
      b.vx = (nx - b.x) / dtm * 16.67; b.vy = (ny - b.y) / dtm * 16.67;
      b.x = nx; b.y = ny; lastT = now;
      var near = (step === 0 || step === 3) && overlaps(b, reader, 18);
      reader.classList.toggle('is-hot', near);
      b.el.classList.toggle('is-near', near);
      kick();
    });
    function up() {
      if (b.mode !== 'drag') return;
      grab = null; b.el.classList.remove('is-dragging', 'is-near'); reader.classList.remove('is-hot');
      var onReader = overlaps(b, reader, 10);
      if (step === 0 && b === corp && onReader) swipe(corp, corpOk);
      else if (step === 3 && b === own && onReader) swipe(own, grant);
      else b.mode = 'hang';
      kick();
    }
    b.el.addEventListener('pointerup', up);
    b.el.addEventListener('pointercancel', up);
    b.el.addEventListener('lostpointercapture', up);
  }

  /* ---------- textos e leitor ---------- */
  function say(stepLabel, title, text) {
    stepEl.textContent = stepLabel; titleEl.textContent = title; textEl.textContent = text;
    live.textContent = title + ' ' + text;
  }
  function readerState(cls, label) {
    reader.classList.remove('is-reading', 'is-denied', 'is-granted', 'is-hot');
    if (cls) reader.classList.add(cls);
    screen.textContent = label;
  }
  function swipe(b, then) {
    busy = true; action.disabled = true;
    b.el.classList.add('is-scanning');
    var r = rel(reader);
    tweenTo(b, { x: r.left + r.width * .22, y: r.top + 22 + hole, a: -4, dur: 380, next: 'still', done: function () { readerState('is-reading', 'Lendo…'); later(function () { b.el.classList.remove('is-scanning'); then(); }, 700); } });
  }
  function currentName() {
    var v = (nameInput.value || '').trim().split(/\s+/)[0] || '';
    return v ? v.charAt(0).toLocaleUpperCase('pt-BR') + v.slice(1) : '';
  }
  function burst() {
    if (reduce) return;
    sparks.innerHTML = '';
    for (var i = 0; i < 18; i++) {
      var s = document.createElement('i'), ang = (i / 18) * Math.PI * 2 + Math.random() * .3, dist = 46 + Math.random() * 48;
      s.style.setProperty('--dx', (Math.cos(ang) * dist).toFixed(0) + 'px');
      s.style.setProperty('--dy', (Math.sin(ang) * dist).toFixed(0) + 'px');
      sparks.appendChild(s);
    }
    later(function () { sparks.innerHTML = ''; }, 900);
  }

  /* ---------- passo 1: o crachá da empresa funciona ---------- */
  function corpOk() {
    readerState('is-granted', 'Acesso liberado');
    stage.classList.add('is-granted'); buzz(30);
    step = 1; game.dataset.step = '1';
    say('Passo 1 de 3', 'Esse crachá abre a porta da empresa.', 'Ele paga as contas e merece respeito. Mas abre uma porta só.');
    corp.mode = 'hang'; corp.vx = -1.5; kick();
    later(function () {
      // O crachá da empresa não vai embora: vai para o canto, e o cordão fica livre para o segundo.
      snap = { t0: performance.now(), x: corp.x, y: corp.y };
      corp.attached = false; corp.draggable = false; corpEl.classList.add('is-parked');
      tweenTo(corp, { x: park.x, y: park.y, a: -9, s: .7, dur: 650, arc: 30, next: 'still' });
      readerState('', 'Aproxime'); stage.classList.remove('is-granted');
      later(choosePrompt, 500);
    }, 1900);
  }

  /* ---------- passo 2: criar o segundo crachá ---------- */
  function choosePrompt() {
    step = 2; game.dataset.step = '2';
    say('Passo 2 de 3', 'Agora, crie o seu segundo crachá.', 'Você continua com o primeiro. Escolha onde quer construir.');
    nameField.hidden = false; choices.hidden = false; action.hidden = true; busy = false;
  }
  function choosePath(p) {
    path = p;
    Array.prototype.forEach.call(choices.querySelectorAll('.path-btn'), function (b) { b.setAttribute('aria-pressed', String(b.dataset.path === p)); });
    ownBand.textContent = PATHS[p].band; ownRole.textContent = PATHS[p].role; cta.textContent = PATHS[p].cta;
    if (step === 2) startOwn();
    else if (own.mode === 'hang' && !reduce) { own.vx += 2; kick(); }
  }
  function startOwn() {
    step = 3; game.dataset.step = '3'; active = own;
    anchorFrac = W < 420 ? .44 : .5; measure();
    lanyard.classList.add('is-own');
    own.mode = 'hang'; own.attached = true; own.draggable = true;
    own.x = home.x + 30; own.y = -bh; own.vx = 0; own.vy = 0; own.a = 0; own.s = 1;
    kick();
    say('Passo 3 de 3', 'Passe o seu crachá.', 'Arraste o seu crachá até o leitor. Dá para trocar o nome e o caminho antes.');
    action.textContent = 'Passar meu crachá'; action.hidden = false; action.disabled = false; busy = false;
  }

  /* ---------- passo 3: acesso liberado e porta de oportunidades ---------- */
  function grant() {
    readerState('is-granted', 'Acesso liberado');
    stage.classList.add('is-granted');
    burst(); buzz(40);
    step = 4; game.dataset.step = '4';
    var n = currentName();
    say('Acesso liberado', 'Esse quem decide é você' + (n ? ', ' + n : '') + '.', PATHS[path].granted);
    own.mode = 'hang'; own.vx = -3; kick();
    nameField.hidden = true; choices.hidden = true; action.hidden = true;
    cta.hidden = false; resetBtn.hidden = false; busy = false;
    later(openDoor, 1100);
  }
  var got = 0, items = [];
  function buildRoom() {
    roomItems.innerHTML = ''; got = 0;
    items = (DOOR[path] && DOOR[path].length) ? DOOR[path] : (Array.isArray(DOOR) && DOOR.length ? DOOR : [{ icon: 'key', label: 'Liberdade para escolher' }]);
    items.forEach(function (it, i) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'opp'; b.style.setProperty('--i', i); b.setAttribute('aria-pressed', 'false');
      b.innerHTML = '<span class="opp-in"><span class="opp-icon">' + svg(it.icon) + '</span><span class="opp-check">' + svg('check') + '</span></span>';
      var label = document.createElement('span'); label.textContent = it.label; b.firstChild.appendChild(label);
      b.addEventListener('click', function () { collect(b, it); });
      roomItems.appendChild(b);
    });
    roomCount.textContent = 'Toque para pegar: 0 de ' + items.length;
  }
  function openDoor() {
    var n = currentName();
    buildRoom();
    roomHello.textContent = n ? 'Bem-vindo, ' + n + '.' : 'Bem-vindo ao seu projeto.';
    door.hidden = false;
    requestAnimationFrame(function () { door.classList.add('is-closed'); });
    buzz(25);
    later(function () {
      door.classList.add('is-open');
      say('A porta abriu', 'Do outro lado, alguém precisa do que você vai criar.', 'Toda solução começa ajudando uma pessoa. Toque em cada oportunidade para pegar.');
    }, 900);
  }
  function collect(b, it) {
    if (b.getAttribute('aria-pressed') === 'true') return;
    b.setAttribute('aria-pressed', 'true'); got++; buzz(15);
    roomCount.textContent = got < items.length ? 'Você pegou ' + got + ' de ' + items.length : 'Você pegou todas.';
    live.textContent = it.label + '. ' + roomCount.textContent;
    if (got === items.length) {
      roomHello.textContent = 'Tudo isso começa resolvendo o problema de alguém.';
      roomBurstGo();
      cta.classList.add('is-ready');
      var n = currentName();
      say('Tudo pronto', 'Agora é com você' + (n ? ', ' + n : '') + '.', PATHS[path].done);
    }
  }
  function roomBurstGo() {
    if (reduce) return;
    roomBurst.innerHTML = '';
    for (var i = 0; i < 26; i++) {
      var s = document.createElement('i'), ang = Math.random() * Math.PI * 2, dist = 70 + Math.random() * 120;
      s.style.setProperty('--dx', (Math.cos(ang) * dist).toFixed(0) + 'px');
      s.style.setProperty('--dy', (Math.sin(ang) * dist).toFixed(0) + 'px');
      s.style.setProperty('--r', (Math.random() * 360).toFixed(0) + 'deg');
      roomBurst.appendChild(s);
    }
    later(function () { roomBurst.innerHTML = ''; }, 1300);
  }

  /* ---------- recomeçar ---------- */
  function reset() {
    timers.forEach(clearTimeout); timers = [];
    busy = false; snap = null; step = 0; path = null; game.dataset.step = '0'; active = corp;
    anchorFrac = .32; measure();
    readerState('', 'Aproxime');
    stage.classList.remove('is-denied', 'is-granted');
    lanyard.classList.remove('is-own');
    corpEl.classList.remove('is-parked', 'is-scanning', 'is-near');
    ownEl.classList.remove('is-scanning', 'is-near');
    own.mode = 'hidden'; own.attached = false; own.draggable = false; render(own);
    corp.mode = 'hang'; corp.attached = true; corp.draggable = true;
    corp.x = home.x + 24; corp.y = -bh; corp.vx = corp.vy = 0; corp.a = 0; corp.s = 1;
    Array.prototype.forEach.call(choices.querySelectorAll('.path-btn'), function (b) { b.setAttribute('aria-pressed', 'false'); });
    ownBand.textContent = PATHS.fora.band; ownRole.textContent = PATHS.fora.role; cta.textContent = PATHS.fora.cta;
    say('O problema', 'Hoje só esta porta abre.', 'Um exemplo, não a única história. Arraste o crachá.');
    action.textContent = 'Passar o crachá'; action.hidden = false; action.disabled = false;
    cta.hidden = true; cta.classList.remove('is-ready'); resetBtn.hidden = true; nameField.hidden = true; choices.hidden = true;
    door.classList.remove('is-closed', 'is-open'); door.hidden = true; roomItems.innerHTML = '';
    kick();
  }

  /* ---------- eventos ---------- */
  action.addEventListener('click', function () {
    if (busy) return; nudged = true;
    if (step === 0) swipe(corp, corpOk);
    else if (step === 3) swipe(own, grant);
  });
  Array.prototype.forEach.call(choices.querySelectorAll('.path-btn'), function (b) {
    b.addEventListener('click', function () { choosePath(b.dataset.path); });
  });
  resetBtn.addEventListener('click', function () { reset(); action.focus(); });
  nameInput.addEventListener('input', function () {
    var n = currentName();
    ownName.textContent = n || 'Seu nome';
    ownInitial.textContent = n ? n.charAt(0) : '?';
    if (own.mode === 'hang' && !reduce) { own.vx += 1.2; kick(); }
  });
  nameInput.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); if (step === 3) action.click(); } });

  enableDrag(corp); enableDrag(own);
  reader.addEventListener('click', function () {
    if (busy) return;
    if (step === 0) swipe(corp, corpOk);
    else if (step === 3) swipe(own, grant);
  });
  stage.addEventListener('pointermove', function (e) {
    var r = stage.getBoundingClientRect();
    stage.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
    stage.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { onscreen = es[0].isIntersecting; if (onscreen) kick(); }, { threshold: 0.08 }).observe(stage);
  }
  window.addEventListener('resize', function () { measure(); kick(); });

  /* ---------- início ---------- */
  measure();
  corp.mode = 'hang'; corp.attached = true; corp.draggable = true;
  corp.x = home.x + (reduce ? 0 : 46); corp.y = home.y; corp.a = reduce ? 0 : -8;
  render(corp); kick();
  later(function () { if (!nudged && step === 0 && !reduce) { corp.vx += 5; kick(); } }, 2600);
})();
