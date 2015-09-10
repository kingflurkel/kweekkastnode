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
		fetchData(flowerPower);
		flowerPower.disconnect(function(){
			console.log('Disconnected from device');
		});
	});
});



function fetchData(flowerPower) {

	// hie die sensor uitlezen ja
	async.series([
			function readSunlight(callback) {
				flowerPower.readCalibratedSunlight(callback);
					},
					function readCAirTemperature(callback) {
						flowerPower.readCalibratedAirTemperature(callback);
					},
					function readCSoilMoisture(callback) {
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
					},
					function readSunlight(callback) {
						flowerPower.readSunlight(callback);
					},
					function readSoilTemperature(callback) {
						flowerPower.readSoilTemperature(callback);
					},
					function readAirTemperature(callback) {
						flowerPower.readAirTemperature(callback);
					},
					function readSoilMoisture(callback) {
						flowerPower.readSoilMoisture(callback);
					},
					function readBattery(callback) {
						flowerPower.readBatteryLevel(callback);
					}
			],
			function(err, results) {
				if (err) {
					console.error(err);
				} else {
					// alles uitgelezen....
					// data posten
					console.log('time: ',Date.now(), ' airtemperature', results[8]);
					// normaal is dat nen array met 3 getallen
					myFirebaseRef.push({ 
						'cairtemp': results[1], 
						'csoilmoisture': results[2],
						'ea': results[3],
						'ecporous': results[4],
						'ecb': results[5],
						'sunlight': results[6],
						'soiltemperature': results[7],
						'airtemperature': results[8],
						'soilmoisture': results[9],
						'battery': results[10],
						'timestamp': Date.now()
					});
				}

			});
		}
