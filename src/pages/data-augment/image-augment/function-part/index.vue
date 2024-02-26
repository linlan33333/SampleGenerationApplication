<template>
  <div class="column full-width flex flex-center full-height">
    <div class="full-width">
      <tool-bar />
    </div>

    <q-separator />

    <div class="full-width">
      <function-list />
    </div>
  </div>
</template>

<script>
import ToolBar from "pages/data-augment/image-augment/function-part/ToolBar.vue";
import FunctionList from "pages/data-augment/image-augment/function-part/FunctionList.vue";
import {getCurrentInstance} from "vue";

export default {
  name: "FunctionPart",

  components: {
    ToolBar,
    FunctionList
  },

  setup() {

  }
}
</script>

<style scoped>

</style>
