<template>
  <q-card flat class="full-width">
    <q-card-section>
      <div class="image-container flex wrap justify-start q-gutter-sm">
        <q-item v-for="(fileInfo, index) in filesInfo" :key="index"
                class="image-item column">
          <q-item-section class="full-width">
            <q-img :src="fileInfo.fileCurrentUrl"
                   class="rounded-borders clickable-img"
                   ratio="1" @click="selectFile(fileInfo)">
              <q-checkbox v-show="multiSelect" class="all-pointer-events"
                          v-model="selectedImages" :val="fileInfo" color="orange" size="sm" />
            </q-img>
          </q-item-section>
          <q-item-label class="self-center q-pt-sm col-auto" lines="1">
            {{fileInfo.fileName}}
          </q-item-label>
        </q-item>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import {onMounted, ref, getCurrentInstance, onBeforeUnmount} from "vue";
import bus from "src/utils/bus";
import { TEMPPATH } from "src/utils/global-args";

export default {
  name: "AugmentResult",

  setup() {
    // temp文件夹下的所有图片都会放到这里
    const filesInfo = ref([]);
    const fs = require('fs');
    const emit = getCurrentInstance().emit;

    const multiSelect = ref(false);
    const selectedImages = ref([]);

    onMounted(() => {
      fs.readdir(TEMPPATH, (err, files) => {
        if (err) {
          console.log("读取目录失败：", err);
          return;
        }

        for (let file of files) {
          // 每个文件都整理好相应的信息
          // 解析文件名从而提取出文件路径、所属文件夹、文件名信息
          const fileCurrentName = file;
          let fileOriginUrl = file.replace(/\^/g, '\/');   // 根据调用python脚本处理文件操作反向还原文件信息
          fileOriginUrl = fileOriginUrl.replace('@', ':');

          const arr = fileOriginUrl.split('\/');
          let fileName = arr.at(-1);
          let dirName = arr.at(-2);

          let temp = {
            dirName,
            fileName,
            fileOriginUrl,
            fileCurrentUrl: TEMPPATH + fileCurrentName
          }
          filesInfo.value.push(temp);
        }
      })
    })

    // 事件总线都放这里
    onMounted(() => {
      bus.on('selectMultiFiles', params => {
        multiSelect.value = params;
      })

      bus.on('cancelSelectMultiFiles', params => {
        multiSelect.value = params;
        selectedImages.value = [];
      })
    })

    onBeforeUnmount(() => {
      bus.off('selectMultiFiles');
      bus.off('cancelSelectMultiFiles');
    })

    return {
      filesInfo,
      multiSelect,
      selectedImages,

      selectFile(fileInfo) {
        bus.emit('selectedFileInfo', fileInfo);
        emit('showDisplayPart', true);
      }
    }
  }
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
