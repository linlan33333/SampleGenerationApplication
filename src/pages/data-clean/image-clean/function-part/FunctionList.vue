<template>
  <q-expansion-item
    switch-toggle-side
    label="转为灰度图像"
    v-model="grayFilterFunc"
  >
    <q-card>
      <q-card-actions align="evenly">
        <q-btn flat @click="grayFilter">应用</q-btn>
      </q-card-actions>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    switch-toggle-side
    label="修改图片大小"
    v-model="imageResizeFunc"
  >
    <q-card>
      <q-card-section>
        <q-input outlined dense color="grey-14" placeholder="请输入宽度" v-model="width" type="number" min="1" :rules="[val => val > 0]" />
        <q-input outlined dense color="grey-14" placeholder="请输入高度" v-model="height" type="number" min="1" :rules="[val => val > 0]" />
      </q-card-section>

      <q-card-actions align="evenly">
        <q-btn flat @click="imageResize">应用</q-btn>
        <q-btn flat @click="width = height = null">取消</q-btn>
      </q-card-actions>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    switch-toggle-side
    label="双边滤波"
    v-model="bilateralFilterFunc"
  >
    <q-card>
      <q-card-section>
        <q-input outlined dense color="grey-14" placeholder="请输入像素邻域的直径" v-model="distance" type="number"
                 min="0" max="10" :rules="[val => val > 0 && val <= 10]" />
        <q-input outlined dense color="grey-14" placeholder="请输入像素值域方差" v-model="sigma_color" type="number"
                 min="10" max="200" :rules="[val => val >= 10 && val <= 200]" />
        <q-input outlined dense color="grey-14" placeholder="请输入空间域方差" v-model="sigma_space" type="number"
                 min="10" max="200" :rules="[val => val >= 10 && val <= 200]" />
      </q-card-section>

      <q-card-actions align="evenly">
        <q-btn flat @click="bilateralFilter">应用</q-btn>
        <q-btn flat @click="distance = 9; sigma_color = sigma_space = 75;">取消</q-btn>
      </q-card-actions>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    switch-toggle-side
    label="形态学滤波"
    v-model="morphologyFilterFunc"
  >
    <q-card>
      <q-card-section>
        <q-select outlined dense color="grey-14" label="请选择操作类型" v-model="operation" :options="['erode', 'dilate']" />
        <q-input class="q-pt-sm" outlined dense color="grey-14" placeholder="请输入迭代次数" v-model="iterations_morphology" type="number"
                 min="1" max="10" :rules="[val => val >= 1 && val <= 10]" />
      </q-card-section>

      <q-card-actions align="evenly">
        <q-btn flat @click="morphologyFilter">应用</q-btn>
        <q-btn flat @click="operation = null; iterations_morphology = 1;">取消</q-btn>
      </q-card-actions>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    switch-toggle-side
    label="快速傅里叶变换滤波"
    v-model="fftFilterFunc"
  >
    <q-card>
      <q-card-section>
        <q-input outlined dense color="grey-14" placeholder="请输入低通滤波器半径" v-model="low_pass_radius" type="number"
                 step="0.1" min="0.0" max="1.0" :rules="[val => val >= 0.0 && val <= 1.0]" />
        <q-input outlined dense color="grey-14" placeholder="请输入高通滤波器半径" v-model="high_pass_radius" type="number"
                 step="0.1" min="0.0" max="1.0" :rules="[val => val >= 0.0 && val <= 1.0]" />
      </q-card-section>

      <q-card-actions align="evenly">
        <q-btn flat @click="fftFilter">应用</q-btn>
        <q-btn flat @click="low_pass_radius = high_pass_radius = null">取消</q-btn>
      </q-card-actions>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    switch-toggle-side
    label="图像锐化"
    v-model="sharpenedFilterFunc"
  >
    <q-card>
      <q-card-actions align="evenly">
        <q-btn flat @click="sharpenedFilter">应用</q-btn>
      </q-card-actions>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    switch-toggle-side
    label="DeblurGAN"
    v-model="imageDeblurGANFunc"
  >
    <q-card>
      <q-card-actions align="evenly">
        <q-btn flat @click="DeblurGAN">应用</q-btn>
      </q-card-actions>
    </q-card>
  </q-expansion-item>

  <div class="column q-pt-md q-pl-md q-pr-md">
    <div class="q-pt-sm">
      <q-btn class="full-width q-dark" flat label="清空选择" @click="cancelSelect" />
    </div>
  </div>
</template>

<script>
import bus from "src/utils/bus";
import {ref} from "vue";
import {IMAGECLEANFUNCPATH, TEMPPATH} from "src/utils/global-args";
import {useQuasar} from "quasar";

export default {
  name: "FunctionList",

  setup() {
    const $q = useQuasar();

    const grayFilterFunc = ref(false);
    const imageResizeFunc = ref(false);
    const bilateralFilterFunc = ref(false);
    const morphologyFilterFunc = ref(false);
    const fftFilterFunc = ref(false);
    const sharpenedFilterFunc = ref(false);
    const imageDeblurGANFunc = ref(false);

    const width = ref(null);
    const height = ref(null);

    const distance = ref(9);
    const sigma_color = ref(75);
    const sigma_space = ref(75);

    const operation = ref(null);
    const iterations_morphology = ref(1);

    const low_pass_radius = ref(null);
    const high_pass_radius = ref(null);

    return {
      grayFilterFunc,
      imageResizeFunc,
      bilateralFilterFunc,
      morphologyFilterFunc,
      fftFilterFunc,
      sharpenedFilterFunc,
      imageDeblurGANFunc,

      width,
      height,

      distance,
      sigma_color,
      sigma_space,

      operation,
      iterations_morphology,

      low_pass_radius,
      high_pass_radius,

      notifyError(msg) {
        $q.notify({
          message: msg,
          position: "top",
          type: "negative"
        })
      },

      cancelSelect() {
        bus.emit('cancelSelect', true);
      },

      // 转为灰度图像
      grayFilter() {
        const params = [IMAGECLEANFUNCPATH + 'grayFilter.py', '-input_folder', TEMPPATH, '-output_folder', TEMPPATH];
        bus.emit('imageClean', params);
      },

      imageResize() {
        if (width.value <= 0 || height.value <= 0) {
          this.notify("参数设置错误");
          return;
        }

        if (width.value === null || height.value === null) {
          this.notify("参数设置不全");
          return;
        }

        const params = [IMAGECLEANFUNCPATH + 'imageResize.py', '-input_folder', TEMPPATH, '-output_folder', TEMPPATH, '-width', width.value, '-height', height.value];
        bus.emit('imageClean', params);
      },

      bilateralFilter() {
        if (distance.value < 1 || distance.value > 10 || sigma_space.value < 10
            || sigma_space.value > 200 || sigma_color < 10 || sigma_color > 200) {
          this.notify("参数设置错误");
          return;
        }

        if (distance.value === null || sigma_space.value === null || sigma_color.value === null) {
          this.notify("参数设置不全");
          return;
        }

        const params = [IMAGECLEANFUNCPATH + 'bilateralFilter.py', '-input_folder', TEMPPATH, '-output_folder', TEMPPATH, '-d', distance.value, '-sigma_color', sigma_color.value, '-sigma_space', sigma_space.value];
        bus.emit('imageClean', params);
      },

      morphologyFilter() {
        if (operation.value === null || iterations.value < 1 || iterations.value > 10) {
          this.notify("参数设置错误");
        }

        const params = [IMAGECLEANFUNCPATH + 'morphologyFilter.py', '-input_folder', TEMPPATH, '-output_folder', TEMPPATH, '-operation', operation.value, '-kernel_size', 3, '-iterations', iterations_morphology.value];
        bus.emit('imageClean', params);
      },

      fftFilter() {
        if (low_pass_radius.value < 0.0 || low_pass_radius.value > 1.0
            || high_pass_radius.value < 0.0 || high_pass_radius.value > 1.0) {
          this.notify("参数设置错误");
        }

        const params = [IMAGECLEANFUNCPATH + 'fftFilter.py', '-input_folder', TEMPPATH, '-output_folder', TEMPPATH, '-low_pass_radius', low_pass_radius.value, '-high_pass_radius', high_pass_radius.value];
        bus.emit('imageClean', params);
      },

      sharpenedFilter() {
        const params = [IMAGECLEANFUNCPATH + 'sharpenedFilter.py', '-input_folder', TEMPPATH, '-output_folder', TEMPPATH];
        bus.emit('imageClean', params);
      },

      // 这几个深度学习方法有点问题，原因不明
      DeblurGAN() {
        const params = [IMAGECLEANFUNCPATH + '/DeblurGAN/imageDeblurGAN.py', '--input_folder', TEMPPATH, '--output_folder', TEMPPATH];
        bus.emit('imageClean', params);
      }
    }
  }
}
</script>

<style scoped>

</style>
