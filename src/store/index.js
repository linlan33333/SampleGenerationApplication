import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'

// import example from './module-example'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    // modules: {
    //   // example
    // },
    state: {
      imgFolders: null,   // 所有被管理的图片文件夹的数据
      selectedImgUrl: null,   // 所选的图片url，用于展示在display-part组件上
    },
    mutations: {
      setImgFolder(state, value) {
        state.imgFolder = value;
      },
      setSelectedImgUrl(state, value) {
        state.selectedImgUrl = value;
      }
    },


    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING
  })

  return Store
})
