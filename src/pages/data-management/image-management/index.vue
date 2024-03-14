<template>
  <q-page :class="{'col-sm-8 col-md-9 col-lg-9': show, 'col-11': !show}">
    <management-part @imgPartSelectedImg="getSelectedImgUrl" :afterModifyFolder="afterModifyFolder"
                     :renameImgData="renameImgData" />
  </q-page>

  <q-page class="col-sm-4 col-md-3 col-lg-3" v-show="show">
    <display-part :imgUrl="selectedImgUrl" :imgFolder="beforeModifyFolder"
                  @afterModifyFolder="getAfterModifyFolder" @renameImgData="getRenameImgData" />
  </q-page>
</template>

<script>
import ManagementPart from "src/pages/data-management/image-management/management-part/index.vue"
import DisplayPart from "src/pages/data-management/image-management/display-part/index.vue"
import { ref, provide } from 'vue';

export default {
  name: "ImageManagement",

  components: {
    ManagementPart,
    DisplayPart
  },

  emits: [
    "afterModifyFolder",
    "imgPartSelectedImg",
    "renameImgData"
  ],

  setup() {
    const selectedImgUrl = ref(null);
    const beforeModifyFolder = ref(null);
    const afterModifyFolder = ref(null);    // display-part组件进行移动文件、重命名文件等操作后修改之后的imgFolder会传过来
    const renameImgData = ref(null);        // 从display-part组件传过来的文件夹重命名的数据
    const show = ref(false);

    provide("afterModifyFolder", afterModifyFolder.value);

    return {
      selectedImgUrl,
      beforeModifyFolder,
      afterModifyFolder,
      renameImgData,
      show,

      getSelectedImgUrl(imgUrl, folder) {
        selectedImgUrl.value = imgUrl;
        beforeModifyFolder.value = folder;
        show.value = true;
      },

      getAfterModifyFolder(data) {
        afterModifyFolder.value = data;
      },

      getRenameImgData(data) {
        renameImgData.value = data;
      }
    }
  }
}
</script>

<style scoped>

</style>
