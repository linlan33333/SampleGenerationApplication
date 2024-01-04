<template>
  <div class="column full-width full-height">
    <div class="full-width">
      <ToolBar />
    </div>

    <div class="full-width q-pt-sm">
      <ImageFrame :imgUrl="url" />
    </div>
  </div>

  <div class="q-pt-sm full-height">
    <ImageInfo :imgUrl="url" :beforeModifyFolder="beforeModifyFolder"
                @afterModifyFolder="getAfterModifyFolder" @renameImgData="getRenameImgData" />
  </div>
</template>

<script>
import ToolBar from "pages/data-management/image-management/display-part/ToolBar.vue";
import ImageFrame from "pages/data-management/image-management/display-part/ImageFrame.vue";
import ImageInfo from "pages/data-management/image-management/display-part/ImageInfo.vue";

import { ref, watch, getCurrentInstance } from 'vue';

export default {
  name: "DisplayPart",

  components: {
    ImageFrame,
    ToolBar,
    ImageInfo
  },

  props: [
    "imgUrl",
    "imgFolder",    // 修改前的图片文件夹数组
  ],

  emits: [
    "afterModifyFolder",
    "renameImgData"
  ],

  setup() {
    const url = ref(null);                  // 当前选中的图片url
    const emit = getCurrentInstance().emit;
    const props = getCurrentInstance().props;

    const beforeModifyFolder = ref(null);   // 修改前的图片文件夹

    watch(() => props.imgUrl, () => {
      url.value = props.imgUrl;
    })

    // 走不到这一步
    watch(() => props.imgFolder, () => {
      beforeModifyFolder.value = props.imgFolder;
    })

    return {
      url,
      beforeModifyFolder,

      getAfterModifyFolder(data) {
        emit('afterModifyFolder', data);
      },

      getRenameImgData(data) {
        emit("renameImgData", data);
      }
    }
  }
}
</script>

<style scoped>

</style>
