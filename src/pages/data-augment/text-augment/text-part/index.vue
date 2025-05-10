<template>
  <div class="column full-width flex flex-center full-height">
    <div class="full-width">
      <tool-bar />
    </div>

    <q-separator color="white" />

    <!-- 这个q-scroll-area是为了让图片多的时候能在左半界面上下滚动，
        而不是让整个窗口上下滚动，右边出现滚动条很难看 -->
    <!--  这个窗口的高度以后再改，能不能改成自适应的  -->
    <q-scroll-area :thumb-style="thumbStyle" class="scroll-area-height full-width">
      <text-list />
    </q-scroll-area>
  </div>
</template>

<script>
import { ref } from "vue";
import ToolBar from "pages/data-augment/text-augment/text-part/ToolBar.vue";
import TextList from "pages/data-augment/text-augment/text-part/TextList.vue";

export default {
  name: "TextPart",

  components: {
    ToolBar,
    TextList
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

<style scoped lang="sass">
.scroll-area-height
  height: calc(90vh)
</style>
