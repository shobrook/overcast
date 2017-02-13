// GLOBALS

var {ipcRenderer, remote} = require('electron');
var app = remote.require('./app.js');

// MAIN

onload = function() {
	// TO-DO: Prevent form reset onsubmit

	document.forms['form'].onsubmit = function() {
		var un = document.loginform.usr.value;
		var pw = document.loginform.pword.value;

		ipcRenderer.send('credentials', {username: un, password: pw}); // Send credentials to main process
	}

	ipcRenderer.on('login-status', (event, arg) => {
		if (arg == false) {
			document.getElementById("heading").innerHTML = "Incorrect email or password.";
			document.getElementById("heading").style["color"] = "#FF2619";
			// TO-DO: Reset form
		}
	});
}