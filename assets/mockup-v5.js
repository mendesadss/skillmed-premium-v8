/* Prévia: estojo fotografico novo, arte comprovada e nome atualizado ao vivo. */
(function () {
  'use strict';
  var escapeXml = function (s) { return String(s || '').replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
  /* Artes do lote r2 (ZIP do dono). Arte limpa 1800x700 sem o placeholder (assets/img/personalizacao/artes-v5/<u>.webp);
     cx, cy = centro da area do nome, w = largura maxima, fs = corpo base, tudo em coordenadas da arte (1800x700). */
  var ZIP = {
    'Enfermagem|01': { u: 'enf-01', cx: 921, cy: 629, w: 560, fs: 78 }, 'Enfermagem|02': { u: 'enf-02', cx: 919, cy: 637, w: 550, fs: 78 },
    'Enfermagem|03': { u: 'enf-03', cx: 907, cy: 640, w: 510, fs: 75 }, 'Enfermagem|04': { u: 'enf-04', cx: 882, cy: 640, w: 560, fs: 78 },
    'Enfermagem|05': { u: 'enf-05', cx: 1281, cy: 515, w: 480, fs: 70 }, 'Enfermagem|06': { u: 'enf-06', cx: 671, cy: 529, w: 510, fs: 70 },
    'Enfermagem|07': { u: 'enf-07', cx: 704, cy: 568, w: 540, fs: 72 }, 'Enfermagem|08': { u: 'enf-08', cx: 1382, cy: 513, w: 360, fs: 52 },
    'Odontologia|02': { u: 'odonto-02', cx: 876, cy: 120, w: 700, fs: 84 }, 'Odontologia|03': { u: 'odonto-03', cx: 908, cy: 325, w: 620, fs: 70 },
    'Odontologia|04': { u: 'odonto-04', cx: 942, cy: 70, w: 560, fs: 60 }, 'Odontologia|05': { u: 'odonto-05', cx: 1140, cy: 205, w: 880, fs: 92 },
    'Odontologia|06': { u: 'odonto-06', cx: 895, cy: 110, w: 640, fs: 72 }
  };
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
        var fz = fx.fam || 'Georgia,serif';
        element.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" role="img" aria-label="' + escapeXml('Prévia da gravação: ' + (name || 'Sem nome') + ', ' + course + ', arte ' + options.desenho) + '">' +
          '<image href="assets/img/personalizacao/estojo-novo-v5.webp" width="1200" height="600"/>' +
          '<g transform="translate(160 96) scale(0.48889)"><image href="assets/img/personalizacao/artes-v5/' + zip.u + '.webp" width="1800" height="700" style="mix-blend-mode:multiply"/>' +
          '<text data-live-engraving="true" x="' + zip.cx + '" y="' + zip.cy + '" text-anchor="middle" dominant-baseline="central" fill="#0A0C0D" font-family="' + fz + '" font-style="' + fx.estilo + '" font-weight="' + fx.peso + '" font-size="' + Math.round(zip.fs * fx.k) + '">' + escapeXml(name) + '</text></g></svg>';
        var tz = element.querySelector('[data-live-engraving]');
        try { var lz = tz.getComputedTextLength(); if (lz > zip.w) tz.setAttribute('font-size', String(Math.max(20, Math.floor(zip.fs * fx.k * zip.w / lz)))); } catch (error) { /* mede na proxima renderizacao */ }
        return;
      }
      if (course === 'Odontologia') {
        /* layout do dono na horizontal: dente a esquerda, nome ao centro com linha e curso, instrumentos a direita */
        var fo = fx.fam || 'Georgia,serif', to = (name.length > 16 ? 40 : 48) * fx.k;
        element.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" role="img" aria-label="' + escapeXml('Prévia da gravação: ' + (name || 'Sem nome') + ', Odontologia') + '">' +
          '<image href="assets/img/personalizacao/estojo-novo-v5.webp" width="1200" height="600"/>' +
          '<image href="assets/img/personalizacao/artes-v5/odonto-dente.png" x="205" y="170" width="214" height="200" preserveAspectRatio="xMidYMid meet" style="mix-blend-mode:multiply"/>' +
          '<rect x="441" y="165" width="2" height="196" fill="#0A0C0D" opacity=".88"/>' +
          '<g opacity=".88"><rect x="468" y="282" width="150" height="2" fill="#0A0C0D"/><circle cx="650" cy="283" r="4" fill="#0A0C0D"/><rect x="682" y="282" width="150" height="2" fill="#0A0C0D"/></g>' +
          '<image href="assets/img/personalizacao/artes-v5/odonto-instrumentos.png" x="858" y="161" width="124" height="208" preserveAspectRatio="xMidYMid meet" style="mix-blend-mode:multiply"/>' +
          '<text data-live-engraving="true" x="650" y="262" text-anchor="middle" fill="#0A0C0D" font-family="' + fo + '" font-style="' + fx.estilo + '" font-weight="' + fx.peso + '" font-size="' + to + '">' + escapeXml(name) + '</text>' +
          '<text x="650" y="334" text-anchor="middle" fill="#343738" font-family="Georgia,serif" font-style="italic" font-size="32">Odontologia</text></svg>';
        var tx = element.querySelector('[data-live-engraving]');
        try { if (tx.getComputedTextLength() > 360) { tx.setAttribute('textLength', '360'); tx.setAttribute('lengthAdjust', 'spacingAndGlyphs'); } } catch (error) { /* mede na proxima renderizacao */ }
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
