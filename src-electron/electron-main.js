import { app, BrowserWindow } from 'electron'
import path from 'path'
import os from 'os'

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

// 1、使用remote，为了能让渲染进程中也能使用remote，请按照这三步走，剩下两步在下面
// 参考博客https://www.jianshu.com/p/7ed27f343e81
const remote = require("@electron/remote/main");
remote.initialize();

let mainWindow

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 1000,
    height: 600,
    useContentSize: true,
    webPreferences: {
      contextIsolation: false,    // 打通主进程与渲染进程要开启的选项，这样就可以在vue文件中使用node.js的能力了
      nodeIntegration: true,      // 打通主进程与渲染进程要开启的选项，这样就可以在vue文件中使用node.js的能力了
      enableRemoteModule:true,    // 2、开启允许渲染进程使用remote选项
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
      // sandbox: false
      webSecurity: false          // 读取并加载用户本地图片时要开启的选项
    },
    // autoHideMenuBar: true
  })

  mainWindow.loadURL(process.env.APP_URL)

  // 3、启用remote模块，渲染进程就可以使用remote模块了
  // 这样就可以在渲染进程中使用dialog功能了
  remote.enable(mainWindow.webContents);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    // 打开应用时自动打开调试窗口
    mainWindow.webContents.openDevTools()
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

// 生命周期函数，这些都是主进程干的事，比如打印一句话，会直接在下面的终端中打印出来而不是在浏览器调试窗口中打印
app.on('window-all-closed', () => {
  // mac系统平台叫darwin，因为mac系统退出应用时app不会彻底退出，而是挂在状态栏里，
  // 所以得加上这么一个逻辑让它在mac系统上退出时彻底退出
  if (platform !== 'darwin') {
    app.quit()    // app彻底关闭
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

const { dialog } = require('electron');
dialog.showOpenDialog({ properties: ['openDirectory'] });
