/* Prévia: estojo fotografico novo, arte comprovada e nome atualizado ao vivo. */
(function () {
  'use strict';
  var escapeXml = function (s) { return String(s || '').replace(/[&<>"']/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
  window.SMMockup = {
    render: function (element, options) {
      if (!element) return;
      var name = (options.nome || '').trim(), course = options.curso || '';
      if (options.productKind === 'odonto') {
        element.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" role="img" aria-label="Prévia do nome para o kit de Odontologia"><rect width="1200" height="600" fill="#fff"/><image href="assets/catalogo-v5/03-kit-odonto/01-960.webp" x="350" y="0" width="500" height="470" preserveAspectRatio="xMidYMid meet"/><text data-live-engraving="true" x="600" y="555" text-anchor="middle" fill="#0A0C0D" font-family="Georgia,serif" font-size="36">' + escapeXml(name || 'Sem nome') + '</text></svg>';
        return;
      }
      var padrao = options.desenho === 'Padrão' || options.desenho === '00' || !(course === 'Medicina' || course === 'Medicina Veterinária');
      var key = course === 'Medicina' ? 'med' : course === 'Medicina Veterinária' ? 'vet' : '';
      var cab, arte, fonte = padrao ? 'Snell Roundhand,Georgia,serif' : 'Georgia,serif', ny = padrao ? 445 : 453, tam;
      if (padrao) {
        cab = key ? '<image href="assets/img/personalizacao/artes-v5/' + key + '-titulo-v6.png" x="' + (key === 'vet' ? 365 : 460) + '" y="100" width="' + (key === 'vet' ? 470 : 280) + '" height="65" preserveAspectRatio="xMidYMid meet"/>' : '<text x="600" y="150" text-anchor="middle" fill="#343738" font-family="Snell Roundhand,Georgia,serif" font-style="italic" font-size="32">' + escapeXml(course) + '</text>';
        arte = options.desenhoUrl ? '<image href="' + escapeXml(options.desenhoUrl) + '" x="450" y="180" width="300" height="205" preserveAspectRatio="xMidYMid meet" style="mix-blend-mode:multiply"/>' : '';
        tam = name.length > 16 ? 62 : 70;
      } else {
        cab = '<text x="600" y="145" text-anchor="middle" fill="#343738" font-family="Georgia,serif" font-style="italic" font-size="32">' + escapeXml(course) + '</text>';
        arte = options.desenhoUrl ? '<image href="' + escapeXml(options.desenhoUrl) + '" x="335" y="170" width="530" height="215" preserveAspectRatio="xMidYMid meet" style="mix-blend-mode:multiply"/>' : '';
        tam = name.length > 16 ? 35 : 42;
      }
      var title = 'Prévia da gravação: ' + (name || 'Sem nome') + ', ' + course + ', arte ' + options.desenho;
      element.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" role="img" aria-label="' + escapeXml(title) + '">' +
        '<image href="assets/img/personalizacao/estojo-novo-v5.webp" width="1200" height="600"/>' + cab + arte +
        '<text data-live-engraving="true" x="600" y="' + ny + '" text-anchor="middle" fill="#0A0C0D" font-family="' + fonte + '" font-style="italic" font-size="' + tam + '">' + escapeXml(name) + '</text></svg>';
      var text = element.querySelector('[data-live-engraving]');
      try { if (text.getComputedTextLength() > 900) { text.setAttribute('textLength', '900'); text.setAttribute('lengthAdjust', 'spacingAndGlyphs'); } } catch (error) { /* mede na proxima renderizacao */ }
    }
  };
})();
