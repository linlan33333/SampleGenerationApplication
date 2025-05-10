<template>
  <div class="column full-width full-height">
    <div class="full-width">
      <ToolBar />
    </div>
  </div>

  <div class="q-pt-sm full-height">
    <TextInfo />
  </div>
</template>

<script>

import ToolBar from "pages/data-management/text-management/display-part/ToolBar.vue";
import TextInfo from "pages/data-management/text-management/display-part/TextInfo.vue";

export default {
  name: "DisplayPart",

  components: {
    TextInfo,
    ToolBar
  }
}
</script>

<style scoped lang="sass">

</style>
