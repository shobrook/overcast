


var {ipcRenderer, remote} = require('electron');

onload = function() {
	//var getInfo = document.getElementById('getinfo'); 
	//var login = document.getElementById('login'); 
	//var statusDiv = document.getElementById('status'); 
	var fbid = 0;

	window.fbAsyncInit = function() {
		FB.init({
	       	appId: '196762700753455',
	       	status: true,
	       	xfbml: true,
	       	version: 'v2.5'
	    });
	    FB.getLoginStatus(function(response) {
	    	if (response.status === 'connected') {
	    	  	//document.getElementById('status').innerHTML = 'We are connected.';
	           	//document.getElementById('login').style.visibility = 'hidden';
	           	console.log('We are connected.');
	           	function getInfo() {
					FB.api('/me', 'GET', {fields: 'first_name,last_name,name,id'}, function(response) {
	    				var innerStatus = response.first_name + ' ' + response.last_name +': ' + response.id; //document.getElementById('status').innerHTML = response.first_name + ' ' + response.last_name +': ' + response.id;
	    				if (response.id) {
	    					//ipcRenderer.send('async', response.id);
	    					fbid = response.id;
	    					console.log(fbid);
	    				}
	    			});
				}
	           	getInfo();
	        } else if (response.status === 'not_authorized') {
	           	//document.getElementById('status').innerHTML = 'We are not logged in.';
	           	console.log('We are not logged in.');
	        } else {
	           	//document.getElementById('status').innerHTML = 'You are not logged into Facebook.';
	           	console.log('You are not logged into Facebook.');
	        }
	   	});
	};

	(function(d, s, id){
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement(s); js.id = id;
		js.src = "https://connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

	function newLogin() { //document.getElementById('login').onclick = function() {
	   	FB.login(function(response) {
	       	if (response.status === 'connected') {
	           	//document.getElementById('status').innerHTML = 'Connected.';
	           	//document.getElementById('login').style.visibility = 'hidden';
	           	console.log('Connected.');
	        } else {
	           	//document.getElementById('status').innerHTML = 'You are not logged into Facebook.';
	           	console.log('You are not logged into Facebook.');
	        }
	    }, {scope: '', display: ''});
	}
}



onload = function() {
	//var getInfo = document.getElementById('getinfo'); 
	//var login = document.getElementById('login'); 
	//var statusDiv = document.getElementById('status'); 
	var fbid = 0;

	window.fbAsyncInit = function() {
		FB.init({
	       	appId: '196762700753455',
	       	status: true,
	       	xfbml: true,
	       	version: 'v2.5'
	    });
	    FB.getLoginStatus(function(response) {
	    	if (response.status === 'connected') {
	           	console.log('We are connected.');
	           	function getInfo() {
					FB.api('/me', 'GET', {fields: 'first_name,last_name,name,id'}, function(response) {
	    				if (response.id) {
	    					console.log(response.id);
	    				}
	    			});
				}
	           	getInfo();
	        } else if (response.status === 'not_authorized') {
	           	console.log('We are not logged in.');
	        } else {
	           	console.log('You are not logged into Facebook.');
	        }
	   	});
	};

	(function(d, s, id){
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement(s); js.id = id;
		js.src = "https://connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));
}

