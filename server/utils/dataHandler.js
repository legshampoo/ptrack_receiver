var start = process.hrtime();  //to track time between msgs
var ptracks = []; //holds previous tracks

// var marginX = 0;  //margin for bounding box (should be '0' for production)
// var marginY = 0;

var canvasWidth = 1920;
var canvasHeight = 1080;

var params = {
		input: {
				x: {
					min: .9,
					max: 4.35
				},
				y: {
					min: .6,
					max: 7.0,
				}
		},
		output: {
				x: {
					min: 0,
					max: canvasWidth,
				},
				y: {
					min: 0,
					max: canvasHeight,
				}
		}
}



var methods = {
  getTracks: function(msg){
    if(msg.length < 2){
      return undefined
    }

    try{
      var tracks = JSON.parse(msg).tracks;
      return tracks;
    }catch(e){
      console.log(e);
    }
  },

  processTracks: function(tracks){
    if(tracks === undefined){
      return
    }

    //add a random color to every new track and flag everything as unmatched
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
      });
    });

    //if a ptrack is matched = false, remove it as a dead track
    ptracks.forEach((ptrack, index) => {
      if(ptrack.matched === false){
        ptracks.splice(index, 1);
      }
    });

    //if a CURRENT track is unmatched, it means it's 'new'
    //add it to the ptrack array
    tracks.forEach((track) => {
      if(track.matched === false){
        ptracks.push(track);
      }
    });

    tracks.forEach((track) => {
      //swap params to change orientation
      var cx = map(track.y, params.input.y.min, params.input.y.max, params.output.x.max, params.output.x.min);
      var cy = map(track.x, params.input.x.min, params.input.x.max, params.output.y.max, params.output.y.min);
      track.cx = cx;
      track.cy = cy;
    });

    // console.log(tracks);

    return tracks;
  },

  elapsedTime: function logMsgFramerate(){
  	elapsed_time("time since last message");
  }
}

//----------------------------------------------------------------
//  Helpers
//----------------------------------------------------------------


//map the raw open_ptrack data to the canvas bounds
function map(value, low1, high1, low2, high2){
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}


//generates a random color for each new track detected in HSL
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

//tracks time between messages
var elapsed_time = function(message){
	var precision = 3; //3 decimal places
	var elapsed = process.hrtime(start)[1] / 1000000; //divide by 1 million to get nano to milli
	console.log(message + ': ' + process.hrtime(start)[0] + ' s, ' + elapsed.toFixed(precision) + ' ms');
	start = process.hrtime(); //reset the timer
}

module.exports = methods;
