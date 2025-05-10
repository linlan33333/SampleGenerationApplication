<template>
  <div class="column full-height justify-around q-pl-md q-pr-md">
    <div class="full-width q-pt-md">
      <q-card flat>
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label>文件名: </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1">{{textName}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>所属文件夹: </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1">{{selectedTextFolderName}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>文件大小: </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1">{{textFileSize}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>

    <div class="column q-pt-md">
      <div>
        <q-btn class="full-width q-dark" flat label="预览" @click="openPlayTextDialog" />
      </div>

      <div class="q-pt-sm">
        <q-btn class="full-width q-dark" flat label="移动文件" @click="openRemoveTextDialog" />
      </div>

      <div class="q-pt-sm">
        <q-btn class="full-width q-dark" flat label="重命名" @click="renameTextDialogOpen = true" />
      </div>

      <div class="q-pt-sm">
        <q-btn class="full-width q-dark" flat label="删除" @click="deleteTextFile" />
      </div>
    </div>
  </div>

  <q-dialog v-model="removeTextDialogOpen" persistent>
    <q-card flat class="full-width">
      <q-card-section class="q-pt-lg">
        <q-select outlined class="full-width" v-model="selectNewFolderName"
                  :options="textFolderNames" label="选择目标文件夹" virtual-scroll-slice-size="2" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn dense flat label="取消" @click="closeRemoveTextDialog" v-close-popup />
        <q-btn dense flat label="确定" @click="removeText" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="renameTextDialogOpen" persistent>
    <q-card flat class="full-width">
      <q-card-section class="q-pt-lg">
        <q-input dense outlined v-model="newTextName" placeholder="请输入文件名称" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn dense flat label="取消" @click="closeRenameTextDialog" v-close-popup />
        <q-btn dense flat label="确定" @click="renameText" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="playTextDialogOpen" persistent>
    <q-card flat class="full-width">
      <q-card-section>
<!--        <q-infinite-scroll-->
<!--          :offset="250"-->
<!--          @load="loadMoreContent"-->
<!--          class="full-width"-->
<!--        >-->
          <pre>{{ textFileContext }}</pre>
<!--        </q-infinite-scroll>-->
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat @click="closeTextPlayDialog">关闭</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {ref, getCurrentInstance, watch, onMounted, onBeforeUnmount, computed} from 'vue';
import { toRaw } from '@vue/reactivity';
import {TEXTFOLDERPATH, FOLDERPATH} from "src/utils/global-args";
import bus from "src/utils/bus";
import fs from "fs";

export default {
  name: "ImageInfo",

  setup() {
    const fs = require('fs');
    const fsextra = require('fs-extra');

    const textUrl = ref(null);
    const textName = ref(null);
    const textFolder = ref(null);
    const selectedTextFolderName = ref(null);
    const textFileSize = ref("");
    const textFolderNames = ref([]);
    const selectNewFolderName = ref(null);   // 移动文件的新文件夹名称
    const newTextName = ref(null);   // 文本重命名后的名称

    const textFileContext = ref('');    // 存储文本预览内容
    const filePosition = ref(0);    // 当前读取的位置
    const loadingFile = ref(false);
    const allLoaded = ref(false);   // 标志是否已经加载完所有内容
    const chunkSize = ref(1024);    // 每次读取文本的数据量

    const playTextDialogOpen = ref(false);
    const removeTextDialogOpen = ref(false);
    const renameTextDialogOpen = ref(false);

    onMounted(() => {
      bus.on('selectedTextUrl', params => {
        textUrl.value = params.textUrl;
        textFolder.value = params.textFolder;
      })
    })

    onBeforeUnmount(() => {
      bus.off('selectedTextUrl');
    })

    watch(() => textUrl.value, () => {
      if (textUrl.value) {
        let textUrlTemp = textUrl.value;
        let textUrlSlice = textUrlTemp.split('/');
        textName.value = textUrlSlice[textUrlSlice.length - 1];
        selectedTextFolderName.value = textUrlSlice[textUrlSlice.length - 2];

        fs.stat(textUrl.value, (err, stats) => {
          if (err) {
            textFileSize.value = null;
          }

          let fileSizeInBytes = stats.size;
          if (fileSizeInBytes >= 1024 * 1024) {
            fileSizeInBytes /= 1024 * 1024;
            textFileSize.value = fileSizeInBytes.toFixed(2).toString() + "M";
          }
          else if (stats.size >= 1024) {
            fileSizeInBytes /= 1024;
            textFileSize.value = fileSizeInBytes.toFixed(2).toString() + "KB";
          }
          else {
            textFileSize.value = fileSizeInBytes + "B";
          }
        });
      }
    })

    return {
      thumbStyle: ref({                     // 设置侧边滚动条样式的
        width: '0px',
      }),
      textUrl,
      textName,
      selectedTextFolderName,
      textFileSize,
      removeTextDialogOpen,
      renameTextDialogOpen,
      selectNewFolderName,       // 移动文件功能选择的新文件夹名称
      textFolderNames,            // 移动文件功能可以选择的文件夹名称
      newTextName,                // 图片重命名后的名称
      playTextDialogOpen,
      textFileContext,
      filePosition,
      loadingFile,
      allLoaded,
      chunkSize,

      // 取消移动文件
      closeRemoveTextDialog() {
        selectNewFolderName.value = null;
        textFolderNames.value = [];
        removeTextDialogOpen.value = false;
      },

      removeText() {
        const newTextUrl = TEXTFOLDERPATH + selectNewFolderName.value + '/' + textName.value;
        // 修改textFolder数组
        let folderList = toRaw(textFolder.value);
        for (let item of folderList) {
          if (item.dirName === selectedTextFolderName.value) {
            for (let index in item.textUrls) {
              if (item.textUrls[index] === textUrl.value) {
                item.textUrls.splice(index, 1);
              }
            }
          }

          if (item.dirName === selectNewFolderName.value) {
            item.textUrls.push(newTextUrl);
          }
        }
        // 修改文本的展示列表
        selectedTextFolderName.value = selectNewFolderName.value;
        // 修改textFolder，因为向managment-part组件传递修改后的textFolder是不会再从managment-part组件传递回来的
        textFolder.value = folderList;
        // 清空数据
        textFolderNames.value = [];
        selectNewFolderName.value = null;
        // 移动文件
        fsextra.moveSync(textUrl.value, newTextUrl);
        // 把结果传递出去
        bus.emit('afterModifyTextFolder', textFolder.value);
      },

      openRemoveTextDialog() {
        const folderList = toRaw(textFolder.value);
        for (let folder of folderList) {
          if (folder.dirName !== selectedTextFolderName.value) {
            textFolderNames.value.push(folder.dirName);
          }
        }

        removeTextDialogOpen.value = true;
      },

      openPlayTextDialog() {
        playTextDialogOpen.value = true;
        fs.readFile(textUrl.value, (err, data) => {
          if (err) {
            console.log("傻逼nodejs");
          }
          else {
            textFileContext.value = data.toString();
          }
        })
      },

      async loadMoreContent() {
        if (loadingFile.value || allLoaded.value) {
          return;
        }

        loadingFile.value = true;
        try {
          const fd = await fs.promises.open(textUrl.value, 'r');
          let buffer = Buffer.alloc(chunkSize.value);  // 文本的每次读取数据量大小自己定
          const { bytesRead } = await fd.read(buffer, 0, chunkSize.value, filePosition.value);
          await fd.close();
          textFileContext.value = buffer.toString('utf-8', 0, bytesRead);
        }
        catch (err) {
          console.log("Failed to load more content", err);
        }
        loadingFile.value = false;
      },

      closeRenameTextDialog() {
        newTextName.value = null;
      },

      // 这个功能本来不想做成弹窗的，应当做成在图片下方的命名框中直接修改的
      renameText() {
        // 边界检查
        // let fileNameNoSuffix = newTextName.value.substring(0, newTextName.value.lastIndexOf("."));
        // newTextName.value = fileNameNoSuffix + ".txt";

        const renameTextData = {
          dirName: selectedTextFolderName.value,
          newName: newTextName.value,
          textUrl: textUrl.value,
          newTextUrl: TEXTFOLDERPATH + selectedTextFolderName.value + '/' + newTextName.value
        }
        fs.renameSync(textUrl.value, TEXTFOLDERPATH + selectedTextFolderName.value + '/' + newTextName.value);
        bus.emit("renameTextData", renameTextData);
        textUrl.value = TEXTFOLDERPATH + selectedTextFolderName.value + '/' + newTextName.value;
        renameTextDialogOpen.value = false;
        // 别忘了把输入栏中的数据清空
        newTextName.value = null;
      },

      // 删除文件
      deleteTextFile() {
        const deletedTextInfo = {
          dirName: selectedTextFolderName.value,
          textUrl: textUrl.value
        }

        fs.unlinkSync(textUrl.value);
        bus.emit("deleteTextDate", deletedTextInfo);
      },

      closeTextPlayDialog() {
        playTextDialogOpen.value = false;
        textFileContext.value = '';
        filePosition.value = 0;
        allLoaded.value = false;
        loadingFile.value = false;
      }
    }
  },
}
</script>

<style lang="sass" scoped>
.image-style
  max-width: calc(90%)

.scroll-area
  overflow-y: auto
  height: calc(100% - 56px)
</style>
