var electron = require('electron');
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;

var main = null; // Instantiate first splash screen of app

app.on('ready', function() { // Fires a binding 'ready' event
    main = new BrowserWindow({ // See http://electron.atom.io/docs/api/browser-window/ for various window settings
        width: 833,
        height: 512,
        titleBarStyle: 'hidden'
    });

    main.loadURL('file://' + __dirname + '/windows/splash/splash.html');

    setTimeout(function(){
        main.loadURL('file://' + __dirname + '/windows/main/main.html');
    }, 2000);
});