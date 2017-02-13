const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path');
const url = require('url');

function createWindow(title, show, node) {
	const win = new BrowserWindow({
		title: title,
		width: 975,
		height: 650,
		show: show,
		titleBarStyle: 'hidden',
		webPreferences: {
			nodeIntegration: node
		}
	});

	return win;
}

app.on('ready', function() {
	let login = createWindow('Login', true, true);
	let loading = createWindow('Loading', false, true);
	let messenger = createWindow('Encrypted Messenger', false, false);

	login.loadURL('file://' + __dirname + '/windows/login/login.html');

	// Listens for login status
	ipcMain.on('credentials', (event, arg) => {
		let temp = createWindow('Temp', false, false);
		var injection = 'document.getElementById("email").value = "' + String(arg['username']) + '"; document.getElementById("pass").value = "' + String(arg['password']) + '"; document.getElementById("loginbutton").click();';

		console.log('Form submitted for: ' + arg['username']);

		temp.loadURL('https://www.messenger.com/login');

		// Post FB credentials to login form
		temp.webContents.on('did-finish-load', () => {
			temp.webContents.executeJavaScript(injection);
		});

		// Detect (un)successful login
		temp.webContents.on('did-navigate', function statusHandler(event, url) {
			if (url == 'https://www.messenger.com/') {
				console.log('Successful login.');
				
				loading.loadURL('file://' + __dirname + '/windows/loading/loading.html');
				loading.show(); // TO-DO: Set loading time-frame dynamically

				// DEMONSTRATION PURPOSES ONLY
				setTimeout(function() {
					messenger.loadURL('https://www.messenger.com/');
					messenger.show();

					// Attempt at installing ReactDevTools
					if (process.env.NODE_ENV === 'development') {
						messenger.addDevToolsExtension('/Users/shobrook/Library/Application Support/Google/Chrome/' + 'default/Extensions/fmkadmapgofadopljbjfkapdkoienihi/0.15.0_0');
					}
					messenger.openDevTools();
				}, 5500);
			} else if (url == 'https://www.messenger.com/login/password/') {
				console.log('Incorrect username or password.');
				
				login.webContents.send('login-status', false);
				setImmediate(function() {
					temp.close();
				});
			}
		});
	});
});

/* TO-DO:
 * 	1) Load messenger (in background) and add ReactDevTools
 *  2) Inject framework.js, scrape FBID and send to main process
 *  3) Send FBID receipt confirmation to loading renderer
 *  4) Generate keybundle in loading renderer
 *  5) Send keybundle to main process
 *  6) Push FBID + keybundle to MongoDB (private keys to local dir?)
 *  7) Send decryption confirmation to main process (from messenger renderer)
 *  8) Load messenger in the foreground
*/

app.on('closed', function() {
	app.quit();
});