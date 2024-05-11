<template>
  <div class="column full-width flex flex-center full-height">
    <div class="full-width">
      <aug-res-tool-bar />
    </div>

    <q-separator color="white" />

    <!-- 这个q-scroll-area是为了让图片多的时候能在左半界面上下滚动，
        而不是让整个窗口上下滚动，右边出现滚动条很难看 -->
    <!--  这个窗口的高度以后再改，能不能改成自适应的  -->
    <q-scroll-area :thumb-style="thumbStyle" class="scroll-area-height full-width">
      <augment-result @showDisplayPart="showDisplayPart" />
    </q-scroll-area>

  </div>
</template>

<script>
import {getCurrentInstance, ref} from "vue";
import AugResToolBar from "pages/data-augment/augment-result/management-part/ToolBar.vue";
import AugmentResult from "pages/data-augment/augment-result/management-part/Result.vue";

export default {
  name: "ManagementPart",

  components: {
    AugResToolBar,
    AugmentResult
  },

  setup() {
    const emit = getCurrentInstance().emit;

    return {
      // 设置侧边滚动条样式的，理论上不应该写在这里中，后期要改
      thumbStyle: ref({
        width: '0px',
      }),

      showDisplayPart() {
        emit("showDisplayPart", true);
      }
    }
  }
}
</script>

<style scoped lang="sass">
.scroll-area-height
  height: calc(90vh)
</style>
