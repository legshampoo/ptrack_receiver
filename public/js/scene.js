const canvas = document.querySelector('#draw');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var params = {
  circle: {
    centerRadius: 40,  //size of the center tracking circle
    centerRingColor: 'white',  //the ring around the inner circle
    ringRadius: 150,  // the large ring
    ringColor: '#FF00F0'  //hot pink
  }
}


//------------------------------------------------
// MAIN
//------------------------------------------------

init();

function init(){
  console.log('INIT');
  requestAnimationFrame(update);
}


function update(){
  drawBounds();
  var tracks = messages.tracks;

  if(tracks === undefined){
    requestAnimationFrame(update);
    return;
  }

  drawTracks(tracks);

  setTimeout(() => {
    requestAnimationFrame(update);
  }, 1000/params.framerate);
}


//------------------------------------------------
//  Helpers
//------------------------------------------------

function drawTracks(tracks){
  tracks.forEach((track) => {
    drawCircle(track);
    drawRing(track);
    drawId(track);
    drawPosition(track);
  })
}

//draw the inner circle
function drawCircle(track){
	ctx.beginPath();
	ctx.arc(track.cx, track.cy, params.circle.centerRadius, 0, 2 * Math.PI, false);
	ctx.fillStyle = track.color;
	ctx.fill();
	//draw the outer circle
	ctx.lineWidth = 5;
	ctx.strokeStyle = params.circle.centerRingColor;
	ctx.stroke();
	ctx.closePath();
}

function drawRing(track){
	ctx.beginPath();
	ctx.arc(track.cx, track.cy, params.circle.ringRadius, 0, 2 * Math.PI, false);
	ctx.strokeStyle = params.circle.ringColor;
	ctx.stroke();
	ctx.closePath();
}


//draws the track.id text to canvas
function drawId(track){
	ctx.beginPath();
	ctx.font = '18px Arial';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = 'white';
	ctx.fillText(track.id, track.cx, track.cy);
	ctx.closePath();
}

//draws the raw x,y coords to canvas (use for finding the min/max bounds coming from open_ptrack)
function drawPosition(track){
	ctx.font = '18px Arial';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = 'white';
	ctx.fillText('x: ' + track.x, track.cx, track.cy + 60);
	ctx.fillText('y: ' + track.y, track.cx, track.cy + 90);
}

//draws the perimeter of the active area, the bounding rect
function drawBounds(){
	ctx.beginPath();
	ctx.strokeStyle = '#13FF00';
	ctx.lineWidth = 10;
	ctx.fillStyle = '#232323';
	ctx.rect(0, 0, canvas.width, canvas.height);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}
