/* CTL — diagnóstico. */
(function () {
  'use strict';
  var C = window.CTL_CONTENT, stage = document.getElementById('quiz-stage');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var Q = C.questions, total = Q.length, state = 'intro', at = 0, answers = [], locked = false;
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  function enter() { stage.classList.remove('is-in'); void stage.offsetWidth; if (!reduce) stage.classList.add('is-in'); }
  function focusTitle() { var h = stage.querySelector('h1'); if (h) { h.tabIndex = -1; h.focus({ preventScroll: true }); } window.scrollTo({ top: 0, behavior: 'auto' }); }

  function intro() {
    state = 'intro';
    stage.innerHTML =
      '<div class="quiz-intro">' +
        '<div class="intro-art" aria-hidden="true"><div class="intro-win"><i></i><i></i><i></i><span>sua solução</span></div><p>Ainda não está no ar</p></div>' +
        '<h1>Você quer criar <em>algo seu?</em></h1>' +
        '<p class="quiz-lead">' + total + ' perguntas sobre o que você quer construir, de onde vem o dinheiro e o que trava. No final, um diagnóstico leve do seu ponto de partida.</p>' +
        '<button class="btn btn-ink quiz-start" type="button">Começar o diagnóstico</button>' +
        '<p class="quiz-note">Leva cerca de 3 minutos. Sem cadastro. Vale com ou sem emprego. Não existe resposta certa.</p>' +
      '</div>';
    stage.querySelector('.quiz-start').onclick = function () { at = 0; answers = []; question(); };
    enter();
  }

  function question() {
    state = 'q'; locked = false;
    var q = Q[at], bars = '';
    for (var i = 0; i < total; i++) bars += '<i class="' + (i < at ? 'done' : i === at ? 'now' : '') + '"></i>';
    stage.innerHTML =
      '<div class="q-top"><span class="q-count">Pergunta ' + (at + 1) + ' de ' + total + '</span>' + (at ? '<button class="q-back" type="button">Voltar</button>' : '') + '</div>' +
      '<div class="q-bars" style="--n:' + total + '" role="progressbar" aria-label="Progresso" aria-valuemin="0" aria-valuemax="' + total + '" aria-valuenow="' + at + '">' + bars + '</div>' +
      '<h1 class="q-title">' + esc(q.q) + '</h1>' +
      '<div class="q-answers" role="group" aria-label="Escolha uma resposta">' +
        q.a.map(function (a, n) { return '<button class="q-answer' + (answers[at] != null && answers[at].i === n ? ' was' : '') + '" type="button" data-i="' + n + '"><span class="q-key" aria-hidden="true">' + (n + 1) + '</span><span>' + esc(a[0]) + '</span></button>'; }).join('') +
      '</div>' +
      '<p class="q-hint">Dica: use as teclas 1 a 4.</p>';
    stage.querySelectorAll('.q-answer').forEach(function (b) { b.onclick = function () { pick(Number(b.dataset.i)); }; });
    var back = stage.querySelector('.q-back'); if (back) back.onclick = function () { at--; question(); };
    enter(); focusTitle();
  }

  function pick(n) {
    if (locked) return; locked = true;
    answers[at] = { i: n, score: Q[at].a[n][1] };
    var btn = stage.querySelector('.q-answer[data-i="' + n + '"]'); if (btn) btn.classList.add('is-picked');
    setTimeout(function () { if (at < total - 1) { at++; question(); } else result(); }, reduce ? 0 : 260);
  }

  function result() {
    state = 'r';
    var score = answers.reduce(function (s, a) { return s + a.score; }, 0), max = total * 3;
    var r = C.results.filter(function (x) { return score <= x.max; })[0] || C.results[C.results.length - 1];
    var pains = answers.map(function (a, i) { return { s: a.score, i: i }; }).filter(function (x) { return x.s >= 2; }).sort(function (a, b) { return b.s - a.s; }).slice(0, 3);
    stage.innerHTML =
      '<p class="r-level">' + esc(r.level) + '</p>' +
      '<h1 class="r-title">' + esc(r.title) + '</h1>' +
      '<p class="r-body">' + esc(r.body) + '</p>' +
      (r.read ? '<p class="r-read"><b>Seu diagnóstico</b>' + esc(r.read) + '</p>' : '') +
      '<div class="r-meter"><div class="r-meter-top"><span>Seu ponto de partida</span><strong>' + score + '<small>de ' + max + '</small></strong></div>' +
        '<div class="r-track" role="meter" aria-label="Pontuação" aria-valuemin="0" aria-valuemax="' + max + '" aria-valuenow="' + score + '"><span class="r-pin"></span></div>' +
        '<div class="r-scale"><span>Mais tranquilo</span><span>Mais em movimento</span></div></div>' +
      '<div class="r-pains"><h2>O que o quiz apontou</h2><ol>' +
        (pains.length ? pains.map(function (p, n) { return '<li><span>' + (n + 1) + '</span>' + esc(Q[p.i].pain) + '</li>'; }).join('') : '<li><span>–</span>Você não marcou nenhuma trava forte. O próximo passo é escolher o que construir.</li>') +
      '</ol></div>' +
      '<p class="r-close">Isso não define o seu futuro. É um recorte do agora. No desafio CTL, a gente ajuda você a escolher uma ideia, criar a primeira versão e começar a vender.</p>' +
      '<div class="r-actions"><a class="btn btn-ink is-pulse" href="desafio/">Ver como funcionam os 7 dias</a><button class="r-reset" type="button">Responder de novo</button></div>' +
      '<p class="r-note">Este diagnóstico é só um ponto de reflexão. Não é uma avaliação financeira nem psicológica.</p>';
    stage.querySelector('.r-reset').onclick = intro;
    enter(); focusTitle();
    var pin = stage.querySelector('.r-pin');
    requestAnimationFrame(function () { requestAnimationFrame(function () { pin.style.left = (score / max * 100) + '%'; }); });
  }

  document.addEventListener('keydown', function (e) {
    if (state !== 'q' || e.metaKey || e.ctrlKey || e.altKey) return;
    var n = parseInt(e.key, 10);
    if (n >= 1 && n <= Q[at].a.length) { e.preventDefault(); pick(n - 1); }
  });

  intro();
})();
