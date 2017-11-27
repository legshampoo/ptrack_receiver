var dgram = require('dgram');
var WebSocketServer = require('ws').Server;
var dataHandler = require('../utils/dataHandler');

var udp_socket;

// 	web socket connection
var wss;					// web socket server
var web_socket;				// web socket

// socket.io init
var server;//= require('http').createServer(app);
var io;// = require('socket.io').listen(server);

// 	connection parameters for multicast (UDP)
var mc = {
	port: 	21234,			// ptrack port
	group: 	'224.0.0.1',	// standard LAN multicast address
	host: 	undefined 		// undefined so node listens to all hosts
}

//--------------------------------------------------------
//Main exported function to effect UDP listening and TCP forwarding on websocket.
//--------------------------------------------------------

function API_ConnectTracker (app) {

	// listen to socket.io
	server = require('http').createServer(app);
	io = require('socket.io').listen(server);

	udp_socket = dgram.createSocket('udp4'); // create UDP listener to remote camera tracker

	// connect to UDP group/host (host is optional)
	udp_socket.bind ( mc.port, mc.host, function () {
		var address = udp_socket.address();
		console.log("*** LISTENING TO " + address.address + " PORT " + address.port + " (" + address.family + ") ***");
		udp_socket.setMulticastLoopback ( true);  // enable receiving multicast packets
		udp_socket.addMembership( mc.group, mc.host );  // join multicast group
	});

	udp_socket.on('message', function(msg, rinfo){
		dataHandler.elapsedTime();  //log the time since last msg received, comment out for production

		var msgString = msg.toString();
		msgString = msgString.substr(0, msgString.indexOf(']}') + 2);

		var tracks = dataHandler.getTracks(msgString);  //parse the tracks

		tracks = dataHandler.processTracks(tracks);  //process the tracks data to fit the canvas

		// send data to client
		if (web_socket) {
	  	// web_socket.send(tracks);
			console.log(tracks);
			web_socket.send(JSON.stringify(tracks));
	  	}
	  	if (io.sockets) {  	
			console.log(tracks);
			io.sockets.emit('tracking data', JSON.stringify(tracks));
	  	}
	})



//--------------------------------------------------------
// create socket.io
//--------------------------------------------------------
	

    server.listen(3030);
    io.sockets.on('connection', function (socket) {
      console.log("connection");
    });


//--------------------------------------------------------
// fake visitors
//--------------------------------------------------------

   // simulate();

//--------------------------------------------------------
// create websocket connection on port 3030 for browser
//--------------------------------------------------------
	
	// wss = new WebSocketServer( { port: 3030 } );

	// wss.on('connection', function ( wsocket ) {
	// 	console.log("*** 3030 Browser Client Connect");
	// 	web_socket = wsocket;
	// 	web_socket.once('close',function() {
	// 		console.log('remote socket BROWSER 3030 closed');
	// 		web_socket = null;
	// 	});
	// });

	// // report errors
	// wss.on('error', function (err) {
	// 	console.log("connectTracker socket server error: "+err);
	// 	web_socket = null;
	// });

}

function simulate() {
	console.log("simulate");

	var trackProto={ 	
						id: 6,
					    x: 4.94695,
					    y: 3.20272,
					    height: 1.91037,
					    age: 74.5986,
					    confidence: 0.918185,
					    matched: true,
					    color: 'hsla(281, 25%,100%,0.5)',
					    cx: 1139.1840000000002,
					    cy: -186.87130434782625 
					}

	var fakeMsg={
					"tracks":[ 
								
							]
				};

	function addNewTrack() {
		// body...
		console.log("addNewTrack"+Math.random());
		if(fakeMsg.tracks.length<6){
			console.log("addNewTrack2");
			if(Math.random()>0.1){
				console.log("addNewTrack3");
				var track = Object.assign({}, trackProto);
				track.animation={};
				track.id=Math.floor(Math.random()*100000);
				track.animation.from={x:Math.random()*1920,y:Math.random()*1080};
				track.animation.to={x:Math.random()*1920,y:Math.random()*1080};
				track.animation.pct=0;
				var dist = Math.sqrt( Math.pow((track.animation.from.x-track.animation.to.x), 2) + Math.pow((track.animation.from.y-track.animation.to.y), 2) );
				track.animation.speed=(0.002+Math.random()*0.003)*1400/dist;
				fakeMsg.tracks.push(track);
			}
		}
		var delay = 300 + Math.floor(Math.random()*500);
		setTimeout(addNewTrack, delay);
	}

	addNewTrack();

		 
	setInterval(function(){

		var killArr=[];

		for (var i = 0; i < fakeMsg.tracks.length; i++) {

			var track = fakeMsg.tracks[i];
			track.animation.pct+=track.animation.speed;

			track.cx=track.animation.pct*(track.animation.to.x - track.animation.from.x)+track.animation.from.x;
			track.cy=track.animation.pct*(track.animation.to.y - track.animation.from.y)+track.animation.from.y;

			if(track.animation.pct>=1){
				killArr.push(i);
			}

		}

		for (var i = 0; i < killArr.length; i++) {
			
			fakeMsg.tracks.splice(killArr[i], 1);

		}
		
		io.sockets.emit('tracking',fakeMsg);

	},20);

}
//brute force close connection
function API_CloseTracker () {
	if (web_socket) web_socket.close();
	if (wss) wss.close();
	if (udp_socket) udp_socket.close();
	console.log("\n*** closing connections\n");
}

exports.connectTracker = API_ConnectTracker;
exports.closeTracker = API_CloseTracker;
