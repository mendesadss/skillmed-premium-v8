/* SkillMed, previa v2 sobre o Dawn 16 (estrutura da Porare). Simula no navegador o que o Dawn faz com global.js + rotas /cart
   (gaveta do carrinho, menu do celular, galeria, filtros, busca preditiva) e os blocos NOVOS da SkillMed:
   personalizacao com prevista ao vivo, propriedades da gravacao em cada linha, barra de frete gratis, oferta unica no carrinho,
   checkout simulado (prova que nome, curso, desenho e mensagem chegam ao pedido), favoritos, toast e voltar ao topo. */
(function () {
  'use strict';
  var SM = window.SM; if (!SM) return;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var brl = SM.brl, esc = SM.esc;
  var ICO = function (d, c) { return '<svg aria-hidden="true" focusable="false" class="icon icon-stroke' + (c ? ' ' + c : '') + '" viewBox="0 0 24 24">' + d + '</svg>'; };
  var P_CHECK = '<path d="m5 12 4 4 10-10"/>';
  var I_CHECK = ICO(P_CHECK, 'icon-check'), I_INFO = ICO('<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>');
  var I_MIN = ICO('<path d="M6 12h12"/>'), I_PLUS = ICO('<path d="M12 6v12M6 12h12"/>', 'icon-plus'), I_CLOSE = ICO('<path d="M6 6l12 12M18 6 6 18"/>');
  var I_TRUCK = ICO('<path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>');
  var I_ERR = ICO('<circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5v.5"/>');
  var reduziert = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FOCO = 'a[href], button:not([disabled]), input:not([type=hidden]):not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';
  var visivel = function (x) { return !!(x.offsetWidth || x.offsetHeight || x.getClientRects().length) && getComputedStyle(x).visibility !== 'hidden'; };
  var prender = function (ev, box) { var f = $$(FOCO, box).filter(visivel); if (!f.length) return;
    if (ev.shiftKey && document.activeElement === f[0]) { ev.preventDefault(); f[f.length - 1].focus(); }
    else if (!ev.shiftKey && document.activeElement === f[f.length - 1]) { ev.preventDefault(); f[0].focus(); } };
  var ler = function (k, d) { try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return v == null ? d : v; } catch (e) { return d; } };
  var gravar = function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } };

  /* ---------- estado: carrinho (linhas com propriedades) e favoritos ---------- */
  var KEY = 'sm-carrinho-v2', FKEY = 'sm-favoritos-v2', MAXQ = 30;
  var KITS = ['kit', 'vet', 'odonto', 'semestre'];
  var carrinho = ler(KEY, []).filter(function (l) { return l && SM.produto(l.id); });
  var favoritos = ler(FKEY, []).filter(function (id) { return SM.produto(id); });
  function salvar() { gravar(KEY, carrinho); }
  function subtotal() { return Math.round(carrinho.reduce(function (s, l) { return s + Math.round(SM.produto(l.id).preis * 100) * l.qtd; }, 0)) / 100; }
  function itens() { return carrinho.reduce(function (s, l) { return s + l.qtd; }, 0); }
  function freteTexto(sub) { return sub >= SM.FRETE_MIN ? 'Grátis' : 'Calculado no checkout'; }

  /* ---------- toast ---------- */
  var toastT;
  function toast(html, opt) {
    opt = opt || {}; var reg = $('[data-toast]'); if (!reg) return;
    reg.innerHTML = '<div class="toast-wm4__item' + (opt.info ? ' toast-wm4__item--info' : '') + '">' + (opt.info ? I_INFO : I_CHECK) + '<span>' + html + '</span>' + (opt.acao ? '<button type="button">' + opt.acao + '</button>' : '') + '</div>';
    document.body.classList.add('has-toast-wm4');
    if (opt.acao) reg.querySelector('button').addEventListener('click', function () { fecharToast(); opt.onAcao(); });
    clearTimeout(toastT); toastT = setTimeout(fecharToast, opt.dur || 5000);
  }
  function fecharToast() { var r = $('[data-toast]'); if (r) r.innerHTML = ''; document.body.classList.remove('has-toast-wm4'); }

  /* ---------- estados do botao: carregando -> "Adicionado" -> volta ---------- */
  function botaoStatus(btn, pronto) {
    if (!btn || btn.classList.contains('is-loading-wm4')) return;
    var orig = btn.innerHTML, lab = btn.querySelector('.button__label-wm4'), qi = btn.querySelector('.quick-add__icon-wm4');
    btn.classList.add('is-loading-wm4'); btn.setAttribute('aria-busy', 'true');
    btn.insertAdjacentHTML('beforeend', '<span class="spinner-wm4" aria-hidden="true"></span>');
    setTimeout(function () {
      btn.classList.remove('is-loading-wm4'); btn.removeAttribute('aria-busy');
      var sp = btn.querySelector('.spinner-wm4'); if (sp) sp.remove();
      btn.classList.add('is-added-wm4');
      if (qi) qi.outerHTML = ICO(P_CHECK, 'quick-add__icon-wm4');
      if (lab) lab.innerHTML = (qi ? '' : I_CHECK) + 'Adicionado';
      if (pronto) pronto();
      setTimeout(function () { btn.classList.remove('is-added-wm4'); btn.innerHTML = orig; }, 1800);
    }, reduziert ? 60 : 380);
  }

  /* ---------- gaveta do carrinho ---------- */
  var gaveta = $('cart-drawer'), gavetaDe = null;
  function abrirCarrinho(de) {
    if (!gaveta) return; gavetaDe = de || document.activeElement;
    fecharMenus(); fecharFiltros(); fecharBusca();
    gaveta.classList.add('animate', 'active'); document.body.classList.add('overflow-hidden');
    setTimeout(function () { var c = gaveta.querySelector('.drawer__close'); if (c) c.focus(); }, 60);
  }
  function fecharCarrinho(semFoco) {
    if (!gaveta || !gaveta.classList.contains('active')) return;
    gaveta.classList.remove('active'); document.body.classList.remove('overflow-hidden');
    if (!semFoco && gavetaDe && gavetaDe.focus && document.contains(gavetaDe)) gavetaDe.focus();
  }
  function adicionar(id, props, opt) {
    opt = opt || {}; var p = SM.produto(id); if (!p) return;
    props = props || {}; var key = id + '|' + JSON.stringify(props);
    var l = carrinho.filter(function (x) { return x.key === key; })[0];
    if (l) l.qtd = Math.min(l.qtd + 1, MAXQ); else carrinho.push({ key: key, id: id, qtd: 1, props: props });
    salvar(); render();
    $$('[data-cart-count]').forEach(function (b) { b.classList.remove('is-bump-wm4'); void b.offsetWidth; b.classList.add('is-bump-wm4'); });
    if (opt.silencioso) return;
    if (opt.abrir) { abrirCarrinho(opt.origem); return; }
    toast('<strong>' + esc(p.kurz) + '</strong> foi para o carrinho.', { acao: 'Ver carrinho', onAcao: function () { abrirCarrinho(); } });
  }
  function remover(i) {
    var antes = carrinho[i], p = SM.produto(antes.id); carrinho.splice(i, 1); salvar(); render();
    toast(esc(p.kurz) + ' saiu do carrinho.', { info: true, acao: 'Desfazer', onAcao: function () { carrinho.splice(i, 0, antes); salvar(); render(); } });
  }
  document.addEventListener('sm:personalized-add', function (event) {
    var detail = event.detail || {}, product = SM.produto(detail.id), props = detail.props || {};
    var name = props['Nome para gravação'];
    if (!product || !product.perso || typeof name !== 'string' || !name.trim() || name.length > 20 || !props.Curso || !props.Arte) return;
    adicionar(product.id, { 'Curso': String(props.Curso), 'Arte': String(props.Arte), 'Nome para gravação': name, 'Fonte': String(props.Fonte || 'Clássica') }, { abrir: true, origem: detail.origin });
  });
  var propsHtml = function (l) { var ks = Object.keys(l.props || {}); return ks.length ? '<dl class="cart-props-sm">' + ks.map(function (k) { return '<div><dt>' + esc(k) + ':</dt><dd' + (k === 'Nome para gravação' ? ' class="nome-sm"' : '') + '>' + esc(l.props[k]) + '</dd></div>'; }).join('') + '</dl>' : ''; };
  var fotoLinha = function (line) {
    var props = line.props || {}, keys = { 'Medicina': 'med', 'Veterinária': 'vet', 'Odontologia': 'odonto', 'Enfermagem': 'enf' }, course = keys[props.Curso] || 'med';
    if (line.id === 'estojo') { var art = (course === 'med' || course === 'vet') ? (/^0[1-8]$/.test(props.Arte || '') ? props.Arte : '00') : (/^0[1-8]$/.test(props.Arte || '') ? props.Arte : '01'); return 'assets/catalogo-v5/05-estojo-personalizado/opcoes/' + course + '-' + art + '/01-480.webp'; }
    if ((course === 'enf' || course === 'odonto') && /^0[1-8]$/.test(props.Arte || '')) return 'assets/catalogo-v5/05-estojo-personalizado/opcoes/' + course + '-' + props.Arte + '/01-480.webp';
    if (line.id === 'semestre' && course === 'vet') return 'assets/catalogo-v5/04-kit-semestre-vet/01-480.webp';
    return SM.klein(SM.produto(line.id));
  };
  function render() {
    var n = itens(), sub = subtotal();
    $$('[data-cart-count]').forEach(function (b) { b.hidden = n === 0; b.querySelector('span').textContent = n; });
    $$('[data-cart-label]').forEach(function (l) { l.textContent = ', ' + n + (n === 1 ? ' item' : ' itens'); });
    if (!gaveta) return;
    gaveta.classList.toggle('is-empty', n === 0);
    var ci = $('cart-drawer-items'); if (ci) ci.classList.toggle('is-empty', n === 0);
    var ca = $('[data-cart-anzahl]'); if (ca) ca.textContent = n ? '(' + n + (n === 1 ? ' item)' : ' itens)') : '';
    // barra de frete gratis (R$ 159,90)
    var falta = Math.max(0, Math.round((SM.FRETE_MIN - sub) * 100) / 100), ok = falta === 0, pct = Math.min(100, Math.round(sub / SM.FRETE_MIN * 100));
    $('[data-versand-fortschritt]').innerHTML = n === 0
      ? '<p>' + I_TRUCK + '<span><strong>Frete grátis acima de ' + brl(SM.FRETE_MIN) + '</strong></span></p>'
      : '<p' + (ok ? ' class="is-done-wm4"' : '') + '>' + I_TRUCK + '<span>' + (ok ? '<strong>Frete grátis garantido neste pedido</strong>' : 'Faltam <strong>' + brl(falta) + '</strong> para o frete grátis') + '</span></p>' +
        '<div class="progress-wm4' + (ok ? ' is-done-wm4' : '') + '" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '" aria-label="Caminho até o frete grátis"><span style="width:' + pct + '%"></span></div>';
    $('[data-cart-items]').innerHTML = carrinho.map(function (l, i) {
      var p = SM.produto(l.id);
      return '<tr id="CartDrawer-Item-' + (i + 1) + '" class="cart-item" role="row">' +
        '<td class="cart-item__media" role="cell" headers="CartDrawer-ColumnProductImage"><img class="cart-item__image" src="' + esc(fotoLinha(l)) + '" decoding="async" alt="" loading="lazy" width="192" height="192"></td>' +
        '<td class="cart-item__details" role="cell" headers="CartDrawer-ColumnProduct"><a href="' + p.url + '" class="cart-item__name">' + esc(p.kurz) + '</a>' + propsHtml(l) +
        (l.qtd > 1 ? '<p class="cart-item__meta-wm4">' + l.qtd + ' × ' + brl(p.preis) + '</p>' : '') + '</td>' +
        '<td class="cart-item__totals right" role="cell" headers="CartDrawer-ColumnTotal"><span class="price price--end">' + brl(Math.round(p.preis * 100) * l.qtd / 100) + '</span></td>' +
        '<td class="cart-item__quantity" role="cell" headers="CartDrawer-ColumnQuantity">' +
        '<quantity-input class="quantity cart-quantity"><button class="quantity__button" name="minus" type="button" data-q="' + i + '" data-d="-1"' + (l.qtd <= 1 ? ' disabled' : '') + '><span class="visually-hidden">Diminuir: ' + esc(p.kurz) + '</span>' + I_MIN + '</button>' +
        '<input class="quantity__input" type="number" value="' + l.qtd + '" min="1" max="' + MAXQ + '" aria-label="Quantidade: ' + esc(p.kurz) + '" readonly>' +
        '<button class="quantity__button" name="plus" type="button" data-q="' + i + '" data-d="1"' + (l.qtd >= MAXQ ? ' disabled' : '') + '><span class="visually-hidden">Aumentar: ' + esc(p.kurz) + '</span>' + I_PLUS + '</button></quantity-input>' +
        '<cart-remove-button><button type="button" class="button button--tertiary cart-remove-wm4" data-rm="' + i + '" aria-label="Remover ' + esc(p.kurz) + '">Remover</button></cart-remove-button></td></tr>';
    }).join('');
    // oferta unica: refil de 12 fios quando ha kit e nao ha refil nem Kit Semestre
    var ids = carrinho.map(function (l) { return l.id; });
    var temKit = ids.some(function (x) { return KITS.indexOf(x) >= 0; }), oferta = temKit && ids.indexOf('refil') < 0 && ids.indexOf('semestre') < 0;
    var r = SM.produto('refil');
    $('[data-cart-upsell]').innerHTML = oferta ? '<h3>Leve junto</h3><div class="upsell-liste-wm4" data-upsell-liste><div class="upsell-wm4" data-upsell-id="refil"><img src="' + esc(SM.klein(r)) + '" decoding="async" alt="" width="128" height="128" loading="lazy"><p><span class="upsell-sm__t">' + esc(r.titel) + '</span><strong>' + brl(r.preis) + '</strong></p>' +
      '<button type="button" class="button button--secondary button--small" data-add="refil" data-upsell aria-label="Adicionar ' + esc(r.titel) + '"><span class="button__label-wm4">' + I_PLUS + 'Adicionar</span></button></div></div>' : '';
    $('[data-cart-zwischen]').textContent = brl(sub);
    $('[data-cart-versand]').textContent = n ? freteTexto(sub) : 'Calculado no checkout';
    $('[data-cart-total]').textContent = brl(sub);
  }

  /* ---------- checkout simulado (na loja: checkout da Yampi com as propriedades de cada item) ---------- */
  var coBox = $('[data-checkout-box]'), coDe = null;
  function abrirCheckout(de) {
    if (!carrinho.length) { toast('Seu carrinho está vazio.', { info: true }); return; }
    coDe = de || document.activeElement; fecharCarrinho(true);
    var sub = subtotal();
    $('[data-checkout-itens]').innerHTML = carrinho.map(function (l) { var p = SM.produto(l.id); return '<li class="checkout-sm__item"><div><p class="checkout-sm__t">' + l.qtd + ' × ' + esc(p.kurz) + '</p>' + propsHtml(l) + '</div><strong>' + brl(Math.round(p.preis * 100) * l.qtd / 100) + '</strong></li>'; }).join('');
    $('[data-co-sub]').textContent = brl(sub); $('[data-co-frete]').textContent = freteTexto(sub); $('[data-co-total]').textContent = brl(sub);
    coBox.hidden = false; document.body.classList.add('overflow-hidden');
    setTimeout(function () { var c = $('[data-checkout-zu]', coBox); if (c) c.focus(); }, 40);
  }
  function fecharCheckout() { if (!coBox || coBox.hidden) return; coBox.hidden = true; document.body.classList.remove('overflow-hidden'); if (coDe && coDe.focus && document.contains(coDe)) coDe.focus(); }
  if (coBox) coBox.addEventListener('click', function (ev) { if (ev.target === coBox || ev.target.closest('[data-checkout-zu]')) fecharCheckout(); });

  /* ---------- favoritos (no tema: app de lista de desejos) ---------- */
  function favRender() {
    $$('[data-merk-count]').forEach(function (b) { b.hidden = !favoritos.length; b.querySelector('span').textContent = favoritos.length; });
    $$('[data-merk-label]').forEach(function (l) { l.textContent = ', ' + favoritos.length + (favoritos.length === 1 ? ' item' : ' itens'); });
    $$('[data-merk]').forEach(function (b) {
      var id = b.getAttribute('data-merk'), on = favoritos.indexOf(id) >= 0, p = SM.produto(id);
      b.setAttribute('aria-pressed', String(on)); if (p) b.setAttribute('aria-label', (on ? 'Tirar ' : 'Salvar ') + p.kurz + (on ? ' dos favoritos' : ' nos favoritos'));
    });
  }
  function favAlternar(id) {
    var p = SM.produto(id), i = favoritos.indexOf(id);
    if (i >= 0) { favoritos.splice(i, 1); toast(esc(p.kurz) + ' saiu dos favoritos.', { info: true }); }
    else { favoritos.push(id); toast('<strong>' + esc(p.kurz) + '</strong> está nos seus favoritos.', { acao: 'Ver favoritos', onAcao: function () { location.href = 'colecao.html?c=todos&favoritos=1'; } }); }
    gravar(FKEY, favoritos); favRender();
  }

  /* ---------- cabecalho: altura e sombra ao rolar ---------- */
  var setHeaderH = function () { var h = $('.section-header'); if (h) document.documentElement.style.setProperty('--wm-header-h', Math.round(h.getBoundingClientRect().height) + 'px'); };
  var tickH = false;
  window.addEventListener('scroll', function () { if (tickH) return; tickH = true; requestAnimationFrame(function () { document.body.classList.toggle('is-scrolled-wm4', window.scrollY > 8); tickH = false; }); }, { passive: true });
  setHeaderH(); window.addEventListener('resize', setHeaderH);

  /* ---------- menu do celular (header-drawer) ---------- */
  var menuDe = null;
  function fecharMenus(exceto) {
    $$('header-drawer > details[open]').forEach(function (d) { if (d === exceto) return; d.classList.remove('menu-opening'); d.removeAttribute('open'); var s = d.querySelector('summary'); if (s) s.setAttribute('aria-expanded', 'false'); });
    document.body.classList.remove('overflow-hidden-tablet');
  }
  $$('header-drawer > details > summary').forEach(function (s) {
    s.setAttribute('aria-expanded', 'false');
    s.addEventListener('click', function (ev) {
      ev.preventDefault(); var d = s.parentElement, abrir = !d.hasAttribute('open');
      fecharMenus(d); fecharCarrinho(); fecharBusca();
      if (!abrir) { d.removeAttribute('open'); d.classList.remove('menu-opening'); s.setAttribute('aria-expanded', 'false'); return; }
      menuDe = s; var h = $('.section-header'); if (h) document.documentElement.style.setProperty('--header-bottom-position', Math.round(h.getBoundingClientRect().bottom) + 'px');
      d.setAttribute('open', ''); s.setAttribute('aria-expanded', 'true');
      requestAnimationFrame(function () { d.classList.add('menu-opening'); }); document.body.classList.add('overflow-hidden-tablet');
    });
  });

  /* ---------- busca com sugestoes e resultados (predictive-search do Dawn) ---------- */
  var norm = function (s) { return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
  var achar = function (q) { q = norm(q); return SM.produtos.filter(function (p) { return SM.sichtbar(p) && norm(p.titel + ' ' + p.kurz + ' ' + p.cursos.join(' ')).indexOf(q) >= 0; }); };
  function fecharBusca() { $$('[data-suche-panel]').forEach(function (pn) { if (pn.hasAttribute('data-fest') || pn.hidden) return; pn.hidden = true; var i = pn.closest('[data-suche]').querySelector('input'); if (i) i.setAttribute('aria-expanded', 'false'); }); }
  $$('[data-suche]').forEach(function (sf) {
    var inp = sf.querySelector('input'), out = sf.querySelector('[data-suche-ergebnis]'), ps = sf.closest('predictive-search'), pn = sf.querySelector('[data-suche-panel]');
    var abrir = function () { pn.hidden = false; inp.setAttribute('aria-expanded', 'true'); fecharMenus(); };
    inp.addEventListener('focus', abrir);
    inp.addEventListener('input', function () {
      abrir(); var q = inp.value.trim();
      if (q.length < 2) { out.innerHTML = ''; ps.removeAttribute('open'); return; }
      var todos = achar(q), hits = todos.slice(0, 5);
      out.innerHTML = hits.length
        ? '<div class="predictive-search__results-groups-wrapper"><div class="predictive-search__result-group"><h2 class="predictive-search__heading">Produtos</h2><ul class="predictive-search__results-list list-unstyled" role="group">' +
          hits.map(function (p, i) { return '<li class="predictive-search__list-item" role="option" id="predictive-search-option-' + i + '"><a href="' + p.url + '" class="predictive-search__item"><img class="predictive-search__image" src="' + esc(SM.klein(p)) + '" decoding="async" alt="" width="56" height="56"><div><p class="predictive-search__item-heading">' + esc(p.kurz) + '</p><span class="price">' + brl(p.preis) + '</span></div></a></li>'; }).join('') +
          '</ul><a class="predictive-search__alle-wm4" href="colecao.html?c=todos&amp;q=' + encodeURIComponent(q) + '">Ver ' + (todos.length === 1 ? '1 resultado' : 'os ' + todos.length + ' resultados') + '</a></div></div>'
        : '<p class="predictive-search__empty-wm4" role="status">Nenhum resultado para “' + esc(q) + '”. Tente um termo mais geral, como “sutura”, “pele” ou “fio”.</p>';
      ps.setAttribute('open', '');
    });
    sf.addEventListener('submit', function (ev) { ev.preventDefault(); var v = inp.value.trim(); if (!v) { inp.focus(); return; } location.href = 'colecao.html?c=todos&q=' + encodeURIComponent(v); });
  });
  document.addEventListener('click', function (ev) { if (!ev.target.closest('[data-suche-box]')) fecharBusca(); });
  var bOv = $('#busca-overlay'), bBtn = $('[data-suche-oeffnen]');
  function abrirOverlay() { if (!bOv) return; fecharMenus(); fecharCarrinho(); fecharBusca(); bOv.hidden = false; bBtn.setAttribute('aria-expanded', 'true'); document.body.classList.add('overflow-hidden'); var i = bOv.querySelector('input'); if (i) i.focus(); }
  function fecharOverlay(foco) { if (!bOv || bOv.hidden) return; bOv.hidden = true; bBtn.setAttribute('aria-expanded', 'false'); document.body.classList.remove('overflow-hidden'); var i = bOv.querySelector('input'); if (i) { i.value = ''; i.dispatchEvent(new Event('input')); } if (foco) bBtn.focus(); }
  if (bOv && bBtn) {
    bBtn.addEventListener('click', function () { bOv.hidden ? abrirOverlay() : fecharOverlay(true); });
    bOv.addEventListener('click', function (ev) { if (ev.target === bOv || ev.target.closest('[data-suche-schliessen]')) fecharOverlay(true); });
  }

  /* ---------- cliques globais ---------- */
  document.addEventListener('click', function (ev) {
    var t = ev.target;
    if (t.closest('[data-open-cart]')) { ev.preventDefault(); abrirCarrinho(t.closest('[data-open-cart]')); return; }
    if (t.closest('cart-drawer .drawer__close') || t.closest('#CartDrawer-Overlay')) { fecharCarrinho(); return; }
    if (t.closest('[data-checkout]')) { abrirCheckout(t.closest('[data-checkout]')); return; }
    var mk = t.closest('[data-merk]'); if (mk) { ev.preventDefault(); favAlternar(mk.getAttribute('data-merk')); return; }
    var h = t.closest('[data-hinweis]'); if (h) { ev.preventDefault(); toast(esc(h.getAttribute('data-hinweis')), { info: true }); return; }
    var a = t.closest('[data-add]');
    if (a) { var id = a.getAttribute('data-add'); botaoStatus(a, function () { adicionar(id, {}, { silencioso: a.hasAttribute('data-upsell') }); if (a.hasAttribute('data-upsell')) toast('<strong>' + esc(SM.produto(id).kurz) + '</strong> foi para o carrinho.'); }); return; }
    var q = t.closest('[data-q]');
    if (q) { var i = Number(q.getAttribute('data-q')), d = Number(q.getAttribute('data-d')), l = carrinho[i]; l.qtd = Math.max(1, Math.min(MAXQ, l.qtd + d)); salvar(); render();
      var nb = $('[data-q="' + i + '"][data-d="' + d + '"]:not([disabled])') || $('[data-q="' + i + '"]:not([disabled])'); if (nb) nb.focus(); return; }
    var r = t.closest('[data-rm]');
    if (r) { var j = Number(r.getAttribute('data-rm')), row = r.closest('.cart-item'); var sai = function () { remover(j); var cl = $('cart-drawer .drawer__close'); if (cl) cl.focus(); };
      if (row && !reduziert) { row.classList.add('is-removing-wm4'); setTimeout(sai, 200); } else sai(); }
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' && bOv && !bOv.hidden) { fecharOverlay(true); return; }
    if (ev.key === 'Escape' && coBox && !coBox.hidden) { fecharCheckout(); return; }
    if (ev.key === 'Escape') { var aberto = $('header-drawer > details[open]'); fecharCarrinho(); fecharFiltros(); fecharBusca(); fecharMenus(); if (aberto && menuDe) menuDe.focus(); }
    if (ev.key !== 'Tab') return;
    if (bOv && !bOv.hidden) return prender(ev, bOv.querySelector('.suche-overlay-wm4__box'));
    if (coBox && !coBox.hidden) return prender(ev, coBox.querySelector('.checkout-sm__box'));
    if (gaveta && gaveta.classList.contains('active')) return prender(ev, gaveta.querySelector('.drawer__inner'));
    var fp = $('[data-filter-panel].is-open-wm4'); if (fp) return prender(ev, fp);
  });
  document.addEventListener('error', function (ev) { var t = ev.target; if (!t || t.tagName !== 'IMG') return; t.style.visibility = 'hidden'; }, true);

  /* ---------- voltar ao topo ---------- */
  var btt = $('[data-back-to-top]'), rodape = $('.footer');
  if (btt) {
    var tick = false, ultY = 0, bttT = 0;
    window.addEventListener('scroll', function () { if (tick) return; tick = true; requestAnimationFrame(function () {
      var y = window.scrollY, longe = y >= Math.max(900, 2 * window.innerHeight);
      if (window.innerWidth < 990) { if (y < ultY - 4) { btt.hidden = !longe; clearTimeout(bttT); bttT = setTimeout(function () { btt.hidden = true; }, 2500); } else if (y > ultY + 4) btt.hidden = true; ultY = y; } else btt.hidden = !longe;
      if (rodape) document.body.classList.toggle('is-footer-wm4', rodape.getBoundingClientRect().top < window.innerHeight - 40); tick = false; }); }, { passive: true });
    btt.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduziert ? 'auto' : 'smooth' }); var m = $('#MainContent'); if (m) m.focus({ preventScroll: true }); });
  }

  /* ---------- newsletter (erro compreensivel) ---------- */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  $$('[data-newsletter]').forEach(function (f) {
    var i = f.querySelector('input[type=email]'), msg = f.querySelector('[data-newsletter-msg]');
    var mostra = function (txt, ok) { msg.hidden = false; msg.className = 'newsletter-form__message form__message ' + (ok ? 'is-success-wm4' : 'is-error-wm4'); msg.innerHTML = (ok ? I_CHECK : I_ERR) + '<span>' + esc(txt) + '</span>'; };
    f.addEventListener('submit', function (ev) {
      ev.preventDefault(); var v = i.value.trim();
      if (!v) { i.setAttribute('aria-invalid', 'true'); mostra('Digite o seu e-mail.'); i.focus(); return; }
      if (!EMAIL.test(v)) { i.setAttribute('aria-invalid', 'true'); mostra('Confira o e-mail, por exemplo: nome@email.com.'); i.focus(); return; }
      i.removeAttribute('aria-invalid'); mostra('Pronto. Enviamos uma confirmação para ' + v + '.', true); f.reset();
    });
    i.addEventListener('input', function () { if (i.getAttribute('aria-invalid')) { i.removeAttribute('aria-invalid'); msg.hidden = true; } });
  });

  /* ---------- colecao: filtros com contagem, ordenacao, filtros ativos, gaveta abaixo de 990 px ---------- */
  var painel = $('[data-filter-panel]'), overlay = $('.facets-overlay-wm4'), toggle = $('[data-filter-toggle]');
  function abrirFiltros() { if (!painel) return; painel.classList.add('is-open-wm4'); overlay.hidden = false; toggle.setAttribute('aria-expanded', 'true'); document.body.classList.add('overflow-hidden'); setTimeout(function () { var c = painel.querySelector('.facets-drawer-wm4__close'); if (c) c.focus(); }, 60); }
  function fecharFiltros() { if (!painel || !painel.classList.contains('is-open-wm4')) return; painel.classList.remove('is-open-wm4'); overlay.hidden = true; toggle.setAttribute('aria-expanded', 'false'); document.body.classList.remove('overflow-hidden'); toggle.focus(); }
  var grade = $('[data-grid]');
  if (grade) {
    var par = new URLSearchParams(location.search), busca = (par.get('q') || '').trim(), soFav = par.get('favoritos') === '1';
    var slug = par.get('c') || 'todos', col = SM.colecao(slug); if (!col) { slug = 'todos'; col = SM.colecao(slug); }
    var titulo = soFav ? 'Meus favoritos' : busca ? 'Busca' : col.name;
    $('[data-koll-titel]').textContent = titulo.replace(/\s+(\S+)$/, '\u00a0$1'); $('[data-koll-crumb]').textContent = titulo;
    $('[data-koll-text]').textContent = soFav ? 'Os produtos que você salvou. A lista fica guardada neste navegador.' : busca ? 'Resultados para “' + busca + '”.' : col.text;
    document.title = titulo + ' | SkillMed';
    var BAN = { todos: 'Kit de sutura SkillMed com estojo e instrumentais', medicina: 'Kit de sutura de medicina com estojo gravado', veterinaria: 'Kit de sutura de veterinária com estojo gravado', odontologia: 'Kit odontológico com instrumentais, modelos dentais e estojo de transporte', enfermagem: 'Simulador de punção venosa com seus acessórios', refis: 'Caixa de fios de nylon para reposição' };
    var bild = $('[data-koll-bild]');
    if (bild && BAN[slug] && !busca && !soFav) {
      var b = 'assets/img/home-v5/colecao-' + slug, im = $('[data-koll-img]');
      $('[data-koll-src-m]').setAttribute('srcset', b + '-mobile-600.webp 600w, ' + b + '-mobile-1200.webp 1200w');
      im.setAttribute('srcset', b + '-desktop-1200.webp 1200w, ' + b + '-desktop-2400.webp 2400w'); im.setAttribute('sizes', '100vw');
      im.src = b + '-desktop-1200.webp'; im.alt = BAN[slug]; bild.hidden = false; $('[data-koll-hero]').classList.add('koll-hero-sm--bild');
    }
    $$('[data-chip]').forEach(function (c) { if (!busca && !soFav && c.getAttribute('data-chip') === slug) c.setAttribute('aria-current', 'page'); });
    // chips: o ativo vai para o centro da faixa (sem rolar a pagina) e o fade so aparece se a faixa realmente rola
    (function () {
      var box = $('.koll-chips-wm4'); if (!box) return;
      var ativo = box.querySelector('[aria-current="page"]');
      var marca = function () { var rola = box.scrollWidth > box.clientWidth + 2; box.classList.toggle('is-rola-sm', rola && box.scrollLeft + box.clientWidth < box.scrollWidth - 4); };
      if (ativo && box.scrollWidth > box.clientWidth) { var rb = box.getBoundingClientRect(), rc = ativo.getBoundingClientRect(); box.scrollLeft += (rc.left + rc.width / 2) - (rb.left + rb.width / 2); }
      box.addEventListener('scroll', marca, { passive: true }); window.addEventListener('resize', marca); marca(); setTimeout(marca, 300);
    })();
    var ordem = SM.produtos.map(function (p) { return p.id; });
    var base = SM.produtos.filter(function (p) { return SM.sichtbar(p) && (slug === 'todos' || p.cursos.indexOf(slug) >= 0) && (!busca || achar(busca).indexOf(p) >= 0) && (!soFav || favoritos.indexOf(p.id) >= 0); });
    var form = $('[data-filter-form]'), sel = $('[data-sort]'), ativos = $('[data-aktive-filter]');
    if (slug !== 'todos') { var cg = form.querySelector('[data-facet="curso"]'); if (cg) cg.classList.add('is-leer-wm4'); }
    var rotulo = function (x) { return x.closest('label').querySelector('.facet-checkbox__text').textContent; };
    var passa = function (p, g, vals) { if (!vals.length) return true; return vals.some(function (v) { if (g === 'tipo') return p.tipo === v; if (g === 'curso') return p.cursos.indexOf(v) >= 0; if (g === 'preco') { var r = v.split('-').map(Number); return p.preis >= r[0] && p.preis < r[1]; } return true; }); };
    var GR = ['tipo', 'curso', 'preco'];
    var desenhar = function () {
      var esc2 = {}; GR.forEach(function (g) { esc2[g] = $$('input[name=' + g + ']:checked', form).map(function (x) { return x.value; }); });
      var sem = function (fora) { return base.filter(function (p) { return GR.every(function (g) { return g === fora || passa(p, g, esc2[g]); }); }); };
      var lista = sem(null);
      GR.forEach(function (g) {
        var pool = sem(g), algum = 0;
        $$('input[name=' + g + ']', form).forEach(function (x) { var n = pool.filter(function (p) { return passa(p, g, [x.value]); }).length; $('[data-n="' + g + ':' + x.value + '"]').textContent = n; x.closest('.facets__item').classList.toggle('is-null-wm4', !n && !x.checked); if (n) algum++; });
        var det = form.querySelector('[data-facet="' + g + '"]'); if (det && !(g === 'curso' && slug !== 'todos')) det.classList.toggle('is-leer-wm4', !algum);
      });
      var s = sel.value;
      lista.sort(function (a, b) { if (s === 'preco-asc') return a.preis - b.preis; if (s === 'preco-desc') return b.preis - a.preis; if (s === 'nome') return a.kurz.localeCompare(b.kurz, 'pt-BR'); return ordem.indexOf(a.id) - ordem.indexOf(b.id); });
      grade.innerHTML = lista.map(function (p, i) { return SM.karte(p, { sid: 'koll', anker: true, eager: i < 2 }); }).join('');
      favRender();
      var txt = lista.length === 1 ? '1 produto' : lista.length + ' produtos';
      $('[data-anzahl]').textContent = txt;
      var zg = $('[data-filter-zeigen]'); if (zg) zg.textContent = lista.length ? 'Ver ' + txt : 'Nenhum resultado';
      $('[data-leer]').hidden = lista.length > 0; grade.hidden = !lista.length;
      if (!lista.length && soFav && !$$('input:checked', form).length) { $('[data-leer-titel]').textContent = 'Você ainda não salvou nenhum produto'; $('[data-leer-text]').textContent = 'Toque no coração de um produto para guardar ele aqui.'; }
      var marcados = $$('input[type=checkbox]:checked', form);
      var fn = $('[data-filter-n]'); if (fn) { fn.hidden = !marcados.length; fn.textContent = marcados.length; }
      ativos.innerHTML = marcados.map(function (x) { return '<button type="button" class="chip-wm4" data-weg="' + x.id + '" aria-label="Tirar o filtro ' + esc(rotulo(x)) + '">' + esc(rotulo(x)) + I_CLOSE + '</button>'; }).join('') +
        (marcados.length > 1 ? '<button type="button" class="button button--tertiary" data-filter-reset>Limpar filtros</button>' : '');
    };
    form.addEventListener('change', desenhar); sel.addEventListener('change', desenhar);
    document.addEventListener('click', function (ev) {
      var w = ev.target.closest('[data-weg]'); if (w) { var cb = document.getElementById(w.getAttribute('data-weg')); if (cb) { cb.checked = false; desenhar(); var n = $('[data-weg]'); (n || sel).focus(); } return; }
      if (ev.target.closest('[data-filter-reset]')) { form.reset(); sel.value = 'recomendados'; desenhar(); return; }
      if (ev.target.closest('[data-filter-close]')) { fecharFiltros(); return; }
    });
    if (toggle) toggle.addEventListener('click', function () { if (painel.classList.contains('is-open-wm4')) fecharFiltros(); else abrirFiltros(); });
    desenhar();
    if (location.hash) { var alvo = document.getElementById(location.hash.slice(1)); if (alvo) setTimeout(function () { alvo.scrollIntoView({ block: 'center' }); }, 60); }
  }

  /* ---------- rodape no celular: Loja e Ajuda recolhidos, Politicas aberto; no desktop tudo aberto ---------- */
  (function () { var fa = $$('[data-footer-akk]'); if (!fa.length || !window.matchMedia) return; var mq = window.matchMedia('(min-width: 750px)'); function ajusta() { fa.forEach(function (d) { d.open = mq.matches; }); $$('.footer-akk-wm4').forEach(function (d) { d.open = d.open || mq.matches; }); } ajusta(); if (mq.addEventListener) mq.addEventListener('change', ajusta); })();

  /* ---------- PDP: galeria ---------- */
  var pdp = $('[data-pdp]');
  if (pdp && $('[data-galerie-track]')) {
    var track = $('[data-galerie-track]'), total = track.children.length, ativa = 0, maisDe = -1;
    var contar = function () { return $$('.product__media-item:not(.is-off-sm)', track).length; };
    var gp = $('[data-gal-prev]'), gn = $('[data-gal-next]');
    var marcar = function (i) {
      $$('[data-thumb]').forEach(function (t) { var n = Number(t.getAttribute('data-thumb')); if (n === i || (maisDe >= 0 && n === maisDe && i >= maisDe)) t.setAttribute('aria-current', 'true'); else t.removeAttribute('aria-current'); });
      $$('.product__media-item', track).forEach(function (li, j) { li.classList.toggle('is-active', i === j); });
      var c = $('[data-gal-current]'); if (c) c.textContent = i + 1;
      if (gp) gp.disabled = i === 0; if (gn) gn.disabled = i === total - 1;
      var st = $('[id^="GalleryStatus"]'); if (st) st.textContent = 'Foto ' + (i + 1) + ' de ' + total;
    };
    var tl = $('[data-galerie-thumbs] .thumbnail-list');
    var calcMais = function () {
      if (!tl) return; var lis = $$('.thumbnail-list__item:not(.is-off-sm)', tl);
      lis.forEach(function (li) { li.hidden = false; li.classList.remove('is-plus-wm4'); var x = li.querySelector('.thumb-plus-wm4'); if (x) x.remove(); });
      maisDe = -1; if (window.innerWidth < 1100 || lis.length < 3) return marcar(ativa);
      var foto = track.children[0], H = foto ? foto.getBoundingClientRect().height : 0, th = lis[0].getBoundingClientRect().height, gap = parseFloat(getComputedStyle(tl).rowGap) || 8;
      if (!H || !th) return; var cabe = Math.max(2, Math.floor((H + gap + 1) / (th + gap)));
      if (lis.length > cabe) { maisDe = cabe - 1; lis.forEach(function (li, j) { li.hidden = j > maisDe; }); lis[maisDe].classList.add('is-plus-wm4'); lis[maisDe].querySelector('.thumbnail').insertAdjacentHTML('beforeend', '<span class="thumb-plus-wm4" aria-hidden="true">+' + (lis.length - maisDe) + '</span>'); }
      marcar(ativa);
    };
    var mostrar = function (i) { i = Math.max(0, Math.min(total - 1, i)); ativa = i; marcar(i); var it = track.children[i]; if (track.scrollWidth > track.clientWidth + 2) track.scrollTo({ left: it.offsetLeft - track.offsetLeft, behavior: reduziert ? 'auto' : 'smooth' }); };
    $$('[data-thumb]').forEach(function (t) { t.addEventListener('click', function () { var n = Number(t.getAttribute('data-thumb')); if (n === maisDe && ativa >= maisDe) n = ativa + 1 < total ? ativa + 1 : maisDe; mostrar(n); }); });
    if (gp) gp.addEventListener('click', function () { mostrar(ativa - 1); });
    if (gn) gn.addEventListener('click', function () { mostrar(ativa + 1); });
    track.addEventListener('scroll', function () { var w = track.children[0].getBoundingClientRect().width || 1, i = Math.round(track.scrollLeft / w); if (i !== ativa) { ativa = i; marcar(i); } }, { passive: true });
    SM.galeriaRecalc = function () { total = contar(); if (ativa >= total) ativa = 0; calcMais(); };
    marcar(0); calcMais();
    var mT = 0; window.addEventListener('resize', function () { clearTimeout(mT); mT = setTimeout(calcMais, 120); });
    var im0 = track.children[0] && track.children[0].querySelector('img'); if (im0 && !im0.complete) im0.addEventListener('load', calcMais);
  }

  /* ---------- PDP: personalizacao (nome, curso, desenho), revisao, presente, conferencia ---------- */
  var pform = $('[data-perso]');
  if (pform) {
    var KD = SM.kitDados || { cursos: {}, galeria: { padrao: [1, 2, 6], semestre: [1, 6] }, especComum: [], uso: '' }, KDC = KD.cursos;
    var CURSO = {
      med: { nome: 'Medicina', id: 'kit', col: 'medicina', artes: 'med', ext: 'webp', artesN: 8 },
      vet: { nome: 'Veterinária', id: 'vet', col: 'veterinaria', artes: 'vet', ext: 'webp', artesN: 8 },
      odonto: { nome: 'Odontologia', id: 'odonto', col: 'odontologia', artes: 'odonto', ext: 'webp', artesN: 6, semPadrao: true },
      enf: { nome: 'Enfermagem', id: 'kit', col: 'enfermagem', artes: 'enf', ext: 'webp', artesN: 8, semPadrao: true }
    };
    var FONTES = { classica: 'Clássica', manuscrita: 'Manuscrita', moderna: 'Moderna' };
    var KNOME = { kit: 'Skillmed Sutura Pro', semestre: 'Kit Semestre Completo', estojo: 'Só o estojo inox gravado' };
    var SEM_EXTRAS = ['Caixa com 24 fios de nylon 4-0', 'Caixa de lâminas de bisturi nº 15', 'Pele simuladora extra com 6 fios'];
    var nome = $('#perso-nome'), semNome = false, focoLeg = 0, mexeu = { curso: false, desenho: false };
    var par2 = new URLSearchParams(location.search);
    if (par2.get('kit') === 'estojo') { location.replace('produto.html?id=estojo&curso=' + encodeURIComponent(par2.get('curso') || 'med')); return; }
    var marca = function (sel) { var x = $(sel); if (x) x.checked = true; };
    var ALIAS = { medicina: 'med', med: 'med', veterinaria: 'vet', vet: 'vet', odontologia: 'odonto', odonto: 'odonto', enfermagem: 'enf', enf: 'enf' };
    var cursoUrl = ALIAS[String(par2.get('curso') || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()];
    if (cursoUrl && CURSO[cursoUrl]) { marca('input[name=curso][value="' + cursoUrl + '"]'); mexeu.curso = true; }
    if (par2.get('kit') && KNOME[par2.get('kit')]) marca('input[name=kit][value="' + par2.get('kit') + '"]');
    if (par2.get('presente') === '1') { $('[data-presente]').checked = true; $('[data-msg-box]').hidden = false; }
    var nokitUl = $('[data-nokit-lista]'), nokitIco = nokitUl && nokitUl.querySelector('svg') ? nokitUl.querySelector('svg').outerHTML : '';
    var rot = function (d) { return d === '00' ? 'Padrão' : d; };
    /* quantidade 1 a 5: cada unidade tem a propria arte e o proprio nome; o curso e o mesmo da pagina */
    var units = [{ desenho: '00', nome: '', semNome: false, fonte: 'classica' }], ativo = 0, qtdEl = $('[data-qtd]'), unidsEl = $('[data-unids]');
    var guardar = function () { var d = $('input[name=desenho]:checked'); var f = $('input[name=fonte]:checked'); units[ativo] = { desenho: d ? d.value : '00', nome: nome.value, semNome: semNome, fonte: f ? f.value : 'classica' }; };
    var carregar = function (i) {
      ativo = i; var u = units[i]; marca('input[name=desenho][value="' + u.desenho + '"]'); marca('input[name=fonte][value="' + (u.fonte || 'classica') + '"]');
      nome.value = u.nome; semNome = u.semNome; nome.disabled = semNome;
      var b = $('[data-ohne-name]'); b.setAttribute('aria-pressed', String(semNome)); b.textContent = semNome ? 'Quero gravar um nome' : 'Prefiro sem nome';
      var z = $('[data-zaehler]'); z.textContent = nome.value.length + '/20'; z.classList.toggle('is-warn-sm', nome.value.length >= 17);
      nome.removeAttribute('aria-invalid'); $('#perso-nome-fehler').hidden = true;
    };
    var montarUnids = function () {
      unidsEl.hidden = units.length < 2;
      unidsEl.innerHTML = units.map(function (u, i) { return '<button type="button" data-unid="' + i + '" aria-pressed="' + (i === ativo) + '"><span>Kit ' + (i + 1) + '</span><small></small></button>'; }).join('');
    };
    var rotulosUnids = function () {
      $$('[data-unid]').forEach(function (b, i) {
        var u = units[i]; b.setAttribute('aria-pressed', String(i === ativo));
        var t = i === ativo ? (semNome ? 'Sem nome' : nome.value.trim()) : (u.semNome ? 'Sem nome' : u.nome.trim());
        b.querySelector('small').textContent = t || 'a preencher';
      });
    };
    var mudarQtd = function (n) {
      n = Math.max(1, Math.min(5, n)); guardar();
      while (units.length < n) units.push({ desenho: '00', nome: '', semNome: false, fonte: 'classica' });
      units.length = n; if (ativo >= n) ativo = n - 1;
      qtdEl.value = String(n); carregar(ativo); montarUnids(); atualizar();
    };
    var estado = function () {
      var c = $('input[name=curso]:checked').value, k = $('input[name=kit]:checked').value, dEl = $('input[name=desenho]:checked'), d = dEl ? dEl.value : '00';
      if (CURSO[c].semPadrao && (d === '00' || Number(d) > CURSO[c].artesN)) { marca('input[name=desenho][value="01"]'); d = '01'; }
      else if (Number(d) > CURSO[c].artesN) { marca('input[name=desenho][value="00"]'); d = '00'; }
      if (CURSO[c].artesN === 0) d = '';
      if ((c === 'odonto' || c === 'enf') && k === 'semestre') { marca('input[name=kit][value="kit"]'); k = 'kit'; }
      var pid = k === 'kit' ? CURSO[c].id : k;
      var fEl = $('input[name=fonte]:checked');
      return { curso: c, kit: k, desenho: d, fonte: fEl ? fEl.value : 'classica', pid: pid, preco: SM.produto(pid).preis, nome: nome.value.trim() };
    };
    var setTxt = function (sel, t) { var x = $(sel); if (x) x.textContent = t; };
    var atualizar = function () {
      var s = estado(), cn = CURSO[s.curso].nome, dc = KDC[s.curso] || KDC.med || {}, semArte = CURSO[s.curso].artesN === 0, sem = s.kit === 'semestre';
      var pastaGaleria = sem ? (s.curso === 'vet' ? '04-kit-semestre-vet' : '04-kit-semestre') : dc.pasta, presente = $('[data-presente]').checked ? SM.produto('presente').preis : 0;
      var nums = sem ? (s.curso === 'vet' ? KD.galeria.semestreVet : KD.galeria.semestre) : s.curso === 'odonto' ? KD.galeria.odonto : s.curso === 'vet' ? KD.galeria.vet : KD.galeria.padrao, nomeKit = KNOME[s.kit];
      // Kit Semestre existe apenas para Medicina e Veterinaria
      var semSemestre = s.curso === 'odonto' || s.curso === 'enf';
      $('#template--sm__main-kit-semestre').disabled = semSemestre;
      $('[data-kit-label="semestre"]').hidden = semSemestre; $('#template--sm__main-kit-semestre').hidden = semSemestre;
      $('[data-kit-preis="kit"]').textContent = brl(SM.produto(CURSO[s.curso].id).preis);
      $('[data-v-label]').textContent = nomeKit;
      var sv = $('[data-v-save]'); sv.textContent = semSemestre ? 'O Kit Semestre Completo está disponível para Medicina e Veterinária.' : sem ? sv.getAttribute('data-sem-texto') : '';
      // preco no botao do curso so onde difere do kit de Medicina
      $$('[data-kurs-preis]').forEach(function (el) { var c = el.getAttribute('data-kurs-preis'); el.textContent = brl(SM.produto(CURSO[c].id).preis); el.hidden = s.kit !== 'kit'; });
      ['odonto', 'enf'].forEach(function (c) { var radio = $('input[name=curso][value="' + c + '"]'); radio.disabled = sem; radio.closest('label').classList.toggle('is-off-sm', sem); });
      $('[data-preis]').textContent = brl(s.preco);
      var qn = units.length;
      $('[data-total]').textContent = brl(Math.round((s.preco + presente) * qn * 100) / 100);
      $('[data-sticky-preis]').textContent = brl(Math.round(s.preco * qn * 100) / 100);
      $('[data-sticky-titel]').textContent = (qn > 1 ? qn + ' × ' : '') + nomeKit + ' · ' + cn;
      setTxt('[data-medida]', 'Estojo inox 18 x 8 x 3 cm');
      $('[data-qtd-menos]').disabled = qn <= 1; $('[data-qtd-mais]').disabled = qn >= 5;
      rotulosUnids();
      $('[data-eyebrow]').textContent = (s.kit === 'estojo' ? 'Estojo para ' : 'Kit para ') + cn;
      // titulo, subtitulo e migalha do curso ativo
      var tituloH1 = sem ? 'Kit Semestre Completo' : dc.h1, sub = sem ? 'Skillmed Sutura Pro + caixa com 24 fios + lâminas nº 15 + pele simuladora extra' : dc.sub;
      setTxt('[data-h1]', tituloH1); setTxt('[data-sub]', sub); setTxt('[data-crumb-nome]', tituloH1);
      var cl = $('[data-crumb-link]'); if (cl) { cl.textContent = cn; cl.href = 'colecao.html?c=' + CURSO[s.curso].col; }
      document.title = tituloH1 + ' | SkillMed';
      setTxt('[data-kit-sub]', dc.pele ? 'Instrumentais, estojo gravado e pele de brinde' : 'Instrumentais e gravação do nome'); setTxt('[data-nutzen-laser]', dc.pele ? 'Gravação a laser grátis no estojo inox' : 'Gravação personalizada inclusa');
      var np = $('[data-nutzen-pele]'); if (np) np.hidden = !dc.pele && !sem;
      var bp = $('[data-band-pele]'); if (bp) { var bandaPele = bp.closest('.descb-wm4__band'); if (bandaPele) bandaPele.hidden = !dc.pele && !sem; }
      // passo da arte: desenhos do curso, ou aviso honesto quando o curso ainda nao tem arte
      $('[data-desenhos]').hidden = semArte; $('[data-sem-arte]').hidden = !semArte;
      $('[data-desenho-name]').textContent = semArte ? 'Sem desenho' : rot(s.desenho);
      var nt = semNome ? 'Sem nome' : (s.nome || 'Seu nome aqui');
      $('[data-lg-nome]').textContent = nt; $('[data-rv-nome]').textContent = nt;
      $('[data-lg-curso]').textContent = cn; $('[data-rv-curso]').textContent = cn;
      $('[data-lg-desenho]').textContent = semArte ? 'Sem desenho' : rot(s.desenho); $('[data-rv-desenho]').textContent = semArte ? 'sem desenho' : rot(s.desenho);
      setTxt('[data-rv-arte-prefixo]', semArte ? '' : 'Arte ');
      $('[data-rv-kit]').textContent = nomeKit;
      $('[data-schritt="1"]').classList.toggle('is-done-sm', true);
      $('[data-schritt="2"]').classList.toggle('is-done-sm', mexeu.desenho || semArte); $('[data-schritt="3"]').classList.toggle('is-done-sm', semNome || s.nome.length > 1);
      $$('[data-leg]').forEach(function (li, i) { li.classList.toggle('is-on-sm', i === focoLeg); });
      $$('[data-arte-option]').forEach(function (label) {
        var input = label.querySelector('input'), valor = input.value, disponivel = CURSO[s.curso].artesN > 0 && Number(valor) <= CURSO[s.curso].artesN && !(CURSO[s.curso].semPadrao && valor === '00');
        label.hidden = !disponivel; input.disabled = !disponivel;
        if (disponivel) {
          var img = label.querySelector('[data-arte-img]');
          img.src = 'assets/img/personalizacao/' + CURSO[s.curso].artes + '/' + valor + '-mini-v5.' + CURSO[s.curso].ext;
          img.alt = (valor === '00' ? 'Arte Padrão' : 'Arte ' + valor) + ' de ' + cn + ' aplicada ao produto';
        }
      });
      // galeria, historia visual, detalhe e descricao: tudo do curso ativo (so cenas inteiras, sem recortes repetidos)
      var src = function (pasta, n, w) { return 'assets/catalogo-v5/' + pasta + '/' + String(n).padStart(2, '0') + '-' + w + '.webp'; };
      var trocar = function (img, n, alt) { img.src = src(pastaGaleria, n, 960); img.srcset = src(pastaGaleria, n, 480) + ' 480w, ' + src(pastaGaleria, n, 960) + ' 960w'; img.alt = alt; };
      $$('.product__media-item').forEach(function (li, i) { var on = i < nums.length; li.classList.toggle('is-off-sm', !on); if (on) trocar(li.querySelector('img'), nums[i], nomeKit + ' ' + cn + ', foto ' + (i + 1)); });
      $$('.thumbnail-list__item').forEach(function (li, i) { var on = i < nums.length; li.classList.toggle('is-off-sm', !on); if (on) li.querySelector('img').src = src(pastaGaleria, nums[i], 480); });
      $$('.product-story-sm__item').forEach(function (li, i) { var on = i < nums.length; li.classList.toggle('is-off-sm', !on); if (on) { trocar(li.querySelector('img'), nums[i], nomeKit + ' ' + cn + ', cena ' + (i + 1)); var lg = li.querySelector('figcaption strong'), leg = (sem ? KD.galeria.legendasSemestre : s.curso === 'odonto' ? KD.galeria.legendasOdonto : KD.galeria.legendas || {})[nums[i]]; if (lg && leg) lg.textContent = leg; } });
      var imgLang = $('.pdx-lang__bild img'); if (imgLang) trocar(imgLang, nums[nums.length - 1], nomeKit + ' ' + cn + ', visão do conjunto');
      var imgDet = $('.pdx-specs .pdx-media img'); if (imgDet) trocar(imgDet, nums[1] || nums[0], nomeKit + ' ' + cn + ', peças do kit');
      var gt = $('[data-gal-total]'); if (gt) gt.textContent = nums.length;
      if (SM.galeriaRecalc) SM.galeriaRecalc();
      // o que vem no kit e especificacoes
      var itens = (dc.itens || []).concat(sem ? SEM_EXTRAS : []);
      if (nokitUl) nokitUl.innerHTML = itens.map(function (t) { return '<li>' + nokitIco + '<span>' + esc(t) + '</span></li>'; }).join('');
      setTxt('[data-nokit-curso]', sem ? 'Semestre' : cn);
      var corpo = $('[data-espec-corpo]');
      if (corpo) corpo.innerHTML = KD.especComum.concat([['Estojo', 'Caixa inox 18 x 8 x 3 cm com gravação a laser'], ['Personalização', dc.perso], ['Uso', KD.uso]]).map(function (r) { return '<tr><th scope="row">' + esc(r[0]) + '</th><td>' + esc(r[1]) + '</td></tr>'; }).join('');
      // descricao: para quem e e como funciona, pelo curso
      setTxt('[data-para-quem]', dc.para || '');
      setTxt('[data-como]', semArte ? 'Você digita o nome e confere a prévia. O estojo inox é gravado a laser com o nome e o curso, e o kit chega pronto para treinar.' : 'Você escolhe o curso e o desenho, digita o nome e confere a prévia. O estojo inox é gravado a laser e o kit chega pronto para treinar' + (dc.pele || sem ? ', com a pele simuladora' + (sem ? ' extra' : ' de brinde') : '') + '.');
      setTxt('[data-d2-titulo]', semArte ? 'Nome e curso gravados' : s.curso === 'enf' ? '8 artes de Enfermagem' : s.curso === 'odonto' ? '6 artes de Odontologia' : 'Padrão + 8 desenhos');
      setTxt('[data-d2-texto]', semArte ? 'Prévia do nome e curso, sem símbolo inventado.' : 'Escolha o que combina com o curso.');
      var detalhe = $('.pdx-wm4--d2 img'); if (detalhe) { var baseDetalhe = 'assets/img/personalizacao/' + CURSO[s.curso].artes + '/' + (s.curso === 'med' && s.desenho !== '00' ? '07' : (s.desenho || '01')) + '-v5.webp'; detalhe.src = baseDetalhe; detalhe.removeAttribute('srcset'); detalhe.alt = 'Gravação personalizada para ' + cn + ' com o texto Seu nome aqui'; }
      var fotoBarra = $('.sticky-atc-wm4__bild'); if (fotoBarra) fotoBarra.src = src(pastaGaleria, 1, 480);
      if (window.SMMockup) window.SMMockup.render($('[data-mock]'), {
        nome: semNome ? '' : (s.nome || 'Seu nome aqui'), curso: s.curso === 'vet' ? 'Medicina Veterinária' : cn, desenho: rot(s.desenho), fonte: s.fonte,
        desenhoUrl: (s.curso === 'med' || s.curso === 'vet') ? 'assets/img/personalizacao/artes-v5/' + s.curso + '-' + s.desenho + '.png' : ''
      });
    };
    pform.addEventListener('change', function (ev) {
      if (ev.target === qtdEl) { mudarQtd(Number(qtdEl.value)); return; }
      if (ev.target.name === 'curso') { mexeu.curso = true; focoLeg = 0; }
      if (ev.target.name === 'desenho') { mexeu.desenho = true; focoLeg = 1; }
      atualizar();
    });
    $$('input[name=kit]').forEach(function (r) { r.addEventListener('change', function () { if (r.value === 'estojo' && r.checked) { location.href = 'produto.html?id=estojo&curso=' + encodeURIComponent(estado().curso); return; } atualizar(); }); });
    nome.addEventListener('focus', function () { focoLeg = 2; atualizar(); });
    var errNome = $('#perso-nome-fehler'), errOk = $('#perso-ok-fehler'), okBox = $('[data-ok-box]'), ok = $('[data-ok]');
    nome.addEventListener('input', function () {
      nome.value = nome.value.replace(/\s{2,}/g, ' ');
      var n = nome.value.length, z = $('[data-zaehler]'); z.textContent = n + '/20'; z.classList.toggle('is-warn-sm', n >= 17);
      if (n) { nome.removeAttribute('aria-invalid'); errNome.hidden = true; }
      atualizar();
    });
    $('[data-ohne-name]').addEventListener('click', function (ev) {
      semNome = !semNome; var b = ev.currentTarget; b.setAttribute('aria-pressed', String(semNome)); b.textContent = semNome ? 'Quero gravar um nome' : 'Prefiro sem nome';
      nome.disabled = semNome; if (semNome) { nome.removeAttribute('aria-invalid'); errNome.hidden = true; }
      atualizar();
    });
    $('[data-presente]').addEventListener('change', function (ev) { $('[data-msg-box]').hidden = !ev.target.checked; atualizar(); });
    $('#perso-msg').addEventListener('input', function (ev) { var t = ev.target; $('[data-msg-zaehler]').textContent = t.value.length + '/180'; t.style.height = 'auto'; t.style.height = t.scrollHeight + 2 + 'px'; });
    ok.addEventListener('change', function () { if (ok.checked) { errOk.hidden = true; okBox.classList.remove('is-invalid-sm'); ok.removeAttribute('aria-invalid'); } });
    var rolar = function (el) { el.scrollIntoView({ block: 'center', behavior: reduziert ? 'auto' : 'smooth' }); };
    var validar = function () {
      guardar();
      for (var ui = 0; ui < units.length; ui++) { if (!units[ui].semNome && !units[ui].nome.trim()) { if (ui !== ativo) { carregar(ui); atualizar(); } break; } }
      if (!semNome && !nome.value.trim()) { nome.setAttribute('aria-invalid', 'true'); errNome.hidden = false; rolar(nome); nome.focus({ preventScroll: true }); return false; }
      if (!ok.checked) { okBox.classList.add('is-invalid-sm'); ok.setAttribute('aria-invalid', 'true'); errOk.hidden = false; rolar(okBox); ok.focus({ preventScroll: true }); return false; }
      return true;
    };
    var colocar = function () {
      guardar(); var s = estado(), m = $('#perso-msg').value.trim();
      units.forEach(function (u) {
        var d = CURSO[s.curso].artesN === 0 ? '' : CURSO[s.curso].semPadrao ? ((u.desenho === '00' || Number(u.desenho) > CURSO[s.curso].artesN) ? '01' : u.desenho) : (Number(u.desenho) > CURSO[s.curso].artesN ? '00' : u.desenho);
        var props = { 'Curso': CURSO[s.curso].nome, 'Arte': d ? rot(d) : 'Sem desenho', 'Nome para gravação': u.semNome ? 'Sem nome' : u.nome.trim(), 'Fonte': FONTES[u.fonte || 'classica'] };
        adicionar(s.pid, props, { silencioso: true });
        if ($('[data-presente]').checked) adicionar('presente', { 'Para o estojo de': props['Nome para gravação'], 'Mensagem do cartão': m || 'Sem mensagem' }, { silencioso: true });
      });
    };
    pform.addEventListener('submit', function (ev) { ev.preventDefault(); if (!validar()) return; var b = $('[data-atc]'); botaoStatus(b, function () { colocar(); abrirCheckout(b); }); });
    $('[data-in-korb]').addEventListener('click', function (ev) { if (!validar()) return; colocar(); abrirCarrinho(ev.currentTarget); });
    // barra fixa (celular e tablet): aparece quando o formulario sai da tela e leva ate ele
    var fixa = $('[data-sticky-atc]'), fixaBtn = $('[data-sticky-add]');
    fixaBtn.addEventListener('click', function () { var alvo = !semNome && !nome.value.trim() ? nome : $('[data-ok-box]'); rolar(alvo); alvo === nome ? nome.focus({ preventScroll: true }) : ok.focus({ preventScroll: true }); });
    var opcoes = $('[data-varianten]') || pform; var fixaAt = function () { var r = pform.getBoundingClientRect(), r0 = opcoes.getBoundingClientRect(), topo = Math.min(r.top, r0.top), on = r.bottom < 0 || topo > window.innerHeight; fixa.classList.toggle('is-visible', on); fixa.setAttribute('aria-hidden', String(!on)); fixaBtn.tabIndex = on ? 0 : -1; document.body.classList.toggle('has-sticky-wm4', on && window.innerWidth < 990); }, fRaf = 0;
    window.addEventListener('scroll', function () { if (fRaf) return; fRaf = requestAnimationFrame(function () { fRaf = 0; fixaAt(); }); }, { passive: true });
    unidsEl.addEventListener('click', function (ev) { var b = ev.target.closest('[data-unid]'); if (!b) return; guardar(); carregar(Number(b.getAttribute('data-unid'))); focoLeg = 1; atualizar(); });
    $('[data-qtd-menos]').addEventListener('click', function () { mudarQtd(units.length - 1); });
    $('[data-qtd-mais]').addEventListener('click', function () { mudarQtd(units.length + 1); });
    if (document.fonts && document.fonts.load) { Promise.all([document.fonts.load('48px "Great Vibes"'), document.fonts.load('500 48px Montserrat')]).then(atualizar, function () {}); }
    montarUnids(); fixaAt(); atualizar();
  }

  /* ---------- videos: so baixam perto da tela, mudos, pausam fora dela, botao de pausa (WCAG 2.2.2) ---------- */
  $$('video.sm-vid').forEach(function (v) {
    var btn = v.parentElement.querySelector('[data-vid-pp]'), manual = false;
    var set = function (tocando) { if (btn) { btn.textContent = tocando ? 'Pausar vídeo' : 'Ver vídeo'; btn.setAttribute('aria-pressed', String(!tocando)); } };
    var carregar = function () { if (!v.getAttribute('src')) v.src = v.getAttribute('data-src'); };
    var tocar = function () { carregar(); var pr = v.play(); if (pr && pr.then) pr.then(function () { set(true); }).catch(function () { set(false); }); };
    if (btn) btn.addEventListener('click', function () { if (v.paused) { manual = false; tocar(); } else { manual = true; v.pause(); set(false); } });
    set(false);
    var poupar = reduziert || (navigator.connection && navigator.connection.saveData);
    if (poupar || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting && v.paused && !manual) tocar(); else if (!x.isIntersecting && !v.paused) { v.pause(); set(false); } }); }, { rootMargin: '200px 0px', threshold: 0.25 }).observe(v);
  });

  render(); favRender();

  /* ---------- FAQ: aria-expanded e no maximo uma pergunta aberta por lista ---------- */
  document.addEventListener('toggle', function (ev) {
    var d = ev.target; if (!d || d.tagName !== 'DETAILS') return; var lista = d.closest('.faq-wm4__list, [data-akk-faq]'); if (!lista) return;
    var sm = d.querySelector('summary'); if (sm) sm.setAttribute('aria-expanded', d.open ? 'true' : 'false');
    if (d.open) lista.querySelectorAll('details[open]').forEach(function (o) { if (o !== d) o.open = false; });
  }, true);

  /* ---------- imagens lazy: .loaded quando carregam (o CSS comeca em opacity 0) ---------- */
  document.addEventListener('load', function (ev) { var t = ev.target; if (t && t.tagName === 'IMG') t.classList.add('loaded'); }, true);
  var varrer = function () { $$('img[loading="lazy"]:not(.loaded)').forEach(function (im) { if (im.complete && im.naturalWidth > 0) im.classList.add('loaded'); }); };
  varrer(); setTimeout(varrer, 300); setTimeout(varrer, 1200);
})();

/* Passada de design premium: revelacao discreta ao rolar e item de menu ativo. Fora da primeira dobra, sem tocar no LCP. */
(function () {
  try {
    var pag = location.pathname.split('/').pop() || 'index.html', q = location.search;
    document.querySelectorAll('.header__menu-item[href]').forEach(function (a) {
      var h = a.getAttribute('href'); if (!h || h.charAt(0) === '#') return;
      var alvo = h.split('#')[0], arq = alvo.split('?')[0];
      if (arq === pag && (alvo.indexOf('?') < 0 || q === alvo.slice(alvo.indexOf('?')))) a.setAttribute('aria-current', 'page');
    });
    if (!('IntersectionObserver' in window) || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    var vh = window.innerHeight, els = [];
    document.querySelectorAll('main .shopify-section:not(:first-child) :is(h2, .product-grid--wm4 > .grid__item, .kachel-wm4, .anlass-kachel-wm4)').forEach(function (el) {
      if (el.getBoundingClientRect().top > vh) els.push(el);
    });
    if (!els.length) return;
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) {
      el.style.setProperty('--sm-i', (Array.prototype.indexOf.call(el.parentNode.children, el) % 4));
      el.classList.add('sm-reveal'); io.observe(el);
    });
    document.documentElement.classList.add('sm-reveal-on');
    setTimeout(function () { els.forEach(function (el) { el.classList.add('is-in'); }); }, 8000);
  } catch (e) {}
})();
