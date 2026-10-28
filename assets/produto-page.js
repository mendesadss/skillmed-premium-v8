document.addEventListener('DOMContentLoaded', function () {
  var folders = {
    vet: '02-kit-veterinaria', odonto: '03-kit-odonto', semestre: '04-kit-semestre', estojo: '05-estojo-personalizado',
    puncao: '06-simulador-puncao', coleta: '07-simulador-coleta', dental: '08-simulador-dental', pele: '09-pele-simuladora',
    fios24: '10-fios-24', laminas: '11-laminas', fios5: '12-fios-5', peledyn: '09-pele-simuladora'
  };
  // Novas composicoes v6. As cenas antigas nao entram nas galerias refeitas.
  var galleries = { default: [1, 2, 6], vet: [1, 2, 5, 6], semestre: [1, 2, 3, 4, 5, 6], pele: [1, 2, 6], fios24: [1, 2, 6], laminas: [1, 6], fios5: [1, 6], estojo: [1, 2, 3], peledyn: [2, 1, 6] };
  var descriptions = {
    vet: 'Conjunto de treino para estudantes de Veterinária, com instrumentais, pele simuladora e organização para a rotina acadêmica.',
    odonto: 'Kit de sutura para prática odontológica, com modelos dentais, instrumentais e estojo de transporte.',
    semestre: 'Kit Sutura Pro, caixa com 24 fios de nylon 4-0, caixa de lâminas nº 15 e pele simuladora extra com 6 fios, para o semestre inteiro.',
    estojo: 'Estojo inox de 18 x 8 x 3 cm com gravação personalizada. Escolha o curso e a arte, digite o nome e confira a prévia antes de adicionar ao carrinho.',
    puncao: 'Simulador compacto para repetição de punção venosa em ambiente educacional, com acessórios apresentados na galeria.',
    coleta: 'Kit para prática educacional de coleta, com componentes organizados e vistas detalhadas do conjunto.',
    dental: 'Base com quatro modelos dentais para treino de técnicas manuais em contexto acadêmico.',
    pele: 'Pele simuladora reutilizável para prática de diferentes padrões de sutura em ambiente de ensino.',
    fios24: 'Caixa com 24 fios agulhados de nylon para reposição durante os ciclos de treino.',
    laminas: 'Conjunto com cinco lâminas nº 15 em embalagens individuais para práticas acadêmicas supervisionadas.',
    peledyn: 'Pele Simuladora Dynamic para treino de sutura em ambiente de ensino. Serve como refil de pele para continuar treinando.',
    fios5: 'Kit compacto com cinco fios de nylon 4-0 para reposição e continuidade do treino.'
  };
  var requested = new URLSearchParams(location.search).get('id');
  if (requested === 'odonto') { location.replace('kit.html?curso=odonto'); return; }
  var id = folders[requested] ? requested : 'puncao';
  var product = window.SM && window.SM.produto ? window.SM.produto(id) : null;
  if (!product) return;
  var title = product.titel;
  var price = product.preis;
  var folder = folders[id];
  var root = document.querySelector('[data-product-root]');
  document.title = title + ' | SkillMed';
  document.querySelector('[data-product-title]').textContent = title;
  document.querySelector('[data-product-crumb]').textContent = title;
  document.querySelector('[data-product-price]').textContent = window.SM.brl(price);
  document.querySelector('[data-product-installment]').textContent = 'ou 12x de ' + window.SM.brl(price / 12) + ' no cartão';
  document.querySelector('[data-product-lead]').textContent = descriptions[id];
  var detail = descriptions[id] + ' Veja a composição principal e os detalhes do produto na sequência abaixo.';
  if (id === 'semestre') {
    var parts = window.SM.semestreItens, sum = 0, names = parts.map(function (pid) { var pp = window.SM.produto(pid); sum += pp.preis; return (pid === 'kit' ? 'Kit Sutura Pro' : pid === 'pele' ? 'pele simuladora extra' : pp.kurz) + ' ' + window.SM.brl(pp.preis); });
    detail = descriptions[id] + ' Separado: ' + names.join(' + ') + ' = ' + window.SM.brl(sum) + '. No Kit Semestre: ' + window.SM.brl(price) + ', ' + window.SM.brl(sum - price) + ' a menos.';
  }
  document.querySelector('[data-product-description]').textContent = detail;
  var nums = galleries[id] || galleries.default;
  var add = document.querySelector('[data-product-add]');
  var customizer;
  if (product.perso) {
    customizer = window.SMProductCustomization.mount(document.querySelector('[data-product-customizer]'), product, add);
  } else add.setAttribute('data-add', id);
  var main = document.querySelector('[data-product-main]');
  var thumbs = document.querySelector('[data-product-thumbs]');
  var source = function (n, width) { return 'assets/catalogo-v5/' + folder + '/' + String(nums[n - 1]).padStart(2, '0') + '-' + width + '.webp'; };
  var selectedImage = 1, customizationSynced = false;
  var captionsSemestre = ['Kit Semestre Completo', 'Mesmo kit, disposição 2', 'Mesmo kit, disposição 3', 'Mesmo kit, disposição 4', 'Mesmo kit, disposição 5', 'Mesmo kit, disposição 6'];
  var captions = id === 'semestre' ? captionsSemestre : id === 'estojo' ? ['Estojo completo', 'Gravação em detalhe', 'Escala na mão'] : id === 'vet' ? ['Conjunto completo', 'Gravação em detalhe', 'Pele com pontos', 'Escala na mão'] : ['Visão principal', 'Composição complementar', 'Detalhe 1', 'Detalhe 2', 'Detalhe 3', 'Visão complementar'];
  Array.prototype.forEach.call(document.querySelectorAll('[data-product-description-image]'), function (image) {
    var number = Number(image.getAttribute('data-product-description-image'));
    if (number > nums.length) { image.closest('li').classList.add('is-off-sm'); return; }
    image.src = source(number, 960);
    image.srcset = source(number, 480) + ' 480w, ' + source(number, 960) + ' 960w';
    image.sizes = '(min-width: 990px) 31vw, (min-width: 750px) 47vw, calc(100vw - 30px)';
    image.alt = title + ', ' + captions[number - 1].toLowerCase();
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-product-description-caption]'), function (caption) {
    var number = Number(caption.getAttribute('data-product-description-caption'));
    if (number <= nums.length) caption.textContent = captions[number - 1];
  });
  var show = function (n) {
    selectedImage = n;
    main.src = source(n, 960);
    main.srcset = source(n, 480) + ' 480w, ' + source(n, 960) + ' 960w';
    main.alt = title + ', imagem ' + n;
    Array.prototype.forEach.call(thumbs.querySelectorAll('button'), function (button, index) {
      button.setAttribute('aria-current', String(index + 1 === n));
    });
  };
  var buildThumbs = function () {
    thumbs.innerHTML = '';
    for (var n = 1; n <= nums.length; n += 1) {
    (function (number) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'generic-pdp-sm__thumb';
      button.setAttribute('aria-label', 'Ver imagem ' + number + ' de ' + nums.length);
      button.innerHTML = '<img src="' + source(number, 480) + '" alt="" width="480" height="480" loading="lazy" decoding="async">';
      button.addEventListener('click', function () { show(number); });
      thumbs.appendChild(button);
    })(n);
    }
    Array.prototype.forEach.call(thumbs.querySelectorAll('button'), function (button, index) { button.setAttribute('aria-current', String(index + 1 === selectedImage)); });
  };
  buildThumbs();
  var syncCustomization = function (state) {
    var nextFolder = folder;
    var nextNums = nums;
    if (id === 'estojo') { nextFolder = '05-estojo-personalizado/opcoes/' + state.course + '-' + state.art; nextNums = (state.course === 'enf' || state.course === 'odonto') ? [1, 2] : state.art === '00' ? [1, 2, 3] : [1, 3, 6]; }
    if (id === 'semestre') { nextFolder = state.course === 'vet' ? '04-kit-semestre-vet' : '04-kit-semestre'; nextNums = state.course === 'vet' ? [1] : [1, 2, 3, 4, 5, 6]; }
    if (customizationSynced && nextFolder === folder && nextNums.join() === nums.join()) return;
    folder = nextFolder; nums = nextNums; customizationSynced = true;
    buildThumbs();
    Array.prototype.forEach.call(document.querySelectorAll('[data-product-description-image]'), function (image) {
      var number = Number(image.getAttribute('data-product-description-image')), item = image.closest('li');
      item.classList.toggle('is-off-sm', number > nums.length);
      if (number > nums.length) return;
      image.src = source(number, 960); image.srcset = source(number, 480) + ' 480w, ' + source(number, 960) + ' 960w'; image.alt = title + ', ' + captions[number - 1].toLowerCase();
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-product-description-caption]'), function (caption) {
      var number = Number(caption.getAttribute('data-product-description-caption'));
      if (number <= nums.length) caption.textContent = captions[number - 1];
    });
    if (selectedImage > nums.length) selectedImage = 1;
    show(selectedImage);
  };
  if (customizer) {
    document.querySelector('[data-product-customizer]').addEventListener('sm:personalization-change', function (event) { syncCustomization(event.detail); });
    syncCustomization(customizer.getState());
  } else show(1);
  root.setAttribute('data-product-id', id);
});
