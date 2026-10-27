// Canetinha de revisão do dono. Só liga com ?revisao=1 na URL (fica ligada nas páginas seguintes até "Sair da revisão").
// Cada pedido vai para o backend temporário skillmed-revisao (Vercel Blob privado): texto, elemento, print do trecho e mídia.
(() => {
  const API = 'https://skillmed-revisao.vercel.app';
  const H2C = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
  const BLOB_CLIENTE = 'https://esm.sh/@vercel/blob@2.8.2/client';
  const script = document.currentScript;
  const VERSAO = (script && script.dataset.versao) || (location.pathname.includes('skillmed-premium-v8') ? 'skillmed-premium-v8' : location.pathname.includes('skillmed-premium-v5') ? 'skillmed-premium-v5' : 'skillmed-loja');

  const ler = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const gravar = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} };

  // A loja pode limpar a query com replaceState antes deste script rodar: vale o endereço original da navegação.
  let urlOriginal = location.href;
  try { urlOriginal = performance.getEntriesByType('navigation')[0].name || urlOriginal; } catch (e) {}
  const params = new URLSearchParams(new URL(urlOriginal).search + '&' + location.search.slice(1));
  if (params.get('revisao') === '1') gravar('skm-rev', '1');
  if (params.get('revisao') === '0') gravar('skm-rev', null);
  if (ler('skm-rev') !== '1') return;

  const paginaAtual = () => {
    const p = new URLSearchParams(location.search); p.delete('revisao');
    const arq = location.pathname.split('/').pop() || 'index.html';
    const q = p.toString();
    return arq + (q ? '?' + q : '');
  };
  let revisor = ler('skm-rev-id');
  if (!revisor) { revisor = 'r-' + Math.random().toString(36).slice(2, 12) + Date.now().toString(36); gravar('skm-rev-id', revisor); }
  let nome = ler('skm-rev-nome') || '';
  const celular = () => matchMedia('(max-width: 900px)').matches;

  // ---------- interface (shadow DOM: não herda nem quebra o CSS da loja) ----------
  const host = document.createElement('div');
  host.setAttribute('data-skm-rev', '');
  // display com !important: o Dawn esconde div:empty, e o host não tem filhos fora do shadow.
  host.style.cssText = 'display:block!important;position:absolute!important;top:0;left:0;width:0;height:0;z-index:2147483646';
  const raiz = host.attachShadow({ mode: 'open' });
  raiz.innerHTML = `
<style>
:host{all:initial}
*{box-sizing:border-box;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.barra{position:fixed;left:16px;bottom:calc(16px + env(safe-area-inset-bottom));display:flex;gap:8px;align-items:center;z-index:3}
@media (max-width:900px){.barra{bottom:calc(88px + env(safe-area-inset-bottom));left:12px}}
.bt{font:600 15px/1 inherit;border:0;border-radius:999px;padding:0 16px;height:48px;display:inline-flex;align-items:center;gap:8px;cursor:pointer;box-shadow:0 6px 20px rgba(10,20,40,.28);background:#fff;color:#0d1b2e}
.bt svg{width:20px;height:20px;flex:none}
.bt.caneta{background:#0d1b2e;color:#fff}
.bt.caneta.on{background:#e0322b}
.bt.peq{height:40px;padding:0 12px;font-size:14px}
.realce{position:absolute;pointer-events:none;border:3px solid #e0322b;border-radius:4px;background:rgba(224,50,43,.08);display:none;z-index:1}
.realce.fixo{border-style:solid;background:rgba(224,50,43,.14)}
.etq{position:absolute;top:-28px;left:-3px;background:#e0322b;color:#fff;font:600 12px/1 inherit;padding:7px 8px;border-radius:4px;white-space:nowrap}
.pino{position:absolute;width:30px;height:30px;margin:-12px 0 0 -12px;border-radius:50%;background:#e0322b;color:#fff;font:700 14px/30px inherit;text-align:center;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.35);cursor:pointer;z-index:2;padding:0}
.painel{position:fixed;z-index:4;background:#fff;color:#0d1b2e;box-shadow:0 12px 40px rgba(10,20,40,.35);display:none;flex-direction:column;gap:14px;padding:20px;overflow:auto}
.painel.on{display:flex}
@media (min-width:901px){.painel{right:20px;top:20px;width:400px;max-height:calc(100vh - 40px);border-radius:12px}}
@media (max-width:900px){.painel{left:0;right:0;bottom:0;max-height:82vh;border-radius:16px 16px 0 0;padding-bottom:calc(20px + env(safe-area-inset-bottom))}}
h2{margin:0;font-size:19px;line-height:1.2}
p{margin:0;font-size:14px;line-height:1.45;color:#3a4a60}
label{font-weight:600;font-size:14px;display:flex;flex-direction:column;gap:6px}
textarea,input[type=text]{font:16px/1.4 inherit;border:1.5px solid #c5cfdc;border-radius:8px;padding:10px 12px;width:100%;color:#0d1b2e}
textarea{min-height:110px;resize:vertical}
textarea:focus,input:focus{outline:2px solid #0d1b2e;outline-offset:1px}
.trecho{background:#f3f6fa;border-radius:8px;padding:10px 12px;font-size:13px;color:#3a4a60;display:flex;flex-direction:column;gap:8px}
.trecho b{color:#0d1b2e}
.linha{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.acoes{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap}
.btp{font:600 15px/1 inherit;height:46px;padding:0 18px;border-radius:8px;border:0;cursor:pointer}
.salvar{background:#1f8a4c;color:#fff}.salvar:disabled{opacity:.6;cursor:wait}
.cancelar{background:#eef2f7;color:#0d1b2e}
.link{background:none;border:0;color:#1d5fbf;font:600 13px/1.2 inherit;cursor:pointer;padding:4px 0;text-decoration:underline}
.arq{display:flex;flex-direction:column;gap:8px}
.rot{font-weight:600;font-size:14px}
.anexar{flex-direction:row;align-items:center;justify-content:center;gap:8px;height:46px;border:1.5px dashed #9fb0c6;border-radius:8px;color:#1d5fbf;cursor:pointer;position:relative}
.anexar svg{width:18px;height:18px}
.anexar input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%}
.anexar:focus-within{outline:2px solid #0d1b2e;outline-offset:1px}
.arq-item{display:flex;align-items:center;gap:8px;font-size:13px;background:#f3f6fa;border-radius:6px;padding:6px 8px}
.arq-item img{width:40px;height:40px;object-fit:cover;border-radius:4px}
.arq-item span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.msg{font-size:14px;font-weight:600;min-height:1em}
.msg.erro{color:#c0251e}.msg.ok{color:#1f8a4c}
.aviso{position:fixed;left:50%;transform:translateX(-50%);top:16px;background:#0d1b2e;color:#fff;padding:12px 18px;border-radius:10px;font:600 14px/1.3 inherit;z-index:5;display:none;max-width:calc(100vw - 32px);text-align:center;box-shadow:0 8px 24px rgba(0,0,0,.3)}
.lista{display:flex;flex-direction:column;gap:10px;margin:0;padding:0;list-style:none}
.lista li{border:1px solid #dfe5ee;border-radius:8px;padding:10px 12px;font-size:14px;display:flex;gap:10px}
.lista .n{flex:none;width:26px;height:26px;border-radius:50%;background:#e0322b;color:#fff;font:700 13px/26px inherit;text-align:center}
.lista a{color:#1d5fbf;font-size:12px}
.fecha{position:absolute;top:10px;right:10px;width:40px;height:40px;border:0;background:none;font-size:24px;cursor:pointer;color:#3a4a60}
</style>
<div class="realce" data-r><span class="etq" data-etq></span></div>
<div data-pinos></div>
<div class="barra">
  <button class="bt caneta" data-caneta aria-pressed="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg><span data-caneta-txt>Ligar caneta</span></button>
  <button class="bt peq" data-meus>Meus pedidos <b data-qtd>0</b></button>
</div>
<div class="aviso" role="status" aria-live="polite" data-aviso></div>
<section class="painel" data-intro role="dialog" aria-label="Como revisar">
  <h2>Modo revisão</h2>
  <p>1. Toque em <b>Ligar caneta</b>.<br>2. Toque no ponto da página que você quer mudar (foto, texto, preço, botão).<br>3. Escreva o que quer no lugar e, se tiver, anexe a foto ou o vídeo.<br>4. Toque em <b>Salvar pedido</b>. Um número vermelho marca o que você já pediu.</p>
  <p>Com a caneta desligada, a página funciona normalmente para você navegar.</p>
  <div class="acoes"><button class="btp salvar" data-intro-ok>Entendi</button></div>
</section>
<section class="painel" data-form role="dialog" aria-label="Pedido de alteração">
  <button class="fecha" data-cancelar aria-label="Fechar">×</button>
  <h2>Pedido de alteração</h2>
  <div class="trecho"><span>Trecho escolhido: <b data-tipo></b></span><span data-texto></span>
    <div class="linha"><button class="link" data-maior>Selecionar área maior</button><button class="link" data-outro>Escolher outro ponto</button></div></div>
  <label data-nome-box>Seu nome<input type="text" data-nome autocomplete="name" placeholder="Para sabermos quem pediu"></label>
  <label>O que você quer mudar aqui?<textarea data-pedido placeholder="Ex.: trocar esta foto pela do estojo aberto; mudar o preço para R$ 349,90; tirar este texto"></textarea></label>
  <div class="arq"><span class="rot">Anexar foto ou vídeo (opcional)</span><label class="anexar"><input type="file" data-arquivo accept="image/*,video/*" multiple><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m21.4 11-8.6 8.6a6 6 0 0 1-8.5-8.5l8.6-8.6a4 4 0 0 1 5.7 5.7l-8.6 8.6a2 2 0 0 1-2.8-2.8l8-8"/></svg>Escolher foto ou vídeo</label><div data-arqs></div></div>
  <div class="msg" data-msg aria-live="polite"></div>
  <div class="acoes"><button class="btp cancelar" data-cancelar>Cancelar</button><button class="btp salvar" data-salvar>Salvar pedido</button></div>
</section>
<section class="painel" data-painel-meus role="dialog" aria-label="Meus pedidos">
  <button class="fecha" data-fecha-meus aria-label="Fechar">×</button>
  <h2>Meus pedidos nesta versão</h2>
  <ul class="lista" data-lista></ul>
  <div class="acoes"><button class="btp cancelar" data-sair>Sair da revisão</button></div>
</section>`;
  const $ = (s) => raiz.querySelector(s);
  const $$ = (s) => [...raiz.querySelectorAll(s)];

  let canetaOn = false, alvo = null, arquivos = [], pedidos = [], enviando = false;

  const aviso = (t, ms = 3500) => { const a = $('[data-aviso]'); a.textContent = t; a.style.display = 'block'; clearTimeout(aviso.t); aviso.t = setTimeout(() => (a.style.display = 'none'), ms); };
  const msg = (t, tipo = '') => { const m = $('[data-msg]'); m.textContent = t; m.className = 'msg ' + tipo; };

  function setCaneta(on) {
    canetaOn = on;
    const b = $('[data-caneta]');
    b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
    $('[data-caneta-txt]').textContent = on ? 'Caneta ligada: toque no que mudar' : 'Ligar caneta';
    document.documentElement.style.cursor = on ? 'crosshair' : '';
    if (!on && !alvo) realce(null);
  }

  // ---------- escolha do elemento ----------
  const INLINE = new Set(['SPAN', 'B', 'STRONG', 'EM', 'I', 'SMALL', 'S', 'U', 'SUP', 'SUB', 'BR', 'PATH', 'USE', 'G', 'CIRCLE', 'RECT', 'LINE', 'POLYLINE', 'POLYGON']);
  function escolher(el) {
    if (el.closest && el.closest('svg')) el = el.closest('svg').parentElement || el;
    while (el && el.parentElement && el.parentElement !== document.body && INLINE.has(el.tagName.toUpperCase())) {
      const r = el.getBoundingClientRect();
      if (r.width > 120 && r.height > 32) break;
      el = el.parentElement;
    }
    return el;
  }
  // Camadas transparentes (link do banner, overlay) cobrem títulos e fotos: entre tudo que está sob o dedo,
  // vale o primeiro elemento com texto próprio ou imagem.
  const temTextoProprio = (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
  const SIGNIFICATIVO = /^(IMG|VIDEO|PICTURE|H[1-6]|P|A|BUTTON|LI|LABEL|INPUT|SELECT|TEXTAREA|FIGCAPTION|BLOCKQUOTE|TD|TH|SPAN|B|STRONG|SMALL|EM)$/;
  function sobOPonto(x, y, fallback) {
    for (const el of document.elementsFromPoint(x, y)) {
      if (dentroDaUi(el) || el === document.body || el === document.documentElement) continue;
      if (/^(IMG|VIDEO|PICTURE)$/.test(el.tagName) || (SIGNIFICATIVO.test(el.tagName) && temTextoProprio(el))) return escolher(el);
    }
    return escolher(fallback);
  }
  const dentroDaUi = (el) => el === host || (el && el.closest && el.closest('[data-skm-rev]'));

  function tipoDe(el) {
    const t = el.tagName.toLowerCase();
    if (t === 'img' || t === 'picture' || t === 'video') return 'Imagem';
    if (/^h[1-6]$/.test(t) || el.closest('h1,h2,h3,h4,h5,h6')) return 'Título';
    if (!/^(a|button)$/.test(t) && el.closest('button,[role=button]')) return 'Botão';
    if (!/^(a|button)$/.test(t) && el.closest('a')) return 'Link';
    if (t === 'p') return 'Texto';
    if (t === 'a') return 'Link';
    if (t === 'button' || el.getAttribute('role') === 'button') return 'Botão';
    if (t === 'li') return 'Item de lista';
    if (t === 'input' || t === 'select' || t === 'textarea') return 'Campo';
    if (getComputedStyle(el).backgroundImage !== 'none' && !el.innerText.trim()) return 'Imagem';
    if (t === 'section' || t === 'header' || t === 'footer' || t === 'nav') return 'Seção';
    return 'Bloco';
  }
  function seletor(el) {
    const partes = [];
    while (el && el.nodeType === 1 && el !== document.body && el !== document.documentElement) {
      if (el.id && document.querySelectorAll('#' + CSS.escape(el.id)).length === 1) { partes.unshift('#' + CSS.escape(el.id)); return partes.join(' > '); }
      let s = el.tagName.toLowerCase();
      const pai = el.parentElement;
      if (pai) { const irmaos = [...pai.children].filter((c) => c.tagName === el.tagName); if (irmaos.length > 1) s += `:nth-of-type(${irmaos.indexOf(el) + 1})`; }
      partes.unshift(s); el = pai;
    }
    return 'body > ' + partes.join(' > ');
  }
  function imagemDe(el) {
    if (el.tagName === 'IMG') return el.currentSrc || el.src;
    const im = el.querySelector && el.querySelector('img'); if (im && el.querySelectorAll('img').length === 1) return im.currentSrc || im.src;
    const m = /url\("?([^")]+)"?\)/.exec(getComputedStyle(el).backgroundImage || ''); return m ? new URL(m[1], location.href).href : '';
  }

  function realce(el, fixo = false) {
    const r = $('[data-r]');
    if (!el) { r.style.display = 'none'; return; }
    const b = el.getBoundingClientRect();
    Object.assign(r.style, { display: 'block', left: b.left + scrollX - 3 + 'px', top: b.top + scrollY - 3 + 'px', width: b.width + 6 + 'px', height: b.height + 6 + 'px' });
    r.classList.toggle('fixo', fixo);
    $('[data-etq]').textContent = tipoDe(el);
  }

  // Captura antes da loja: com a caneta ligada, o toque escolhe o elemento em vez de navegar ou abrir carrinho.
  const bloquear = (e) => { if (canetaOn && !dentroDaUi(e.target)) e.stopPropagation(); };
  ['pointerdown', 'mousedown', 'touchstart', 'pointerup', 'mouseup', 'touchend'].forEach((t) => document.addEventListener(t, bloquear, { capture: true, passive: true }));
  document.addEventListener('click', (e) => {
    if (!canetaOn || dentroDaUi(e.target)) return;
    e.preventDefault(); e.stopImmediatePropagation();
    abrirForm(e.clientX || e.clientY ? sobOPonto(e.clientX, e.clientY, e.target) : escolher(e.target));
  }, true);
  document.addEventListener('submit', (e) => { if (canetaOn) { e.preventDefault(); e.stopImmediatePropagation(); } }, true);
  document.addEventListener('pointermove', (e) => {
    if (!canetaOn || alvo || e.pointerType !== 'mouse' || dentroDaUi(e.target)) return;
    realce(sobOPonto(e.clientX, e.clientY, e.target));
  }, true);

  // ---------- formulário ----------
  function mostrarTrecho() {
    $('[data-tipo]').textContent = tipoDe(alvo);
    const t = (alvo.innerText || alvo.getAttribute('alt') || alvo.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ');
    $('[data-texto]').textContent = t ? '“' + (t.length > 140 ? t.slice(0, 140) + '…' : t) + '”' : (imagemDe(alvo) ? 'Foto ou ilustração' : '');
    realce(alvo, true);
  }
  function abrirForm(el) {
    alvo = el; arquivos = []; desenharArquivos(); msg('');
    $('[data-aviso]').style.display = 'none';
    $('[data-pedido]').value = '';
    $('[data-nome-box]').style.display = nome ? 'none' : '';
    $('[data-nome]').value = nome;
    fecharPaineis(); $('[data-form]').classList.add('on');
    mostrarTrecho();
    setTimeout(() => (nome ? $('[data-pedido]') : $('[data-nome]')).focus({ preventScroll: true }), 50);
  }
  function fecharForm() { if (enviando) return; $('[data-form]').classList.remove('on'); alvo = null; realce(null); }
  function fecharPaineis() { $$('.painel').forEach((p) => p.classList.remove('on')); }

  $('[data-maior]').onclick = () => { if (alvo && alvo.parentElement && alvo.parentElement !== document.body) { alvo = alvo.parentElement; mostrarTrecho(); } };
  $('[data-outro]').onclick = () => { fecharForm(); setCaneta(true); aviso('Toque no ponto que você quer mudar'); };
  $$('[data-cancelar]').forEach((b) => (b.onclick = fecharForm));
  $('[data-arquivo]').onchange = (e) => { arquivos = arquivos.concat([...e.target.files]).slice(0, 10); e.target.value = ''; desenharArquivos(); };
  function desenharArquivos() {
    const box = $('[data-arqs]'); box.innerHTML = '';
    arquivos.forEach((f, i) => {
      const d = document.createElement('div'); d.className = 'arq-item';
      if (f.type.startsWith('image/')) { const im = document.createElement('img'); im.src = URL.createObjectURL(f); im.alt = ''; d.append(im); }
      const s = document.createElement('span'); s.textContent = `${f.name} (${(f.size / 1048576).toFixed(1)} MB)`; d.append(s);
      const x = document.createElement('button'); x.className = 'link'; x.textContent = 'Remover'; x.onclick = () => { arquivos.splice(i, 1); desenharArquivos(); }; d.append(x);
      box.append(d);
    });
  }

  function carregarScript(src) { return new Promise((ok, erro) => { if (window.html2canvas) return ok(); const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = erro; document.head.append(s); }); }
  async function tirarPrint(el) {
    try {
      await carregarScript(H2C);
      const b = el.getBoundingClientRect(), pad = 24;
      const x = Math.max(0, b.left + scrollX - pad), y = Math.max(0, b.top + scrollY - pad);
      const w = Math.min(document.documentElement.scrollWidth - x, b.width + pad * 2), h = Math.min(1800, b.height + pad * 2);
      const tela = await Promise.race([
        window.html2canvas(document.documentElement, { x, y, width: w, height: h, scale: Math.min(devicePixelRatio || 1, 1.5), useCORS: true, logging: false, backgroundColor: '#ffffff', ignoreElements: (n) => n === host, windowWidth: document.documentElement.clientWidth }),
        new Promise((_, erro) => setTimeout(() => erro(new Error('tempo')), 12000)),
      ]);
      const c = tela.getContext('2d'), k = tela.width / w;
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.strokeStyle = '#e0322b'; c.lineWidth = 4 * k;
      c.strokeRect((b.left + scrollX - x) * k, (b.top + scrollY - y) * k, b.width * k, Math.min(b.height, h) * k);
      let q = 0.75, url = tela.toDataURL('image/jpeg', q);
      while (url.length > 2.6e6 && q > 0.3) { q -= 0.15; url = tela.toDataURL('image/jpeg', q); }
      return url.length <= 2.6e6 ? url : null;
    } catch (e) { return null; }
  }
  const nomeSeguro = (n) => n.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9.]+/g, '-').slice(-60);
  async function subirMidias(onPct) {
    if (!arquivos.length) return [];
    const { upload } = await import(BLOB_CLIENTE);
    const total = arquivos.reduce((s, f) => s + f.size, 0) || 1; let feito = 0;
    const saida = [];
    for (const f of arquivos) {
      const r = await upload(`midia/${VERSAO}/${Date.now()}-${nomeSeguro(f.name)}`, f, {
        access: 'private', handleUploadUrl: API + '/api/upload', multipart: f.size > 8 * 1048576, contentType: f.type || undefined,
        onUploadProgress: (p) => onPct(Math.round(((feito + p.loaded) / total) * 100)),
      });
      feito += f.size;
      saida.push({ pathname: r.pathname, tipo: f.type, nome: f.name, tamanho: f.size });
    }
    return saida;
  }

  $('[data-salvar]').onclick = async () => {
    if (enviando || !alvo) return;
    const texto = $('[data-pedido]').value.trim();
    if (!nome) { const n = $('[data-nome]').value.trim(); if (!n) { msg('Escreva seu nome para salvarmos o pedido.', 'erro'); $('[data-nome]').focus(); return; } nome = n; gravar('skm-rev-nome', nome); }
    if (!texto && !arquivos.length) { msg('Escreva o que você quer mudar ou anexe uma foto.', 'erro'); $('[data-pedido]').focus(); return; }
    enviando = true; const bt = $('[data-salvar]'); bt.disabled = true;
    try {
      // Posição lida junto com a rolagem: o dono pode rolar a página enquanto a mídia sobe.
      const el = alvo, b = el.getBoundingClientRect(), sx = scrollX, sy = scrollY;
      msg('Tirando o print do trecho…');
      $('[data-form]').style.visibility = 'hidden';
      const print = await tirarPrint(el);
      $('[data-form]').style.visibility = '';
      msg(arquivos.length ? 'Enviando a mídia… 0%' : 'Salvando…');
      const midia = await subirMidias((p) => msg(`Enviando a mídia… ${p}%`));
      msg('Salvando…');
      const r = await fetch(API + '/api/pedidos', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          versao: VERSAO, pagina: paginaAtual(), url: location.href.replace(/([?&])revisao=1&?/, '$1').replace(/[?&]$/, ''),
          revisor: { id: revisor, nome },
          elemento: { seletor: seletor(el), tag: el.tagName.toLowerCase(), texto: (el.innerText || el.getAttribute('alt') || '').trim().slice(0, 1500), imagem: imagemDe(el), caixa: { x: Math.round(b.left + sx), y: Math.round(b.top + sy), w: Math.round(b.width), h: Math.round(b.height) } },
          dispositivo: { largura: innerWidth, altura: innerHeight, celular: celular(), navegador: navigator.userAgent },
          pedido: texto, print, midia,
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.ok) throw new Error(d.erro || 'falha');
      enviando = false; bt.disabled = false;
      fecharForm();
      await carregarPedidos();
      aviso(`Pedido ${pedidos.length} salvo. Pode marcar o próximo ponto.`);
    } catch (e) {
      $('[data-form]').style.visibility = '';
      enviando = false; bt.disabled = false;
      msg('Não consegui salvar. Confira a internet e toque em Salvar de novo.', 'erro');
    }
  };

  // ---------- alfinetes e lista ----------
  async function carregarPedidos() {
    try {
      const r = await fetch(`${API}/api/pedidos?versao=${VERSAO}&revisor=${encodeURIComponent(revisor)}`);
      pedidos = (await r.json()).pedidos || [];
    } catch (e) { pedidos = []; }
    $('[data-qtd]').textContent = pedidos.length;
    desenharPinos();
  }
  function desenharPinos() {
    const box = $('[data-pinos]'); box.innerHTML = '';
    const aqui = paginaAtual();
    pedidos.forEach((p, i) => {
      if (p.pagina !== aqui) return;
      let el = null; try { el = document.querySelector(p.seletor); } catch (e) {}
      if (!el) return;
      const b = el.getBoundingClientRect(); if (!b.width && !b.height) return;
      const pin = document.createElement('button'); pin.className = 'pino'; pin.textContent = i + 1;
      pin.style.left = b.left + scrollX + 'px'; pin.style.top = b.top + scrollY + 'px';
      pin.setAttribute('aria-label', `Pedido ${i + 1}: ${p.pedido}`);
      pin.onclick = (e) => { e.stopPropagation(); aviso(`Pedido ${i + 1}: ${p.pedido || '(só mídia)'}`, 6000); };
      box.append(pin);
    });
  }
  function abrirMeus() {
    const ul = $('[data-lista]'); ul.innerHTML = '';
    if (!pedidos.length) { const li = document.createElement('li'); li.textContent = 'Nenhum pedido ainda. Ligue a caneta e toque no que quer mudar.'; ul.append(li); }
    pedidos.forEach((p, i) => {
      const li = document.createElement('li');
      const n = document.createElement('span'); n.className = 'n'; n.textContent = i + 1;
      const c = document.createElement('div');
      const t = document.createElement('div'); t.textContent = p.pedido || '(só mídia)';
      const a = document.createElement('a'); a.href = p.pagina; a.textContent = `${p.pagina}${p.midias ? ' · ' + p.midias + ' anexo(s)' : ''}`;
      c.append(t, a); li.append(n, c); ul.append(li);
    });
    fecharPaineis(); setCaneta(false); $('[data-painel-meus]').classList.add('on');
  }

  $('[data-caneta]').onclick = () => { if (alvo) fecharForm(); fecharPaineis(); setCaneta(!canetaOn); if (canetaOn) aviso('Toque no ponto que você quer mudar'); };
  $('[data-meus]').onclick = abrirMeus;
  $('[data-fecha-meus]').onclick = fecharPaineis;
  $('[data-sair]').onclick = () => { gravar('skm-rev', null); location.href = location.pathname + location.search.replace(/([?&])revisao=1&?/, '$1').replace(/[?&]$/, ''); };
  $('[data-intro-ok]').onclick = () => { gravar('skm-rev-intro', '1'); fecharPaineis(); setCaneta(true); aviso('Toque no ponto que você quer mudar'); };
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (alvo) fecharForm(); else if (canetaOn) setCaneta(false); fecharPaineis(); } });
  let raf; const reposicionar = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { desenharPinos(); if (alvo) realce(alvo, true); }); };
  addEventListener('resize', reposicionar); addEventListener('load', reposicionar);
  new MutationObserver(reposicionar).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });

  const iniciar = () => {
    document.body.append(host);
    if (!ler('skm-rev-intro')) $('[data-intro]').classList.add('on');
    carregarPedidos();
  };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', iniciar) : iniciar();
})();
