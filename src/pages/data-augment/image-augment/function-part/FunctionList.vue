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

  <div class="column q-pt-lg-lg">
    <div>
      <q-btn class="full-width q-dark" flat label="确定" @click="imageRotate" />
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
        const params = [PYFUNCTESTPATH + 'imageRotate.py', '-input_folder', TEMPPATH + 'input1', '-angle', angle.value, '-output_folder', TEMPPATH];
        // const py = spawn('python',[PYFUNCTESTPATH + 'imageRotate.py', '-input_folder', PYTESTIMAGEPATH + 'input', '-angle', angle.value, '-output_folder', PYTESTIMAGEPATH + 'output']);
        //
        // py.stdout.on('data', function (data) {
        //   console.log("翻转已完成");
        //   emit("finishOperation", true);
        // })

        bus.emit('imageAugment', params);
      }
    }
  }
}
</script>

<style scoped>

</style>
