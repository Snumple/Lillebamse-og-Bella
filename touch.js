// Shared touch controls for the games (see touch.css). A game calls
//   bellaTouch(press)
// after its own button setup; press(name, on) is told when the stick starts or stops pointing
// 'left', 'right' or 'down'. The game's own .pad buttons keep working as before.
(function(){
  'use strict';
  window.bellaTouch=function(press){
    const pad=document.querySelector('.pad'),screen=document.querySelector('.screen');
    if(!pad||!screen)return;

    const stick=document.createElement('div');stick.className='stick';stick.setAttribute('aria-hidden','true');
    const knob=document.createElement('i');stick.appendChild(knob);
    (pad.querySelector('.move')||pad).prepend(stick);
    const state={left:false,right:false,down:false};
    const set=(k,on)=>{if(state[k]!==on){state[k]=on;press(k,on)}};
    let id=null;
    function aim(e){
      const r=stick.getBoundingClientRect(),R=r.width/2-24;
      let dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);const d=Math.hypot(dx,dy);
      if(d>R){dx*=R/d;dy*=R/d}
      knob.style.transform=`translate(${dx}px,${dy}px)`;
      set('left',dx<-14);set('right',dx>14);set('down',dy>R*.6&&Math.abs(dx)<R*.7);
    }
    function release(){id=null;knob.style.transform='';set('left',false);set('right',false);set('down',false)}
    stick.addEventListener('pointerdown',e=>{e.preventDefault();id=e.pointerId;try{stick.setPointerCapture(id)}catch(_){}aim(e)});
    stick.addEventListener('pointermove',e=>{if(e.pointerId===id)aim(e)});
    ['pointerup','pointercancel','lostpointercapture'].forEach(t=>stick.addEventListener(t,e=>{if(e.pointerId===id)release()}));

    const hint=document.createElement('p');hint.className='rotate';hint.textContent='Snu skjermen på siden, så fyller spillet hele skjermen.';
    screen.before(hint);

    // in full screen the page's own "Alle spillene" link is hidden, so float one over the game
    const home=document.createElement('button');home.type='button';home.className='allgames';home.textContent='← Alle spill';
    document.body.appendChild(home);
    // The home buttons react when the finger is lifted (iPad sometimes drops the click after a touch)
    let left=false;
    function goHome(){if(left)return;left=true;setTimeout(()=>left=false,800);
      if(window.parent!==window)parent.postMessage({type:'bella-home'},'*');else location.href='index.html'}
    for(const el of[home,...document.querySelectorAll('a.home')]){
      el.addEventListener('pointerup',e=>{if(e.pointerType!=='mouse'){e.preventDefault();goHome()}});
      el.addEventListener('click',e=>{e.preventDefault();goHome()});
    }

    const cv=screen.querySelector('canvas');
    if(cv){const r=cv.width/cv.height;document.body.style.setProperty('--ratio',r.toFixed(4))}
    const coarse=matchMedia('(pointer: coarse)');
    let asked=false;
    function layout(){
      const on=coarse.matches&&innerWidth>innerHeight;
      if(on!==document.body.classList.contains('full')){document.body.classList.toggle('full',on);if(!on)asked=false;release()}
      if(!on&&document.fullscreenElement){try{document.exitFullscreen()}catch(_){}}
    }
    addEventListener('resize',layout);addEventListener('orientationchange',()=>setTimeout(layout,200));layout();
    // If iOS loses a finger-lift (it can when the screen turns or a banner pops up), a button would stay
    // held and never react again. So when no finger is on the screen any more, let go of everything.
    function releaseAll(){release();pad.querySelectorAll('button.on').forEach(b=>b.dispatchEvent(new Event('pointercancel')))}
    addEventListener('touchend',e=>{if(!e.touches.length)releaseAll()},true);
    addEventListener('touchcancel',e=>{if(!e.touches.length)releaseAll()},true);
    addEventListener('blur',releaseAll);
    document.addEventListener('visibilitychange',releaseAll);
    // Ask for real full screen on the first touch on Android. iPad and iPhone get no request: Safari's
    // full screen puts its own close buttons over the game's corner buttons and eats the first tap.
    const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
    addEventListener('pointerdown',()=>{
      if(ios||!document.body.classList.contains('full')||asked||document.fullscreenElement)return;
      asked=true;const el=document.documentElement,req=el.requestFullscreen||el.webkitRequestFullscreen;
      if(req)try{const p=req.call(el,{navigationUI:'hide'});if(p&&p.catch)p.catch(()=>{})}catch(_){}
    },true);
  };
})();
