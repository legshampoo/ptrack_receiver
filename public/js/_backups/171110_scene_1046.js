var canvasWidth = 800;
var canvasHeight = 500;

var minInputX = 0;
var maxInputX = 5;

var minInputY = 0;
var maxInputY = 5

var minOutput = 50;
var maxOutput = 400;

var origin;

var prev_tracks = [];
var finalTracks = [];
var color;

function setup() {
	console.log('START');
	createCanvas(canvasWidth, canvasHeight);
	background(50);
	color = color(0, 0, 0);

	origin = createVector(maxOutput + minOutput, minOutput);

}

function draw() {
	console.log('DRAW');
	background(50);

	//draw bounding rect
	fill(255, 255, 255, 10);
	stroke(100, 100, 100);
	rect(minOutput, minOutput, maxOutput, maxOutput);

	//draw origin point
	fill(0, 255, 0, 100);
	ellipse(origin.x, origin.y, 10, 10);

	var tracks = messages.data.tracks;
	finalTracks = [];
	if(tracks === undefined){
		return
	}

	tracks.forEach((track) => {
		track.matched = false;
	})

	console.log('tracks.length: ', tracks.length);
	console.log('prev_tracks.length: ', prev_tracks.length);

	if(prev_tracks.length < 1){
		console.log('load the tracks');
		prev_tracks = tracks;
		prev_tracks.forEach((prev_track) => {
			var c = randomColor();
			console.log(c.r);
			color.r = c.r;
			color.g = c.g;
			color.b = c.b;
			prev_track.color = color;
			// prev_track.matched = false;
		})
	}

	prev_tracks.forEach((prev_track) => {
		prev_track.matched = false;
	})

	tracks.forEach((track) => {
		prev_tracks.forEach((prev_track) => {
			if(track.id === prev_track.id){
				console.log('got a match');
				track.matched = true;
				prev_track.matched = true;
				track.color = prev_track.color;
				finalTracks.push(track);
			}
		})
	})

	prev_tracks.forEach((prev_track, index) => {
		if(!prev_track.matched){
			console.log('remove');
			prev_tracks.splice(index, 1);
		}
	})

	tracks.forEach((track) => {
		if(!track.matched){
			var c = randomColor();
			console.log(c.r);
			color.r = c.r;
			color.g = c.g;
			color.b = c.b;
			track.color = color;
			track.matched = true;
			finalTracks.push(track);
			// prev_tracks.push(track);
		}
	})


	if(true){
		finalTracks.forEach((track) => {
			if(track.matched){
				console.log(track.color.r);
				fill(track.color.r, track.color.g, track.color.b);
				var x = map(track.x, minInputX, maxInputX, maxOutput, minOutput);
				var y = map(track.y, minInputY, maxInputY, minOutput, maxOutput);
				var id = track.id;
				text(id, x, y - 20);
				ellipse(x, y, 10, 10);
			}
		})
	}

	prev_tracks = finalTracks;
}

function randomColor(){
	var r = Math.random() * (255 - 0) + 0;
	var g = Math.random() * (255 - 0) + 0;
	var b = Math.random() * (255 - 0) + 0;

	// color = new color(r, g, b);
	var c = {
		'r': r,
		'g': g,
		'b': b
	}

	return c
}

function map(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}
