// GLOBALS

var {ipcRenderer, remote} = require('electron');
var app = remote.require('./app.js');

// MAIN

onload = function() {
	document.forms['form'].onsubmit = function() {
		var un = document.loginform.usr.value;
		var pw = document.loginform.pword.value;

		ipcRenderer.send('credentials', {username: un, password: pw}); // Send credentials to main process
	}
	
	ipcRenderer.on('login-status', (event, arg) => {
		if (arg == false) {
			// TO-DO: Change heading to 'Incorrect email or password.', font-color to #FF2619, and reset form
		}
	});
}