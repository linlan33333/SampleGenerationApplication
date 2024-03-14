<template>
  <q-expansion-item
    switch-toggle-side
    label="图像旋转"
    v-model="imageRotateFunc"
    >
    <q-card>
      <q-card-section>
        <q-select outlined dense color="grey-14" :options="[90, 180, 270]" v-model="angle" />
      </q-card-section>

      <q-card-actions align="evenly">
        <q-btn flat @click="imageRotate">应用</q-btn>
        <q-btn flat @click="angle=null">取消</q-btn>
      </q-card-actions>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    switch-toggle-side
    label="图像剪裁"
    v-model="imageCropFunc"
  >
    <q-card>
      <q-card-section>
        <q-input outlined dense color="grey-14" placeholder="请输入左上角横坐标" v-model="x" />
        <q-input outlined dense color="grey-14" class="q-pt-sm" placeholder="请输入右上角纵坐标" v-model="y" />
        <q-input outlined dense color="grey-14" class="q-pt-sm" placeholder="请输入剪裁宽度" v-model="crop_width" />
        <q-input outlined dense color="grey-14" class="q-pt-sm" placeholder="请输入剪裁高度" v-model="crop_height" />
      </q-card-section>

      <q-card-actions align="evenly">
        <q-btn flat @click="imageCrop">应用</q-btn>
        <q-btn flat @click="x=y=crop_width=crop_height=null">清空</q-btn>
      </q-card-actions>
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
import {useQuasar} from "quasar";

export default {
  name: "FunctionList",

  setup() {
    const imageRotateFunc = ref(false);
    const imageCropFunc = ref(false);

    const $q = useQuasar();
    const angle = ref(null);

    // 图像剪裁相关参数，这些参数需要做检查啊
    const x = ref(null);
    const y = ref(null);
    const crop_width = ref(null);
    const crop_height = ref(null);

    return {
      imageRotateFunc,
      imageCropFunc,

      angle,

      x,
      y,
      crop_width,
      crop_height,

      // 图像翻转
      imageRotate() {
        if (angle.value === null) {
          $q.notify({
            message: "参数设置不全",
            position: "top",
            type: "negative"
          })
          return;
        }
        const params = [PYFUNCTESTPATH + 'imageRotate.py', '-input_folder', TEMPPATH, '-angle', angle.value, '-output_folder', TEMPPATH];
        bus.emit('imageAugment', params);
      },

      // 图像剪裁
      imageCrop() {
        if (crop_height === null || crop_width === null) {
          $q.notify({
            message: "参数设置不全",
            position: "top",
            type: "negative"
          })
          return;
        }
        const params = [PYFUNCTESTPATH + 'imageCrop.py', '-input_folder', TEMPPATH, '-x', x.value, '-y', y.value,
                          '-width', crop_width.value, '-height', crop_height.value, '-output_folder', TEMPPATH];
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
