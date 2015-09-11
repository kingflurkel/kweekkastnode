//sudo forever stop -a -l forever.log -o out2.log -e err.log /mnt/KFProjects/kweekkast/flower.js 


console.log("Kweekkast starting");



var request = require("request");
var FlowerPower = require('flower-power');
var async = require('async');
var Firebase = require("firebase");


var fb_sun = new Firebase("https://kweekkast.firebaseio.com/sunlight");
var fb_airtemp = new Firebase("https://kweekkast.firebaseio.com/airtemp");
var fb_moist = new Firebase("https://kweekkast.firebaseio.com/moist");
var fb_soiltemp = new Firebase("https://kweekkast.firebaseio.com/soiltemp");

	FlowerPower.discover(function(flowerPower) {
		console.log('Found a device');
		flowerPower.connectAndSetup(function() {
			console.log('Connected to device');
			// fetch the data status every x min.
			//setInterval(fetchData(flowerPower), 30 * 1000);
			flowerPower.enableLiveMode(function(err){
				console.log('live mode enabled');
				flowerPower.on('airTemperatureChange', function(airtemp){
					console.log("airtemp changed: ",airtemp);
					fb_airtemp.set({'airtemp': airtemp, 'timestamp': Date.now()});
				});
				flowerPower.on('sunlightChange', function(sunlight){
					console.log("sunlight changed: ", sunlight);
					fb_sun.set({'sun': sunlight, 'timestamp': Date.now()});
				});
				flowerPower.on('soilTemperatureChange', function(soiltemp){
					console.log("soiltemp changed: ", soiltemp);
					fb_soiltemp.set({'soiltemp': soiltemp, 'timestamp': Date.now()});
				});
				flowerPower.on('soilMoistureChange', function(soilmoist){
					console.log("soilmoist changed: ", soilmoist);
					fb_moist.set({'soilmoist': soilmoist, 'timestamp': Date.now()});
				});
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
					flowerPower.disconnect(function(){
						console.log('Disconnected from device');
					});
				} else {
					// alles uitgelezen....
					// data posten
					console.log('time: ',Date.now(), ' airtemperature', results[8]);
					// normaal is dat nen array met 3 getallen
					// fb_kast.set({ 
					// 	'cairtemp': results[1], 
					// 	'csoilmoisture': results[2],
					// 	'ea': results[3],
					// 	'ecporous': results[4],
					// 	'ecb': results[5],
					// 	'sunlight': results[6],
					// 	'soiltemperature': results[7],
					// 	'airtemperature': results[8],
					// 	'soilmoisture': results[9],
					// 	'battery': results[10],
					// 	'timestamp': Date.now()
					// });
				}

			});
		}
