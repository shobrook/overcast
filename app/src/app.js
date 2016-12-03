const {app, BrowserWindow, ipcMain} = require('electron');
let mainWindow;

app.on('window-all-closed', function() {
	app.quit();
});

app.on('ready', function() {
	mainWindow = new BrowserWindow({
		width: 833,
		height: 512,
		titleBarStyle: 'hidden' // Hides the traffic lights
	});
	mainWindow.loadURL('file://' + __dirname + '/windows/splash/splash.html');

	// TO-DO: Replace the timeout function with a DOM event that, while X
	// condition, loads the splash screen
	setTimeout(function() {
		mainWindow.loadURL('file://' + __dirname + '/windows/main/main.html');
	}, 2000);
});

// Communicating with the renderer process for logging
ipcMain.on('async', (event, arg) => {
	console.log(arg);
});