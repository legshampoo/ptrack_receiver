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
var color;

function setup() {
	console.log('START');
	createCanvas(canvasWidth, canvasHeight);
	background(50);
	color = color(0, 0, 0);

	origin = createVector(maxOutput + minOutput, minOutput);

}

function draw() {
	console.log('BEGIN LOOP');
	background(50);

	//draw bounding rect
	fill(255, 255, 255, 10);
	stroke(100, 100, 100);
	rect(minOutput, minOutput, maxOutput, maxOutput);

	//draw origin point
	fill(0, 255, 0, 100);
	ellipse(origin.x, origin.y, 10, 10);

	var tracks = messages.data.tracks;

	//reset the matched flag on prev_tracks
	if(prev_tracks.length !== 0 && prev_tracks != undefined){
		prev_tracks.forEach(function(prev_track){
			prev_track.matched = false;
		})
	}

	if(tracks != undefined){

		//mark each track as unmatched and give it a random color
		tracks.forEach(function(track){
			track.matched = false;
			var c = randomColor();
			color.r = c.r;
			color.g = c.g;
			color.b = c.b;

			track.color = color;
		})

		//first pass fill blobs array with tracks
		if(prev_tracks.length === 0){
			console.log('no previous tracks yet');
			tracks.forEach(function(track){
				console.log('adding track: ', track.id + ' to prev_tracks');
				prev_tracks.push(track);
			})

		}

		//loop through each track, check if it matches with our prev_track
		Object.keys(tracks).forEach(function(key, index){
			var track = tracks[key];

			//check for a matched
			prev_tracks.forEach(function(prev_track){
				if(prev_track.id === track.id){
					console.log('track: ' + track.id + ' matched with prev_track');
					track.matched = true;
					prev_track.matched = true;
					color.r = prev_track.color.r;
					color.g = prev_track.color.g;
					color.b = prev_track.color.b;
					track.color = color;
				}
			})

		})

		//loop through and draw tracks
		Object.keys(tracks).forEach(function(key, index){
			var track = tracks[key];

			// console.log('draw track.r: ', track.color.r);
			fill(track.color.r, track.color.g, track.color.b);
			var rawX = track.x;
			var rawY = track.y;

			var x = map(track.x, minInputX, maxInputX, maxOutput, minOutput);
			var y = map(track.y, minInputY, maxInputY, minOutput, maxOutput);

	 		ellipse(x, y, 10, 10);
	 		textSize(12);
	 		// fill(0, 255, 0);

	 		//data read out
	 		var id = track.id;
	 		var rawXloc = "x: " + track.x;
	 		var rawYloc = "y: " + track.y;

	 		text(id, x, y-30);
	 		// text(rawXloc, x, y-20);
	 		// text(rawYloc, x, y-10);

		})

		prev_tracks.forEach(function(prev_track, index){
			if(!prev_track.matched){
				prev_tracks.splice(index, 1);
			}
		});

		tracks.forEach(function(track){
			if(!track.matched){
					prev_tracks.push(track);
			}
		})
	}


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
