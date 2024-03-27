<template>
  <q-page class="col-sm-8 col-md-9 col-lg-9">
    <image-part />
  </q-page>

  <q-page class="col-sm-4 col-md-3 col-lg-3">
    <function-part />
  </q-page>
</template>

<script>
import ImagePart from "pages/data-clean/image-clean/image-part/index.vue";
import FunctionPart from "pages/data-clean/image-clean/function-part/index.vue";

import {ref} from 'vue';

export default {
  name: "ImageClean",

  components: {
    ImagePart,
    FunctionPart
  },

  setup() {

  }
}
</script>

<style scoped>

</style>
