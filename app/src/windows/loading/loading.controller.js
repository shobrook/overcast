// GLOBALS

var {ipcRenderer, remote} = require('electron');
var app = remote.require('./app.js');
var axolotl = require('axolotl');

// MAIN

onload = function() {
	// Listens for confirmation of FBID receipt
	ipcRenderer.on('fbid-status', (event, arg) => {
		if (arg == true) {
			// Generate keybundle
		}
	});
}