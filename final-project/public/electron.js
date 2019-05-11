const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
// const ur?l = require('url');
const isDev = require('electron-is-dev');
app.setBadgeCount(20);
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minHeight: 500,
        minWidth: 450,
        icon: `${__dirname}/assets/icons/png/64x64.png`,
        movable: true,
        titleBarStyle: "hidden"
    });
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
    mainWindow.on('closed', () => mainWindow = null);
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
}

app.on('ready', createWindow);

app.on('browser-window-created', (event, win) => {
    win.setAutoHideMenuBar(true);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});