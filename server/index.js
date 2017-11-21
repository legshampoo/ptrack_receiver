var express = require('express');
var app = express();
var path = require('path');

var port = 3000;

var ptrack = require('./comm/ptrack');

app.use('/', express.static(path.join(__dirname, '../public')))

app.get('/', function(req, res) {
	res.sendFile('index.html');
});

app.listen(port, function (){
	console.log('App listening on port ', port);
});

ptrack.connectTracker();
