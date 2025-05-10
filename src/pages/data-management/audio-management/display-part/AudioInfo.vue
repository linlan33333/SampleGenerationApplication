<template>
  <div class="column full-height justify-around q-pl-md q-pr-md">
    <div class="full-width flex flex-center">
      <div class="full-width full-height" id="waveform" />
    </div>

    <div class="full-width q-pt-md">
      <q-input v-model="audioName" outlined dense input-class="text-center" disable />
    </div>

    <div class="full-width q-pt-md">
      <q-card flat>
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label>所属文件夹: </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1">{{selectedAudioFolderName}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>文件大小: </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1">{{audioFileSize}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>音频时长: </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1">
                {{audioTimeLength}}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>

    <div class="column q-pt-md">
      <div>
        <q-btn class="full-width q-dark" flat label="播放" @click="openPlayAudioDialog" />
      </div>

      <div class="q-pt-sm">
        <q-btn class="full-width q-dark" flat label="移动文件" @click="openRemoveAudioDialog" />
      </div>

      <div class="q-pt-sm">
        <q-btn class="full-width q-dark" flat label="重命名" @click="renameAudioDialogOpen = true" />
      </div>

      <div class="q-pt-sm">
        <q-btn class="full-width q-dark" flat label="删除" @click="deleteAudioFile" />
      </div>
    </div>
  </div>

  <q-dialog v-model="removeAudioDialogOpen" persistent>
    <q-card flat class="full-width">
      <q-card-section class="q-pt-lg">
        <q-select outlined class="full-width" v-model="selectNewFolderName"
                  :options="audioFolderNames" label="选择目标文件夹" virtual-scroll-slice-size="2" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn dense flat label="取消" @click="closeRemoveAudioDialog" v-close-popup />
        <q-btn dense flat label="确定" @click="removeAudio" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="renameAudioDialogOpen" persistent>
    <q-card flat class="full-width">
      <q-card-section class="q-pt-lg">
        <q-input dense outlined v-model="newAudioName" placeholder="请输入文件名称" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn dense flat label="取消" @click="closeRenameAudioDialog" v-close-popup />
        <q-btn dense flat label="确定" @click="renameAudio" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="playAudioDialogOpen" persistent>
    <q-card flat class="full-width">
      <q-card-actions align="center">
        <div class="row justify-evenly col-4">
          <q-btn round flat class="self-center" size="lg" padding="xs xs" icon="replay_5" @click="replayFiveSeconds" />
          <q-btn round size="xl" padding="xs xs" icon="play_circle" @click="playPause" />
          <q-btn round flat class="self-center" size="lg" padding="xs xs" icon="forward_5" @click="forwardFiveSecond"/>
        </div>
      </q-card-actions>

      <q-card-actions align="right">
        <q-btn flat @click="closeAudioPlayDialog">关闭</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {ref, getCurrentInstance, watch, onMounted, onBeforeUnmount, computed} from 'vue';
import { toRaw } from '@vue/reactivity';
import {AUDIOFOLDERPATH, FOLDERPATH} from "src/utils/global-args";
import WaveSurfer from "wavesurfer.js";
import bus from "src/utils/bus";

export default {
  name: "ImageInfo",

  setup() {
    const fs = require('fs');
    const fsextra = require('fs-extra');

    const wavesurfer = ref(null);
    const audioUrl = ref(null);
    const audioName = ref(null);
    const audioFolder = ref(null);
    const selectedAudioFolderName = ref(null);
    const audioTimeLength = ref(null);    // 音频的持续时间，但是加了"s"单位
    const audioFileSize = ref("");
    const audioFolderNames = ref([]);
    const selectNewFolderName = ref(null);   // 移动文件的新文件夹名称
    const newAudioName = ref(null);   // 图片重命名后的名称

    const playAudioDialogOpen = ref(false);
    const removeAudioDialogOpen = ref(false);
    const renameAudioDialogOpen = ref(false);

    onMounted(() => {
      bus.on('selectedAudioUrl', params => {
        audioUrl.value = params.audioUrl;
        audioFolder.value = params.audioFolder;
      })
    })

    onBeforeUnmount(() => {
      bus.off('selectedAudioUrl');
    })

    watch(() => audioUrl.value, () => {
      if (wavesurfer.value) {
        wavesurfer.value.destroy();
      }
      if (audioUrl.value) {
        let audioUrlTemp = audioUrl.value;
        let audioUrlSlice = audioUrlTemp.split('/');
        audioName.value = audioUrlSlice[audioUrlSlice.length - 1];
        selectedAudioFolderName.value = audioUrlSlice[audioUrlSlice.length - 2];

        // 读取音频的长度和文件大小

        wavesurfer.value = WaveSurfer.create({
          container: '#waveform',
          autoCenter: false
        })
        wavesurfer.value.load(audioUrl.value);
        // wavesurfer有些接口是异步的，所以得等到加载完成后再使用
        wavesurfer.value.on('ready', () => {
          audioTimeLength.value = wavesurfer.value.getDuration() + 's';
        })

        fs.stat(audioUrl.value, (err, stats) => {
          if (err) {
            audioFileSize.value = null;
          }

          let fileSizeInBytes = stats.size;
          if (fileSizeInBytes >= 1024 * 1024) {
            fileSizeInBytes /= 1024 * 1024;
            audioFileSize.value = fileSizeInBytes.toFixed(2).toString() + "M";
          }
          else if (stats.size >= 1024) {
            fileSizeInBytes /= 1024;
            audioFileSize.value = fileSizeInBytes.toFixed(2).toString() + "KB";
          }
          else {
            audioFileSize.value = fileSizeInBytes + "B";
          }
        });
      }
    })

    return {
      thumbStyle: ref({                     // 设置侧边滚动条样式的
        width: '0px',
      }),
      audioUrl,
      audioName,
      selectedAudioFolderName,
      audioTimeLength,
      audioFileSize,
      removeAudioDialogOpen,
      renameAudioDialogOpen,
      selectNewFolderName,       // 移动文件功能选择的新文件夹名称
      audioFolderNames,            // 移动文件功能可以选择的文件夹名称
      newAudioName,                // 图片重命名后的名称
      playAudioDialogOpen,

      // 取消移动文件
      closeRemoveAudioDialog() {
        selectNewFolderName.value = null;
        audioFolderNames.value = [];
        removeAudioDialogOpen.value = false;
      },

      removeAudio() {
        const newAudioUrl = AUDIOFOLDERPATH + selectNewFolderName.value + '/' + audioName.value;
        // 修改audioFolder数组
        let folderList = toRaw(audioFolder.value);
        for (let item of folderList) {
          if (item.dirName === selectedAudioFolderName.value) {
            for (let index in item.audioUrls) {
              if (item.audioUrls[index] === audioUrl.value) {
                item.audioUrls.splice(index, 1);
              }
            }
          }

          if (item.dirName === selectNewFolderName.value) {
            item.audioUrls.push(newAudioUrl);
          }
        }
        // 修改音频的展示列表
        selectedAudioFolderName.value = selectNewFolderName.value;
        // 修改audioFolder，因为向managment-part组件传递修改后的audioFolder是不会再从managment-part组件传递回来的
        audioFolder.value = folderList;
        // 清空数据
        audioFolderNames.value = [];
        selectNewFolderName.value = null;
        // 移动文件
        fsextra.moveSync(audioUrl.value, newAudioUrl);
        // 把结果传递出去
        bus.emit('afterModifyAudioFolder', audioFolder.value);
      },

      openRemoveAudioDialog() {
        const folderList = toRaw(audioFolder.value);
        for (let folder of folderList) {
          if (folder.dirName !== selectedAudioFolderName.value) {
            audioFolderNames.value.push(folder.dirName);
          }
        }

        removeAudioDialogOpen.value = true;
      },

      openPlayAudioDialog() {
        playAudioDialogOpen.value = true;
      },

      closeRenameAudioDialog() {
        newAudioName.value = null;
        renameAudioDialogOpen.value = false;
      },

      // 这个功能本来不想做成弹窗的，应当做成在图片下方的命名框中直接修改的
      renameAudio() {
        const renameAudioData = {
          dirName: selectedAudioFolderName.value,
          newName: newAudioName.value,
          audioUrl: audioUrl.value,
          newAudioUrl: AUDIOFOLDERPATH + selectedAudioFolderName.value + '/' + newAudioName.value
        }
        fs.renameSync(audioUrl.value, AUDIOFOLDERPATH + selectedAudioFolderName.value + '/' + newAudioName.value);
        bus.emit("renameAudioData", renameAudioData);
        audioUrl.value = AUDIOFOLDERPATH + selectedAudioFolderName.value + '/' + newAudioName.value;
        renameAudioDialogOpen.value = false;
        // 别忘了把输入栏中的数据清空
        newAudioName.value = null;
      },

      // 删除文件
      deleteAudioFile() {
        const deletedAudioInfo = {
          dirName: selectedAudioFolderName.value,
          audioUrl: audioUrl.value
        }

        fs.unlinkSync(audioUrl.value);
        bus.emit("deleteAudioDate", deletedAudioInfo);
      },

      // 后退5秒
      replayFiveSeconds() {
        wavesurfer.value.skip(-5);
      },

      // 前进5秒
      forwardFiveSecond() {
        wavesurfer.value.skip(5);
      },

      // 若音乐播放则暂停，否则开始播放
      playPause() {
        wavesurfer.value.playPause();
      },

      closeAudioPlayDialog() {
        playAudioDialogOpen.value = false;
        wavesurfer.value.pause();
      }
    }
  },
}
</script>

<style lang="sass" scoped>
.image-style
  max-width: calc(90%)
</style>
