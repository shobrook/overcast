const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');

<<<<<<< HEAD
=======
let loginStatus = false;

>>>>>>> master
function createWindow(url, nodeInt) {
	const win = new BrowserWindow({
		title: 'Encrypted Messenger',
		width: 975,
		height: 650,
		titleBarStyle: 'hidden',
		webPreferences: {
			//preload: path.join(__dirname, 'preload.js'),
			//webSecurity: false,
			nodeIntegration: nodeInt,
<<<<<<< HEAD
			plugins: true
=======
			plugsin: true
>>>>>>> master
		}
	});

	win.loadURL(url);

	return win;
<<<<<<< HEAD
};

app.on('ready', function() {
	mainWindow = createWindow('file://' + __dirname + '/windows/splash/splash.html', false);
	//mainWindow = createWindow('file://' + __dirname + '/windows/main/main.html'); //('file://' + __dirname + '/windows/main/main.html');

	mainWindow.show();
	//mainWindow.loadURL('http://facebook.com/');
	setTimeout(function() { // Detect 'did-finish-load' event for mainWindow
		signInWindow = createWindow('http://localhost:8000/windows/main/get-user-info.html', true)
		signInWindow.show();
		signInWindow.webContents.openDevTools();
		// Check for successful sign-in, then run mainWindow.show()
	}, 1000);

	//signInWindow.webContents.openDevTools();
});

app.on('closed', function() {
	app.quit();
	signInWindow = null;
=======
}

app.on('ready', function() {
	loginWindow = createWindow('file://' + __dirname + '/windows/login/login.html');
	loginWindow.show();

	


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
>>>>>>> master
});
*/

app.on('closed', function() {
	app.quit();
});

/*
// Communicating with the renderer process for logging
ipcMain.on('async', (event, arg) => {
	console.log(arg);
});
<<<<<<< HEAD
<<<<<<< HEAD
=======
*/
>>>>>>> master
=======
*/

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
>>>>>>> master
