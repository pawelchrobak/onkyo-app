/*jslint node:true nomen:true*/
'use strict';
var util = require('util'),
	eiscp = require('eiscp'),
	os = require('os');

// eiscp.on('debug', util.log);
// eiscp.on('error', util.log);

// Discover receviers on network, stop after 2 receviers or 5 seconds

eiscp.discover({address: '192.168.1.255', timeout: 2}, function (err, result) {
	
	if(err) {
		console.log("Error message: " + result);
	} else {
		console.log("Found these receivers on the local network:");
		console.log(result);
		// console.log(result[0].host);

		eiscp.connect({host: result[0].host});
		eiscp.on('connect', () => {
			eiscp.command('main.system-power=query');

			eiscp.on('system-power', (pwr) => {
				console.log(pwr);
			})
			// console.log(eiscp.eventNames());
			// eiscp.close();
			// eiscp.removeAllListeners();
			// console.log(eiscp.eventNames());

		})
	}
});

// var interfaces = os.networkInterfaces();

// console.log(interfaces);


//  :::: add to sets: set1

// eiscp.on('connect', function () {

//     // Change the receiver volume to 22
//     eiscp.command("main.master-volume=80");
// 	// Same thing below just written with different formats
//     //eiscp.command("volume:22");
//     //eiscp.command("volume 22");
//     //eiscp.command("main.volume=22");
//     //eiscp.command("main.volume:22");
//     //eiscp.command("main.volume 22");

//     // eiscp.close();

// });

// ::: ::: WORKING SAMPLES ::: :::

// eiscp.on('volume', (vol) => {
//     console.log(vol);
// })

// eiscp.on('input-selector', (src) => {
//     console.log(src);
// })

// eiscp.on('system-power', (pwr) => {
//     console.log(pwr);
// })