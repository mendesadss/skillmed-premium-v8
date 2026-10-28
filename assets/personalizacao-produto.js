/* Personalizacao no proprio PDP: SKU fixo, mesmas artes comprovadas e mesmo mockup. */
(function () {
  'use strict';
  var courses={medicina:{key:'med',name:'Medicina',arts:8},veterinaria:{key:'vet',name:'Veterinária',arts:8},odontologia:{key:'odonto',name:'Odontologia',arts:6,semPadrao:true},enfermagem:{key:'enf',name:'Enfermagem',arts:8,semPadrao:true}};
  window.SMProductCustomization={mount:function(form,product,button){
    if(!form||!product.perso)return;
    var SM=window.SM,esc=SM.esc,$=function(s){return form.querySelector(s);};
    var available=product.cursos.filter(function(c){return courses[c];}),course=available[0],art='00',noName=false,font='classica',FONTS={classica:'Clássica',manuscrita:'Manuscrita',moderna:'Moderna'};
  var padraoArt=function(c){return courses[c].semPadrao?'01':(courses[c].arts?'00':'01');},rot=function(a){return a==='00'?'Padrão':a;};    var requested=new URLSearchParams(location.search).get('curso');
    available.forEach(function(c){if(requested===c||requested===courses[c].key)course=c;});
    art=padraoArt(course);
    form.hidden=false;
    $('[data-product-courses]').innerHTML=available.map(function(c){return '<label><input type="radio" name="product-course" value="'+c+'"'+(course===c?' checked':'')+'><span><b>'+courses[c].name+'</b></span></label>';}).join('');
    var name=$('#product-personal-name'),confirm=$('[data-product-personal-confirm]'),error=$('#product-personal-error');
    button.type='submit';button.setAttribute('form',form.id);button.removeAttribute('data-add');
    button.querySelector('[data-product-add-label]').textContent='Adicionar personalizado';
    function renderArts(){
      var cfg=courses[course],note=$('[data-product-art-note]');
      $('[data-product-art-title]').textContent=cfg.arts?'Escolha a arte':'Personalização do nome';
      $('[data-product-arts]').hidden=!cfg.arts;note.hidden=!!cfg.arts;
      note.textContent='Prévia de nome e curso, sem símbolo adicional.';
      $('[data-product-arts]').innerHTML=Array.from({length:cfg.arts?cfg.arts+1:0},function(_,i){return String(i).padStart(2,'0');}).filter(function(n){return !(cfg.semPadrao&&n==='00');}).map(function(n){return '<label><input type="radio" name="product-art" value="'+n+'"'+(n===art?' checked':'')+' aria-label="Arte '+rot(n)+'"><span><img src="assets/img/personalizacao/'+cfg.key+'/'+n+'-mini-v5.webp" width="300" height="150" alt="Arte '+rot(n)+' de '+cfg.name+'" loading="lazy"><i>'+rot(n)+'</i></span></label>';}).join('');
    }
    function update(){
      var cfg=courses[course],value=noName?'':name.value.trim();
      window.SMMockup.render($('[data-product-mock]'),{nome:noName?'':value||'Seu nome aqui',curso:cfg.key==='vet'?'Medicina Veterinária':cfg.name,desenho:rot(art),fonte:font,desenhoUrl:cfg.arts&&!cfg.semPadrao?'assets/img/personalizacao/artes-v5/'+cfg.key+'-'+art+'.png':'',productKind:'estojo'});
      $('[data-product-name-count]').textContent=name.value.length+'/20';
      $('[data-product-personal-summary]').textContent=cfg.name+' · '+(cfg.arts?'Arte '+rot(art):'Sem símbolo')+' · '+(noName?'Sem nome':value||'Seu nome aqui');
      confirm.checked=false;confirm.removeAttribute('aria-invalid');error.hidden=true;
      form.dispatchEvent(new CustomEvent('sm:personalization-change',{detail:{course:cfg.key,art:art}}));
    }
    form.addEventListener('change',function(ev){
      if(ev.target.name==='product-course'){course=ev.target.value;art=padraoArt(course);renderArts();update();}
      if(ev.target.name==='product-art'){art=ev.target.value;update();}
      if(ev.target.name==='product-fonte'){font=ev.target.value;update();}
      if(ev.target===confirm){error.hidden=true;confirm.removeAttribute('aria-invalid');}
    });
    name.addEventListener('input',function(){name.removeAttribute('aria-invalid');update();});
    $('[data-product-no-name]').addEventListener('click',function(ev){noName=!noName;name.disabled=noName;ev.currentTarget.setAttribute('aria-pressed',String(noName));ev.currentTarget.textContent=noName?'Quero gravar um nome':'Prefiro sem nome';update();});
    form.addEventListener('submit',function(ev){
      ev.preventDefault();var value=name.value.trim();
      if(!noName&&(!value||value.length>20)){error.textContent='Digite o nome ou escolha Prefiro sem nome.';error.hidden=false;name.setAttribute('aria-invalid','true');name.focus();return;}
      if(!confirm.checked){error.textContent='Confira a personalização e marque a confirmação antes de adicionar.';error.hidden=false;confirm.setAttribute('aria-invalid','true');confirm.focus();return;}
      var cfg=courses[course];
      document.dispatchEvent(new CustomEvent('sm:personalized-add',{detail:{id:product.id,props:{'Curso':cfg.name,'Arte':cfg.arts?rot(art):'Sem símbolo','Nome para gravação':noName?'Sem nome':value,'Fonte':FONTS[font]},origin:button}}));
    });
    renderArts();update();
    return {getState:function(){return {course:courses[course].key,art:art};}};
  }};
})();
