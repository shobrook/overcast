const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');

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
			plugins: true
		}
	});

	win.loadURL(url);

	return win;
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
});

// Communicating with the renderer process for logging
ipcMain.on('async', (event, arg) => {
	console.log(arg);
});
