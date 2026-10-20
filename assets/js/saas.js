/* CTL — vitrine "Em qualquer área, o problema vira uma solução".
   Cada área mostra uma solução de exemplo dentro de um celular, que dá para usar de verdade.
   Os textos ficam em assets/js/content.js (areas). Os desenhos ficam aqui (APPS). */
(function () {
  'use strict';
  var C = window.CTL_CONTENT || {}, AREAS = C.areas || [];
  var chips = document.getElementById('area-chips'), screen = document.getElementById('phone-screen');
  var info = document.getElementById('saas-info'), hint = document.getElementById('phone-hint');
  var device = document.getElementById('device'), devUrl = document.getElementById('dev-url'), saasBox = document.querySelector('.saas'), devMode = 'phone';
  if (!chips || !screen || !info || !AREAS.length) return;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var brl = function (n) { return 'R$ ' + Math.round(n).toLocaleString('pt-BR'); };
  var P = {
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    bell: '<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
    spark: '<path d="M12 3l1.8 4.6L18.5 9l-4.7 1.6L12 15l-1.8-4.4L5.5 9l4.7-1.4z"/><path d="M18 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
    swap: '<path d="M4 8h13l-3-3M20 16H7l3 3"/>',
    play: '<path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/>',
    send: '<path d="M4 12l16-8-6 16-3-6z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    home: '<path d="M4 11L12 4.5 20 11v8.5a1 1 0 0 1-1 1h-4.5V15h-5v5.5H5a1 1 0 0 1-1-1z"/>',
    list: '<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'
  };
  var ic = function (n) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[n] || '') + '</svg>'; };
  var top = function (a, sub) {
    return '<header class="ax-top"><span class="ax-logo">' + esc(a.name.charAt(0)) + '</span><div class="ax-id"><b>' + esc(a.name) + '</b><small>' + esc(sub) + '</small></div><span class="ax-bell">' + ic('bell') + '</span></header>';
  };
  var toast = function (root, msg) {
    var t = root.querySelector('.ax-toast');
    if (!t) { t = document.createElement('div'); t.className = 'ax-toast'; t.setAttribute('role', 'status'); root.appendChild(t); }
    t.textContent = msg; t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
  };
  var countTo = function (el, from, to, fmt) {
    if (reduce) { el.textContent = fmt(to); return; }
    var t0 = performance.now();
    (function f(now) { var t = Math.min(1, (now - t0) / 500), e = 1 - Math.pow(1 - t, 3); el.textContent = fmt(from + (to - from) * e); if (t < 1) requestAnimationFrame(f); })(t0);
  };

  /* ---------------- os apps ---------------- */
  var APPS = {
    /* Academia: Série do Dia */
    gym: function (a) {
      var moves = [['1', 'Agachamento', '4 séries de 10'], ['2', 'Supino reto', '4 séries de 8'], ['3', 'Remada curvada', '4 séries de 10'], ['4', 'Prancha', '3 séries de 40s']];
      return {
        html: top(a, 'Peito e perna · hoje') + '<div class="ax-body">' +
          '<div class="ax-kpis"><span><b class="kpi-ad">0%</b><small>feito hoje</small></span><span><b class="kpi-next">1</b><small>próximo</small></span><span><b>12</b><small>alunos</small></span></div>' +
          '<div class="ax-card ax-hero"><div class="ring" style="--p:0"><span><em><b class="ring-n">0</b><small>/4</small></em></span></div><div><b>Treino de hoje</b><small class="ring-msg">Toque no exercício quando terminar</small><i class="ax-pill">Agachamento · 4x10</i></div></div>' +
          '<div class="ax-list">' + moves.map(function (m, i) { return '<button type="button" class="ax-row ax-med' + (i === 0 ? ' is-next' : '') + '" data-i="' + i + '"><span class="ax-time">' + m[0] + '</span><span class="ax-txt"><b>' + m[1] + '</b><small>' + m[2] + '</small></span><span class="ax-tick">' + ic('check') + '</span></button>'; }).join('') + '</div>' +
          '<p class="ax-foot">O personal vê, na hora, quem fez o treino.</p></div>',
        bind: function (root) {
          var ring = root.querySelector('.ring'), n = root.querySelector('.ring-n'), msg = root.querySelector('.ring-msg'), ad = root.querySelector('.kpi-ad'), nxt = root.querySelector('.kpi-next'), pill = root.querySelector('.ax-pill');
          root.querySelectorAll('.ax-med').forEach(function (b) {
            b.addEventListener('click', function () {
              b.classList.toggle('done'); b.setAttribute('aria-pressed', String(b.classList.contains('done')));
              var all = root.querySelectorAll('.ax-med'), d = root.querySelectorAll('.ax-med.done').length, next = null;
              all.forEach(function (x) { x.classList.remove('is-next'); if (!next && !x.classList.contains('done')) next = x; });
              if (next) next.classList.add('is-next');
              ring.style.setProperty('--p', d / 4 * 100); n.textContent = d; ad.textContent = Math.round(d / 4 * 100) + '%';
              msg.textContent = d === 4 ? 'Treino completo. Personal avisado.' : 'Faltam ' + (4 - d) + ' exercícios';
              if (next) { nxt.textContent = next.querySelector('.ax-time').textContent; pill.textContent = next.querySelector('.ax-txt b').textContent + ' · ' + next.querySelector('.ax-txt small').textContent; }
              else { nxt.textContent = '—'; pill.textContent = 'Nada pendente'; }
              if (d === 4) toast(root, 'Treino do dia concluído. O personal foi avisado.');
            });
          });
        }
      };
    },

    /* Saúde: CuidaBem */
    care: function (a) {
      var meds = [['08:00', 'Remédio da pressão', '1 comprimido'], ['12:00', 'Vitamina D', '1 cápsula'], ['18:00', 'Remédio da diabetes', '1 comprimido'], ['22:00', 'Remédio do colesterol', '1 comprimido']];
      return {
        html: top(a, 'Dona Maria · cuidador') + '<div class="ax-body">' +
          '<div class="ax-kpis"><span><b class="kpi-ad">0%</b><small>adesão hoje</small></span><span><b class="kpi-next">08:00</b><small>próxima</small></span><span><b>3</b><small>na família</small></span></div>' +
          '<div class="ax-card ax-hero"><div class="ring" style="--p:0"><span><em><b class="ring-n">0</b><small>/4</small></em></span></div><div><b>Rotina de hoje</b><small class="ring-msg">Toque na dose quando tomar</small><i class="ax-pill">Pressão · 08:00</i></div></div>' +
          '<div class="ax-list">' + meds.map(function (m, i) { return '<button type="button" class="ax-row ax-med' + (i === 0 ? ' is-next' : '') + '" data-i="' + i + '"><span class="ax-time">' + m[0] + '</span><span class="ax-txt"><b>' + m[1] + '</b><small>' + m[2] + '</small></span><span class="ax-tick">' + ic('check') + '</span></button>'; }).join('') + '</div>' +
          '<p class="ax-foot">Se atrasar, a filha e o neto recebem o aviso na hora.</p></div>',
        bind: function (root) {
          var ring = root.querySelector('.ring'), n = root.querySelector('.ring-n'), msg = root.querySelector('.ring-msg'), ad = root.querySelector('.kpi-ad'), nxt = root.querySelector('.kpi-next'), pill = root.querySelector('.ax-pill');
          root.querySelectorAll('.ax-med').forEach(function (b) {
            b.addEventListener('click', function () {
              b.classList.toggle('done'); b.setAttribute('aria-pressed', String(b.classList.contains('done')));
              var all = root.querySelectorAll('.ax-med'), d = root.querySelectorAll('.ax-med.done').length, next = null;
              all.forEach(function (x) { x.classList.remove('is-next'); if (!next && !x.classList.contains('done')) next = x; });
              if (next) next.classList.add('is-next');
              ring.style.setProperty('--p', d / 4 * 100); n.textContent = d; ad.textContent = Math.round(d / 4 * 100) + '%';
              msg.textContent = d === 4 ? 'Dia completo. Família avisada.' : 'Faltam ' + (4 - d) + ' doses';
              if (next) { nxt.textContent = next.querySelector('.ax-time').textContent; pill.textContent = next.querySelector('.ax-txt b').textContent + ' · ' + nxt.textContent; }
              else { nxt.textContent = '—'; pill.textContent = 'Nada pendente'; }
              if (d === 4) toast(root, 'A família foi avisada: tudo certo hoje.');
            });
          });
        }
      };
    },

    /* Mães: Soninho */
    baby: function (a) {
      var fmt = function (m) { m = Math.max(0, Math.round(m)); var h = Math.floor(m / 60), r = m % 60; return h ? h + 'h' + (r ? ' ' + r + 'min' : '') : r + ' min'; };
      var clock = function (m) { m = ((m % 1440) + 1440) % 1440; return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
      return {
        html: top(a, 'Theo · 7 meses') + '<div class="ax-body">' +
          '<div class="bb-hero"><span class="bb-stars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span><span class="bb-moon">' + ic('moon') + '</span>' +
          '<small class="bb-state">Acordado há</small><b class="bb-time">1h 35min</b><span class="bb-next">Próxima soneca em <b class="bb-in">25 min</b></span><i class="bb-bar"><i style="width:79%"></i></i></div>' +
          '<button type="button" class="ax-btn bb-btn">' + ic('moon') + '<span>Dormiu agora</span></button>' +
          '<p class="ax-label">Sono de hoje</p><div class="bb-line"><span class="bb-blk" style="left:0;width:27.1%"></span><span class="bb-blk" style="left:37.5%;width:6.25%"></span><span class="bb-blk" style="left:54.2%;width:6.25%"></span><span class="bb-blk bb-live" style="left:67%;width:0"></span><span class="bb-now" style="left:67%"></span></div>' +
          '<div class="bb-hours"><span>0h</span><span>6h</span><span>12h</span><span>18h</span><span>24h</span></div>' +
          '<div class="ax-list bb-list">' + [['13:00', 'Soneca da tarde', '1h 30min'], ['09:00', 'Soneca da manhã', '1h 30min'], ['00:00', 'Noite', '6h 30min']].map(function (r) { return '<div class="ax-row"><span class="bb-ico">' + ic('moon') + '</span><span class="ax-txt"><b>' + r[1] + '</b><small>Início ' + r[0] + '</small></span><span class="bb-dur">' + r[2] + '</span></div>'; }).join('') + '</div></div>',
        bind: function (root) {
          var now = 16 * 60 + 5, awakeSince = 14 * 60 + 30, asleep = false, start = 0, timer = 0;
          var hero = root.querySelector('.bb-hero'), st = root.querySelector('.bb-state'), tm = root.querySelector('.bb-time'), nx = root.querySelector('.bb-next'), bar = root.querySelector('.bb-bar i');
          var btn = root.querySelector('.bb-btn'), live = root.querySelector('.bb-live'), nowMk = root.querySelector('.bb-now'), list = root.querySelector('.bb-list');
          var tick = function () {
            if (!document.body.contains(root)) { clearInterval(timer); return; }
            now += 1;
            var slept = now - start;
            tm.textContent = fmt(slept);
            live.style.width = (slept / 1440 * 100) + '%'; nowMk.style.left = (now / 1440 * 100) + '%';
            bar.style.width = Math.min(100, slept / 90 * 100) + '%';
          };
          btn.addEventListener('click', function () {
            asleep = !asleep;
            hero.classList.toggle('asleep', asleep);
            if (asleep) {
              start = now; live.style.left = (now / 1440 * 100) + '%'; live.style.width = '0';
              st.textContent = 'Dormindo há'; tm.textContent = '0 min'; nx.innerHTML = 'Soneca começou às <b>' + clock(now) + '</b>'; bar.style.width = '0';
              btn.querySelector('span').textContent = 'Acordou agora'; btn.classList.add('wake');
              timer = setInterval(tick, reduce ? 40 : 160);
            } else {
              clearInterval(timer);
              var slept = now - start;
              var row = document.createElement('div'); row.className = 'ax-row new';
              row.innerHTML = '<span class="bb-ico">' + ic('moon') + '</span><span class="ax-txt"><b>Soneca agora</b><small>Início ' + clock(start) + '</small></span><span class="bb-dur">' + fmt(slept) + '</span>';
              list.insertBefore(row, list.firstChild);
              var live2 = live.cloneNode(); live2.classList.remove('bb-live'); live.parentNode.insertBefore(live2, live); live.style.width = '0';
              awakeSince = now; st.textContent = 'Acordado há'; tm.textContent = '0 min'; nx.innerHTML = 'Próxima soneca em <b>2h</b>'; bar.style.width = '0';
              btn.querySelector('span').textContent = 'Dormiu agora'; btn.classList.remove('wake');
              toast(root, 'Soneca de ' + fmt(slept) + ' registrada. Próxima janela por volta das ' + clock(now + 120) + '.');
            }
          });
        }
      };
    },

    /* Educação: Lição Leve */
    edu: function (a) {
      return {
        html: top(a, 'Fase 3 · Tabuada') + '<div class="ax-body">' +
          '<div class="ax-xp"><span>Pontos</span><b class="xp-n">120</b><i class="xp-bar"><i style="width:40%"></i></i></div>' +
          '<div class="ax-card ax-quiz"><small>Quanto é</small><p class="q-big"></p><div class="q-opts"></div><p class="q-fb" aria-live="polite"></p></div>' +
          '<div class="ax-badges"><span class="on">Fase 1</span><span class="on">Fase 2</span><span class="cur">Fase 3</span><span>Fase 4</span></div>' +
          '<p class="ax-foot">Os pais recebem o progresso toda semana.</p></div>',
        bind: function (root) {
          var Q = [['7 × 8', ['54', '56', '63'], 1], ['9 × 6', ['54', '56', '45'], 0], ['8 × 8', ['72', '56', '64'], 2]], k = 0, xp = 120;
          var big = root.querySelector('.q-big'), opts = root.querySelector('.q-opts'), fb = root.querySelector('.q-fb'), xpn = root.querySelector('.xp-n'), bar = root.querySelector('.xp-bar i');
          var show = function () {
            var q = Q[k]; big.textContent = q[0] + ' = ?'; fb.textContent = '';
            opts.innerHTML = q[1].map(function (o, i) { return '<button type="button" class="q-opt" data-i="' + i + '">' + o + '</button>'; }).join('');
            opts.querySelectorAll('.q-opt').forEach(function (b) {
              b.addEventListener('click', function () {
                if (opts.classList.contains('lock')) return;
                if (+b.dataset.i === q[2]) {
                  opts.classList.add('lock'); b.classList.add('ok'); fb.textContent = 'Acertou! +10 pontos';
                  countTo(xpn, xp, xp + 10, function (v) { return Math.round(v); }); xp += 10; bar.style.width = Math.min(100, 40 + (k + 1) * 20) + '%';
                  setTimeout(function () {
                    opts.classList.remove('lock'); k++;
                    if (k < Q.length) show();
                    else { big.textContent = 'Fase 3 concluída!'; opts.innerHTML = ''; fb.textContent = 'Fase 4 liberada.'; root.querySelector('.ax-badges .cur').classList.add('on'); toast(root, 'Os pais receberam o relatório da fase.'); }
                  }, reduce ? 0 : 850);
                } else { b.classList.add('no'); fb.textContent = 'Quase! Tente de novo.'; setTimeout(function () { b.classList.remove('no'); }, 500); }
              });
            });
          };
          show();
        }
      };
    },

    /* Vendas: Funil Fácil */
    crm: function (a) {
      return {
        html: top(a, 'Loja da Ju') + '<div class="ax-body"><div class="crm-sum"></div><div class="crm-cols"></div><p class="ax-foot">Toque em "Avançar" para mover o cliente no funil.</p></div>',
        bind: function (root) {
          var S = ['Novos', 'Conversando', 'Vendido'], cs = [['Carla', 'Vestido azul', 0], ['Rafael', 'Tênis 42', 0], ['Bianca', 'Bolsa preta', 1], ['João', 'Camisa M', 2]];
          var sum = root.querySelector('.crm-sum'), cols = root.querySelector('.crm-cols');
          var draw = function () {
            sum.innerHTML = S.map(function (s, i) { var n = cs.filter(function (c) { return c[2] === i; }).length; return '<span class="' + (i === 2 ? 'won' : '') + '"><b>' + n + '</b>' + s + '</span>'; }).join('');
            cols.innerHTML = S.map(function (s, i) {
              var list = cs.map(function (c, j) { return [c, j]; }).filter(function (x) { return x[0][2] === i; });
              return '<div class="crm-col"><p class="crm-h">' + s + '</p>' + (list.length ? list.map(function (x) {
                var c = x[0];
                return '<div class="crm-card' + (i === 2 ? ' won' : '') + '"><span class="crm-av">' + c[0].charAt(0) + '</span><span class="ax-txt"><b>' + c[0] + '</b><small>' + c[1] + '</small></span>' +
                  (i < 2 ? '<button type="button" class="crm-go" data-j="' + x[1] + '">Avançar</button>' : '<span class="crm-ok">' + ic('check') + '</span>') + '</div>';
              }).join('') : '<p class="crm-empty">Nenhum cliente aqui</p>') + '</div>';
            }).join('');
            cols.querySelectorAll('.crm-go').forEach(function (b) {
              b.addEventListener('click', function () {
                var c = cs[+b.dataset.j]; c[2]++; draw();
                toast(root, c[2] === 2 ? 'Venda registrada! Lembrete de pós-venda criado.' : c[0] + ' foi para "Conversando". Retorno marcado para amanhã.');
              });
            });
          };
          draw();
        }
      };
    },

    /* Beleza: Agenda Bela */
    salon: function (a) {
      var days = ['Seg 12', 'Ter 13', 'Qua 14', 'Qui 15', 'Sex 16'], slots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
      return {
        html: top(a, 'Studio da Lu') + '<div class="ax-body"><div class="sl-days">' + days.map(function (d, i) { return '<button type="button" class="sl-day' + (i === 3 ? ' on' : '') + '" data-i="' + i + '"><small>' + d.split(' ')[0] + '</small><b>' + d.split(' ')[1] + '</b></button>'; }).join('') + '</div>' +
          '<p class="ax-label">Horários livres</p><div class="sl-slots"></div><div class="ax-card sl-conf" hidden></div><p class="ax-foot">A cliente agenda sozinha e recebe lembrete um dia antes.</p></div>',
        bind: function (root) {
          var day = 3, slotsBox = root.querySelector('.sl-slots'), conf = root.querySelector('.sl-conf');
          var drawSlots = function () {
            slotsBox.innerHTML = slots.map(function (s, i) { var taken = (i * 3 + day * 2) % 5 === 0 || (i + day) % 4 === 0; return '<button type="button" class="sl-slot' + (taken ? ' taken' : '') + '"' + (taken ? ' disabled' : '') + '>' + s + '</button>'; }).join('');
            slotsBox.querySelectorAll('.sl-slot:not(.taken)').forEach(function (b) {
              b.addEventListener('click', function () {
                slotsBox.querySelectorAll('.mine').forEach(function (x) { x.classList.remove('mine'); });
                b.classList.add('mine'); conf.hidden = false;
                conf.innerHTML = '<span class="sl-ok">' + ic('check') + '</span><div><b>Confirmado: ' + days[day] + ', ' + b.textContent + '</b><small>Corte e escova com a Lu</small></div>';
                toast(root, 'Lembrete automático agendado para a cliente.');
              });
            });
          };
          root.querySelectorAll('.sl-day').forEach(function (b) { b.addEventListener('click', function () { root.querySelectorAll('.sl-day').forEach(function (x) { x.classList.remove('on'); }); b.classList.add('on'); day = +b.dataset.i; conf.hidden = true; drawSlots(); }); });
          drawSlots();
        }
      };
    },

    /* Administrativo: Caixa Claro */
    cash: function (a) {
      return {
        html: top(a, 'Padaria Central') + '<div class="ax-body"><div class="ax-card cx-bal"><small>Saldo de hoje</small><b class="cx-n">R$ 4.280</b><div class="cx-bars">' + [42, 55, 38, 61, 70, 66].map(function (h, i) { return '<i style="height:' + h + '%"' + (i === 5 ? ' class="now"' : '') + '></i>'; }).join('') + '</div><span class="cx-cap">Últimos 6 meses</span></div>' +
          '<div class="cx-btns"><button type="button" class="cx-in">' + ic('plus') + 'Entrada</button><button type="button" class="cx-out">' + ic('minus') + 'Saída</button></div>' +
          '<div class="ax-list cx-list"></div></div>',
        bind: function (root) {
          var bal = 4280, list = root.querySelector('.cx-list'), n = root.querySelector('.cx-n'), nowBar = root.querySelector('.cx-bars .now');
          var rows = [['Venda no balcão', 380], ['Fornecedor de farinha', -920], ['Pix de cliente', 150]];
          var ins = [['Venda no balcão', 120], ['Encomenda de bolo', 260], ['Pix de cliente', 95]], outs = [['Conta de luz', -210], ['Embalagens', -85], ['Gás', -130]], ki = 0, ko = 0;
          var draw = function () { list.innerHTML = rows.slice(0, 4).map(function (r) { return '<div class="ax-row cx-row"><span class="ax-txt"><b>' + r[0] + '</b><small>Hoje</small></span><span class="cx-v ' + (r[1] > 0 ? 'pos' : 'neg') + '">' + (r[1] > 0 ? '+ ' : '− ') + brl(Math.abs(r[1])) + '</span></div>'; }).join(''); };
          var add = function (r) { var from = bal; bal += r[1]; rows.unshift(r); draw(); list.firstChild.classList.add('new'); countTo(n, from, bal, brl); nowBar.style.height = Math.max(20, Math.min(96, 66 + (bal - 4280) / 40)) + '%'; };
          root.querySelector('.cx-in').addEventListener('click', function () { add(ins[ki++ % ins.length]); });
          root.querySelector('.cx-out').addEventListener('click', function () { add(outs[ko++ % outs.length]); });
          draw();
        }
      };
    },

    /* Construção: Orça Obra */
    build: function (a) {
      var rooms = [['Banheiro', 900], ['Cozinha', 750], ['Sala', 420], ['Quarto', 380]], quals = [['Simples', 1], ['Padrão', 1.35], ['Alto', 1.8]];
      return {
        html: top(a, 'Orçamento rápido') + '<div class="ax-body"><p class="ax-label">Cômodo</p><div class="ob-chips">' + rooms.map(function (r, i) { return '<button type="button" class="ob-room' + (i === 0 ? ' on' : '') + '" data-i="' + i + '">' + r[0] + '</button>'; }).join('') + '</div>' +
          '<p class="ax-label">Tamanho: <b class="ob-m">6 m²</b></p><input class="ob-range" type="range" min="2" max="30" value="6" aria-label="Tamanho em metros quadrados">' +
          '<p class="ax-label">Acabamento</p><div class="ob-seg">' + quals.map(function (q, i) { return '<button type="button" class="ob-q' + (i === 1 ? ' on' : '') + '" data-i="' + i + '">' + q[0] + '</button>'; }).join('') + '</div>' +
          '<div class="ax-card ob-res"><small>Estimativa da reforma</small><b class="ob-v"></b><span class="ob-note">Mão de obra e material</span></div>' +
          '<button type="button" class="ax-btn ob-send">' + ic('send') + 'Enviar orçamento</button></div>',
        bind: function (root) {
          var r = 0, q = 1, m = 6, v = root.querySelector('.ob-v'), mm = root.querySelector('.ob-m');
          var calc = function () { var base = rooms[r][1] * m * quals[q][1]; v.textContent = brl(Math.round(base * .9 / 100) * 100) + ' a ' + brl(Math.round(base * 1.1 / 100) * 100); mm.textContent = m + ' m²'; };
          root.querySelectorAll('.ob-room').forEach(function (b) { b.addEventListener('click', function () { root.querySelectorAll('.ob-room').forEach(function (x) { x.classList.remove('on'); }); b.classList.add('on'); r = +b.dataset.i; calc(); }); });
          root.querySelectorAll('.ob-q').forEach(function (b) { b.addEventListener('click', function () { root.querySelectorAll('.ob-q').forEach(function (x) { x.classList.remove('on'); }); b.classList.add('on'); q = +b.dataset.i; calc(); }); });
          root.querySelector('.ob-range').addEventListener('input', function (e) { m = +e.target.value; calc(); });
          root.querySelector('.ob-send').addEventListener('click', function () { toast(root, 'Orçamento enviado para o cliente.'); });
          calc();
        }
      };
    },

    /* Alimentação: Cardápio da Semana */
    menu: function (a) {
      var D = [['Seg', ['Frango com legumes', 'Escondidinho']], ['Ter', ['Macarrão ao sugo', 'Risoto de abóbora']], ['Qua', ['Omelete de forno', 'Panqueca de carne']], ['Qui', ['Carne moída com purê', 'Strogonoff de frango']], ['Sex', ['Pizza caseira', 'Hambúrguer caseiro']], ['Sáb', ['Peixe assado', 'Feijão tropeiro']], ['Dom', ['Sopa de legumes', 'Lasanha']]];
      var items = ['Frango 1 kg', 'Macarrão 500 g', 'Ovos 12 un', 'Batata 1 kg', 'Tomate 6 un', 'Queijo 300 g', 'Carne moída 500 g', 'Legumes variados'];
      return {
        html: top(a, 'Família Souza') + '<div class="ax-body"><div class="mn-hero"><small>Hoje à noite</small><b>Frango com legumes</b><span>30 min · 4 porções</span><i class="mn-plate" aria-hidden="true"><i></i><i></i><i></i></i></div><p class="ax-label">Jantares da semana</p><div class="ax-list mn-list">' +
          D.map(function (d, i) { return '<div class="ax-row mn-row"><span class="ax-time">' + d[0] + '</span><span class="ax-txt"><b class="mn-dish">' + d[1][0] + '</b><small>30 min</small></span><button type="button" class="mn-swap" data-i="' + i + '" aria-label="Trocar o prato de ' + d[0] + '">' + ic('swap') + '</button></div>'; }).join('') +
          '</div><button type="button" class="ax-btn mn-gen">Gerar lista de compras</button></div>' +
          '<div class="ax-sheet" hidden><div class="ax-sheet-top"><b>Lista de compras</b><button type="button" class="mn-close" aria-label="Fechar lista">' + ic('close') + '</button></div><div class="ax-list">' +
          items.map(function (t) { return '<button type="button" class="ax-row mn-item"><span class="ax-box">' + ic('check') + '</span><span class="ax-txt"><b>' + t + '</b></span></button>'; }).join('') + '</div></div>',
        bind: function (root) {
          var alt = D.map(function () { return 0; });
          root.querySelectorAll('.mn-swap').forEach(function (b) {
            b.addEventListener('click', function () { var i = +b.dataset.i; alt[i] = 1 - alt[i]; var dish = b.parentNode.querySelector('.mn-dish'); dish.textContent = D[i][1][alt[i]]; b.parentNode.classList.remove('new'); void b.parentNode.offsetWidth; b.parentNode.classList.add('new'); });
          });
          var sheet = root.querySelector('.ax-sheet');
          root.querySelector('.mn-gen').addEventListener('click', function () { sheet.hidden = false; requestAnimationFrame(function () { sheet.classList.add('open'); }); });
          root.querySelector('.mn-close').addEventListener('click', function () { sheet.classList.remove('open'); setTimeout(function () { sheet.hidden = true; }, reduce ? 0 : 300); });
          root.querySelectorAll('.mn-item').forEach(function (b) { b.addEventListener('click', function () { b.classList.toggle('done'); }); });
        }
      };
    },

    /* Tecnologia: Ajuda Digital */
    help: function (a) {
      return {
        html: top(a, 'Olá, seu Antônio') + '<div class="ax-body"><button type="button" class="hp-big">' + ic('phone') + '<b>Preciso de ajuda</b><small>Alguém atende em instantes</small></button>' +
          '<div class="hp-status" hidden></div>' +
          '<p class="ax-label">Aulas curtas</p><div class="ax-list">' + ['Como mandar uma foto', 'Como fazer chamada de vídeo', 'Como evitar golpes'].map(function (t) { return '<div class="ax-row"><span class="hp-play">' + ic('play') + '</span><span class="ax-txt"><b>' + t + '</b><small>2 min</small></span></div>'; }).join('') + '</div></div>',
        bind: function (root) {
          var big = root.querySelector('.hp-big'), st = root.querySelector('.hp-status'), tm = 0;
          big.addEventListener('click', function () {
            clearTimeout(tm); st.hidden = false; big.classList.add('calling');
            st.innerHTML = '<span class="hp-ring"></span><div><b>Chamando a Ana…</b><small>Sua atendente</small></div>';
            tm = setTimeout(function () {
              st.innerHTML = '<span class="hp-av">A</span><div><b>A Ana entrou na chamada</b><small>Ela vai te ajudar passo a passo</small></div><button type="button" class="hp-end">Encerrar</button>';
              toast(root, 'Atendimento iniciado.');
              st.querySelector('.hp-end').addEventListener('click', function () { st.hidden = true; big.classList.remove('calling'); });
            }, reduce ? 0 : 1600);
          });
        }
      };
    },

    /* Dentro da empresa: Relatório Automático */
    auto: function (a) {
      var steps = [['07:55', 'Junta os dados de vendas'], ['07:58', 'Monta os gráficos com IA'], ['08:00', 'Envia para a liderança']];
      return {
        html: top(a, 'Equipe comercial') + '<div class="ax-body"><div class="ax-card au-tog"><div><b>Automação</b><small class="au-state">Desligada</small></div><button type="button" class="au-switch" role="switch" aria-checked="false" aria-label="Ligar automação"><i></i></button></div>' +
          '<p class="ax-label">Toda segunda-feira</p><div class="au-steps">' + steps.map(function (s, i) { return '<div class="au-step" style="--i:' + i + '"><span class="ax-time">' + s[0] + '</span><span class="au-dot"></span><b>' + s[1] + '</b></div>'; }).join('') + '</div>' +
          '<div class="ax-card au-saved"><small>Tempo da equipe de volta</small><b><span class="au-h">0</span> h por semana</b></div></div>',
        bind: function (root) {
          var sw = root.querySelector('.au-switch'), on = false, h = root.querySelector('.au-h'), state = root.querySelector('.au-state'), body = root.querySelector('.ax-body');
          sw.addEventListener('click', function () {
            on = !on; sw.setAttribute('aria-checked', String(on)); body.classList.toggle('au-on', on); state.textContent = on ? 'Ligada' : 'Desligada';
            countTo(h, on ? 0 : 6, on ? 6 : 0, function (v) { return Math.round(v); });
            if (on) setTimeout(function () { toast(root, 'Relatório enviado às 08:00.'); }, reduce ? 0 : 1100);
          });
        }
      };
    },

    /* Outra área: o seu app */
    custom: function (a) {
      return {
        html: top(a, 'Em criação') + '<div class="ax-body"><label class="cu-field"><span>Qual problema a sua solução resolve?</span><input type="text" class="cu-in" maxlength="60" placeholder="Ex.: clientes esquecem de pagar"></label>' +
          '<button type="button" class="ax-btn cu-gen">' + ic('spark') + 'Gerar com IA</button><div class="cu-out"><div class="cu-sk"></div><div class="cu-sk"></div><div class="cu-sk short"></div></div></div>',
        bind: function (root) {
          var inp = root.querySelector('.cu-in'), out = root.querySelector('.cu-out'), title = root.querySelector('.ax-id small');
          var gen = function () {
            var p = (inp.value || '').trim() || 'um problema que você conhece';
            title.textContent = 'Resolve: ' + p;
            out.innerHTML = '<div class="cu-sk"></div><div class="cu-sk"></div><div class="cu-sk short"></div>'; out.classList.add('loading');
            setTimeout(function () {
              out.classList.remove('loading');
              out.innerHTML = [['Cadastro de clientes', 'Quem usa e quando'], ['Lembretes automáticos', 'Ninguém esquece mais'], ['Assinatura mensal', 'O cliente paga todo mês']].map(function (f, i) {
                return '<div class="ax-row cu-feat" style="--i:' + i + '"><span class="ax-box on">' + ic('check') + '</span><span class="ax-txt"><b>' + f[0] + '</b><small>' + f[1] + '</small></span></div>';
              }).join('');
              toast(root, 'Rascunho da solução pronto. No desafio, a gente constrói de verdade.');
            }, reduce ? 0 : 1100);
          };
          root.querySelector('.cu-gen').addEventListener('click', gen);
          inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); gen(); } });
        }
      };
    }
  };

  /* ---------------- painel de informações ---------------- */
  var renderInfo = function (a) {
    info.innerHTML =
      '<p class="si-area">' + esc(a.area) + '</p>' +
      '<div class="si-block"><span>O problema</span><p>' + esc(a.problem) + '</p></div>' +
      '<div class="si-app"><span class="si-logo" style="background:' + esc(a.color) + '">' + esc(a.name.charAt(0)) + '</span><div><span>A solução</span><b>' + esc(a.name) + '</b><p>' + esc(a.tagline) + '</p></div></div>' +
      '<ul class="si-feats">' + a.features.map(function (f) { return '<li>' + ic('check') + esc(f) + '</li>'; }).join('') + '</ul>' +
      '<div class="si-money"><span>' + (a.intra ? 'Como gera valor' : 'Como ganha dinheiro') + '</span><b>' + esc(a.money) + '</b></div>' +
      '<p class="si-who">Quem poderia criar: <b>' + esc(a.who.toLowerCase()) + '</b>.</p>' +
      '<p class="si-dev">' + ic('check') + 'Funciona no celular e no computador. Construído com IA, sem programar.</p>' +
      '<p class="si-note">Demonstração simplificada. A sua solução pode ir além. Nomes e valores ilustrativos.</p>';
    if (!reduce) { info.classList.remove('is-in'); void info.offsetWidth; info.classList.add('is-in'); }
  };

  /* ---------------- troca de área ---------------- */
  var current = -1, genTimer = 0;
  var slug = function (s) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); };
  var mount = function (a) {
    var app = (APPS[a.ui] || APPS.custom)(a), navIcons = ['home', 'list', 'chart', 'user'];
    var side = '<aside class="ax-side" aria-hidden="true"><div class="ax-side-id"><span class="ax-logo">' + esc(a.name.charAt(0)) + '</span><b>' + esc(a.name) + '</b></div><nav>' +
      ['Início'].concat(a.features.slice(0, 3)).map(function (n, i) { return '<span class="' + (i === 0 ? 'on' : '') + '">' + ic(navIcons[i]) + esc(n) + '</span>'; }).join('') + '</nav><span class="ax-side-plan">Plano mensal ativo</span></aside>';
    var status = '<div class="ax-status" aria-hidden="true"><b>9:41</b><span><svg viewBox="0 0 18 12" fill="currentColor"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><svg viewBox="0 0 26 12" fill="none" stroke="currentColor"><rect x=".5" y=".5" width="22" height="11" rx="3"/><rect x="2.5" y="2.5" width="15" height="7" rx="1.5" fill="currentColor" stroke="none"/><path d="M24.5 4v4" stroke-linecap="round"/></svg></span></div>';
    var tabs = '<nav class="ax-tabs" aria-hidden="true">' + navIcons.map(function (n, i) { return '<span class="' + (i === 0 ? 'on' : '') + '">' + ic(n) + '</span>'; }).join('') + '</nav>';
    screen.innerHTML = '<div class="ax ax-in" style="--ac:' + esc(a.color) + '">' + status + side + app.html + tabs + '</div>';
    app.bind(screen.firstChild);
    devUrl.textContent = 'solucao.com.br/' + slug(a.name);
    hint.textContent = a.ui === 'custom' ? 'Escreva o problema e toque em "Gerar com IA".' : 'Toque na solução para testar a demonstração.';
  };
  var select = function (i, user) {
    if (i === current) return; current = i;
    var a = AREAS[i];
    Array.prototype.forEach.call(chips.children, function (b, n) { var on = n === i; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
    renderInfo(a);
    clearTimeout(genTimer);
    if (!user || reduce) { mount(a); return; }
    screen.innerHTML = '<div class="ax-gen" style="--ac:' + esc(a.color) + '"><span class="ax-gen-ico">' + ic('spark') + '</span><b>Criando o ' + esc(a.name) + ' com IA…</b><i class="ax-gen-bar"><i></i></i><div class="ax-gen-sk"><i></i><i></i><i></i></div></div>';
    genTimer = setTimeout(function () { mount(a); }, 750);
  };
  AREAS.forEach(function (a, i) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'area-chip'; b.textContent = a.area; b.setAttribute('role', 'tab'); b.setAttribute('aria-controls', 'phone-screen');
    b.addEventListener('click', function () { select(i, true); });
    b.addEventListener('keydown', function (e) {
      var to = e.key === 'ArrowRight' ? (i + 1) % AREAS.length : e.key === 'ArrowLeft' ? (i - 1 + AREAS.length) % AREAS.length : null;
      if (to != null) { e.preventDefault(); select(to, true); chips.children[to].focus(); }
    });
    chips.appendChild(b);
  });
  Array.prototype.forEach.call(document.querySelectorAll('.dev-btn'), function (b) {
    b.addEventListener('click', function () {
      var m = b.dataset.dev; if (m === devMode) return; devMode = m;
      Array.prototype.forEach.call(document.querySelectorAll('.dev-btn'), function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      device.classList.toggle('is-phone', m === 'phone'); device.classList.toggle('is-desk', m === 'desk');
      if (saasBox) saasBox.classList.toggle('is-desk-mode', m === 'desk');
      clearTimeout(genTimer); mount(AREAS[current]);
      if (!reduce) { device.classList.remove('dev-swap'); void device.offsetWidth; device.classList.add('dev-swap'); }
    });
  });
  select(0, false);
})();
