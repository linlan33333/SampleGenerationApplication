<template>
  <div class="column full-height justify-around q-pl-md q-pr-md">
    <div class="full-width">
      <q-input v-model="imgName" outlined dense input-class="text-center" disable>

      </q-input>
    </div>

    <div class="full-width q-pt-md">
      <q-card flat>
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label>所属文件夹: </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1">{{imgFolder}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>图片分辨率: </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1" v-if="imgDimension">{{imgDimension.width}} × {{imgDimension.height}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>图片大小: </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1">
                {{imgFileSize}}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>

    <div class="column q-pt-md">
      <div>
        <q-btn class="full-width q-dark" flat label="移动文件" />
      </div>

      <div class="q-pt-sm">
        <q-btn class="full-width q-dark" flat label="重命名" />
      </div>

      <div class="q-pt-sm">
        <q-btn class="full-width q-dark" flat label="删除" />
      </div>
    </div>
  </div>
</template>

<script>
import {ref, getCurrentInstance, watch} from 'vue';

export default {
  name: "ImageInfo",

  props: ["imgUrl"],

  setup() {
    const fs = require('fs');
    const path = require('path');
    const sizeOf = require('image-size');

    const imageUrl = ref(null);
    const imgName = ref(null);
    const imgFolder = ref(null);
    const imgDimension = ref(null);
    const imgFileSize = ref("");

    const props = getCurrentInstance().props;

    watch(() => {
      imageUrl.value = props.imgUrl;
      if (props.imgUrl) {
        let imgUrlSlice = props.imgUrl.split('/');
        imgName.value = imgUrlSlice[imgUrlSlice.length - 1];
        imgFolder.value = imgUrlSlice[imgUrlSlice.length - 2];

        const buffer = fs.readFileSync(imageUrl.value);
        fs.stat(imageUrl.value, (err, stats) => {
          if (err) {
            imgFileSize.value = null;
          }

          let fileSizeInBytes = stats.size;
          if (fileSizeInBytes >= 1024 * 1024) {
            fileSizeInBytes /= 1024 * 1024;
            imgFileSize.value = fileSizeInBytes.toFixed(2).toString() + "M";
          }
          else if (stats.size >= 1024) {
            fileSizeInBytes /= 1024;
            imgFileSize.value = fileSizeInBytes.toFixed(2).toString() + "KB";
          }
          else {
            imgFileSize.value = fileSizeInBytes + "B";
          }
        });
        imgDimension.value = sizeOf(buffer);
      }
    })

    return {
      imageUrl,
      imgName,
      imgFolder,
      imgDimension,
      imgFileSize
    }
  }
}
</script>

<style scoped>

</style>
