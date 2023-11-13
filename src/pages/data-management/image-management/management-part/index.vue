<template>
  <div class="column full-width flex flex-center">
    <div class="full-width">
      <tool-bar />
    </div>

    <q-separator color="white" />

    <div class="full-width">
      <folder-list />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import ToolBar from "pages/data-management/image-management/management-part/ToolBar.vue";
import FolderList from "pages/data-management/image-management/management-part/FolderList.vue";

export default {
  name: "ManagementPart",

  components: {
    ToolBar,
    FolderList
  },

  setup() {

    return {

    }
  }
}
</script>

<style scoped>

</style>
