//----------------------------------
//   Draw the open_ptrack data to canvas
//   used for diagnostic purposes
//	'tracks' refer to people or blobs, ie one 'track' is one person
//----------------------------------
//set up canvas
const canvas = document.querySelector('#draw');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// var marginX = canvas.width / 6;  //margin for bounding box (should be '0' for production)
// var marginY = canvas.height / 6;
var marginX = 0;  //margin for bounding box (should be '0' for production)
var marginY = 0;

var params = {
		input: {
				x: {
					min: 1,
					max: 4.5
				},
				y: {
					min: .25,
					max: 7.4,
				}
		},
		output: {
				x: {
					min: marginX,
					max: canvas.width - (2 * marginX),
				},
				y: {
					min: marginY,
					max: canvas.height - (2 * marginY)
				}
		},
		framerate: 60,
		circle: {
			centerRadius: 40,
			centerRingColor: 'white',  //the ring around the inner circle
			ringRadius: 150,		//the large ring
			ringColor: '#FF00F0'  //hot pink
		}
}


// var color;

// var timer;
var counter = 0;


//array to hold previous tracks
var ptracks = [];

//-----------------------------------
// 	Main
//-----------------------------------

init();	//start the scene


//-----------------------------------
// 	Methods
//-----------------------------------

function init(){
	console.log('INIT!');
	requestAnimationFrame(update);
}


//this is the main update loop, gets ptrack data and updates the animation
//set the framerate with params.framerate (should be at 30 or 60, typically)
function update(){
	// console.log(counter);  //this is just a debug dummy check that the loop is running smoothly
	counter++;

	// drawOrigin();
	drawBounds();  //draw the bounding rectangle

	var tracks = messages.data.tracks;  //get the new ptrack data from the node server 'tracks' are people detections or 'blobs'

	// if there are no tracks in the array, return
	if(tracks === undefined){
		console.log('waiting for track data...');
		requestAnimationFrame(update);
		return;
	}

	//add a color to each track and reset to matched = false
	tracks.forEach((track) => {
		let c = randomColor_hsla();
		let color = 'hsla(' + c.h + ', ' + c.s + '%,' + c.l + '%,' + c.a + ')';
		track.matched = false;
		track.color = color;
	});

	//ptracks is our array for storing the previous tracks from last frame
	//check for matches against the previous tracks
	//set the matched state to true or false for later use
	//if true, use the ptrack color for the new track
	ptracks.forEach((ptrack) => {
		tracks.forEach((track) => {
			if(track.id === ptrack.id){
				track.matched = true;
				ptrack.matched = true;
				track.color = ptrack.color;
			}
		})
	});

	//if matched = false, remove dead tracks from the ptracks array
	ptracks.forEach((ptrack, index) => {
		if(ptrack.matched === false){
			ptracks.splice(index, 1);
		}
	});

	//if a current track is matched = false, it means it is 'new'
	//add it to the ptrack array
	tracks.forEach((track) => {
		if(track.matched === false){
			ptracks.push(track);
		}
	});

	//draw the updated tracks
	tracks.forEach((track) => {
		drawTrack(track);  //draw each circle
		// drawID(track);		//draw each track.id as text
		// drawPosition(track);  	//draw the raw x,y coords to canvas
	})

	setTimeout(() => {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);  //clear the canvas so we don't have residual images
		requestAnimationFrame(update);  //start the loop again
	}, 1000/params.framerate);
}



//draws the individual circle for each track
function drawTrack(track){
	//entrance on left, right head up
	// var cx = map(track.y, params.input.y.min, params.input.y.max, params.output.x.min, params.output.x.max);
	// var cy = map(track.x, params.input.x.min, params.input.x.max, params.output.y.min, params.output.y.max);

	//entrance on Right
	var cx = map(track.y, params.input.y.min, params.input.y.max, params.output.x.max, params.output.x.min);
	var cy = map(track.x, params.input.x.min, params.input.x.max, params.output.y.max, params.output.y.min);

	drawCircle(cx, cy, track);
	drawRing(cx, cy, track);
	drawID(cx, cy, track);
	drawPosition(cx, cy, track);
}

function drawCircle(cx, cy, track){
	var radius = 40;
	ctx.beginPath();
	//draw the inner circle
	ctx.arc(cx, cy, params.circle.centerRadius, 0, 2 * Math.PI, false);
	ctx.fillStyle = track.color;
	ctx.fill();
	//draw the outer circle
	ctx.lineWidth = 5;
	// ctx.strokeStyle = 'white';
	ctx.strokeStyle = params.circle.centerRingColor;
	ctx.stroke();
	ctx.closePath();


}

function drawRing(cx, cy, track){
	// var radius = 100;
	ctx.beginPath();
	ctx.arc(cx, cy, params.circle.ringRadius, 0, 2 * Math.PI, false);
	// ctx.strokeStyle = '#FF00F0'
	ctx.strokeStyle = params.circle.ringColor;
	ctx.stroke();
	ctx.closePath();
}


//draws the perimeter of the active area, the bounding rect
function drawBounds(){
	ctx.beginPath();
	ctx.strokeStyle = '#13FF00';
	ctx.lineWidth = 10;
	ctx.fillStyle = '#232323';
	ctx.rect(params.output.x.min, params.output.y.min, params.output.x.max, params.output.y.max);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
}

function drawOrigin(){
	var radius = 10;
	ctx.beginPath();
	ctx.arc(marginX, marginY, radius, 0, 2 * Math.PI, false);
	ctx.fillStyle = 'blue';
	ctx.fill();
	ctx.closePath();
}


//draws the track.id text to canvas
// function drawID(track){
function drawID(cx, cy, track){
	ctx.beginPath();
	ctx.font = '18px Arial';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = 'white';
	ctx.fillText(track.id, cx, cy);
	ctx.closePath();
}



//draws the raw x,y coords to canvas (use for finding the min/max bounds coming from open_ptrack)
function drawPosition(cx, cy, track){
	ctx.font = '18px Arial';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = 'white';
	ctx.fillText('x: ' + track.x, cx, cy + 60);
	ctx.fillText('y: ' + track.y, cx, cy + 90);
}



//generates a random color for each new track detected
// RGB
function randomColor_rgb(){
	var r = Math.random() * (255 - 0) + 0;
	var g = Math.random() * (255 - 0) + 0;
	var b = Math.random() * (255 - 0) + 0;

	var c = {
		'r': Math.round(r),
		'g': Math.round(g),
		'b': Math.round(b)
	}

	return c
}



//generates a random color for each new track detected
// HSL
function randomColor_hsla(){
	var h = Math.random() * (360 - 0) + 0;
	var s = Math.random() * (100 - 0) + 0;
	var l = Math.random() * (100 - 0) + 0;
	var a = 0.5;

	var c = {
		'h': Math.round(h),
		's': Math.round(s),
		'l': Math.round(l),
		'a': a
	}

	return c
}



//maps the raw open_ptrack x,y to the browser canvas bounds
function map(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
