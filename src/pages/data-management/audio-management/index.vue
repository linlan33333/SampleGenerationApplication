<template>
  <q-page :class="{'col-sm-8 col-md-9 col-lg-9': show, 'col-11': !show}">
    <management-part />
  </q-page>

  <q-page class="col-sm-4 col-md-3 col-lg-3" v-show="show">
    <display-part />
  </q-page>
</template>

<script>
import {ref, provide, onMounted} from 'vue';
import ManagementPart from "pages/data-management/audio-management/management-part/index.vue";
import DisplayPart from "pages/data-management/audio-management/diaplay-part/index.vue";
import bus from "src/utils/bus";

export default {
  name: "AudioManagement",

  components: {
    ManagementPart,
    DisplayPart,
  },

  setup() {
    const show = ref(false);

    onMounted(() => {
      bus.on('selectedAudioUrl', params => {
        show.value = true;
      })
    })

    return {
      show
    }
  }
}
</script>

<style scoped>

</style>
