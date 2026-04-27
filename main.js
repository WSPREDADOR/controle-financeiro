const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

function createWindow() {
  const splash = new BrowserWindow({
    width: 460,
    height: 320,
    frame: false,
    transparent: true,
    resizable: false,
    movable: true,
    minimizable: false,
    maximizable: false,
    alwaysOnTop: true,
    show: true,
    autoHideMenuBar: true,
    backgroundColor: '#00000000',
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: {
      contextIsolation: true,
      sandbox: true
    }
  });

  const win = new BrowserWindow({
    width: 1480,
    height: 960,
    minWidth: 1180,
    minHeight: 760,
    backgroundColor: '#0f1418',
    show: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'build', 'icon.png'),
    title: 'Controle de Dívidas',
    webPreferences: {
      contextIsolation: true,
      sandbox: true
    }
  });

  Menu.setApplicationMenu(null);
  splash.loadFile(path.join(__dirname, 'splash.html'));
  win.loadFile(path.join(__dirname, 'index.html'));

  win.once('ready-to-show', () => {
    setTimeout(() => {
      if (!splash.isDestroyed()) {
        splash.close();
      }

      win.show();
      win.focus();
    }, 1200);
  });

  win.on('closed', () => {
    if (!splash.isDestroyed()) {
      splash.close();
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
