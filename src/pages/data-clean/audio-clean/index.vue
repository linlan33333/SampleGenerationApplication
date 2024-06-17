<template>
  <q-page class="col-sm-8 col-md-9 col-lg-9">
    <audio-part />
  </q-page>

  <q-page class="col-sm-4 col-md-3 col-lg-3">
    <function-part />
  </q-page>
</template>

<script>
import AudioPart from "pages/data-clean/audio-clean/audio-part/index.vue";
import FunctionPart from "pages/data-clean/audio-clean/function-part/index.vue";

import {ref} from 'vue';

export default {
  name: "AudioClean",

  components: {
    AudioPart,
    FunctionPart
  },

  setup() {

  }
}
</script>

<style scoped>

</style>
