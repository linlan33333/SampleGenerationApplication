<template>
  <q-page class="col-sm-8 col-md-9 col-lg-9">
    <management-part @mgPartSelectedImg="getSelectedImgUrl" />
  </q-page>

  <q-page class="col-sm-4 col-md-3 col-lg-3">
    <display-part :imgUrl="selectedImgUrl" />
  </q-page>
</template>

<script>
import ManagementPart from "src/pages/data-management/image-management/management-part/index.vue"
import DisplayPart from "src/pages/data-management/image-management/display-part/index.vue"
import { ref } from 'vue';

export default {
  name: "ImageManagement",

  components: {
    ManagementPart,
    DisplayPart
  },

  setup() {
    const selectedImgUrl = ref(null);

    return {
      selectedImgUrl,

      getSelectedImgUrl(data) {
        selectedImgUrl.value = data;
      }
    }
  }
}
</script>

<style scoped>

</style>
