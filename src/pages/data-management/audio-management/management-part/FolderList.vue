<template>
  <q-list v-show="searchAudioName === ''" class="full-width" v-for="(folder, listIndex) in audioFolder"
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
            <q-btn flat padding="xs" icon="add" @click.stop="importMultiAudios(listIndex, folder.dirName)" v-close-popup>
              <q-tooltip class="text-subtitle2">
                导入音频
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
            <q-item v-for="(audioUrl, index) in folder.audioUrls" :key="index"
                    class="image-item column">
              <q-item-section class="full-width">
                <q-img src="~assets/audio.webp"
                       class="rounded-borders clickable-img"
                       :class="{'highlighted-img': index === selectedImageIndex && listIndex === selectedListIndex}"
                       @click="selectAudio(audioUrl, index, listIndex)"
                       ratio="1" />
              </q-item-section>
              <q-item-label class="self-center q-pt-sm col-auto" lines="1">
                {{audioUrl.split('/').pop()}}
              </q-item-label>
            </q-item>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-list>

  <q-card v-show="searchAudioName !== ''" flat>
    <q-card-section>
      <div class="image-container flex wrap justify-start q-gutter-sm">
        <q-item v-for="(audioUrl, index) in targetImages" :key="index"
                class="image-item column">
          <q-item-section class="full-width">
            <q-img src="~assets/audio.webp"
                   class="rounded-borders clickable-img"
                   :class="{'highlighted-img': index === selectedImageIndex}"
                   @click="selectAudio(audioUrl, index, -1)"
                   ratio="1" />
          </q-item-section>
          <q-item-label class="self-center q-pt-sm col-auto" lines="1">
            {{audioUrl.split('/').pop()}}
          </q-item-label>
        </q-item>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import {ref, onMounted, watch, getCurrentInstance, inject, onBeforeUnmount} from 'vue';
import { useQuasar } from 'quasar';
import { FOLDERPATH, AUDIOFOLDERPATH } from "src/utils/global-args";
import bus from "src/utils/bus";
import folderList from "pages/data-management/image-management/management-part/FolderList.vue";

export default {
  name: "FolderList",

  props: [
    "newFolderName",      // tool-bar组件创建文件夹的名字
    "searchAudioName",    // tool-bar组件搜索图片的名字
    "importFolderPath",   // tool-bar组件导入文件夹的路径
  ],

  emits: [
    "selectedAudioUrl"
  ],

  setup() {
    const fs = require('fs');
    const fsCp = require('fs-extra');
    const $q = useQuasar();
    const { dialog } = require('@electron/remote');

    const emit = getCurrentInstance().emit;
    const props = getCurrentInstance().props;

    const audioFolder = ref([]);      // 工作目录下的所有文件夹以及里面的图片信息都会存放到这里
    const targetImages = ref([]);   // 显示搜索目标图片时会将符合要求的图片存放到这里
    const selectedImageIndex = ref(-1);   // 为了控制选中的图片显示高亮的样式，需要记录选中的图片的index和所在列表项的index
    const selectedListIndex = ref(-1);
    const selectedAudioUrl = ref("");     // 记录选中的图片的url
    const folderRenameDOpen = ref(false);   // 文件夹重命名的对话框是否打开
    const newFolderName = ref("");    // 文件夹重命名后的名字
    const renameDirName = ref("");    // 重命名时选择的文件夹名称
    const renameDirIndex = ref(null); // 重命名时选择的文件夹序号
    const show = inject("show");

    const urlTemp = ref(AUDIOFOLDERPATH);

    const componentKey = ref(0);    // 强制组件刷新的key

    // 这里假设本软件管理的图片文件夹的路径在这个文件夹中，这里将用户的所有图片文件夹读出来并展示在前端
    onMounted( () => {
      fs.readdir(AUDIOFOLDERPATH, (err, dirs) => {
        if (err) {
          console.log("读取目录失败：", err);
          return;
        }

        for (let dir of dirs) {
          // 定义一个临时变量，等把当前文件夹中的图片的url都存放好后再添加进audioFolder
          let temp = {
            dirName: dir,
            expanded: false,
            audioUrls: []
          }

          fs.readdir(AUDIOFOLDERPATH + dir, (err, files) => {
            if (err) {
              console.log("读取音频文件失败：", err);
              return;
            }

            for (let file of files) {
              temp.audioUrls.push(urlTemp.value + dir + '/' + file);
            }
          })

          audioFolder.value.push(temp);
        }
      });
    });

    onMounted(() => {
      bus.on("afterModifyAudioFolder", params => {
        show();
      });

      bus.on("renameAudioData", params => {
        let audioFolderTemp = audioFolder.value;
        for (let dir_info of audioFolderTemp) {
          if (dir_info.dirName === params.dirName) {
            for (let i = 0; i < dir_info.audioUrls.length; i++) {
              // 找到该文件夹下的原图片url，更换为新图片url
              if (dir_info.audioUrls[i] === params.audioUrl) {
                dir_info.audioUrls[i] = params.newAudioUrl;
                return;
              }
            }
          }
        }
      });

      bus.on("deleteAudioDate", params => {
        let audioFolderTemp = audioFolder.value;
        for (let dir_info of audioFolderTemp) {
          if (dir_info.dirName === params.dirName) {
            for (let i = 0; i < dir_info.audioUrls.length; i++) {
              // 找到该文件夹下的原图片url，然后删掉
              if (dir_info.audioUrls[i] === params.audioUrl) {
                dir_info.audioUrls.splice(i, 1);
                return;
              }
            }
          }
        }
      });
    });

    onBeforeUnmount(() => {
      bus.off("afterModifyAudioFolder");
      bus.off("renameAudioData");
      bus.off("deleteAudioDate");
    });

    // 新建文件夹
    watch(() => props.newFolderName, () => {
      const tmp = {
        dirName: props.newFolderName,
        expanded: false,
        audioUrls: []
      }
      audioFolder.value.push(tmp);
      $q.notify({
        message: "创建成功",
        color: "custom-notification",
        position: "top"
      });
    });

    watch(() => props.searchAudioName, () => {
      targetImages.value = [];    // 清空targetImages

      for (let dir of audioFolder.value) {
        for (let audioUrl of dir.audioUrls) {
          // 拿到音频文件的名称
          let audioName = audioUrl.split('/').pop().split('.')[0];
          // 这样就可以支持模糊搜索
          if (audioName.includes(props.searchAudioName)) {
            targetImages.value.push(audioUrl);
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
        audioUrls: []
      };

      const importDirNotyfy = $q.notify({
        group: false,   // 必须开这个选项允许更新进度
        timeout: 0,     // 让用户可以同时干其他事情
        spinner: true,
        message: '导入中...',
        position: 'top'
      })

      fs.mkdirSync(AUDIOFOLDERPATH + dirName);

      fsCp.copySync(dirPath, AUDIOFOLDERPATH + dirName);

      fs.readdir(AUDIOFOLDERPATH + dirName, (err, files) => {
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
          temp.audioUrls.push(AUDIOFOLDERPATH + dirName + '/' + file);
        }

        audioFolder.value.push(temp);

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
      audioFolder,
      urlTemp,
      targetImages,
      selectedImageIndex,
      selectedListIndex,
      folderRenameDOpen,
      newFolderName,
      componentKey,

      selectAudio(audioUrl, index, listIndex) {
        selectedImageIndex.value = index;
        selectedListIndex.value = listIndex;
        selectedAudioUrl.value = audioUrl;
        let audioInfo = {
          audioUrl,
          audioFolder: audioFolder.value
        }
        bus.emit("selectedAudioUrl", audioInfo);
      },

      openFolderRenameDialog(dirName, listIndex) {
        folderRenameDOpen.value = true;
        renameDirName.value = dirName;
        renameDirIndex.value = listIndex;
      },

      renameFolder() {
        const oldPath = AUDIOFOLDERPATH + renameDirName.value;
        const newPath = AUDIOFOLDERPATH + newFolderName.value;

        fs.rename(oldPath, newPath, (err) => {
          if (err) {
            $q.notify({
              message: "重命名失败",
              position: "top"
            })
            console.log(err);
          }

          audioFolder.value[renameDirIndex.value].dirName = newFolderName;
          let selectedImageName = selectedAudioUrl.value.split('/').pop();
          const newAudioUrl = newPath + '/' + selectedImageName;
          console.log(newAudioUrl);
          emit("selectedAudioUrl", newAudioUrl);
        });
      },

      // 支持一次性导入多个音频文件进来
      importMultiAudios(listIndex, dirName) {
        dialog.showOpenDialog({
          properties: ['openFile', 'multiSelections'],
          filters:[
            {
              name: 'Audio Files',
              extensions: ['mp3', 'wav', 'ogg', 'flac', 'wma', 'ape', 'aac']    // 这得看那些深度学习算法支持哪些格式的图片了，后续再加
            }
          ]
        }).then((res) => {
          if (!res.canceled && res.filePaths.length > 0) {
            for (let audioPath of res.filePaths) {
              const audioName = audioPath.split('\\').pop();
              fsCp.copySync(audioPath, AUDIOFOLDERPATH + dirName + '/' + audioName);
              audioFolder.value[listIndex].audioUrls.push(AUDIOFOLDERPATH + dirName + '/' + audioName);
            }

            $q.notify({
              message: "导入音频完成",
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
