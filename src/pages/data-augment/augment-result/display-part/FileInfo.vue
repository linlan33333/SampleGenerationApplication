<template>
  <div class="column full-height justify-around q-pl-md q-pr-md">
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
        <q-btn class="full-width q-dark" flat label="预览" @click="openIPDialog" />
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
</template>

<script>
import {onMounted, ref} from "vue";
import bus from "src/utils/bus";
import { useQuasar } from "quasar";
import fs from "fs";

export default {
  name: 'FileInfo',

  setup() {
    const fileInfo = ref(null);
    const fileSize = ref(null);

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

    return {
      fileInfo,
      fileSize,

      openIPDialog() {
        bus.emit('openImagePreviewDialog', fileInfo.value.fileCurrentUrl);
      },

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
      }
    }
  }
}
</script>

<style scoped>

</style>
