/* Mockup da gravação: estojo inox visto de cima, desenhado em SVG e atualizado ao vivo.
   Uso: SMMockup.render(el, { nome, curso, desenho, desenhoUrl, marcadores }) */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  let uid = 0;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function svg(id, o) {
    const nome = (o.nome || '').trim().toUpperCase();
    const vazio = !nome;
    const curso = (o.curso || '').toUpperCase();
    const fs = nome.length > 16 ? 26 : nome.length > 12 ? 30 : 36;
    const mk = o.marcadores !== false;
    return `
<svg xmlns="${NS}" viewBox="38 38 564 312" role="img" aria-labelledby="${id}-t" class="mk">
  <title id="${id}-t">Prévia da gravação: desenho ${esc(o.desenho || '')}, nome ${esc(vazio ? 'não preenchido' : nome)}, curso ${esc(curso)}</title>
  <defs>
    <linearGradient id="${id}-aco" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f7f8fa"/><stop offset=".18" stop-color="#e3e7eb"/><stop offset=".5" stop-color="#cfd5db"/>
      <stop offset=".62" stop-color="#e8ebee"/><stop offset="1" stop-color="#bcc4cc"/>
    </linearGradient>
    <linearGradient id="${id}-borda" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a7b0b9"/><stop offset="1" stop-color="#6c7680"/></linearGradient>
    <linearGradient id="${id}-luz" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".45" stop-color="#fff" stop-opacity=".55"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/>
    </linearGradient>
    <pattern id="${id}-esc" width="640" height="3" patternUnits="userSpaceOnUse"><rect width="640" height="1" fill="#ffffff" opacity=".28"/></pattern>
    <filter id="${id}-sombra" x="-20%" y="-20%" width="140%" height="160%"><feGaussianBlur stdDeviation="14"/></filter>
    <filter id="${id}-arte" x="0" y="0" width="100%" height="100%">
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncR type="linear" slope="1.5" intercept="-.28"/><feFuncG type="linear" slope="1.5" intercept="-.28"/><feFuncB type="linear" slope="1.5" intercept="-.28"/></feComponentTransfer>
    </filter>
    <radialGradient id="${id}-fade"><stop offset=".72" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient>
    <mask id="${id}-m"><circle cx="320" cy="132" r="54" fill="url(#${id}-fade)"/></mask>
    <clipPath id="${id}-c"><circle cx="320" cy="132" r="54"/></clipPath>
  </defs>

  <rect x="40" y="48" width="560" height="300" rx="38" fill="url(#${id}-borda)"/>
  <rect x="40" y="40" width="560" height="300" rx="38" fill="url(#${id}-aco)"/>
  <rect x="40" y="40" width="560" height="300" rx="38" fill="url(#${id}-esc)"/>
  <rect x="40" y="40" width="560" height="300" rx="38" fill="url(#${id}-luz)" class="mk__luz"/>
  <rect x="58" y="58" width="524" height="264" rx="24" fill="none" stroke="#ffffff" stroke-opacity=".75" stroke-width="1.5"/>
  <rect x="59.5" y="59.5" width="521" height="261" rx="23" fill="none" stroke="#5c6670" stroke-opacity=".18"/>

  ${o.desenhoUrl ? `<g mask="url(#${id}-m)" clip-path="url(#${id}-c)" style="mix-blend-mode:multiply" opacity=".9">
    <image href="${esc(o.desenhoUrl)}" x="262" y="74" width="116" height="116" preserveAspectRatio="xMidYMid slice" filter="url(#${id}-arte)"/>
  </g>` : ''}

  <g font-family="IBM Plex Mono, Menlo, monospace" text-anchor="middle">
    ${vazio
      ? `<rect x="150" y="196" width="340" height="52" rx="8" fill="none" stroke="#5c6670" stroke-opacity=".45" stroke-dasharray="6 6"/>
         <text x="320" y="230" font-size="17" letter-spacing="3" fill="#5c6670" opacity=".8">SEU NOME APARECE AQUI</text>`
      : `<text x="320" y="${235 + 1.2}" font-size="${fs}" letter-spacing="5" fill="#ffffff" opacity=".85" class="mk__nome">${esc(nome)}</text>
         <text x="320" y="235" font-size="${fs}" letter-spacing="5" fill="#46515c" class="mk__nome">${esc(nome)}</text>`}
    <path d="M262 262h116" stroke="#46515c" stroke-opacity=".5"/>
    <text x="320" y="${292 + 1}" font-size="14" letter-spacing="7" fill="#ffffff" opacity=".8">${esc(curso)}</text>
    <text x="320" y="292" font-size="14" letter-spacing="7" fill="#55606b">${esc(curso)}</text>
  </g>

  ${mk ? `<g class="mk__pins" font-family="Figtree, Arial, sans-serif" font-weight="800" font-size="14" text-anchor="middle">
    ${[[132, '3'], [222, '1'], [287, '2']].map(([y, n]) => `<path d="M34 ${y}H66" stroke="#1859be" stroke-width="1.5" stroke-dasharray="3 3"/><circle cx="20" cy="${y}" r="14" fill="#1859be"/><text x="20" y="${y + 5}" fill="#fff">${n}</text>`).join('')}
  </g>` : ''}
</svg>`;
  }

  function fit(el) {
    el.querySelectorAll('.mk__nome').forEach((t) => {
      try { if (t.getComputedTextLength() > 440) { t.setAttribute('textLength', '440'); t.setAttribute('lengthAdjust', 'spacingAndGlyphs'); } } catch (e) { /* sem layout ainda */ }
    });
  }

  window.SMMockup = {
    render(el, o) {
      if (!el._id) el._id = 'mk' + (++uid);
      el.innerHTML = svg(el._id, o || {});
      fit(el);
    },
  };
})();
