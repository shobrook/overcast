var {ipcRenderer, remote} = require('electron');

onload = function() {
	window.fbAsyncInit = function() {
		FB.init({
	       	appId: '196762700753455',
	       	status: true,
	       	xfbml: true,
	       	version: 'v2.5'
	    });
	    FB.getLoginStatus(function(response) {
	    	if (response.status === 'connected') {
	    	  	document.getElementById('status').innerHTML = 'We are connected.';
	           	document.getElementById('login').style.visibility = 'hidden';
	           	function getInfo() {
					FB.api('/me', 'GET', {fields: 'first_name,last_name,name,id'}, function(response) {
	    				document.getElementById('status').innerHTML = response.first_name + ' ' + response.last_name +': ' + response.id;
	    				if (response.id) {
	    					//ipcRenderer.send('async', response.id);
	    				}
	    			});
				}
	           	getInfo();
	        } else if (response.status === 'not_authorized') {
	           	document.getElementById('status').innerHTML = 'We are not logged in.';
	        } else {
	           	document.getElementById('status').innerHTML = 'You are not logged into Facebook.';
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

	function login() {
	   	FB.login(function(response) {
	       	if (response.status === 'connected') {
	           	document.getElementById('status').innerHTML = 'Connected.';
	           	document.getElementById('login').style.visibility = 'hidden';
	        } else {
	           	document.getElementById('status').innerHTML = 'You are not logged into Facebook.';
	        }
	    }, {scope: '', display: ''});
	}
}
