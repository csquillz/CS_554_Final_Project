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
        width: 950,
        height: 700,
        minWidth: 800,
        minHeight: 700,
        icon: `${__dirname}/assets/icons/png/64x64.png`,
        movable: true,
        titleBarStyle: "hidden",
        resizable: true
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