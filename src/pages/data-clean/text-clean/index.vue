<template>
  <q-page class="col-sm-8 col-md-9 col-lg-9">
    <text-part />
  </q-page>

  <q-page class="col-sm-4 col-md-3 col-lg-3">
    <function-part />
  </q-page>
</template>

<script>
import TextPart from "pages/data-clean/text-clean/text-part/index.vue";
import FunctionPart from "pages/data-clean/text-clean/function-part/index.vue";

import {ref} from 'vue';

export default {
  name: "TextClean",

  components: {
    TextPart,
    FunctionPart
  },

  setup() {

  }
}
</script>

<style scoped>

</style>
