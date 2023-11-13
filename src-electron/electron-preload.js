/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 *
 * WARNING!
 * If accessing Node functionality (like importing @electron/remote) then in your
 * electron-main.js you will need to set the following when you instantiate BrowserWindow:
 *
 * mainWindow = new BrowserWindow({
 *   // ...
 *   webPreferences: {
 *     // ...
 *     sandbox: false // <-- to be able to import @electron/remote in preload script
 *   }
 * }
 */
// const fs = require('fs');   // node.js语法
// const { app, contextBridge, ipcRenderer } = require('electron');
// const path = require('path');

// contextBridge的作用是将本文件中通过node.js操作本机得到的变量传给vue文件或其他html文件
// 比如本文件中通过fs获取到某个路径下的所有文件夹名称，那么这些名称怎么传给vue文件，就通过contextBridge去传
// exposeInMainWorld会将注册的对象全部放到window对象上，而html页面是可以访问window对象的，因此就能访问到这些值了
// contextBridge.exposeInMainWorld('version', {
//   node: () => process.versions.node,
//   chrome: () => process.versions.chrome,
//   electron: () => process.versions.electron
// })

// let folder_names = [];
//
// contextBridge.exposeInMainWorld('folder', {
//   // 还非得线程同步才能读到数据，后续想办法以异步的方式读文件夹，然后在vue文件中监听window中的folder，进行响应式更新数据
//   getFolderNames: () => fs.readdirSync('E:/programing/QuasarDemo/SampleGenerationApp/imgFolder'),
// })
