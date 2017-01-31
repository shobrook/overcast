const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');

let loginStatus = false;

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
			plugsin: true
		}
	});

	win.loadURL(url);

	return win;
}

app.on('ready', function() {
	loading = createWindow('file://' + __dirname + '/windows/loading/index.html');
	loading.show();
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

/*
// Communicating with the renderer process for logging
ipcMain.on('async', (event, arg) => {
	console.log(arg);
});
*/