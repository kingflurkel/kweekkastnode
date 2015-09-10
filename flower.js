console.log("Kweekkast starting");


var request = require("request");
var FlowerPower = require('flower-power');
var async = require('async');
var Firebase = require("firebase");

var myFirebaseRef = new Firebase("https://kweekkast.firebaseio.com/");

FlowerPower.discover(function(flowerPower) {
	console.log('Found a device');
	flowerPower.connectAndSetup(function() {
		console.log('Connected to device');
		// fetch the data status every x min.
		var checkInterval = setInterval(function() {
			fetchData(flowerPower);
		}, 9 * 1000);
	});
});



function fetchData(flowerPower) {

	// hie die sensor uitlezen ja
	async.series([
			function readSunlight(callback) {
				flowerPower.readCalibratedSunlight(callback);
					},
					function readAirTemperature(callback) {
						flowerPower.readCalibratedAirTemperature(callback);
					},
					function readSoilMoisture(callback) {
						flowerPower.readCalibratedSoilMoisture(callback);
					},
					function readEa(callback) {
						flowerPower.readCalibratedEa(callback);
					},
					function readEcPorous(callback) {
						flowerPower.readCalibratedEcPorous(callback);
					},
					function readEcb(callback) {
						flowerPower.readCalibratedEcb(callback);
					}
			],
			function(err, results) {
				if (err) {
					console.error(err);
				} else {
					// alles uitgelezen....
					// data posten
					// normaal is dat nen array met 3 getallen
					myFirebaseRef.push({ 'airtemp': result[1], 'soilmoisture': result[2] });
					console.log("data=", results);
var url = "https://data.sparkfun.com/input/DJLnMNw2mJcjqEZMn5wq?private_key=P4A6oKGY94hY7bZqE4K7&light=" + results[0]
	+ "&airtemp=" + results[1] 
	+ "&soilmoisture=" + results[2] 
	+ "&ea=" + results[3] 
	+ "&ecporous=" + results[4]
	+ "&ecb=" + results[5];
					console.log(url);
					request({
						url: url,
					}, function(error, response, body) {
						if (!error && response.statusCode === 200) {
							console.log('okay');

						} else {
							console.log(error);

						}
					});
				}

			});
	}
