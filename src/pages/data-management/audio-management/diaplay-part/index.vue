<template>
  <div class="column full-width full-height">
    <div class="full-width">
      <ToolBar />
    </div>
  </div>

  <div class="q-pt-sm full-height">
    <AudioInfo />
  </div>
</template>

<script>

import ToolBar from "pages/data-management/audio-management/diaplay-part/ToolBar.vue";
import AudioInfo from "pages/data-management/audio-management/diaplay-part/AudioInfo.vue";

export default {
  name: "DisplayPart",

  components: {
    AudioInfo,
    ToolBar
  }
}
</script>

<style scoped lang="sass">

</style>
