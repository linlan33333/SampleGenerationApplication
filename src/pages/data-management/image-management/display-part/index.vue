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
    <ImageInfo :imgUrl="url" />
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

  props: ["imgUrl"],

  setup() {
    const url = ref(null);

    const props = getCurrentInstance().props;

    watch(() => {
      url.value = props.imgUrl;
    })

    return {
      url,
    }
  }
}
</script>

<style scoped>

</style>
