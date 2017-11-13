var canvasWidth = 800;
var canvasHeight = 500;

var minInputX = 0;
var maxInputX = 5;

var minInputY = 0;
var maxInputY = 5

var minOutput = 50;
var maxOutput = 400;

var origin;

var blobs = [];
var color;

function setup() {
	createCanvas(canvasWidth, canvasHeight);
	background(50);
	color = color(0, 0, 0);

	origin = createVector(maxOutput + minOutput, minOutput);

}

function draw() {
	background(50);

	//draw bounding rect
	fill(255, 255, 255, 10);
	stroke(100, 100, 100);
	rect(minOutput, minOutput, maxOutput, maxOutput);

	//draw origin point
	fill(0, 255, 0, 100);
	ellipse(origin.x, origin.y, 10, 10);

	var tracks = messages.data.tracks;
	// console.log(tracks);

	if(tracks != undefined){
		if(blobs.length === 0){
			blobs = tracks;

			blobs.forEach(function(blob){
				// blob.color = randomColor();
				var c = randomColor();
				color.r = c.r;
				color.g = c.g;
				color.b = c.b;
				blob.color = color;
			})
		}

		Object.keys(tracks).forEach(function(key, index){
			var track = tracks[key];

			var newBlob = false;

			blobs.forEach(function(blob){
				console.log(blob);
				if(blob.id === track.id){
					// console.log('match');
				}else{
					// console.log('not match');
				}
			});



			// if(newBlob){
			// 	blobs.push(track);
			// 	console.log('new blob');
			// }

			// console.log(blobs.length);
			// console.log(track);
			var rawX = track.x;
			var rawY = track.y;

			var x = map(track.x, minInputX, maxInputX, maxOutput, minOutput);
			var y = map(track.y, minInputY, maxInputY, minOutput, maxOutput);

	 		ellipse(x, y, 10, 10);
	 		textSize(12);
	 		fill(0, 255, 0);

	 		//data read out
	 		var id = track.id;
	 		var rawXloc = "x: " + track.x;
	 		var rawYloc = "y: " + track.y;

	 		text(id, x, y-30);
	 		// text(rawXloc, x, y-20);
	 		// text(rawYloc, x, y-10);

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
