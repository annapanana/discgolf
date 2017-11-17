// draw a single disc trajectory path
function drawPath(dist, hss, lsf, armspeed, wear, color, drawPath)
{
  var pathContext=pathBuffer.getContext("2d");
  pathContext.strokeStyle = color;
  pathContext.lineWidth = 2.4;

  var airspeed=armspeed;
  var ehss=hss, elsf=lsf;
  var turnsign=($("#throw-type").val()=="rhbh") ? 1.0 : -1.0;
  var fadestart=0.4+(1.0-airspeed*airspeed)*0.3;
  var impact=(1.0-airspeed)/5;
  var turnend=0.8 - airspeed*airspeed*0.36;
  var x, y;
  var ox=canvas.width/2; oy=canvas.height;
  var vx=0.0, vy=-1.0;
  var ht=yscale*dist;
  var deltav=yscale/ht;
  var wm=wear/10.0;

  // calculate effective HSS and LSF
  ehss*=1.0+1.0-wm;
  ehss-=((1.0-wm)/0.05)*(dist/100);
  elsf*=wm;
  if (airspeed>0.8) {
    var op=(airspeed-0.8)/0.4;
    op*=op*2;
    var dc=Math.max(0.0, (350-dist))/10.0; // emphasize high-speed turn on sub-350ft discs
    ehss-=op*dc;
  }
  ehss*=airspeed*airspeed*airspeed*airspeed;
  elsf*=1.0/(airspeed*airspeed);

  // iterate through the flight path
  var yd,yt,yf;
  do {
    y=oy+vy;
    x=ox+vx*xscale;
    airspeed-=deltav;
    if (airspeed > turnend) {
      vx-=turnsign * (ehss/14000) * (turnend/airspeed);
      yt=canvas.height-y;
    }
    if (airspeed < fadestart) {
      vx-=turnsign * (elsf/4000) * (fadestart-airspeed)/fadestart;
    } else { yf=canvas.height-y; }
    if (airspeed > 0.0) {
      if (drawPath) {
        pathContext.beginPath();
        pathContext.moveTo(ox, oy);
        pathContext.lineTo(x, y);
        pathContext.stroke();
      }
      ox=x; oy=y;
    }
  } while (airspeed > impact);
  yd=canvas.height-oy;

  if ($("#debug-data").is(":checked")) {
    if (drawPath) {
      var hx=canvas.width/2;
      console.log("hss "+hss+" lsf "+lsf+" ehss "+ehss+" elsf "+elsf+" turnend "+turnend+" fadestart "+fadestart+" yd "+yd);
      pathContext.strokeStyle="#fff";
      pathContext.beginPath();
      pathContext.moveTo(hx-20, canvas.height-yd);
      pathContext.lineTo(hx+20, canvas.height-yd);
      pathContext.stroke();

      pathContext.strokeStyle="#0ff";
      pathContext.beginPath();
      pathContext.moveTo(hx-20, canvas.height-yt);
      pathContext.lineTo(hx+20, canvas.height-yt);
      pathContext.stroke();

      pathContext.strokeStyle="#f0f";
      pathContext.beginPath();
      pathContext.moveTo(hx-20, canvas.height-yf);
      pathContext.lineTo(hx+20, canvas.height-yf);
      pathContext.stroke();
    }
  }

  // return lie coordinates to caller
  return [x, y];
}
