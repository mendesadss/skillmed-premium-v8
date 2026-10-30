/* Prévia: estojo fotografico novo, arte comprovada e nome atualizado ao vivo. */
(function () {
  'use strict';
  var escapeXml = function (s) { return String(s || '').replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
  /* Artes ORIGINAIS do dono (ZIP + horizontal anterior de Odontologia). Fundo = a imagem do dono sem o placeholder
     (assets/img/personalizacao/originais-limpas/<u>.webp, tela 2:1 W x H nativa); o nome entra no mesmo centro (cx) e linha de base (y).
     w = largura maxima, fs = corpo da fonte "Classica" da arte (c), km/kd = fator para Manuscrita/Moderna, cor = cinza do tracado do dono. */
  var CLASSICAS = {
    dancing: { fam: 'Dancing Script,Snell Roundhand,cursive', peso: '400' },
    lora: { fam: 'Lora,Georgia,serif', peso: '500' },
    josefin: { fam: 'Josefin Sans,Helvetica Neue,Arial,sans-serif', peso: '400' }
  };
  var ZIP = {
    "Enfermagem|01": { u: "enf-01", W: 628, H: 314, cx: 315, y: 264, w: 293, c: "dancing", fs: 39.1, km: 1.16, kd: 0.66, cor: "rgb(32,32,35)" },
    "Enfermagem|02": { u: "enf-02", W: 618, H: 309, cx: 313, y: 260, w: 288, c: "dancing", fs: 38.3, km: 1.16, kd: 0.66, cor: "rgb(34,34,37)" },
    "Enfermagem|03": { u: "enf-03", W: 618, H: 309, cx: 319, y: 261, w: 299, c: "dancing", fs: 39.8, km: 1.16, kd: 0.66, cor: "rgb(35,36,38)" },
    "Enfermagem|04": { u: "enf-04", W: 772, H: 386, cx: 375, y: 333, w: 373, c: "dancing", fs: 49.6, km: 1.16, kd: 0.66, cor: "rgb(22,22,24)" },
    "Enfermagem|05": { u: "enf-05", W: 538, H: 269, cx: 381, y: 191, w: 192, c: "dancing", fs: 25.5, km: 1.16, kd: 0.66, cor: "rgb(31,29,30)" },
    "Enfermagem|06": { u: "enf-06", W: 540, H: 270, cx: 193, y: 196, w: 203, c: "dancing", fs: 27, km: 1.16, kd: 0.66, cor: "rgb(28,27,28)" },
    "Enfermagem|07": { u: "enf-07", W: 538, H: 269, cx: 211, y: 202, w: 216, c: "dancing", fs: 28.8, km: 1.16, kd: 0.66, cor: "rgb(28,26,27)" },
    "Enfermagem|08": { u: "enf-08", W: 1652, H: 826, cx: 1230, y: 552, w: 522, c: "josefin", fs: 52.1, km: 1.5, kd: 0.88, cor: "rgb(37,37,38)" },
    "Odontologia|01": { u: "odonto-01", W: 1200, H: 600, cx: 680, y: 295, w: 545, c: "lora", fs: 45.5, km: 1.29, kd: 0.94, cor: "rgb(18,16,15)" },
    "Odontologia|02": { u: "odonto-02", W: 530, H: 265, cx: 256, y: 79, w: 291, c: "dancing", fs: 50.5, km: 1.13, kd: 0.67, cor: "rgb(40,37,33)" },
    "Odontologia|03": { u: "odonto-03", W: 528, H: 264, cx: 267, y: 128, w: 194, c: "lora", fs: 25.2, km: 1.5, kd: 0.9, cor: "rgb(23,20,17)" },
    "Odontologia|04": { u: "odonto-04", W: 526, H: 263, cx: 275, y: 65, w: 204, c: "lora", fs: 26.5, km: 1.5, kd: 0.9, cor: "rgb(25,21,19)" },
    "Odontologia|05": { u: "odonto-05", W: 528, H: 264, cx: 332, y: 108, w: 299, c: "dancing", fs: 51.8, km: 1.13, kd: 0.67, cor: "rgb(25,22,19)" },
    "Odontologia|06": { u: "odonto-06", W: 596, H: 298, cx: 304, y: 89, w: 213, c: "lora", fs: 27.6, km: 1.5, kd: 0.9, cor: "rgb(23,19,17)" }
  };
  /* Nome do CURSO desenhado como texto (Enfermagem e Odontologia): apagado da arte limpa e redesenhado na fonte escolhida.
     t = texto, c = fonte Classica da arte, caps = versalete espacado, cx = centro do original, w = largura do original, cor = tracado do dono.
     cls / manu / mod = {fs corpo, ls espacamento, base linha de base, x ancora} para Classica, Manuscrita (Great Vibes) e Moderna (Montserrat). Gerado por _fonte/limpar-curso.cjs. */
  var CURSO = {"enf-01": {"t": "Enfermagem", "c": "dancing", "caps": 0, "cor": "rgb(20,20,21)", "cx": 312.5, "w": 149, "cls": {"fs": 33.8, "ls": 0, "base": 64.4, "x": 312.2}, "manu": {"fs": 37.2, "ls": 0, "base": 65.3, "x": 310.8}, "mod": {"fs": 22.8, "ls": 0, "base": 63.2, "x": 312.3}}, "enf-02": {"t": "Enfermagem", "c": "dancing", "caps": 0, "cor": "rgb(20,21,22)", "cx": 314.5, "w": 155, "cls": {"fs": 35.1, "ls": 0, "base": 62.7, "x": 314.2}, "manu": {"fs": 38.7, "ls": 0, "base": 63.6, "x": 312.7}, "mod": {"fs": 23.7, "ls": 0, "base": 61.5, "x": 314.3}}, "enf-03": {"t": "Enfermagem", "c": "dancing", "caps": 0, "cor": "rgb(23,23,24)", "cx": 306.5, "w": 149, "cls": {"fs": 33.8, "ls": 0, "base": 55.4, "x": 306.2}, "manu": {"fs": 37.2, "ls": 0, "base": 56.3, "x": 304.8}, "mod": {"fs": 22.8, "ls": 0, "base": 54.2, "x": 306.3}}, "enf-04": {"t": "Enfermagem", "c": "dancing", "caps": 0, "cor": "rgb(10,10,11)", "cx": 381.5, "w": 209, "cls": {"fs": 47.4, "ls": 0, "base": 67.4, "x": 381.1}, "manu": {"fs": 52.2, "ls": 0, "base": 68.6, "x": 379.1}, "mod": {"fs": 32, "ls": 0, "base": 65.8, "x": 381.2}}, "enf-05": {"t": "Enfermagem", "c": "dancing", "caps": 0, "cor": "rgb(11,9,10)", "cx": 378, "w": 222, "cls": {"fs": 50.3, "ls": 0, "base": 137.1, "x": 377.6}, "manu": {"fs": 55.5, "ls": 0, "base": 138.4, "x": 375.4}, "mod": {"fs": 34, "ls": 0, "base": 135.3, "x": 377.7}}, "enf-06": {"t": "ENFERMAGEM", "c": "josefin", "caps": 1, "cor": "rgb(14,12,13)", "cx": 188, "w": 248, "cls": {"fs": 24.9, "ls": 7.88, "base": 132, "x": 195.9}, "manu": {"fs": 62, "ls": 0, "base": 136.8, "x": 185.1}, "mod": {"fs": 25.7, "ls": 6.48, "base": 132, "x": 194.5}}, "enf-07": {"t": "Enfermagem", "c": "dancing", "caps": 0, "cor": "rgb(11,9,9)", "cx": 178.5, "w": 225, "cls": {"fs": 51, "ls": 0, "base": 130.2, "x": 178.1}, "manu": {"fs": 56.2, "ls": 0, "base": 131.5, "x": 175.9}, "mod": {"fs": 34.4, "ls": 0, "base": 128.4, "x": 178.2}}, "enf-08": {"t": "Enfermagem", "c": "dancing", "caps": 0, "cor": "rgb(26,26,25)", "cx": 1197, "w": 700, "cls": {"fs": 158.7, "ls": 0, "base": 392.9, "x": 1195.7}, "manu": {"fs": 175, "ls": 0, "base": 397, "x": 1188.9}, "mod": {"fs": 107.1, "ls": 0, "base": 387.4, "x": 1196}}, "odonto-01": {"t": "Odontologia", "c": "lora", "caps": 0, "cor": "rgb(6,3,1)", "cx": 673, "w": 234, "cls": {"fs": 40.8, "ls": 0, "base": 374.9, "x": 672.6}, "manu": {"fs": 61.4, "ls": 0, "base": 379.1, "x": 669.3}, "mod": {"fs": 37.7, "ls": 0, "base": 375.5, "x": 673.7}}, "odonto-02": {"t": "ODONTOLOGIA", "c": "josefin", "caps": 1, "cor": "rgb(40,35,30)", "cx": 262, "w": 166, "cls": {"fs": 15.2, "ls": 4.67, "base": 217, "x": 266.5}, "manu": {"fs": 43.5, "ls": 0, "base": 221.5, "x": 259.4}, "mod": {"fs": 15.7, "ls": 4.15, "base": 217, "x": 265.8}}, "odonto-03": {"t": "ODONTOLOGIA", "c": "josefin", "caps": 1, "cor": "rgb(43,39,35)", "cx": 273, "w": 138, "cls": {"fs": 15.6, "ls": 1.56, "base": 164, "x": 274.4}, "manu": {"fs": 36.2, "ls": 0, "base": 166.3, "x": 270.8}, "mod": {"fs": 15.5, "ls": 1.55, "base": 164, "x": 274.1}}, "odonto-04": {"t": "ODONTOLOGIA", "c": "josefin", "caps": 1, "cor": "rgb(38,35,29)", "cx": 264.5, "w": 173, "cls": {"fs": 19.4, "ls": 2.12, "base": 224, "x": 266.4}, "manu": {"fs": 45.4, "ls": 0, "base": 227.5, "x": 261.7}, "mod": {"fs": 19.4, "ls": 1.94, "base": 224, "x": 265.9}}, "odonto-05": {"t": "ODONTOLOGIA", "c": "josefin", "caps": 1, "cor": "rgb(28,24,18)", "cx": 333.5, "w": 151, "cls": {"fs": 13.8, "ls": 4.25, "base": 138, "x": 337.6}, "manu": {"fs": 39.6, "ls": 0, "base": 142.1, "x": 331.1}, "mod": {"fs": 14.3, "ls": 3.79, "base": 138, "x": 336.9}}, "odonto-06": {"t": "ODONTOLOGIA", "c": "josefin", "caps": 1, "cor": "rgb(40,36,31)", "cx": 300, "w": 168, "cls": {"fs": 19, "ls": 1.9, "base": 232, "x": 301.7}, "manu": {"fs": 44, "ls": 0, "base": 234.7, "x": 297.3}, "mod": {"fs": 18.8, "ls": 1.88, "base": 232, "x": 301.4}}};
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
      var cab, arte, fonte = fx.fam || (padrao ? 'Snell Roundhand,Georgia,serif' : 'Georgia,serif'), ny = padrao ? 445 : 453, tam;
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
        '<text data-live-engraving="true" x="600" y="' + ny + '" text-anchor="middle" fill="#0A0C0D" font-family="' + fonte + '" font-style="' + fx.estilo + '" font-weight="' + fx.peso + '" font-size="' + tam + '">' + escapeXml(name) + '</text></svg>';
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
