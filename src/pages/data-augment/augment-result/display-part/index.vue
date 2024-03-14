<template>
  <div class="column full-width full-height">
    <div class="full-width">
      <aug-dis-tool-bar />
    </div>

    <div class="q-pt-sm">
      <file-info />
    </div>
  </div>

  <image-preview-dialog />

</template>

<script>
import AugDisToolBar from "pages/data-augment/augment-result/display-part/ToolBar.vue";
import FileInfo from "pages/data-augment/augment-result/display-part/FileInfo.vue";
import ImagePreviewDialog from "pages/data-augment/augment-result/display-part/ImagePreviewDialog.vue";

export default {
  name: "DisplayPart",

  components: {
    AugDisToolBar,
    FileInfo,
    ImagePreviewDialog
  },

  setup() {

  }
}
</script>

<style scoped>

</style>
