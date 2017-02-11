// GLOBALS

var {ipcRenderer, remote} = require('electron');
var app = remote.require('./app.js');
var Horseman = require('node-horseman');

// MAIN

onload = function() {
	var horseman = new Horseman(); // Initialize headless browser

	// Listen for a form submission
	document.forms['form'].onsubmit = function() {
		var un = document.loginform.usr.value;
		var pw = document.loginform.pword.value;
		
		ipcRenderer.send('async', 'Form submitted for: ' + un);

		// Post credentials to fb.com/login and scrape FBID
		horseman
		  .userAgent('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0')
		  .open('https://www.facebook.com/login.php')
		  .type('input[id="email"]', un) // Fill username
		  .type('input[id="pass"]', pw) // Fill password
		  .click('[id="loginbutton"]') // Login
		  .wait(2000)
		  .screenshot('test.png')
		  .open('https://www.producthunt.com/')
		  .evaluate(/*onload = */function() {
		  	var fbid = 0;

		  	window.fbAsyncInit = function() {
		  		FB.init({
		  			appId: '196762700753455',
		  			status: true,
		  			xfbml: true,
		  			version: 'v2.5'
		  		});
		  		FB.getLoginStatus(function(response) {
		  			if (response.status == 'connected') {
		  				console.log('We are connected.');
		  				function getInfo() {
		  					FB.api('/me', 'GET', {fields: 'first_name,last_name,name,id'}, function(response) {
		  						if (response.id) {
		  							fbid = response.id;
		  							console.log(response.first_name + ' ' + response.last_name);
		  							console.log(fbid);
		  						}
		  					});
		  				}
		  				getInfo();
		  			} else if (response.status == 'not_authorized') {
		  				console.log('We are not logged in.');
		  			} else {
		  				console.log('You are not logged into Facebook.');
		  			}
		  		});
		  	}

		  	(function(d, s, id) {
		  		var js, fjs = d.getElementsByTagName(s)[0];
		  		if (d.getElementById(id)) {
		  			return;
		  		}
		  		js = d.createElement(s);
		  		js.id = id;
		  		js.src = "https://connect.facebook.net/en_US/sdk.js";
		  		fjs.parentNode.insertBefore(js, fjs);
		  	}(document, 'script', 'facebook-jssdk'));

		  	return fbid;
		  })
		  .then(function(fbid) {
		  	console.log(fbid);
		  	ipcRenderer.send('async', fbid);
		  })
		  .log()
		  .close();
	}
}

/* PSEUDO
 * 1) Initialize headless browser onload of the login page
 * 2) Scrape user's inputted FB credentials on form submit
 * 3) Post credentials to fb.com/login in headless browser
 *      1) On successful login, initialize FBID scraper
 			1) Send FBID to main process using ipcRenderer
 *		2) Else return 'Incorrect email or password.' error screen (new page?)
 * 4) Initialize loading screen upon receipt of FBID
*/