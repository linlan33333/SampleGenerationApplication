<template>
  <q-list v-show="searchImageName === ''" class="full-width" v-for="(folder, listIndex) in imgFolder"
          :key="componentKey">
    <q-expansion-item
      switch-toggle-side
      v-model="folder.expanded">
      <template v-slot:header>
        <q-item-section>
          <q-item-label>
            {{folder.dirName}}
          </q-item-label>
        </q-item-section>

        <q-item-section side v-close-popup>
          <div class="row" v-close-popup>
            <q-btn flat padding="xs" icon="add" @click.stop="importMultiImages(listIndex, folder.dirName)" v-close-popup>
              <q-tooltip class="text-subtitle2">
                导入图片
              </q-tooltip>
            </q-btn>

            <q-btn flat padding="xs" icon="edit" @click.stop="openFolderRenameDialog(folder.dirName, listIndex)" v-close-popup>
              <q-tooltip class="text-subtitle2">
                重命名
              </q-tooltip>
            </q-btn>
          </div>

          <q-dialog v-model="folderRenameDOpen" persistent>
            <q-card flat class="full-width">
              <q-card-section class="q-pt-lg">
                <q-input dense outlined v-model="newFolderName" placeholder="请输入文件夹名称" />
              </q-card-section>

              <q-card-actions align="right">
                <q-btn dense flat label="取消" @click="folderRenameDOpen = false" v-close-popup />
                <q-btn dense flat label="确定" @click="renameFolder" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </q-item-section>
      </template>
      <q-card flat>
        <q-card-section>
          <div class="image-container flex wrap justify-start q-gutter-sm">
            <q-item v-for="(imgUrl, index) in folder.imgUrls" :key="index"
                    class="image-item column">
              <q-item-section class="full-width">
                <q-img :src="imgUrl"
                       class="rounded-borders clickable-img"
                       :class="{'highlighted-img': index === selectedImageIndex && listIndex === selectedListIndex}"
                       @click="selectImage(imgUrl, index, listIndex)"
                       ratio="1" />
              </q-item-section>
              <q-item-label class="self-center q-pt-sm col-auto" lines="1">
                {{imgUrl.split('/').pop()}}
              </q-item-label>
            </q-item>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-list>

  <q-card v-show="searchImageName !== ''" flat>
    <q-card-section>
      <div class="image-container flex wrap justify-start q-gutter-sm">
        <q-item v-for="(imgUrl, index) in targetImages" :key="index"
                class="image-item column">
          <q-item-section class="full-width">
            <q-img :src="imgUrl"
                   class="rounded-borders clickable-img"
                   :class="{'highlighted-img': index === selectedImageIndex}"
                   @click="selectImage(imgUrl, index, -1)"
                   ratio="1" />
          </q-item-section>
          <q-item-label class="self-center q-pt-sm col-auto" lines="1">
            {{imgUrl.split('/').pop()}}
          </q-item-label>
        </q-item>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { ref, onMounted, watch, getCurrentInstance, inject } from 'vue';
import { useStore } from 'vuex';
import { useQuasar } from 'quasar';
import { FOLDERPATH } from "src/utils/global-args";

export default {
  name: "FolderList",

  props: [
    "newFolderName",      // tool-bar组件创建文件夹的名字
    "searchImageName",    // tool-bar组件搜索图片的名字
    "importFolderPath",   // tool-bar组件导入文件夹的路径
    "afterModFolder",     // display-part组件修改后的
    "renameImgData",      // 重命名的数据
  ],

  emits: [
    "selectedImgUrl"
  ],

  setup() {
    const fs = require('fs');
    const fsCp = require('fs-extra');
    const $q = useQuasar();
    const { dialog } = require('@electron/remote');
    const store = useStore();

    const emit = getCurrentInstance().emit;
    const props = getCurrentInstance().props;

    const imgFolder = ref([]);      // 工作目录下的所有文件夹以及里面的图片信息都会存放到这里
    const targetImages = ref([]);   // 显示搜索目标图片时会将符合要求的图片存放到这里
    const selectedImageIndex = ref(-1);   // 为了控制选中的图片显示高亮的样式，需要记录选中的图片的index和所在列表项的index
    const selectedListIndex = ref(-1);
    const selectedImageUrl = ref("");     // 记录选中的图片的url
    const folderRenameDOpen = ref(false);   // 文件夹重命名的对话框是否打开
    const newFolderName = ref("");    // 文件夹重命名后的名字
    const renameDirName = ref("");    // 重命名时选择的文件夹名称
    const renameDirIndex = ref(null); // 重命名时选择的文件夹序号
    const show = inject("show");

    const urlTemp = ref(FOLDERPATH);

    const componentKey = ref(0);    // 强制组件刷新的key

    // 这里假设本软件管理的图片文件夹的路径在这个文件夹中，这里将用户的所有图片文件夹读出来并展示在前端
    onMounted( () => {
      fs.readdir(FOLDERPATH, (err, dirs) => {
        if (err) {
          console.log("读取目录失败：", err);
          return;
        }

        for (let dir of dirs) {
          // 定义一个临时变量，等把当前文件夹中的图片的url都存放好后再添加进imgFolder
          let temp = {
            dirName: dir,
            expanded: false,
            imgUrls: []
          }

          fs.readdir(FOLDERPATH + dir, (err, files) => {
            if (err) {
              console.log("读取图片文件失败：", err);
              return;
            }

            for (let file of files) {
              temp.imgUrls.push(urlTemp.value + dir + '/' + file);
            }
          })

          imgFolder.value.push(temp);
        }
      });

      // 把数据扔到vuex中
      // store.commit('setImgFolder', imgFolder.value);
    })

    // 新建文件夹
    watch(() => props.newFolderName, () => {
      const tmp = {
        dirName: props.newFolderName,
        expanded: false,
        imgUrls: []
      }
      imgFolder.value.push(tmp);
      $q.notify({
        message: "创建成功",
        color: "custom-notification",
        position: "top"
      });

      // 把数据扔到vuex中
      // store.commit('setImgFolder', imgFolder.value);
    });

    watch(() => props.searchImageName, () => {
      targetImages.value = [];    // 清空targetImages

      for (let dir of imgFolder.value) {
        for (let imgUrl of dir.imgUrls) {
          // 这里拿到的是不带后缀名的图片名称
          let imgName = imgUrl.split('/').pop().split('.')[0];
          // 这样就可以支持模糊搜索
          if (imgName.includes(props.searchImageName)) {
            targetImages.value.push(imgUrl);
          }
        }
      }
    });

    watch(() => props.importFolderPath, () => {
      // 获取文件夹名称
      let dirPath = props.importFolderPath;
      const dirName = dirPath.split('\\').pop();
      let temp = {
        dirName: dirName,
        expanded: false,
        imgUrls: []
      };

      const importDirNotyfy = $q.notify({
        group: false,   // 必须开这个选项允许更新进度
        timeout: 0,     // 让用户可以同时干其他事情
        spinner: true,
        message: '导入中...',
        position: 'top'
      })

      fs.mkdirSync(FOLDERPATH + dirName);

      fsCp.copySync(dirPath, FOLDERPATH + dirName);

      fs.readdir(FOLDERPATH + dirName, (err, files) => {
        if (err) {
          importDirNotyfy({
            icon: 'error',
            spinner: false,
            message: '导入失败',
            position: 'top',
            timeout: 2500
          })
          return;
        }

        for (let file of files) {
          temp.imgUrls.push(FOLDERPATH + dirName + '/' + file);
        }

        imgFolder.value.push(temp);

        // 把数据扔到vuex中
        // store.commit('setImgFolder', imgFolder.value);
      })

      importDirNotyfy({
        icon: 'done', // we add an icon
        spinner: false, // we reset the spinner setting so the icon can be displayed
        message: '导入成功',
        position: 'top',
        timeout: 2500 // we will timeout it in 2.5s
      })
    });

    // 没走这条路
    watch(() => props.afterModFolder, () => {
      show();
    });

    watch(() => props.renameImgData, () => {
      show();
    });

    return {
      imgFolder,
      urlTemp,
      targetImages,
      selectedImageIndex,
      selectedListIndex,
      folderRenameDOpen,
      newFolderName,
      componentKey,

      selectImage(imgUrl, index, listIndex) {
        selectedImageIndex.value = index;
        selectedListIndex.value = listIndex;
        selectedImageUrl.value = imgUrl;
        emit("selectedImgUrl", imgUrl, imgFolder.value);
      },

      openFolderRenameDialog(dirName, listIndex) {
        folderRenameDOpen.value = true;
        renameDirName.value = dirName;
        renameDirIndex.value = listIndex;
      },

      renameFolder() {
        const oldPath = FOLDERPATH + renameDirName.value;
        const newPath = FOLDERPATH + newFolderName.value;

        fs.rename(oldPath, newPath, (err) => {
          if (err) {
            $q.notify({
              message: "重命名失败",
              position: "top"
            })
            console.log(err);
          }

          imgFolder.value[renameDirIndex.value].dirName = newFolderName;
          let selectedImageName = selectedImageUrl.value.split('/').pop();
          const newImgUrl = newPath + '/' + selectedImageName;
          console.log(newImgUrl);
          emit("selectedImgUrl", newImgUrl);
        });
      },

      // 支持一次性导入多张图片进来
      importMultiImages(listIndex, dirName) {
        dialog.showOpenDialog({
          properties: ['openFile', 'multiSelections'],
          filters:[
            {
              name: 'Image',
              extensions: ['jpg', 'png', 'jpeg', 'webp']    // 这得看那些深度学习算法支持哪些格式的图片了，后续再加
            }
          ]
        }).then((res) => {
          if (!res.canceled && res.filePaths.length > 0) {
            for (let imgPath of res.filePaths) {
              const imgName = imgPath.split('\\').pop();
              fsCp.copySync(imgPath, FOLDERPATH + dirName + '/' + imgName);
              imgFolder.value[listIndex].imgUrls.push(FOLDERPATH + dirName + '/' + imgName);
            }

            $q.notify({
              message: "导入图片完成",
              position: "top"
            })
          }
        });
      },
    }
  },
}
</script>

<style lang="sass" scoped>
.image-container
  //display: flex
  //flex-wrap: wrap
  //justify-content: space-between
  width: 100%
  margin: 0 auto

.image-item
  width: calc(20% - 8px)
  margin-bottom: 20px
//aspect-ratio: 1

.clickable-img
  cursor: pointer

.highlighted-img
  border: 2px solid #1976D2
</style>
