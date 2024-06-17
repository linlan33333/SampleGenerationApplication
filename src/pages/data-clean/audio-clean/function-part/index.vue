<template>
  <div class="column full-width flex flex-center full-height">
    <div class="full-width">
      <tool-bar />
    </div>

    <q-separator />

    <q-scroll-area :thumb-style="thumbStyle" class="scroll-area-height full-width">
      <function-list />
    </q-scroll-area>
  </div>
</template>

<script>
import ToolBar from "pages/data-clean/audio-clean/function-part/ToolBar.vue";
import FunctionList from "pages/data-clean/audio-clean/function-part/FunctionList.vue";
import {ref} from "vue";

export default {
  name: "FunctionPart",

  components: {
    ToolBar,
    FunctionList
  },

  setup() {
    return {
      thumbStyle: ref({                     // 设置侧边滚动条样式的，理论上不应该写在这里中，后期要改
        width: '0px',
      }),
    }
  }
}
</script>

<style lang="sass" scoped>
.scroll-area-height
  height: calc(90vh)
</style>
