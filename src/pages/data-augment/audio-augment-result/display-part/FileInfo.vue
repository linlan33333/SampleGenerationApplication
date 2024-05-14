<template>
  <div class="column full-height justify-around q-pl-md q-pr-md">
    <div class="full-width flex flex-center">
      <div class="full-width full-height" id="waveform888" />
    </div>

    <div class="full-width q-pt-md">
      <q-card flat>
        <q-list>
          <q-item class="row">
            <q-item-section>
              <q-item-label>文件名: </q-item-label>
            </q-item-section>
            <q-item-section class="wrap">
              <q-item-label v-if="fileInfo" class="wrap">{{fileInfo.fileName}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>所属文件夹: </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1" v-if="fileInfo">{{fileInfo.dirName}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>文件大小: </q-item-label>
            </q-item-section>
            <q-item-section v-if="fileSize">
              <q-item-label lines="1">
                {{fileSize}}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>

    <div class="column q-pt-md">
      <div>
        <q-btn class="full-width q-dark" flat label="预览" @click="openAPDialog = true;" />
      </div>

      <div class="q-pt-sm">
        <q-btn class="full-width q-dark" flat label="保存" @click="saveFile" />
      </div>

      <!--   这里另存为应当能让用户自己选择存储路径   -->
      <div class="q-pt-sm">
        <q-btn class="full-width q-dark" flat label="另存为" @click="saveAs" />
      </div>
    </div>
  </div>

  <q-dialog class="full-width" v-model="openAPDialog" persistent>

    <q-card flat class="full-width">
      <q-card-section>
        <div class="text-h6">音频预览</div>
      </q-card-section>

      <q-card-section>
        <div class="full-width flex flex-center">
          <div class="full-width full-height" id="waveform888" />
        </div>
      </q-card-section>

      <q-card-actions align="center">
        <div class="row justify-evenly col-4">
          <q-btn round flat class="self-center" size="lg" padding="xs xs" icon="replay_5" @click="replayFiveSeconds" />
          <q-btn round size="xl" padding="xs xs" icon="play_circle" @click="playPause" />
          <q-btn round flat class="self-center" size="lg" padding="xs xs" icon="forward_5" @click="forwardFiveSecond"/>
        </div>
      </q-card-actions>

      <q-card-actions align="right">
        <q-btn flat label="关闭" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import bus from "src/utils/bus";
import { useQuasar } from "quasar";
import fs from "fs";
import WaveSurfer from "wavesurfer.js";

export default {
  name: 'FileInfo',

  setup() {
    const fileInfo = ref(null);
    const fileSize = ref(null);
    const openAPDialog = ref(false);

    const wavesurfer = ref(null);
    const fs = require('fs');
    const { dialog } = require('@electron/remote');
    const $q = useQuasar();

    onMounted(() => {
      bus.on('selectedFileInfo', params => {
        fileInfo.value = params;

        fs.stat(params.fileCurrentUrl, (err, stats) => {
          let fileSizeInBytes = stats.size;
          if (fileSizeInBytes >= 1024 * 1024) {
            fileSizeInBytes /= 1024 * 1024;
            fileSize.value = fileSizeInBytes.toFixed(2).toString() + "M";
          }
          else if (stats.size >= 1024) {
            fileSizeInBytes /= 1024;
            fileSize.value = fileSizeInBytes.toFixed(2).toString() + "KB";
          }
          else {
            fileSize.value = fileSizeInBytes + "B";
          }
        });
      })
    })

    onBeforeUnmount(() => {
      bus.off("selectedFileInfo");
    });

    watch(() => fileInfo.value, () => {
      if (wavesurfer.value) {
        wavesurfer.value.destroy();
      }

      wavesurfer.value = WaveSurfer.create({
        container: '#waveform888',
        autoCenter: false
      })

      wavesurfer.value.load(fileInfo.value.fileCurrentUrl);
    })

    return {
      fileInfo,
      fileSize,
      openAPDialog,

      // openAPDialog() {
      //   openAPDialog.value = true;
      // },

      saveFile() {
        if (fileInfo.value !== null) {
          // 覆盖原文件
          fs.copyFile(fileInfo.value.fileCurrentUrl, fileInfo.value.fileOriginUrl, (err) => {
            if (err) {
              $q.notify({
                message: "文件保存失败",
                position: "top",
                type: "negative"
              });
              console.log(err);
            }
            else {
              $q.notify({
                type: "positive",
                message: "文件替换保存成功",
                position: "top",
                color: "grey-14"
              });
            }
          })
        }
        else {
          $q.notify({
            message: "未选择文件",
            position: "top",
            type: "negative"
          })
        }
      },

      saveAs() {
        dialog.showSaveDialog({
          title: '保存文件',
          // 这里可以设置默认的文件名或文件类型过滤等
          defaultPath: fileInfo.value.fileName
        }).then(res => {
          if (!res.canceled && res.filePath) {
            // 用户没有取消且选择了文件路径，写入文件
            fs.copyFile(fileInfo.value.fileCurrentUrl, res.filePath, (err) => {
              if (err) {
                $q.notify({
                  message: "文件保存失败",
                  position: "top",
                  type: "negative"
                });
                console.log(err);
              }
              else {
                $q.notify({
                  type: "positive",
                  message: "文件保存成功",
                  position: "top",
                  color: "grey-14"
                });
              }
            })
          }
        }).catch(err => {
          $q.notify({
            message: "文件保存失败",
            position: "top",
            type: "negative"
          });
        })
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
      }
    }
  }
}
</script>

<style scoped>

</style>
