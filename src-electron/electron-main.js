import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import os from 'os'

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

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
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
      // sandbox: false
      webSecurity: false          // 读取并加载用户本地图片时要开启的选项
    }
  })

  mainWindow.loadURL(process.env.APP_URL)

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
