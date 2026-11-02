// Mormor, Bella and Lillebamse's grandmother, drawn for any game page. A page calls
//   drawMormor(ctx, x, y, dir, o)
// with the feet at x,y (about 92 px tall), dir 1 facing right or -1 facing left, and o for the pose:
//   o.walk   a number that counts up while walking (swings the legs)
//   o.wave   0..1, how far the right arm is raised in a wave
//   o.hug    true for both arms open wide
//   o.talk   true for an open mouth
//   o.happy  true for smiling, closed eyes
//   o.blink  true for closed eyes
(function(){
  'use strict';
  const TAU=Math.PI*2,INK='#3a2430';
  window.drawMormor=function(X,x,y,dir,o){
    o=o||{};
    const E=(cx,cy,rx,ry,fill,st)=>{X.beginPath();X.ellipse(cx,cy,Math.max(.1,rx),Math.max(.1,ry),0,0,TAU);if(fill){X.fillStyle=fill;X.fill()}if(st)X.stroke()};
    const RR=(rx,ry,w,h,r,fill,st)=>{r=Math.min(r,w/2,h/2);X.beginPath();X.moveTo(rx+r,ry);X.arcTo(rx+w,ry,rx+w,ry+h,r);X.arcTo(rx+w,ry+h,rx,ry+h,r);X.arcTo(rx,ry+h,rx,ry,r);X.arcTo(rx,ry,rx+w,ry,r);X.closePath();if(fill){X.fillStyle=fill;X.fill()}if(st)X.stroke()};
    const skin='#f6d0b4',cardigan='#8a4ab8',cardDk='#6a3290',dress='#e86a8a',hair='#e8e4ea',hairDk='#c8c0d0',sw=o.walk?Math.sin(o.walk)*4:0;
    X.save();X.translate(x,y);X.scale(dir,1);X.lineWidth=1.6;X.strokeStyle=INK;X.lineJoin='round';X.lineCap='round';
    // legs and shoes
    RR(-9-sw,-20,7,18,3,'#d8b8a0',true);RR(3+sw,-20,7,18,3,'#d8b8a0',true);
    RR(-12-sw,-5,12,6,3,'#5a3a5a',true);RR(1+sw,-5,12,6,3,'#5a3a5a',true);
    // dress and cardigan
    X.beginPath();X.moveTo(-16,-20);X.quadraticCurveTo(-18,-38,-12,-50);X.lineTo(12,-50);X.quadraticCurveTo(18,-38,16,-20);X.closePath();X.fillStyle=dress;X.fill();X.stroke();
    for(let i=-12;i<=12;i+=8)E(i,-26,1.6,1.6,'#fff',false);
    X.beginPath();X.moveTo(-15,-30);X.quadraticCurveTo(-17,-48,-11,-58);X.lineTo(11,-58);X.quadraticCurveTo(17,-48,15,-30);X.lineTo(5,-30);X.lineTo(3,-54);X.lineTo(-3,-54);X.lineTo(-5,-30);X.closePath();X.fillStyle=cardigan;X.fill();X.stroke();
    E(-4.5,-46,1.3,1.3,'#ffd36b',false);E(-4.5,-38,1.3,1.3,'#ffd36b',false);
    // arms: the back one first, the waving one in front
    const arm=(sx,sy,a,len)=>{const ex=sx+Math.cos(a)*len,ey=sy+Math.sin(a)*len;X.lineWidth=7;X.strokeStyle=INK;X.beginPath();X.moveTo(sx,sy);X.lineTo(ex,ey);X.stroke();X.lineWidth=4.6;X.strokeStyle=cardDk;X.stroke();X.lineWidth=1.6;X.strokeStyle=INK;E(ex,ey,3.6,3.6,skin,true)};
    const wave=o.wave||0,wig=wave>.5?Math.sin((o.t||0)*.25)*.35:0;
    if(o.hug){arm(-11,-54,Math.PI+.5,17);arm(11,-54,-.5,17)}
    else{arm(-11,-54,Math.PI/2+.35+sw*.03,17);arm(11,-54,Math.PI/2-.35-wave*(2.3)+wig-sw*.03,17)}
    // neck, head and hair in a bun
    RR(-3,-62,6,6,2,skin,true);
    E(0,-82,11,4,hair,true);E(0,-92,6,5,hair,true);E(0,-92,3,2.6,hairDk,false);
    E(0,-72,13,13.5,skin,true);
    X.beginPath();X.moveTo(-13,-72);X.quadraticCurveTo(-14,-88,0,-87);X.quadraticCurveTo(14,-88,13,-72);X.quadraticCurveTo(10,-82,2,-80);X.quadraticCurveTo(-8,-84,-13,-72);X.closePath();X.fillStyle=hair;X.fill();X.stroke();
    E(-12.5,-71,3,4.5,hair,true);E(12.5,-71,3,4.5,hair,true);
    // glasses and eyes
    X.lineWidth=1.3;E(-5,-72,4,3.6,'rgba(255,255,255,.35)',true);E(5,-72,4,3.6,'rgba(255,255,255,.35)',true);X.beginPath();X.moveTo(-1,-72);X.lineTo(1,-72);X.stroke();
    if(o.happy||o.blink){for(const ex of[-5,5]){X.beginPath();X.moveTo(ex-2.2,-71.6);X.quadraticCurveTo(ex,o.happy?-74.6:-70.6,ex+2.2,-71.6);X.stroke()}}
    else for(const ex of[-5,5]){E(ex,-72,1.5,1.9,'#2a1a20',false);E(ex+.5,-72.8,.6,.6,'#fff',false)}
    // nose, cheeks, mouth
    E(0,-67.5,1.8,1.4,'#e8a890',false);
    X.globalAlpha=.55;E(-8,-65,2.8,1.8,'#ff8fab',false);E(8,-65,2.8,1.8,'#ff8fab',false);X.globalAlpha=1;
    X.lineWidth=1.4;if(o.talk)E(0,-62.8,2.6,2,'#a03a4a',true);else{X.beginPath();X.moveTo(-3.4,-63.6);X.quadraticCurveTo(0,-60.8,3.4,-63.6);X.stroke()}
    X.restore();
  };
})();
