// Morfar, Bella and Lillebamse's grandfather, drawn for any game page after the picture in Morfar.jpg:
// bald, a dark beard, a big grin, a black shirt with buttons at the neck, blue jeans and black socks.
// A page calls
//   drawMorfar(ctx, x, y, dir, o)
// with the feet at x,y (about 96 px tall), dir 1 facing right or -1 facing left, and o for the pose:
//   o.walk   a number that counts up while walking (swings the legs)
//   o.wave   0..1, how far the right arm is raised in a wave
//   o.hug    true for both arms open wide
//   o.snack  true for holding a pastry up in the right hand, like in the picture
//   o.talk   true for an open mouth
//   o.happy  true for smiling, closed eyes
//   o.blink  true for closed eyes
//   o.t      a frame counter, used to wiggle the waving hand
(function(){
  'use strict';
  const TAU=Math.PI*2,INK='#2a2024';
  window.drawMorfar=function(X,x,y,dir,o){
    o=o||{};
    const E=(cx,cy,rx,ry,fill,st)=>{X.beginPath();X.ellipse(cx,cy,Math.max(.1,rx),Math.max(.1,ry),0,0,TAU);if(fill){X.fillStyle=fill;X.fill()}if(st)X.stroke()};
    const RR=(rx,ry,w,h,r,fill,st)=>{r=Math.min(r,w/2,h/2);X.beginPath();X.moveTo(rx+r,ry);X.arcTo(rx+w,ry,rx+w,ry+h,r);X.arcTo(rx+w,ry+h,rx,ry+h,r);X.arcTo(rx,ry+h,rx,ry,r);X.arcTo(rx,ry,rx+w,ry,r);X.closePath();if(fill){X.fillStyle=fill;X.fill()}if(st)X.stroke()};
    const skin='#f0c49c',skinDk='#dca27c',shirt='#25232a',under='#55535a',jeans='#3a5680',jeansDk='#2c4466',beard='#3a2a22',sw=o.walk?Math.sin(o.walk)*4:0;
    X.save();X.translate(x,y);X.scale(dir,1);X.lineWidth=1.6;X.strokeStyle=INK;X.lineJoin='round';X.lineCap='round';
    // jeans and black socks
    RR(-13-sw,-38,11,34,4,jeans,true);RR(2+sw,-38,11,34,4,jeans,true);
    X.strokeStyle=jeansDk;X.lineWidth=1;X.beginPath();X.moveTo(-7.5-sw,-30);X.lineTo(-7.5-sw,-8);X.moveTo(7.5+sw,-30);X.lineTo(7.5+sw,-8);X.stroke();X.strokeStyle=INK;X.lineWidth=1.6;
    RR(-15-sw,-6,14,6,3,'#1c1b20',true);RR(1+sw,-6,14,6,3,'#1c1b20',true);
    // black shirt with a round tummy, grey shirt peeking out at the neck, belt
    X.beginPath();X.moveTo(-15,-67);X.quadraticCurveTo(-20,-52,-17,-36);X.lineTo(17,-36);X.quadraticCurveTo(21,-50,15,-67);X.quadraticCurveTo(0,-70,-15,-67);X.closePath();X.fillStyle=shirt;X.fill();X.stroke();
    X.beginPath();X.moveTo(-5,-67.5);X.lineTo(0,-59);X.lineTo(5,-67.5);X.closePath();X.fillStyle=under;X.fill();
    X.strokeStyle='#4a4850';X.lineWidth=1;X.beginPath();X.moveTo(0,-59);X.lineTo(0,-50);X.stroke();X.strokeStyle=INK;X.lineWidth=1.6;
    for(const by of[-57,-53.5,-50])E(0,by,.9,.9,'#8a8890',false);
    RR(-17,-39,34,4,1.5,'#141316',true);RR(-3,-39.5,6,5,1,'#a8a8b0',true);
    // arms: sleeves pushed up, so the forearms are bare
    const arm=(sx,sy,a,len)=>{const ex=sx+Math.cos(a)*len,ey=sy+Math.sin(a)*len,mx=sx+Math.cos(a)*len*.55,my=sy+Math.sin(a)*len*.55;
      X.lineWidth=8.6;X.strokeStyle=INK;X.beginPath();X.moveTo(sx,sy);X.lineTo(ex,ey);X.stroke();
      X.lineWidth=6;X.strokeStyle=skin;X.beginPath();X.moveTo(mx,my);X.lineTo(ex,ey);X.stroke();
      X.lineWidth=7;X.strokeStyle=shirt;X.beginPath();X.moveTo(sx,sy);X.lineTo(mx,my);X.stroke();
      X.lineWidth=1.6;X.strokeStyle=INK;E(ex,ey,4.2,4.2,skin,true);return[ex,ey]};
    const wave=o.wave||0,wig=wave>.5?Math.sin((o.t||0)*.25)*.35:0;
    let hand;
    if(o.hug){arm(-15,-63,Math.PI+.5,19);hand=arm(15,-63,-.5,19)}
    else{arm(-15,-63,Math.PI/2+.28+sw*.03,20);
      if(o.snack)hand=arm(15,-63,-1.25,17);
      else hand=arm(15,-63,Math.PI/2-.28-wave*2.4+wig-sw*.03,20)}
    // a half-moon pastry with a crimped edge
    if(o.snack&&!o.hug){const[hx,hy]=hand;X.save();X.translate(hx-1,hy-7);X.rotate(-.35);
      X.beginPath();X.moveTo(-5,3);X.quadraticCurveTo(-6,-7,0,-9);X.quadraticCurveTo(6,-7,5,3);X.closePath();X.fillStyle='#e8a848';X.fill();X.stroke();
      X.lineWidth=1;for(let i=0;i<4;i++){const a=-2.6+i*.55;X.beginPath();X.moveTo(Math.cos(a)*5.4,-3+Math.sin(a)*5.4);X.lineTo(Math.cos(a)*3.8,-3+Math.sin(a)*3.8);X.stroke()}
      X.restore();X.lineWidth=1.6;E(hx,hy,4.2,4.2,skin,true)}
    // neck, ears and the bald head with a shine
    RR(-4.5,-71,9,6,2,skinDk,true);
    E(-12.2,-81,2.8,3.8,skin,true);E(12.2,-81,2.8,3.8,skin,true);
    E(0,-82,12.5,13.5,skin,true);
    X.globalAlpha=.5;E(-4,-91,4.5,2,'#fff',false);X.globalAlpha=1;
    // the dark beard round the jaw, and a moustache
    X.beginPath();X.moveTo(-12.4,-83);X.quadraticCurveTo(-13.4,-68,0,-66.5);X.quadraticCurveTo(13.4,-68,12.4,-83);X.lineTo(10.4,-82);X.quadraticCurveTo(9,-77,0,-77.5);X.quadraticCurveTo(-9,-77,-10.4,-82);X.closePath();X.fillStyle=beard;X.fill();X.stroke();
    // eyebrows and big round eyes
    X.lineWidth=2.4;X.strokeStyle=beard;X.beginPath();X.moveTo(-7.5,-89.6);X.quadraticCurveTo(-4.5,-91.6,-1.8,-89.8);X.moveTo(1.8,-89.8);X.quadraticCurveTo(4.5,-91.6,7.5,-89.6);X.stroke();X.lineWidth=1.4;X.strokeStyle=INK;
    if(o.happy||o.blink){for(const ex of[-4.6,4.6]){X.beginPath();X.moveTo(ex-2.6,-85);X.quadraticCurveTo(ex,o.happy?-88:-84,ex+2.6,-85);X.stroke()}}
    else for(const ex of[-4.6,4.6]){E(ex,-85.2,3.1,3.6,'#fff',true);E(ex+.4,-84.8,1.6,1.8,'#1a1012',false);E(ex+.9,-85.6,.6,.6,'#fff',false)}
    // nose, cheeks
    E(0,-80,2.2,2,skinDk,false);
    X.globalAlpha=.4;E(-8,-79.5,2.6,1.6,'#ff8f8f',false);E(8,-79.5,2.6,1.6,'#ff8f8f',false);X.globalAlpha=1;
    // a big toothy grin, or an open mouth while talking
    if(o.talk){E(0,-73.4,3.6,3,'#7a2a32',true);X.beginPath();X.rect(-2.8,-76,5.6,1.6);X.fillStyle='#fff';X.fill()}
    else{X.beginPath();X.moveTo(-5.2,-75.6);X.quadraticCurveTo(0,-68.6,5.2,-75.6);X.closePath();X.fillStyle='#fff';X.fill();X.stroke();X.lineWidth=.8;X.beginPath();X.moveTo(-4.4,-74.4);X.quadraticCurveTo(0,-73,4.4,-74.4);X.stroke()}
    X.lineWidth=1.6;X.fillStyle=beard;E(-2.8,-77.2,3.2,1.3,beard,false);E(2.8,-77.2,3.2,1.3,beard,false);
    X.restore();
  };
})();
