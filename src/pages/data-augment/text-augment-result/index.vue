<template>
  <!-- 小技巧：绑定class可以让class跟随某个bool变量切换不同组值，这里让文件详情侧栏不出现时占满全屏，出现时四八开 -->
  <q-page :class="{'col-sm-8 col-md-9 col-lg-9': show, 'col-11': !show}">
    <management-part @showDisplayPart="showDisplayPart" />
  </q-page>

  <q-page class="col-sm-4 col-md-3 col-lg-3" v-show="show">
    <display-part />
  </q-page>
</template>

<script>
import ManagementPart from "pages/data-augment/text-augment-result/management-part/index.vue";
import DisplayPart from "pages/data-augment/text-augment-result/display-part/index.vue";
import {ref} from "vue";

export default {
  name: 'AudioAugmentResult',

  components: {
    ManagementPart,
    DisplayPart
  },

  setup() {
    const show = ref(false);

    return {
      show,

      showDisplayPart() {
        show.value = true;
      }
    }
  }
}
</script>

<style scoped>

</style>
