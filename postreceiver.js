const myVersion = "0.4.0", myProductName = "postreceiver"; 

const fs = require ("fs");
const utils = require ("daveutils");
const davehttp = require ("davehttp"); 

var config = {
	port: process.env.PORT || 1408,
	flLogToConsole: true,
	flAllowAccessFromAnywhere: true,
	flPostEnabled: true
	};

function readConfig (f, theConfig, callback) { 
	fs.readFile (f, function (err, jsontext) {
		if (err) {
			console.log ("readConfig: err.message == " + err.message);
			}
		else {
			try {
				var jstruct = JSON.parse (jsontext);
				for (var x in jstruct) {
					theConfig [x] = jstruct [x];
					}
				}
			catch (err) {
				console.log ("readConfig: err.message == " + err.message);
				}
			}
		callback ();
		});
	}
readConfig ("config.json", config, function () {
	davehttp.start (config, function (theRequest) {
		function return404 () {
			theRequest.httpReturn (404, "text/plain", "Not found.");
			}
		function returnText (theText) {
			theRequest.httpReturn (200, "text/plain", theText);
			}
		switch (theRequest.lowermethod) {
			case "get":
				switch (theRequest.lowerpath) {
					case "/now":
						returnText (new Date ());
						return;
					default:
						return404 ();
						return;
					}
			case "post": 
				switch (theRequest.lowerpath) {
					case "/uppercase": 
						returnText (utils.stringUpper (theRequest.postBody));
						return;
					default: 
						return404 ();
						return;
					}
			}
		});
	});

