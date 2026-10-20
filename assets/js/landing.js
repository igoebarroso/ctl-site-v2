/* CTL — interações da landing (números, checklist, 7 dias, galeria, listas). */
(function () {
  'use strict';
  var C = window.CTL_CONTENT || {};
  var $ = function (id) { return document.getElementById(id); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  var ICON = {
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    no: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5L12 12l8.5-4.5M12 12v9"/></svg>'
  };

  /* Botões de compra */
  document.querySelectorAll('[data-cta]').forEach(function (a) { a.href = C.cta || '#'; });

  /* Números com contador */
  var stats = $('stats');
  if (stats && C.stats) {
    C.stats.forEach(function (s) {
      var box = el('div', 'stat');
      var n = el('p', 'stat-n'); n.innerHTML = '<span>' + (reduce ? s.n : 0) + '</span><small>' + s.unit + '</small>'; n.dataset.to = s.n;
      var p = el('p', null, s.body);
      var a = el('a', null, 'Fonte: ' + s.source); a.href = s.url; a.target = '_blank'; a.rel = 'noopener';
      box.append(n, p, a); stats.appendChild(box);
    });
    if (!reduce && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return; io.disconnect();
          var nodes = stats.querySelectorAll('.stat-n'), t0 = performance.now();
          (function frame(now) {
            var t = Math.min(1, (now - t0) / 1100), e = 1 - Math.pow(1 - t, 3);
            nodes.forEach(function (node) { node.firstChild.textContent = Math.round(node.dataset.to * e); });
            if (t < 1) requestAnimationFrame(frame);
          })(t0);
        });
      }, { threshold: .4 });
      io.observe(stats);
    } else stats.querySelectorAll('.stat-n').forEach(function (n) { n.firstChild.textContent = n.dataset.to; });
    /* Carrossel automático no celular */
    var dotsBox = $('stats-dots'), cards = stats.querySelectorAll('.stat'), sIdx = 0, sTimer = 0, sPaused = false, sVisible = false;
    var mq = window.matchMedia('(max-width:819px)');
    var dots = Array.prototype.map.call(cards, function (c, i) {
      var d = el('button', 'stats-dot'); d.type = 'button'; d.setAttribute('role', 'tab'); d.setAttribute('aria-label', 'Dado ' + (i + 1));
      d.addEventListener('click', function () { goStat(i, true); restart(); }); dotsBox.appendChild(d); return d;
    });
    var mark = function (i) { sIdx = i; dots.forEach(function (d, k) { d.setAttribute('aria-selected', String(k === i)); d.classList.toggle('on', k === i); }); };
    var goStat = function (i, smooth) { if (!mq.matches) return; stats.scrollTo({ left: cards[i].offsetLeft - cards[0].offsetLeft, behavior: (smooth && !reduce) ? 'smooth' : 'auto' }); mark(i); };
    var restart = function () {
      clearInterval(sTimer);
      if (reduce || !mq.matches || sPaused || !sVisible) return;
      sTimer = setInterval(function () { goStat((sIdx + 1) % cards.length, true); }, 3800);
    };
    mark(0);
    var sScroll = 0;
    stats.addEventListener('scroll', function () {
      clearTimeout(sScroll);
      sScroll = setTimeout(function () { var w = cards[0].offsetWidth || 1; mark(Math.max(0, Math.min(cards.length - 1, Math.round(stats.scrollLeft / w)))); }, 80);
    }, { passive: true });
    stats.addEventListener('pointerdown', function () { sPaused = true; clearInterval(sTimer); });
    stats.addEventListener('pointerup', function () { setTimeout(function () { sPaused = false; restart(); }, 4000); });
    stats.addEventListener('focusin', function () { sPaused = true; clearInterval(sTimer); });
    stats.addEventListener('focusout', function () { sPaused = false; restart(); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { sVisible = e[0].isIntersecting; restart(); }, { threshold: .5 }).observe(stats);
    (mq.addEventListener ? mq.addEventListener('change', restart) : mq.addListener(restart));
  }

  /* Você se reconhece? */
  var list = $('check-list'), meter = $('check-meter'), ctext = $('check-text');
  if (list && C.checklist) {
    var total = C.checklist.length;
    meter.innerHTML = Array(total + 1).join('<i></i>');
    C.checklist.forEach(function (txt) {
      var b = el('button', 'check-item'); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
      b.innerHTML = '<span class="check-box"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>';
      b.appendChild(el('span', null, txt));
      b.addEventListener('click', function () { b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true')); updateCheck(); });
      list.appendChild(b);
    });
    var updateCheck = function () {
      var on = list.querySelectorAll('[aria-pressed="true"]').length;
      meter.querySelectorAll('i').forEach(function (i, n) { i.classList.toggle('on', n < on); });
      if (!on) ctext.textContent = 'Nenhuma marcada ainda.';
      else if (on < 3) ctext.textContent = 'Você marcou ' + on + ' de ' + total + '. Já é motivo para ter um plano B.';
      else ctext.innerHTML = 'Você marcou ' + on + ' de ' + total + '. O CTL foi feito para isso. <a class="link" href="#como-funciona">Ver os 7 dias</a>';
    };
  }

  /* Trilha do que a gente entrega: cada passo tem uma cena desenhada que a pessoa "faz" com um botão */
  var nodes = $('track-nodes'), fill = $('track-fill'), prog = $('day-progress');
  if (nodes && C.days) {
    var days = C.days, done = new Set(), current = 0, runTimers = [];
    var jLabel = $('j-label'), jTitle = $('j-title'), jBody = $('j-body'), jOut = $('j-out'), jUrl = $('j-url'), jScene = $('j-scene'), jRun = $('j-run'), jDone = $('j-done'), jNext = $('j-next'), jPrev = $('j-prev');
    var SV = function (p) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>'; };
    var SCENES = {
      access: function () {
        var side = ''; for (var i = 1; i <= 7; i++) side += '<span class="' + (i === 1 ? 'on' : '') + '">Dia ' + i + '</span>';
        return '<div class="sc sc-access">' +
          '<div class="sc-login"><b class="sc-logo">ctl<svg class="logo-mark" viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M7.2 0h1.6l.4 6.05 4.35-4.1 1.15 1.15-4.1 4.35L16 7.2v1.6l-6.05.4 4.1 4.35-1.15 1.15-4.35-4.1L8.8 16H7.2l-.4-6.05-4.35 4.1-1.15-1.15 4.1-4.35L0 8.8V7.2l6.05-.4-4.1-4.35L3.1 1.3l4.35 4.1z"/></svg></b><span class="sc-field">seu e-mail</span><span class="sc-field">senha</span><span class="sc-btn">Entrar</span></div>' +
          '<div class="sc-dash"><aside class="sc-side">' + side + '</aside><div class="sc-main"><p class="sc-hello">Seu desafio começa aqui</p><span class="sc-bar"><i></i></span>' +
          '<div class="sc-lesson"><span class="sc-ico">' + SV('<path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/>') + '</span><span><b>Aula do dia 1</b><small>Como escolher a sua ideia</small></span></div>' +
          '<div class="sc-lesson"><span class="sc-ico">' + SV('<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5M10 13h6M10 17h6"/>') + '</span><span><b>Material</b><small>Roteiro de ideias</small></span></div>' +
          '<div class="sc-lesson"><span class="sc-ico">' + SV('<path d="M12 3v3M12 18v3M4.6 6.6l2.1 2.1M17.3 15.3l2.1 2.1M3 12h3M18 12h3M4.6 17.4l2.1-2.1M17.3 8.7l2.1-2.1"/>') + '</span><span><b>Ferramentas de IA</b><small>Prontas para usar</small></span></div>' +
          '</div></div></div>';
      },
      idea: function () {
        var notes = [['Sei cozinhar bem', -96, -70, -6], ['Amigos pedem receitas', 70, -78, 5], ['Trabalho o dia todo', -110, 4, 4], ['Vizinhos sem tempo', 96, 0, -5], ['Gosto de organizar', -70, 74, 6], ['Faço marmita no domingo', 76, 72, -4]];
        return '<div class="sc sc-idea">' + notes.map(function (n, i) { return '<span class="note" style="--x:' + n[1] + 'px;--y:' + n[2] + 'px;--r:' + n[3] + 'deg;--i:' + i + '">' + n[0] + '</span>'; }).join('') +
          '<span class="sc-ai">' + SV('<path d="M12 3l1.8 4.6L18.5 9l-4.7 1.6L12 15l-1.8-4.4L5.5 9l4.7-1.4z"/><path d="M18 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>') + 'IA</span>' +
          '<div class="sc-ideacard"><small>Ideia escolhida</small><b>Solução de cardápio semanal para famílias sem tempo</b><span class="tag">Para quem: famílias que trabalham fora</span><span class="tag">Problema: falta tempo para cozinhar</span></div></div>';
      },
      offer: function () {
        return '<div class="sc sc-offer"><p class="sc-doc-title">Minha oferta</p><p class="sc-typed" data-text="Uma solução que monta o cardápio da semana e a lista de compras para famílias sem tempo. Assinatura mensal."><span class="txt"></span><span class="caret"></span></p>' +
          '<div class="sc-checks"><span>Para quem</span><span>O que resolve</span><span>Por que vale</span></div></div>';
      },
      build: function () {
        return '<div class="sc sc-build"><div class="sc-prompt"><small>Você escreve para a IA</small><p class="sc-typed" data-text="Crie uma solução que monta o cardápio da semana e a lista de compras para famílias sem tempo."><span class="txt"></span><span class="caret"></span></p></div>' +
          '<div class="sc-site"><span class="b b-nav"><i></i><i></i></span><span class="b b-h1">Cardápio da semana</span><span class="b b-sub">Comida boa, sem perder o domingo</span><span class="b b-img"></span><span class="b b-li">7 jantares planejados</span><span class="b b-li">Lista de compras automática</span><span class="b b-cta">Assinar por R$15/mês</span></div>' +
          '<span class="sc-badge">Sem código</span></div>';
      },
      show: function () {
        var ppl = [['A', 'Gostei da ideia!'], ['M', 'Quanto custa?'], ['J', 'Não entendi o preço.'], ['R', 'Eu usaria toda semana.'], ['L', 'Me manda o link?']];
        return '<div class="sc sc-show"><div class="sc-out">Oi! Criei isso para famílias sem tempo. O que você acha?<span class="sc-link">seuprojeto.com.br</span></div><ul class="sc-people">' +
          ppl.map(function (p, i) { return '<li style="--i:' + i + '"><span class="av">' + p[0] + '</span><span class="rp">' + p[1] + '</span></li>'; }).join('') + '</ul></div>';
      },
      improve: function () {
        var rows = [['Explicar melhor o preço', 'Ajustar', 'adj'], ['Página muito longa', 'Cortar', 'cut'], ['Cardápio de 7 dias', 'Manter', 'keep'], ['Lista de compras', 'Manter', 'keep'], ['Opção vegetariana', 'Adicionar', 'add']];
        return '<div class="sc sc-improve"><p class="sc-doc-title">O que ouvimos</p><ul>' + rows.map(function (r, i) { return '<li class="r-' + r[2] + '" style="--i:' + i + '"><span class="it">' + r[0] + '</span><span class="tg">' + r[1] + '</span></li>'; }).join('') + '</ul></div>';
      },
      distribute: function () {
        var ch = [['Redes sociais', -96, -84], ['Mensagens', 96, -84], ['Grupos', -104, 62], ['Indicação', 104, 62], ['Anúncio (opcional)', 0, 112]];
        return '<div class="sc sc-dist">' +
          ch.map(function (c, i) { return '<span class="ping" style="--x:' + c[1] + 'px;--y:' + c[2] + 'px;--i:' + i + '"></span>'; }).join('') +
          ch.map(function (c, i) { return '<span class="chan" style="--x:' + c[1] + 'px;--y:' + c[2] + 'px;--i:' + i + '">' + c[0] + '</span>'; }).join('') +
          '<div class="sc-prod"><span class="dot"></span><b>Seu produto</b><small>no ar</small></div>' +
          '<p class="sc-plan">Plano da semana: 3 canais, 20 conversas</p></div>';
      },
      launch: function () {
        return '<div class="sc sc-launch"><div class="sc-mini"><span class="b b-h1">Cardápio da semana</span><span class="b b-sub">Comida boa, sem perder o domingo</span><span class="b b-img"></span><span class="b b-cta">Assinar por R$15/mês</span></div>' +
          '<div class="sc-status"><span class="st st-draft">Rascunho</span><span class="st st-live"><i></i>No ar</span></div><span class="sc-publish">Publicar</span><span class="sc-confetti"></span></div>';
      }
    };

    var clearRun = function () { runTimers.forEach(clearTimeout); runTimers = []; };
    var later2 = function (fn, ms) { runTimers.push(setTimeout(fn, reduce ? 0 : ms)); };
    var typeIn = function (p, cb) {
      var txt = p.dataset.text, out = p.querySelector('.txt'), i = 0;
      if (reduce) { out.textContent = txt; p.classList.add('is-typed'); if (cb) cb(); return; }
      (function step() { out.textContent = txt.slice(0, ++i); if (i < txt.length) runTimers.push(setTimeout(step, 22)); else { p.classList.add('is-typed'); if (cb) cb(); } })();
    };
    var runScene = function (d, sc, cb) {
      sc.classList.add('is-run');
      if (d.scene === 'offer') { typeIn(sc.querySelector('.sc-typed'), function () { sc.classList.add('is-checked'); later2(cb, 900); }); return; }
      if (d.scene === 'build') { typeIn(sc.querySelector('.sc-typed'), function () { sc.classList.add('is-built'); later2(cb, 1600); }); return; }
      if (d.scene === 'launch') { later2(function () { sc.classList.add('is-live'); burstIn(sc.querySelector('.sc-confetti')); later2(cb, 700); }, 650); return; }
      if (d.scene === 'distribute') { later2(function () { sc.classList.add('is-done'); later2(cb, 700); }, 1900); return; }
      later2(cb, d.scene === 'show' ? 2100 : d.scene === 'improve' ? 1700 : d.scene === 'idea' ? 1700 : 1300);
    };
    var burstIn = function (box) {
      if (reduce || !box) return; box.innerHTML = '';
      for (var i = 0; i < 22; i++) { var c = document.createElement('i'), a = Math.random() * Math.PI * 2, r = 60 + Math.random() * 90; c.style.setProperty('--dx', (Math.cos(a) * r).toFixed(0) + 'px'); c.style.setProperty('--dy', (Math.sin(a) * r).toFixed(0) + 'px'); c.style.setProperty('--r', (Math.random() * 360).toFixed(0) + 'deg'); box.appendChild(c); }
    };

    days.forEach(function (d, i) {
      var li = el('li');
      var b = el('button', 'node'); b.type = 'button'; b.setAttribute('role', 'tab'); b.id = 'node-' + i; b.setAttribute('aria-controls', 'journey');
      b.setAttribute('aria-label', 'Passo ' + (i + 1) + ': ' + d.phase);
      b.innerHTML = '<span class="node-dot">' + (i + 1) + '</span>';
      b.appendChild(el('span', 'node-label', d.phase));
      b.addEventListener('click', function () { show(i, true); });
      b.addEventListener('keydown', function (e) {
        var k = e.key, to = null;
        if (k === 'ArrowRight') to = (i + 1) % days.length; else if (k === 'ArrowLeft') to = (i - 1 + days.length) % days.length; else if (k === 'Home') to = 0; else if (k === 'End') to = days.length - 1;
        if (to != null) { e.preventDefault(); show(to, true); nodes.querySelectorAll('.node')[to].focus(); }
      });
      li.appendChild(b); nodes.appendChild(li);
    });

    var updateTrack = function () {
      nodes.querySelectorAll('.node').forEach(function (b, n) {
        var sel = n === current; b.setAttribute('aria-selected', String(sel)); b.tabIndex = sel ? 0 : -1; b.classList.toggle('is-seen', done.has(n) && !sel);
      });
      fill.style.width = (current / (days.length - 1) * 100) + '%';
      prog.textContent = done.size === days.length ? 'Você fez o caminho inteiro. Depois dos 7 dias, os ciclos continuam na plataforma.' : 'Você fez ' + done.size + ' de ' + days.length + ' passos';
    };
    var show = function (i, user) {
      clearRun(); current = i; var d = days[i];
      jLabel.textContent = 'Passo ' + (i + 1) + ' · ' + d.day; jTitle.textContent = d.title; jBody.textContent = d.body; jOut.textContent = d.out; jUrl.textContent = d.url;
      jScene.innerHTML = SCENES[d.scene] ? SCENES[d.scene]() : '';
      jRun.hidden = true; jDone.textContent = '';
      jPrev.disabled = i === 0;
      jNext.hidden = i === days.length - 1;
      jNext.textContent = 'Próximo passo';
      jNext.classList.add('is-ready');
      var sc = jScene.querySelector('.sc');
      if (sc) runScene(d, sc, function () {});
      $('journey').setAttribute('aria-labelledby', 'node-' + i);
      if (user && !reduce) { var jj = $('journey'); jj.classList.remove('is-in'); void jj.offsetWidth; jj.classList.add('is-in'); }
      updateTrack();
    };
    jRun.addEventListener('click', function () {
      var d = days[current], sc = jScene.querySelector('.sc'); if (!sc) return;
      jRun.disabled = true; jRun.textContent = 'Fazendo…';
      runScene(d, sc, function () {
        done.add(current); jRun.hidden = true; jDone.textContent = d.done; jNext.classList.add('is-ready'); updateTrack();
      });
    });
    jNext.addEventListener('click', function () {
      if (current < days.length - 1) show(current + 1, true);
    });
    jPrev.addEventListener('click', function () { if (current > 0) show(current - 1, true); });
    show(0, false);
  }

  /* Caminho sem prazo: arrastar, tocar nas etapas, teclado ou "Ver o caminho" */
  var HZ = C.horizon || {}, tlKnob = $('tl-knob');
  if (tlKnob && HZ.stops) {
    var MAX = 100, stops = HZ.stops, ms = HZ.milestones || [];
    var tlTrack = $('tl-track'), tlFill = $('tl-fill'), tlMonth = $('tl-month'), tlTicks = $('tl-ticks'), tlPlay = $('tl-play');
    var hPanel = $('horizon-panel'), vizOwn = $('viz-own'), msList = $('milestones'), msCount = $('milestones-count');
    var MI = {
      launch: '<path d="M12 3c3 2.2 5 5.4 5 9.2L15.2 15H8.8L7 12.2C7 8.4 9 5.2 12 3z"/><circle cx="12" cy="10" r="1.7"/><path d="M10 18.5L9 21M14 18.5l1 2.5"/>',
      chat: '<path d="M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-8l-4 3.5V16H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/>',
      coin: '<circle cx="12" cy="12" r="8.5"/><path d="M14.6 9.2c-.5-.8-1.5-1.2-2.6-1.2-1.5 0-2.6.8-2.6 1.9 0 2.6 5.3 1.4 5.3 4.1 0 1.1-1.2 2-2.7 2-1.2 0-2.2-.5-2.7-1.3M12 6.5V8m0 8v1.5"/>',
      home: '<path d="M4 11.2L12 5l8 6.2V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z"/>',
      key: '<circle cx="8" cy="15.5" r="4"/><path d="M11 12.5L19.5 4M16 7.5l2.2 2.2M13.8 9.7l2 2"/>',
      lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>'
    };
    var ic = function (n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (MI[n] || MI.key) + '</svg>'; };

    stops.forEach(function (st, i) {
      var b = el('button', 'tl-tick'); b.type = 'button'; b.style.left = st.at + '%';
      if (i === 0) b.classList.add('is-first'); if (i === stops.length - 1) b.classList.add('is-last');
      b.innerHTML = '<span class="tl-dot" aria-hidden="true"></span>'; b.appendChild(el('span', null, st.label));
      b.addEventListener('click', function () { stopPlay(); animateTo(st.at); });
      tlTicks.appendChild(b);
    });
    ms.forEach(function (m) {
      var li = el('li', 'ms'); li.innerHTML = '<span class="ms-icon">' + ic('lock') + '</span>';
      li.appendChild(el('span', 'ms-label', m.label));
      li._icon = m.icon; msList.appendChild(li);
    });

    var pos = 0, stageAt = -1;
    var ownAt = function (p) {
      for (var i = 1; i < stops.length; i++) {
        if (p <= stops[i].at) { var a = stops[i - 1], b = stops[i], t = (p - a.at) / (b.at - a.at); return a.own + (b.own - a.own) * t; }
      }
      return stops[stops.length - 1].own;
    };
    var draw = function (p, user) {
      pos = Math.max(0, Math.min(MAX, p));
      tlKnob.style.left = pos + '%'; tlFill.style.width = pos + '%';
      var si = 0; stops.forEach(function (st, i) { if (pos >= st.at - .01) si = i; });
      tlMonth.textContent = stops[si].label;
      tlKnob.setAttribute('aria-valuenow', String(Math.round(pos))); tlKnob.setAttribute('aria-valuetext', stops[si].label);
      Array.prototype.forEach.call(tlTicks.children, function (b, i) { b.classList.toggle('is-past', stops[i].at <= pos + .01); b.classList.toggle('is-current', i === si); });
      if (si !== stageAt) {
        stageAt = si; hPanel.innerHTML = '';
        hPanel.append(el('h3', null, stops[si].title), el('p', null, stops[si].body));
        if (user && !reduce) { hPanel.classList.remove('is-in'); void hPanel.offsetWidth; hPanel.classList.add('is-in'); }
      }
      var o = ownAt(pos); vizOwn.style.width = Math.round(o * 100) + '%'; vizOwn.classList.toggle('has', o > .04);
      var got = 0;
      Array.prototype.forEach.call(msList.children, function (li, i) {
        var on = pos >= ms[i].at - .01; if (on) got++;
        if (on !== li.classList.contains('is-on')) {
          li.classList.toggle('is-on', on);
          li.querySelector('.ms-icon').innerHTML = ic(on ? li._icon : 'lock');
          if (on && user && !reduce) { li.classList.remove('pop'); void li.offsetWidth; li.classList.add('pop'); }
        }
      });
      msCount.textContent = got + ' de ' + ms.length;
    };

    var anim = 0, playing = false;
    var animateTo = function (target, dur, done) {
      cancelAnimationFrame(anim);
      var from = pos, t0 = performance.now(); dur = reduce ? 1 : (dur || Math.max(260, Math.abs(target - from) * 9));
      (function f(now) {
        var t = Math.min(1, (now - t0) / dur), e = playing ? t : 1 - Math.pow(1 - t, 3);
        draw(from + (target - from) * e, true);
        if (t < 1) anim = requestAnimationFrame(f); else if (done) done();
      })(t0);
    };
    var setPlayUI = function (on) { playing = on; tlPlay.classList.toggle('is-playing', on); tlPlay.querySelector('span').textContent = on ? 'Pausar' : 'Ver'; tlPlay.querySelector('svg').innerHTML = on ? '<path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/>' : '<path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/>'; };
    var stopPlay = function () { if (playing) { cancelAnimationFrame(anim); setPlayUI(false); } };
    tlPlay.addEventListener('click', function () {
      if (playing) { stopPlay(); return; }
      if (pos >= MAX - .1) draw(0, true);
      setPlayUI(true);
      animateTo(MAX, (MAX - pos) * 45, function () { setPlayUI(false); });
    });

    /* Arrastar */
    var dragging = false;
    var fromX = function (x) { var r = tlTrack.getBoundingClientRect(); return (x - r.left) / r.width * MAX; };
    tlTrack.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      stopPlay(); cancelAnimationFrame(anim); dragging = true; tlTrack.classList.add('is-dragging');
      try { tlTrack.setPointerCapture(e.pointerId); } catch (err) {}
      draw(fromX(e.clientX), true); e.preventDefault(); tlKnob.focus({ preventScroll: true });
    });
    tlTrack.addEventListener('pointermove', function (e) { if (dragging) draw(fromX(e.clientX), true); });
    var endDrag = function () { if (!dragging) return; dragging = false; tlTrack.classList.remove('is-dragging'); };
    tlTrack.addEventListener('pointerup', endDrag); tlTrack.addEventListener('pointercancel', endDrag);

    /* Teclado: setas andam um pouco, Page Up/Down pulam de etapa */
    tlKnob.addEventListener('keydown', function (e) {
      var k = e.key, to = null, next = null, prev = null;
      stops.forEach(function (st) { if (st.at > pos + .5 && next == null) next = st.at; if (st.at < pos - .5) prev = st.at; });
      if (k === 'ArrowRight' || k === 'ArrowUp') to = pos + 5; else if (k === 'ArrowLeft' || k === 'ArrowDown') to = pos - 5;
      else if (k === 'PageUp') to = next == null ? MAX : next; else if (k === 'PageDown') to = prev == null ? 0 : prev;
      else if (k === 'Home') to = 0; else if (k === 'End') to = MAX;
      if (to != null) { e.preventDefault(); stopPlay(); animateTo(Math.max(0, Math.min(MAX, to)), 180); }
    });
    draw(0, false);
  }

  /* Listas */
  function fillList(id, items, icon) {
    var ul = $(id); if (!ul || !items) return;
    items.forEach(function (t) { var li = el('li'); li.innerHTML = icon; li.appendChild(el('span', null, t)); ul.appendChild(li); });
  }
  fillList('fit-yes', C.audienceIn, ICON.check);
  fillList('fit-no', C.audienceOut, ICON.no);
  var plist = $('price-list');
  if (plist && C.includes) {
    var sum = 0;
    C.includes.forEach(function (it) {
      var label = typeof it === 'string' ? it : it.label, val = typeof it === 'string' ? null : it.value;
      var li = el('li'); if (it.pitch) li.className = 'pl-pitch';
      li.innerHTML = ICON.check; li.appendChild(el('span', 'pl-label', label));
      if (val != null) { sum += val; li.appendChild(el('span', 'pl-val', 'R$' + val)); }
      plist.appendChild(li);
    });
    if (sum && $('price-sum')) $('price-sum').textContent = 'R$' + sum.toLocaleString('pt-BR');
  }

  /* Depoimentos reais (opcional) */
  var tests = (C.testimonials || []).filter(function (t) { return t && t.quote && t.name; });
  if (tests.length) {
    var grid = $('testimonials-grid');
    tests.forEach(function (t) {
      var card = el('article', 'testimonial'), q = el('blockquote', null, t.quote), f = el('footer'), who = el('span', 't-who');
      f.appendChild(el('span', 't-av', t.name.trim().charAt(0)));
      who.appendChild(el('strong', null, t.name));
      if (t.context) who.appendChild(el('span', null, t.context));
      f.appendChild(who);
      card.append(q, f); grid.appendChild(card);
    });
    $('depoimentos').hidden = false;
  }

  /* Galeria */
  var gal = $('gallery'), prev = $('gallery-prev'), nxt = $('gallery-next'), count = $('gallery-count');
  if (gal) {
    var shots = Array.prototype.slice.call(gal.querySelectorAll('.shot'));
    var idx = function () {
      var best = 0, dist = Infinity;
      shots.forEach(function (s, i) { var d = Math.abs(s.offsetLeft - gal.offsetLeft - gal.scrollLeft); if (d < dist) { dist = d; best = i; } });
      return best;
    };
    var upd = function () { var i = gal.scrollLeft >= gal.scrollWidth - gal.clientWidth - 4 ? shots.length - 1 : idx(); count.textContent = (i + 1) + ' de ' + shots.length; prev.disabled = i === 0; nxt.disabled = i === shots.length - 1; };
    var go = function (d) { var i = Math.max(0, Math.min(shots.length - 1, idx() + d)); gal.scrollTo({ left: shots[i].offsetLeft - gal.offsetLeft, behavior: reduce ? 'auto' : 'smooth' }); };
    prev.addEventListener('click', function () { go(-1); });
    nxt.addEventListener('click', function () { go(1); });
    gal.addEventListener('scroll', function () { requestAnimationFrame(upd); }, { passive: true });
    gal.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { e.preventDefault(); go(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); } });
    window.addEventListener('resize', upd); upd();
  }

  /* Navegação e CTA fixo */
  var nav = $('nav'), sticky = $('sticky-cta'), hero = document.querySelector('.hero'), price = $('entrega'), closing = document.querySelector('.closing');
  var heroOut = false, priceIn = false, gameIn = false, gameEl = document.getElementById('game');
  function stickyUpdate() {
    var show = heroOut && !priceIn && !gameIn;
    sticky.classList.toggle('is-visible', show);
    sticky.setAttribute('aria-hidden', String(!show));
    var link = sticky.querySelector('a'); if (link) link.tabIndex = show ? 0 : -1;
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { heroOut = !e[0].isIntersecting; stickyUpdate(); }, { threshold: 0 }).observe(hero);
    if (gameEl) new IntersectionObserver(function (e) { gameIn = e[0].isIntersecting; stickyUpdate(); }, { threshold: 0 }).observe(gameEl);
    var ends = new IntersectionObserver(function (es) { es.forEach(function (en) { en.target._in = en.isIntersecting; }); priceIn = !!(price._in || closing._in); stickyUpdate(); }, { threshold: 0 });
    ends.observe(price); ends.observe(closing);
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { nav.classList.toggle('is-scrolled', window.scrollY > 12); ticking = false; });
  }, { passive: true });
})();
