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
      if (zip) {
        var ativo = ativos.filter(function (a) { return a[0] === element; })[0];
        if (ativo) ativo[1] = options; else ativos.push([element, options]);
        var cl = CLASSICAS[zip.c], fk = options.fonte, fam, peso, tam;
        if (fk === 'manuscrita') { fam = 'Great Vibes,Snell Roundhand,cursive'; peso = '400'; tam = zip.fs * zip.km; }
        else if (fk === 'moderna') { fam = 'Montserrat,Helvetica Neue,Arial,sans-serif'; peso = '500'; tam = zip.fs * zip.kd; }
        else { fam = cl.fam; peso = cl.peso; tam = zip.fs; }
        element.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + zip.W + ' ' + zip.H + '" role="img" aria-label="' + escapeXml('Prévia da gravação: ' + (name || 'Sem nome') + ', ' + course + ', arte ' + options.desenho) + '">' +
          '<image href="assets/img/personalizacao/originais-limpas/' + zip.u + '.webp" width="' + zip.W + '" height="' + zip.H + '"/>' +
          '<text data-live-engraving="true" x="' + zip.cx + '" y="' + zip.y + '" text-anchor="middle" fill="' + zip.cor + '" fill-opacity=".94" font-family="' + fam + '" font-weight="' + peso + '" font-size="' + (Math.round(tam * 10) / 10) + '">' + escapeXml(name) + '</text></svg>';
        var tz = element.querySelector('[data-live-engraving]');
        try { var lz = tz.getComputedTextLength(); if (lz > zip.w) tz.setAttribute('font-size', String(Math.max(zip.fs * 0.4, Math.floor(tam * zip.w / lz * 10) / 10))); } catch (error) { /* mede na proxima renderizacao */ }
        return;
      }
      var padrao = options.desenho === 'Padrão' || options.desenho === '00' || !(course === 'Medicina' || course === 'Medicina Veterinária');
      var key = course === 'Medicina' ? 'med' : course === 'Medicina Veterinária' ? 'vet' : '';
      var cab, arte, fonte = fx.fam || (padrao ? 'Snell Roundhand,Georgia,serif' : 'Georgia,serif'), ny = padrao ? 445 : 453, tam;
      if (padrao) {
        cab = key ? '<image href="assets/img/personalizacao/artes-v5/' + key + '-titulo-v6.png" x="' + (key === 'vet' ? 365 : 460) + '" y="100" width="' + (key === 'vet' ? 470 : 280) + '" height="65" preserveAspectRatio="xMidYMid meet"/>' : '<text x="600" y="150" text-anchor="middle" fill="#343738" font-family="Snell Roundhand,Georgia,serif" font-style="italic" font-size="32">' + escapeXml(course) + '</text>';
        arte = options.desenhoUrl ? '<image href="' + escapeXml(options.desenhoUrl) + '" x="450" y="180" width="300" height="205" preserveAspectRatio="xMidYMid meet" style="mix-blend-mode:multiply"/>' : '';
        tam = name.length > 16 ? 62 : 70;
      } else {
        cab = '<text x="600" y="145" text-anchor="middle" fill="#343738" font-family="Georgia,serif" font-style="italic" font-size="32">' + escapeXml(course) + '</text>';
        arte = options.desenhoUrl ? '<image href="' + escapeXml(options.desenhoUrl) + '" x="335" y="170" width="530" height="215" preserveAspectRatio="xMidYMid meet" style="mix-blend-mode:multiply"/>' : '';
        tam = name.length > 16 ? 35 : 42;
      }
      tam = Math.round(tam * fx.k);
      var title = 'Prévia da gravação: ' + (name || 'Sem nome') + ', ' + course + ', arte ' + options.desenho;
      element.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" role="img" aria-label="' + escapeXml(title) + '">' +
        '<image href="assets/img/personalizacao/estojo-novo-v5.webp" width="1200" height="600"/>' + cab + arte +
        '<text data-live-engraving="true" x="600" y="' + ny + '" text-anchor="middle" fill="#0A0C0D" font-family="' + fonte + '" font-style="' + fx.estilo + '" font-weight="' + fx.peso + '" font-size="' + tam + '">' + escapeXml(name) + '</text></svg>';
      var text = element.querySelector('[data-live-engraving]');
      try { if (text.getComputedTextLength() > 900) { text.setAttribute('textLength', '900'); text.setAttribute('lengthAdjust', 'spacingAndGlyphs'); } } catch (error) { /* mede na proxima renderizacao */ }
    }
  };
})();
