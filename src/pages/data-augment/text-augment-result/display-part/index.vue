<template>
  <div class="column full-width full-height">
    <div class="full-width">
      <aug-dis-tool-bar />
    </div>

    <div class="q-pt-sm">
      <file-info />
    </div>
  </div>
</template>

<script>
import AugDisToolBar from "pages/data-augment/text-augment-result/display-part/ToolBar.vue";
import FileInfo from "pages/data-augment/text-augment-result/display-part/FileInfo.vue";

export default {
  name: "DisplayPart",

  components: {
    AugDisToolBar,
    FileInfo,
  },

  setup() {

  }
}
</script>

<style scoped>

</style>
