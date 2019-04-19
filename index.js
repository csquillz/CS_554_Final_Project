const electron = require('electron');
const { app, BrowserWindow } = electron
app.setBadgeCount(20);
app.on('ready', () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minHeight: 500,
        minWidth: 450,
        icon: `${__dirname}/assets/icons/png/64x64.png`,
        movable: true,
        show: false,
        // frame: false,
        titleBarStyle: "hidden"
    });
    win.loadURL(`file://${__dirname}/html/index.htm`);
    win.once('ready-to-show', () => {
        win.show();
    });
});

app.on('browser-window-created', (event, win) => {
    win.setAutoHideMenuBar(true);
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit()
});
