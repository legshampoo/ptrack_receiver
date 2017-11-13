// var canvasWidth = 800;
// var canvasHeight = 500;

//set up mapping bounds
var minInputX = 0;  //min value expected from kinects
var maxInputX = 5;	//max value expected from kinects

var minInputY = 0;  //min expected
var maxInputY = 5		//max expected

var minOutput = 50;  //canvas bound min x
var maxOutput = 400;

var params = {
		input: {
				min: {
					x: -.5,
					y: 0
				},
				max: {
					x: 4.5,
					y: 8.5
				}
		},
		output: {
				min: {
					x: 50,
					y: 50
				},
				max: {
					x: 466 + 50,
					y: 700 + 50
				}
		}
}


var origin;
var color;

var timer;
var counter = 0;

//set up canvas
const canvas = document.querySelector('#draw');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// let isDrawing = true;

//array to hold previous tracks
var ptracks = [];


init();

function init(){
	console.log('INIT!');
	// console.log(params.input.max.y);
	// timer = window.setInterval(update, 1000/3);
	requestAnimationFrame(update);
}

function update(){
	// console.log(counter);
	counter++;
	drawBounds();
	//get the new tracks
	var tracks = messages.data.tracks;

	//return if no tracks in array
	if(tracks === undefined){
		console.log('waiting for track data...');
		requestAnimationFrame(update);
		return;
	}

	//first pass - add colors and reset to unmatched
	tracks.forEach((track) => {
		let c = randomColor_hsla();
		let color = 'hsla(' + c.h + ', ' + c.s + '%,' + c.l + '%,' + c.a + ')';
		track.matched = false;
		track.color = color;
	});

	//check for matches
	ptracks.forEach((ptrack) => {
		tracks.forEach((track) => {
			if(track.id === ptrack.id){
				track.matched = true;
				ptrack.matched = true;
				track.color = ptrack.color;
			}
		})
	});

	//remove dead tracks
	ptracks.forEach((ptrack, index) => {
		if(ptrack.matched === false){
			ptracks.splice(index, 1);
		}
	});

	//add new tracks to ptracks array
	tracks.forEach((track) => {
		if(track.matched === false){
			ptracks.push(track);
		}
	});

	//draw updated tracks
	tracks.forEach((track) => {

		drawCircle(track);
		drawID(track);
		drawPosition(track);
		// ctx.font = '48px serif';
		// ctx.fillText('test', track.x, track.y);
	})

	setTimeout(() => {
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		requestAnimationFrame(update);
	}, 1000/60);
}

function drawCircle(track){
	var radius = 20;
	ctx.beginPath();
	// var cx = map(track.x, minInputX, maxInputX, maxOutput, minOutput);
	// var cy = map(track.y, minInputY, maxInputY, maxOutput, minOutput);
	var cx = map(track.x, params.input.min.x, params.input.max.x, params.output.min.x, params.output.max.x);
	var cy = map(track.y, params.input.min.y, params.input.max.y, params.output.min.y, params.output.max.y);
	// var cx = map(track.x, params.input.min.x, params.input.max.x, params.output.max.x, params.output.min.x);
	// var cy = map(track.y, params.input.min.y, params.input.max.y, params.output.max.y, params.output.min.y);

	//draw the inner circle
	ctx.arc(cx, cy, radius, 0, 2 * Math.PI, false);
	ctx.fillStyle = track.color;
	ctx.fill();
	ctx.lineWidth = 5;
	ctx.strokeStyle = 'black';
	ctx.stroke();
}

function drawBounds(){
	// ctx.rect(100, 100, 300, 300);
	ctx.rect(params.output.min.x, params.output.min.y, params.output.max.x, params.output.max.y);
	ctx.stroke();
}

function drawID(track){
	// var cx = map(track.x, minInputX, maxInputX, maxOutput, minOutput);
	// var cy = map(track.y, minInputY, maxInputY, maxOutput, minOutput);
	var cx = map(track.x, params.input.min.x, params.input.max.x, params.output.min.x, params.output.max.x);
	var cy = map(track.y, params.input.min.y, params.input.max.y, params.output.min.y, params.output.max.y);
	ctx.font = '12px Arial';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = 'black';
	ctx.fillText(track.id, cx, cy);
}

function drawPosition(track){
	var cx = map(track.x, params.input.min.x, params.input.max.x, params.output.min.x, params.output.max.x);
	var cy = map(track.y, params.input.min.y, params.input.max.y, params.output.min.y, params.output.max.y);
	ctx.font = '12px Arial';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = 'black';
	ctx.fillText('x: ' + track.x, cx, cy + 50);
	ctx.fillText('y: ' + track.y, cx, cy + 60);
}


function randomColor_rgb(){
	var r = Math.random() * (255 - 0) + 0;
	var g = Math.random() * (255 - 0) + 0;
	var b = Math.random() * (255 - 0) + 0;

	// color = new color(r, g, b);
	var c = {
		'r': Math.round(r),
		'g': Math.round(g),
		'b': Math.round(b)
	}

	return c
}

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

function map(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
