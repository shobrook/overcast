const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');

let loginStatus = false;

function createWindow(url, nodeInt, showInt) {
	const win = new BrowserWindow({
		title: 'Encrypted Messenger',
		width: 975,
		height: 650,
		show: showInt,
		titleBarStyle: 'hidden',
		webPreferences: {
			//preload: path.join(__dirname, 'preload.js'),
			//webSecurity: false,
			nodeIntegration: nodeInt,
			plugsin: true
		}
	});

	win.loadURL(url);

	return win;
}

app.on('ready', function() {
	loginWindow = createWindow('file://' + __dirname + '/windows/login/login.html');
	loginWindow.show();

	ipcMain.on('credentials', (event, arg) => {
		var cred = arg;
		if (('username' in arg) && ('password' in arg)) {
			console.log('Form submitted for: ' + arg['username']);

			let tempWindow = new BrowserWindow({
				width: 975,
				height: 650,
				show: false,
				webPreferences: {
					nodeIntegration: false
				}
			});

			var injection = 'document.getElementById("email").value = "' + String(arg['username']) + '"; document.getElementById("pass").value = "' + String(arg['password']) + '"; document.getElementById("loginbutton").click();';

			tempWindow.loadURL('https://www.messenger.com/login');
			tempWindow.webContents.on('did-finish-load', () => {
				tempWindow.webContents.executeJavaScript(injection);
			});
			tempWindow.webContents.on('did-navigate', function statusHandler(event, url) {
				if (url == 'https://www.messenger.com/login/password/') {
					console.log('Incorrect username or password.');
					loginWindow.webContents.send('login-status', false);
				}
				if (url == 'https:/www.messenger.com/') {
					console.log('User signed in!');
				}
			});
		}
	});



	// TO-DO: Hide the messenger.com screen

	// Receive FB credentials from renderer*
	// Load, but don't show, messenger.com/login with a preload.js
	// Send credentials to preload (after page loads)
	// POST credentials to loginform (renderer)
	// Receive login status from renderer
	// If successful, load loading screen...
	// If unsuccessful, load error screen

	//loading = createWindow('file://' + __dirname + '/windows/loading/loading.html');
	//loading.show();
});

/*
app.on('ready', function() {
	signInWindow = createWindow('https://www.facebook.com/login', false);
	signInWindow.show();

	signInWindow.webContents.on('did-navigate-in-page', function(event, url) {
		if (url == 'https://www.facebook.com/') {
			splashWindow = createWindow('http://localhost:8000/windows/loading/main.html', true);
			splashWindow.show();
			ipcMain.on('async', (event, arg) => {
				console.log(arg);
				if (arg) {
					mainWindow = createWindow('https://www.messenger.com/', false);
					mainWindow.show();
					mainWindow.webContents.openDevTools();
					mainWindow.webContents.on('did-navigate-in-page', function(event, url) {
						if (url == 'https://www.messenger.com/') {
							console.log('test');
						}
					});
				}
			});
		}
	});
});
*/

app.on('closed', function() {
	app.quit();
});


// Communicating with the renderer process for logging
ipcMain.on('async', (event, arg) => {
	console.log(arg);
});

// Initialize headless browser onload of the login page.
// Scrape user's inputted FB credentials on form submit.
// Post credentials to facebook.com in headless browser; on successful login, initialize FBID scraper,
// else return 'Incorrect email or password.' error screen
// Run Malik's JS in headless browser to scrape user's FBID, then send the FBID to the main process using ipcRenderer.
// Upon receipt of FBID, initialize the loading screen.
// Generate the user's keybundle in the renderer and pass all data to both local directories and the main process.
// Push the FBID and public prekeys to MongoDB.
// After server receipt confirmation, load the messenger.com/login wrapper (but do not show).
// Preload the JS injection that posts FB credentials to login form and decrypts all messages on-screen.
// Then show the messenger screen after confirmation from the JS injection.