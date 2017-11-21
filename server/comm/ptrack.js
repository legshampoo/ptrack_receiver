var dgram = require('dgram');
var WebSocketServer = require('ws').Server;
var dataHandler = require('../utils/dataHandler');

var udp_socket;

// 	web socket connection
var wss;					// web socket server
var web_socket;				// web socket

// 	connection parameters for multicast (UDP)
var mc = {
	port: 	21234,			// ptrack port
	group: 	'224.0.0.1',	// standard LAN multicast address
	host: 	undefined 		// undefined so node listens to all hosts
}

//--------------------------------------------------------
//Main exported function to effect UDP listening and TCP forwarding on websocket.
//--------------------------------------------------------

function API_ConnectTracker () {

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
	})


//--------------------------------------------------------
// create websocket connection on port 3030 for browser
//--------------------------------------------------------
	wss = new WebSocketServer( { port: 3030 } );

	wss.on('connection', function ( wsocket ) {
		console.log("*** 3030 Browser Client Connect");
		web_socket = wsocket;
		web_socket.once('close',function() {
			console.log('remote socket BROWSER 3030 closed');
			web_socket = null;
		});
	});

	// report errors
	wss.on('error', function (err) {
		console.log("connectTracker socket server error: "+err);
		web_socket = null;
	});

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
