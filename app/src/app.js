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
		width: 945,
		height: 600,
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

app.on('closed', function() {
	app.quit();
});

/*
// Communicating with the renderer process for logging
ipcMain.on('async', (event, arg) => {
	console.log(arg);
});
<<<<<<< HEAD
=======
*/
>>>>>>> master
