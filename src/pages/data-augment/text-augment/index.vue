<template>
  <q-page class="col-sm-8 col-md-9 col-lg-9">
    <text-part />
  </q-page>

  <q-page class="col-sm-4 col-md-3 col-lg-3">
    <function-part />
  </q-page>
</template>

<script>

import {defineComponent} from "vue";
import FunctionPart from "pages/data-augment/text-augment/function-part/index.vue";
import TextPart from "pages/data-augment/text-augment/text-part/index.vue";

export default {
  name: "TextAugment",

  components: {
    TextPart,
    FunctionPart
  },


}

</script>

<style scoped lang="sass">

</style>
