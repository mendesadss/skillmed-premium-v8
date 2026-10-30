/* Prévia: estojo fotografico novo, arte comprovada e nome atualizado ao vivo. */
(function () {
  'use strict';
  var escapeXml = function (s) { return String(s || '').replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
  /* Artes ORIGINAIS do dono (conjunto definitivo de 30/10/2026: 5 de Enfermagem e 5 de Odontologia). Fundo = a imagem do dono sem o placeholder
     (assets/img/personalizacao/originais-limpas/<u>.webp, tela 2:1 W x H nativa); o nome entra no mesmo centro (cx) e linha de base (y).
     w = largura maxima, fs = corpo da fonte "Classica" da arte (c), km/kd = fator para Manuscrita/Moderna, cor = cinza do tracado do dono. */
  var CLASSICAS = {
    dancing: { fam: 'Dancing Script,Snell Roundhand,cursive', peso: '400' },
    lora: { fam: 'Lora,Georgia,serif', peso: '500' },
    josefin: { fam: 'Josefin Sans,Helvetica Neue,Arial,sans-serif', peso: '400' }
  };
  var ZIP = {
    "Enfermagem|01": { u: "enf-01", W: 896, H: 448, cx: 443.5, y: 370, w: 281, c: "dancing", fs: 50.8, km: 1.12, kd: 0.66, cor: "rgb(41,42,46)" },
    "Enfermagem|02": { u: "enf-02", W: 894, H: 447, cx: 437.5, y: 366, w: 281, c: "dancing", fs: 50.8, km: 1.12, kd: 0.66, cor: "rgb(42,42,46)" },
    "Enfermagem|03": { u: "enf-03", W: 894, H: 447, cx: 451.5, y: 369, w: 281, c: "dancing", fs: 50.8, km: 1.12, kd: 0.66, cor: "rgb(42,42,46)" },
    "Enfermagem|04": { u: "enf-04", W: 916, H: 458, cx: 438.5, y: 372, w: 281, c: "dancing", fs: 50.8, km: 1.12, kd: 0.66, cor: "rgb(42,42,46)" },
    "Enfermagem|05": { u: "enf-05", W: 924, H: 462, cx: 448.5, y: 373, w: 281, c: "dancing", fs: 50.8, km: 1.12, kd: 0.66, cor: "rgb(42,42,46)" },
    "Odontologia|01": { u: "odonto-01", W: 924, H: 462, cx: 442.5, y: 373, w: 281, c: "dancing", fs: 50.8, km: 1.12, kd: 0.66, cor: "rgb(42,42,46)" },
    "Odontologia|02": { u: "odonto-02", W: 888, H: 444, cx: 431.5, y: 362, w: 281, c: "dancing", fs: 50.8, km: 1.12, kd: 0.66, cor: "rgb(42,42,46)" },
    "Odontologia|03": { u: "odonto-03", W: 926, H: 463, cx: 441.5, y: 374, w: 281, c: "dancing", fs: 50.8, km: 1.12, kd: 0.66, cor: "rgb(41,42,45)" },
    "Odontologia|04": { u: "odonto-04", W: 900, H: 450, cx: 445.5, y: 370, w: 281, c: "dancing", fs: 50.8, km: 1.12, kd: 0.66, cor: "rgb(42,43,47)" },
    "Odontologia|05": { u: "odonto-05", W: 912, H: 456, cx: 443.5, y: 372, w: 281, c: "dancing", fs: 50.8, km: 1.12, kd: 0.66, cor: "rgb(42,42,46)" }
  };
  /* Nome do CURSO desenhado como texto (Enfermagem e Odontologia): apagado da arte limpa e redesenhado na fonte escolhida.
     t = texto, c = fonte Classica da arte, caps = versalete espacado, cx = centro do original, w = largura do original, cor = tracado do dono.
     cls / manu / mod = {fs corpo, ls espacamento, base linha de base, x ancora} para Classica, Manuscrita (Great Vibes) e Moderna (Montserrat). Gerado por _fonte/limpar-30out.cjs. */
  var CURSO = {"enf-01": {"t": "Enfermagem", "c": "dancing", "caps": 0, "cor": "rgb(46,46,46)", "cx": 443.5, "w": 145, "cls": {"fs": 32.9, "ls": 0, "base": 86.7, "x": 443.2}, "manu": {"fs": 36.2, "ls": 0, "base": 87.6, "x": 441.8}, "mod": {"fs": 22.2, "ls": 0, "base": 85.6, "x": 443.3}}, "enf-02": {"t": "Enfermagem", "c": "dancing", "caps": 0, "cor": "rgb(47,47,49)", "cx": 437.5, "w": 147, "cls": {"fs": 33.3, "ls": 0, "base": 82.8, "x": 437.2}, "manu": {"fs": 36.7, "ls": 0, "base": 83.7, "x": 435.8}, "mod": {"fs": 22.5, "ls": 0, "base": 81.7, "x": 437.3}}, "enf-03": {"t": "Enfermagem", "c": "dancing", "caps": 0, "cor": "rgb(47,47,48)", "cx": 451.5, "w": 147, "cls": {"fs": 33.3, "ls": 0, "base": 85.8, "x": 451.2}, "manu": {"fs": 36.7, "ls": 0, "base": 86.7, "x": 449.8}, "mod": {"fs": 22.5, "ls": 0, "base": 84.7, "x": 451.3}}, "enf-04": {"t": "Enfermagem", "c": "dancing", "caps": 0, "cor": "rgb(47,47,48)", "cx": 438.5, "w": 147, "cls": {"fs": 33.3, "ls": 0, "base": 88.8, "x": 438.2}, "manu": {"fs": 36.7, "ls": 0, "base": 89.7, "x": 436.8}, "mod": {"fs": 22.5, "ls": 0, "base": 87.7, "x": 438.3}}, "enf-05": {"t": "Enfermagem", "c": "dancing", "caps": 0, "cor": "rgb(46,46,48)", "cx": 448.5, "w": 147, "cls": {"fs": 33.3, "ls": 0, "base": 89.8, "x": 448.2}, "manu": {"fs": 36.7, "ls": 0, "base": 90.7, "x": 446.8}, "mod": {"fs": 22.5, "ls": 0, "base": 88.7, "x": 448.3}}, "odonto-01": {"t": "Odontologia", "c": "dancing", "caps": 0, "cor": "rgb(47,47,48)", "cx": 442.5, "w": 151, "cls": {"fs": 35.6, "ls": 0, "base": 90.3, "x": 441.6}, "manu": {"fs": 39.6, "ls": 0, "base": 91.6, "x": 440.1}, "mod": {"fs": 24.3, "ls": 0, "base": 89.3, "x": 443}}, "odonto-02": {"t": "Odontologia", "c": "dancing", "caps": 0, "cor": "rgb(47,47,48)", "cx": 431.5, "w": 151, "cls": {"fs": 35.6, "ls": 0, "base": 79.3, "x": 430.6}, "manu": {"fs": 39.6, "ls": 0, "base": 80.6, "x": 429.1}, "mod": {"fs": 24.3, "ls": 0, "base": 78.3, "x": 432}}, "odonto-03": {"t": "Odontologia", "c": "dancing", "caps": 0, "cor": "rgb(47,46,48)", "cx": 441.5, "w": 151, "cls": {"fs": 35.6, "ls": 0, "base": 91.3, "x": 440.6}, "manu": {"fs": 39.6, "ls": 0, "base": 92.6, "x": 439.1}, "mod": {"fs": 24.3, "ls": 0, "base": 90.3, "x": 442}}, "odonto-04": {"t": "Odontologia", "c": "dancing", "caps": 0, "cor": "rgb(46,46,47)", "cx": 445.5, "w": 151, "cls": {"fs": 35.6, "ls": 0, "base": 87.3, "x": 444.6}, "manu": {"fs": 39.6, "ls": 0, "base": 88.6, "x": 443.1}, "mod": {"fs": 24.3, "ls": 0, "base": 86.3, "x": 446}}, "odonto-05": {"t": "Odontologia", "c": "dancing", "caps": 0, "cor": "rgb(46,46,47)", "cx": 443.5, "w": 151, "cls": {"fs": 35.6, "ls": 0, "base": 89.3, "x": 442.6}, "manu": {"fs": 39.6, "ls": 0, "base": 90.6, "x": 441.1}, "mod": {"fs": 24.3, "ls": 0, "base": 88.3, "x": 444}}};
  var ativos = [];
  if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', function () { ativos.forEach(function (a) { window.SMMockup.render(a[0], a[1]); }); });
  window.SMMockup = {
    render: function (element, options) {
      if (!element) return;
      var name = (options.nome || '').trim(), course = options.curso || '';
      var FONTES = {
        classica: { fam: null, estilo: 'italic', peso: '400', k: 1 },
        manuscrita: { fam: 'Great Vibes,Snell Roundhand,cursive', estilo: 'normal', peso: '400', k: 1.3 },
        moderna: { fam: 'Montserrat,Helvetica Neue,Arial,sans-serif', estilo: 'normal', peso: '500', k: 0.82 }
      };
      var fx = FONTES[options.fonte] || FONTES.classica;
      var zip = ZIP[course + '|' + options.desenho];
      var ativo = ativos.filter(function (a) { return a[0] === element; })[0];
      if (ativo) ativo[1] = options; else ativos.push([element, options]);
      if (zip) {
        var cl = CLASSICAS[zip.c], fk = options.fonte, fam, peso, tam;
        if (fk === 'manuscrita') { fam = 'Great Vibes,Snell Roundhand,cursive'; peso = '400'; tam = zip.fs * zip.km; }
        else if (fk === 'moderna') { fam = 'Montserrat,Helvetica Neue,Arial,sans-serif'; peso = '500'; tam = zip.fs * zip.kd; }
        else { fam = cl.fam; peso = cl.peso; tam = zip.fs; }
        element.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + zip.W + ' ' + zip.H + '" role="img" aria-label="' + escapeXml('Prévia da gravação: ' + (name || 'Sem nome') + ', ' + course + ', arte ' + options.desenho) + '">' +
          '<image href="assets/img/personalizacao/originais-limpas/' + zip.u + '.webp" width="' + zip.W + '" height="' + zip.H + '"/>' +
          '<text data-live-engraving="true" x="' + zip.cx + '" y="' + zip.y + '" text-anchor="middle" fill="' + zip.cor + '" fill-opacity=".94" font-family="' + fam + '" font-weight="' + peso + '" font-size="' + (Math.round(tam * 10) / 10) + '">' + escapeXml(name) + '</text></svg>';
        var cu = CURSO[zip.u];
        if (cu) {
          var fc = fk === 'manuscrita' ? { fam: 'Great Vibes,Snell Roundhand,cursive', peso: '400', p: cu.manu, tx: cu.t.charAt(0) + cu.t.slice(1).toLowerCase() } : fk === 'moderna' ? { fam: 'Montserrat,Helvetica Neue,Arial,sans-serif', peso: '500', p: cu.mod, tx: cu.t } : { fam: CLASSICAS[cu.c].fam, peso: CLASSICAS[cu.c].peso, p: cu.cls, tx: cu.t };
          var svgc = element.querySelector('svg');
          var tc = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          tc.setAttribute('data-live-course', 'true'); tc.setAttribute('x', fc.p.x); tc.setAttribute('y', fc.p.base); tc.setAttribute('text-anchor', 'middle');
          tc.setAttribute('fill', cu.cor); tc.setAttribute('fill-opacity', '.94'); tc.setAttribute('font-family', fc.fam); tc.setAttribute('font-weight', fc.peso);
          tc.setAttribute('font-size', fc.p.fs); if (fc.p.ls) tc.setAttribute('letter-spacing', fc.p.ls);
          tc.textContent = fc.tx; svgc.appendChild(tc);
          try { var lc = tc.getComputedTextLength(); if (lc > cu.w * 1.03) tc.setAttribute('font-size', String(Math.floor(fc.p.fs * cu.w / lc * 10) / 10)); } catch (error) { /* mede na proxima renderizacao */ }
        }
        var tz = element.querySelector('[data-live-engraving]');
        try { var lz = tz.getComputedTextLength(); if (lz > zip.w) tz.setAttribute('font-size', String(Math.max(zip.fs * 0.4, Math.floor(tam * zip.w / lz * 10) / 10))); } catch (error) { /* mede na proxima renderizacao */ }
        return;
      }
      var padrao = options.desenho === 'Padrão' || options.desenho === '00' || !(course === 'Medicina' || course === 'Medicina Veterinária');
      var key = course === 'Medicina' ? 'med' : course === 'Medicina Veterinária' ? 'vet' : '';
      var cab, arte, fonte = fx.fam || (padrao ? 'Dancing Script,Snell Roundhand,cursive' : 'Georgia,serif'), ny = padrao ? 445 : 453, tam;
      /* nome do curso como TEXTO, na mesma fonte escolhida para o nome da pessoa (Classica = cursiva do titulo original / Georgia) */
      var cf = options.fonte === 'manuscrita' ? { fam: fx.fam, st: 'normal', pe: '400' } : options.fonte === 'moderna' ? { fam: fx.fam, st: 'normal', pe: '500' } : padrao ? { fam: 'Dancing Script,Snell Roundhand,cursive', st: 'normal', pe: '400' } : { fam: 'Georgia,serif', st: 'italic', pe: '400' };
      var cfs = padrao ? (options.fonte === 'moderna' ? 40 : options.fonte === 'manuscrita' ? 58 : 56) : Math.round(32 * (options.fonte === 'manuscrita' ? 1.3 : options.fonte === 'moderna' ? 0.82 : 1));
      var cmax = padrao ? (key === 'vet' ? 470 : 280) : 520, cy = padrao ? 150 : 145;
      cab = '<text data-live-course="true" data-max="' + cmax + '" data-ajusta="' + (padrao && !options.fonte || padrao && options.fonte === 'classica' ? 1 : 0) + '" x="600" y="' + cy + '" text-anchor="middle" fill="#343738" font-family="' + cf.fam + '" font-style="' + cf.st + '" font-weight="' + cf.pe + '" font-size="' + cfs + '">' + escapeXml(course) + '</text>';
      if (padrao) {
        arte = options.desenhoUrl ? '<image href="' + escapeXml(options.desenhoUrl) + '" x="450" y="180" width="300" height="205" preserveAspectRatio="xMidYMid meet" style="mix-blend-mode:multiply"/>' : '';
        tam = name.length > 16 ? 62 : 70;
      } else {
        arte = options.desenhoUrl ? '<image href="' + escapeXml(options.desenhoUrl) + '" x="335" y="170" width="530" height="215" preserveAspectRatio="xMidYMid meet" style="mix-blend-mode:multiply"/>' : '';
        tam = name.length > 16 ? 35 : 42;
      }
      tam = Math.round(tam * fx.k);
      var title = 'Prévia da gravação: ' + (name || 'Sem nome') + ', ' + course + ', arte ' + options.desenho;
      element.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" role="img" aria-label="' + escapeXml(title) + '">' +
        '<image href="assets/img/personalizacao/estojo-novo-v5.webp" width="1200" height="600"/>' + cab + arte +
        '<text data-live-engraving="true" x="600" y="' + ny + '" text-anchor="middle" fill="#0A0C0D" font-family="' + fonte + '" font-style="' + (!fx.fam && padrao ? 'normal' : fx.estilo) + '" font-weight="' + fx.peso + '" font-size="' + tam + '">' + escapeXml(name) + '</text></svg>';
      var tcurso = element.querySelector('[data-live-course]');
      try {
        var lcs = tcurso.getComputedTextLength(), mx = Number(tcurso.getAttribute('data-max')), fz = Number(tcurso.getAttribute('font-size'));
        if (tcurso.getAttribute('data-ajusta') === '1') tcurso.setAttribute('font-size', String(Math.min(64, Math.floor(fz * mx / lcs * 10) / 10)));
        else if (lcs > mx) tcurso.setAttribute('font-size', String(Math.floor(fz * mx / lcs * 10) / 10));
      } catch (error) { /* mede na proxima renderizacao */ }
      var text = element.querySelector('[data-live-engraving]');
      try { if (text.getComputedTextLength() > 900) { text.setAttribute('textLength', '900'); text.setAttribute('lengthAdjust', 'spacingAndGlyphs'); } } catch (error) { /* mede na proxima renderizacao */ }
    }
  };
})();
