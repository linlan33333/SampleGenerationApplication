<template>
  <q-expansion-item
    switch-toggle-side
    label="图像旋转"
    v-model="expanded"
    >
    <q-card>
      <q-card-section>
        <q-input outlined dense color="grey-14" v-model="angle" />
      </q-card-section>
    </q-card>
  </q-expansion-item>

  <div class="column q-pt-md q-pl-md q-pr-md">
    <div>
      <q-btn class="full-width q-dark" flat label="确定" @click="imageRotate" />
    </div>

    <div class="q-pt-sm">
      <q-btn class="full-width q-dark" flat label="取消" @click="cancelSelect" />
    </div>
  </div>
</template>

<script>
import {getCurrentInstance, ref} from "vue";
import bus from "src/utils/bus";
import {PYFUNCTESTPATH, PYTESTIMAGEPATH, TEMPPATH} from "src/utils/global-args";

export default {
  name: "FunctionList",

  setup() {
    const spawn = require('child_process').spawn;

    const expanded = ref(true);
    const angle = ref(90.0);

    return {
      expanded,
      angle,

      imageRotate() {
        const params = [PYFUNCTESTPATH + 'imageRotate.py', '-input_folder', TEMPPATH, '-angle', angle.value, '-output_folder', TEMPPATH];
        bus.emit('imageAugment', params);
      },

      cancelSelect() {
        bus.emit('cancelSelect', true);
      }
    }
  }
}
</script>

<style scoped>

</style>
