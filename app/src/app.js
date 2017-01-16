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
			nodeIntegration: nodeInt,
			plugins: true
		}
	});

	win.loadURL(url);

	return win;
};

app.on('ready', function() {
	mainWindow = createWindow('file://' + __dirname + '/windows/splash/splash.html', true);
	//('file://' + __dirname + '/windows/main/main.html');

	mainWindow.show();
	setTimeout(function() { // Detect 'did-finish-load' event for mainWindow
		mainWindow.loadURL('http://localhost:8000/windows/main/get-user-info.html');
		mainWindow.webContents.openDevTools();
		
		// Check for successful sign-in, then run mainWindow.show()
	}, 3000);

});

app.on('closed', function() {
	app.quit();
});

// Communicating with the renderer process for logging
ipcMain.on('async', (event, arg) => {
	console.log(arg);
});