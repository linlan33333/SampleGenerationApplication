<template>
  <q-list v-show="searchTextName === ''" class="full-width" v-for="(folder, listIndex) in textFolder"
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
            <q-btn flat padding="xs" icon="add" @click.stop="importMultiTexts(listIndex, folder.dirName)" v-close-popup>
              <q-tooltip class="text-subtitle2">
                导入文本
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
            <q-item v-for="(textUrl, index) in folder.textUrls" :key="index"
                    class="image-item column">
              <q-item-section class="full-width">
                <q-img src="~assets/text.jpg"
                       class="rounded-borders clickable-img"
                       :class="{'highlighted-img': index === selectedImageIndex && listIndex === selectedListIndex}"
                       @click="selectText(textUrl, index, listIndex)"
                       ratio="1" />
              </q-item-section>
              <q-item-label class="self-center q-pt-sm col-auto" lines="1">
                {{textUrl.split('/').pop()}}
              </q-item-label>
            </q-item>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-list>

  <q-card v-show="searchTextName !== ''" flat>
    <q-card-section>
      <div class="image-container flex wrap justify-start q-gutter-sm">
        <q-item v-for="(textUrl, index) in targetImages" :key="index"
                class="image-item column">
          <q-item-section class="full-width">
            <q-img src="~assets/text.jpg"
                   class="rounded-borders clickable-img"
                   :class="{'highlighted-img': index === selectedImageIndex}"
                   @click="selectText(textUrl, index, -1)"
                   ratio="1" />
          </q-item-section>
          <q-item-label class="self-center q-pt-sm col-auto" lines="1">
            {{textUrl.split('/').pop()}}
          </q-item-label>
        </q-item>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import {ref, onMounted, watch, getCurrentInstance, inject, onBeforeUnmount} from 'vue';
import { useQuasar } from 'quasar';
import { FOLDERPATH, TEXTFOLDERPATH } from "src/utils/global-args";
import bus from "src/utils/bus";
import folderList from "pages/data-management/image-management/management-part/FolderList.vue";

export default {
  name: "FolderList",

  props: [
    "newFolderName",      // tool-bar组件创建文件夹的名字
    "searchTextName",    // tool-bar组件搜索图片的名字
    "importFolderPath",   // tool-bar组件导入文件夹的路径
  ],

  emits: [
    "selectedTextUrl"
  ],

  setup() {
    const fs = require('fs');
    const fsCp = require('fs-extra');
    const $q = useQuasar();
    const { dialog } = require('@electron/remote');

    const emit = getCurrentInstance().emit;
    const props = getCurrentInstance().props;

    const textFolder = ref([]);      // 工作目录下的所有文件夹以及里面的图片信息都会存放到这里
    const targetImages = ref([]);   // 显示搜索目标图片时会将符合要求的图片存放到这里
    const selectedImageIndex = ref(-1);   // 为了控制选中的图片显示高亮的样式，需要记录选中的图片的index和所在列表项的index
    const selectedListIndex = ref(-1);
    const selectedTextUrl = ref("");     // 记录选中的图片的url
    const folderRenameDOpen = ref(false);   // 文件夹重命名的对话框是否打开
    const newFolderName = ref("");    // 文件夹重命名后的名字
    const renameDirName = ref("");    // 重命名时选择的文件夹名称
    const renameDirIndex = ref(null); // 重命名时选择的文件夹序号
    const show = inject("show");

    const urlTemp = ref(TEXTFOLDERPATH);

    const componentKey = ref(0);    // 强制组件刷新的key

    // 这里假设本软件管理的图片文件夹的路径在这个文件夹中，这里将用户的所有图片文件夹读出来并展示在前端
    onMounted( () => {
      fs.readdir(TEXTFOLDERPATH, (err, dirs) => {
        if (err) {
          console.log("读取目录失败：", err);
          return;
        }

        for (let dir of dirs) {
          // 定义一个临时变量，等把当前文件夹中的图片的url都存放好后再添加进textFolder
          let temp = {
            dirName: dir,
            expanded: false,
            textUrls: []
          }

          fs.readdir(TEXTFOLDERPATH + dir, (err, files) => {
            if (err) {
              console.log("读取文本文件失败：", err);
              return;
            }

            for (let file of files) {
              temp.textUrls.push(urlTemp.value + dir + '/' + file);
            }
          })

          textFolder.value.push(temp);
        }
      });
    });

    onMounted(() => {
      bus.on("afterModifyTextFolder", params => {
        show();
      });

      bus.on("renameTextData", params => {
        let textFolderTemp = textFolder.value;
        for (let dir_info of textFolderTemp) {
          if (dir_info.dirName === params.dirName) {
            for (let i = 0; i < dir_info.textUrls.length; i++) {
              // 找到该文件夹下的原图片url，更换为新图片url
              if (dir_info.textUrls[i] === params.textUrl) {
                dir_info.textUrls[i] = params.newTextUrl;
                return;
              }
            }
          }
        }
      });

      bus.on("deleteTextDate", params => {
        let textFolderTemp = textFolder.value;
        for (let dir_info of textFolderTemp) {
          if (dir_info.dirName === params.dirName) {
            for (let i = 0; i < dir_info.textUrls.length; i++) {
              // 找到该文件夹下的原图片url，然后删掉
              if (dir_info.textUrls[i] === params.textUrl) {
                dir_info.textUrls.splice(i, 1);
                return;
              }
            }
          }
        }
      });
    });

    onBeforeUnmount(() => {
      bus.off("afterModifyTextFolder");
      bus.off("renameTextData");
      bus.off("deleteTextDate");
    });

    // 新建文件夹
    watch(() => props.newFolderName, () => {
      const tmp = {
        dirName: props.newFolderName,
        expanded: false,
        textUrls: []
      }
      textFolder.value.push(tmp);
      $q.notify({
        message: "创建成功",
        color: "custom-notification",
        position: "top"
      });
    });

    watch(() => props.searchTextName, () => {
      targetImages.value = [];    // 清空targetImages

      for (let dir of textFolder.value) {
        for (let textUrl of dir.textUrls) {
          // 拿到文本文件的名称
          let textName = textUrl.split('/').pop().split('.')[0];
          // 这样就可以支持模糊搜索
          if (textName.includes(props.searchTextName)) {
            targetImages.value.push(textUrl);
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
        textUrls: []
      };

      const importDirNotyfy = $q.notify({
        group: false,   // 必须开这个选项允许更新进度
        timeout: 0,     // 让用户可以同时干其他事情
        spinner: true,
        message: '导入中...',
        position: 'top'
      })

      fs.mkdirSync(TEXTFOLDERPATH + dirName);

      fsCp.copySync(dirPath, TEXTFOLDERPATH + dirName);

      fs.readdir(TEXTFOLDERPATH + dirName, (err, files) => {
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
          temp.textUrls.push(TEXTFOLDERPATH + dirName + '/' + file);
        }

        textFolder.value.push(temp);

      })

      importDirNotyfy({
        icon: 'done', // we add an icon
        spinner: false, // we reset the spinner setting so the icon can be displayed
        message: '导入成功',
        position: 'top',
        timeout: 2500 // we will timeout it in 2.5s
      })
    });

    return {
      textFolder,
      urlTemp,
      targetImages,
      selectedImageIndex,
      selectedListIndex,
      folderRenameDOpen,
      newFolderName,
      componentKey,

      selectText(textUrl, index, listIndex) {
        selectedImageIndex.value = index;
        selectedListIndex.value = listIndex;
        selectedTextUrl.value = textUrl;
        let textInfo = {
          textUrl,
          textFolder: textFolder.value
        }
        bus.emit("selectedTextUrl", textInfo);
      },

      openFolderRenameDialog(dirName, listIndex) {
        folderRenameDOpen.value = true;
        renameDirName.value = dirName;
        renameDirIndex.value = listIndex;
      },

      renameFolder() {
        const oldPath = TEXTFOLDERPATH + renameDirName.value;
        const newPath = TEXTFOLDERPATH + newFolderName.value;

        fs.rename(oldPath, newPath, (err) => {
          if (err) {
            $q.notify({
              message: "重命名失败",
              position: "top"
            })
            console.log(err);
          }

          textFolder.value[renameDirIndex.value].dirName = newFolderName;
          let selectedImageName = selectedTextUrl.value.split('/').pop();
          const newTextUrl = newPath + '/' + selectedImageName;
          console.log(newTextUrl);
          emit("selectedTextUrl", newTextUrl);
        });
      },

      // 支持一次性导入多个文本文件进来
      importMultiTexts(listIndex, dirName) {
        dialog.showOpenDialog({
          properties: ['openFile', 'multiSelections'],
          filters:[
            {
              name: 'Text Files',
              extensions: ['txt']    // 目前只支持txt格式文件
            }
          ]
        }).then((res) => {
          if (!res.canceled && res.filePaths.length > 0) {
            for (let textPath of res.filePaths) {
              const textName = textPath.split('\\').pop();
              fsCp.copySync(textPath, TEXTFOLDERPATH + dirName + '/' + textName);
              textFolder.value[listIndex].textUrls.push(TEXTFOLDERPATH + dirName + '/' + textName);
            }

            $q.notify({
              message: "导入文本完成",
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
  width: calc(12% - 8px)
  margin-bottom: 20px
//aspect-ratio: 1

.clickable-img
  cursor: pointer

.highlighted-img
  border: 2px solid #1976D2
</style>
