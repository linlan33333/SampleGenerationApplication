<template>
  <q-page class="col-sm-8 col-md-9 col-lg-9">
    <audio-part />
  </q-page>

  <q-page class="col-sm-4 col-md-3 col-lg-3">
    <function-part />
  </q-page>
</template>

<script>

import {defineComponent} from "vue";
import FunctionPart from "pages/data-augment/audio-augment/function-part/index.vue";
import AudioPart from "pages/data-augment/audio-augment/audio-part/index.vue";

export default {
  name: "AudioAugment",

  components: {
    AudioPart,
    FunctionPart
  },


}

</script>

<style scoped lang="sass">

</style>
