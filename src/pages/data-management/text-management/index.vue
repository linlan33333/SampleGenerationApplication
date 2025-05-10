<template>
  <q-page :class="{'col-sm-8 col-md-9 col-lg-9': show, 'col-11': !show}">
    <management-part />
  </q-page>

  <q-page class="col-sm-4 col-md-3 col-lg-3" v-show="show">
    <display-part />
  </q-page>
</template>

<script>

import {ref, onMounted} from 'vue';
import ManagementPart from "pages/data-management/text-management/management-part/index.vue";
import DisplayPart from "pages/data-management/text-management/display-part/index.vue";
import bus from "src/utils/bus";

export default {
  name: "TextManagement",

  components: {
    DisplayPart,
    ManagementPart
  },

  setup() {
    const show = ref(false);

    onMounted(() => {
      bus.on('selectedTextUrl', params => {
        show.value = true;
      })
    })

    return {
      show,
    }
  }
}
</script>

<style scoped lang="sass">

</style>
