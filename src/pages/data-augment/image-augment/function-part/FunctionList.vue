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

  <q-expansion-item
    switch-toggle-side
    label="亮度调整"
    v-model="imageBrightnessFunc"
  >
    <q-card>
      <q-card-section>
        <q-input outlined dense color="grey-14" placeholder="请输入亮度值" v-model="brightness" type="number" :rules="[val => val >= -255 && val <= 255]" />
      </q-card-section>

      <q-card-actions align="evenly">
        <q-btn flat @click="imageBrightness">应用</q-btn>
        <q-btn flat @click="brightness = null">清空</q-btn>
      </q-card-actions>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    switch-toggle-side
    label="饱和度调整"
    v-model="imageSaturationFunc"
  >
    <q-card>
      <q-card-section>
        <q-input outlined dense color="grey-14" placeholder="请输入饱和度值" v-model="saturation" type="number" :rules="[val => val >= -255 && val <= 255]" />
      </q-card-section>

      <q-card-actions align="evenly">
        <q-btn flat @click="imageSaturation">应用</q-btn>
        <q-btn flat @click="saturation = null">清空</q-btn>
      </q-card-actions>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    switch-toggle-side
    label="图像模糊"
    v-model="imageBlurFunc"
  >
    <q-card>
      <q-card-section>
        <q-select outlined dense color="grey-14" placeholder="请选择模糊类型" v-model="blur_type"
                  :options="['average', 'gaussian', 'median']" />
      </q-card-section>

      <q-card-actions align="evenly">
        <q-btn flat @click="imageBlur">应用</q-btn>
        <q-btn flat @click="blur_type = null">清空</q-btn>
      </q-card-actions>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    switch-toggle-side
    label="弹性变换"
    v-model="imageElasticFunc"
  >
    <q-card>
      <q-card-section>
        <q-input outlined dense color="grey-14" placeholder="请输入变形程度" v-model="elastic_alpha"
                 type="number" :rules="[val => val >= 100 && val <= 500]" />
        <q-input outlined dense color="grey-14" placeholder="请输入平滑程度" v-model="elastic_sigma"
                 type="number" :rules="[val => val >= 5 && val <= 20]" />
      </q-card-section>

      <q-card-actions align="evenly">
        <q-btn flat @click="imageElastic">应用</q-btn>
        <q-btn flat @click="(elastic_alpha = 200) && (elastic_sigma = 10)">恢复默认</q-btn>
      </q-card-actions>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    switch-toggle-side
    label="网格扭曲"
    v-model="imageGridFunc"
  >
    <q-card>
      <q-card-section>
        <q-input outlined dense color="grey-14" placeholder="请输入网格数量" v-model="grid_num"
                 type="number" :rules="[val => val >= 25 && val <= 250]" />
        <q-input outlined dense color="grey-14" placeholder="请输入扭曲程度" v-model="intensity"
                 type="number" :rules="[val => val >= 5 && val <= 50]" />
      </q-card-section>

      <q-card-actions align="evenly">
        <q-btn flat @click="imageGrid">应用</q-btn>
        <q-btn flat @click="intensity = 20">恢复默认</q-btn>
      </q-card-actions>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    switch-toggle-side
    label="cycleGAN"
    v-model="cycleGANFunc"
  >
    <q-card>
      <q-card-section>
        <q-select outlined dense color="grey-14" placeholder="请选择转换风格" v-model="cycleGANName"
                  :options="['horse2zebra', 'monet2photo', 'summer2winter']" />
      </q-card-section>

      <q-card-actions align="evenly">
        <q-btn flat @click="cycleGANRun">应用</q-btn>
        <q-btn flat @click="cycleGANName = null">取消</q-btn>
      </q-card-actions>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    switch-toggle-side
    label="Pix2Pix"
    v-model="Pix2PixFunc"
  >
    <q-card>
      <q-card-section>
        <q-select outlined dense color="grey-14" placeholder="请选择转换风格" v-model="Pix2PixName"
                  :options="['sat2map', 'map2sat', 'day2night']" />
      </q-card-section>

      <q-card-actions align="evenly">
        <q-btn flat @click="Pix2PixRun">应用</q-btn>
        <q-btn flat @click="Pix2PixName = null">取消</q-btn>
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
import {getCurrentInstance, ref} from "vue";
import bus from "src/utils/bus";
import {PYFUNCTESTPATH, PYTESTIMAGEPATH, TEMPPATH} from "src/utils/global-args";
import {useQuasar} from "quasar";

export default {
  name: "FunctionList",

  setup() {
    const imageRotateFunc = ref(false);
    const imageCropFunc = ref(false);
    const imageBrightnessFunc = ref(false);
    const imageSaturationFunc = ref(false);
    const imageBlurFunc = ref(false);
    const imageElasticFunc = ref(false);
    const imageGridFunc = ref(false);
    const cycleGANFunc = ref(false);
    const Pix2PixFunc = ref(false);

    const $q = useQuasar();
    const angle = ref(null);

    // 图像剪裁相关参数，这些参数需要做检查啊
    const x = ref(null);
    const y = ref(null);
    const crop_width = ref(null);
    const crop_height = ref(null);

    // 图像亮度调节相关参数
    const brightness = ref(null);

    // 图像饱和度调节相关参数
    const saturation = ref(null);

    // 图像模糊的选项参数
    const blur_type = ref(null);

    // 图像弹性变换选项参数
    const elastic_alpha = ref(200);
    const elastic_sigma = ref(10);

    // 图像网格扭曲选项参数
    const intensity = ref(20);
    const grid_num = ref(null);

    // cycleGAN模型的名称
    const cycleGANName = ref(null);

    // Pix2Pix模型的名称
    const Pix2PixName = ref(null);

    return {
      imageRotateFunc,
      imageCropFunc,
      imageBrightnessFunc,
      imageSaturationFunc,
      imageBlurFunc,
      imageElasticFunc,
      imageGridFunc,
      cycleGANFunc,
      Pix2PixFunc,

      angle,

      x,
      y,
      crop_width,
      crop_height,

      brightness,
      saturation,
      blur_type,
      elastic_alpha,
      elastic_sigma,

      intensity,
      grid_num,

      cycleGANName,
      Pix2PixName,

      notifyError(msg) {
        $q.notify({
          message: msg,
          position: "top",
          type: "negative"
        })
      },

      // 图像翻转
      imageRotate() {
        if (angle.value === null) {
          this.notifyError("参数设置不全");
          return;
        }
        const params = [PYFUNCTESTPATH + 'imageRotate.py', '-input_folder', TEMPPATH, '-angle', angle.value, '-output_folder', TEMPPATH];
        bus.emit('imageAugment', params);
      },

      // 图像剪裁
      imageCrop() {
        if (crop_height === null || crop_width === null) {
          this.notifyError("参数设置不全");
          return;
        }
        const params = [PYFUNCTESTPATH + 'imageCrop.py', '-input_folder', TEMPPATH, '-x', x.value, '-y', y.value,
                          '-width', crop_width.value, '-height', crop_height.value, '-output_folder', TEMPPATH];
        bus.emit('imageAugment', params);
      },

      imageBrightness() {
        if (brightness.value < -255 || brightness.value > 255) {
          this.notifyError("参数设置错误");
          return;
        }

        if (brightness.value === null) {
          this.notifyError("参数设置不全");
          return;
        }

        const params = [PYFUNCTESTPATH + 'imageBrightness.py', '-input_folder', TEMPPATH,
                '-brightness', brightness.value, '-output_folder', TEMPPATH];
        bus.emit('imageAugment', params);
      },

      imageSaturation() {
        if (saturation.value < -255 || saturation.value > 255) {
          this.notifyError("参数设置错误");
          return;
        }

        if (saturation.value === null) {
          this.notifyError("参数设置不全");
          return;
        }

        const params = [PYFUNCTESTPATH + 'imageSaturation.py', '-input_folder', TEMPPATH,
          '-saturation', saturation.value, '-output_folder', TEMPPATH];
        bus.emit('imageAugment', params);
      },

      imageBlur() {
        if (blur_type === null) {
          this.notifyError("参数设置不全");
          return;
        }

        const params = [PYFUNCTESTPATH + 'imageBlur.py', '-input_folder', TEMPPATH,
          '-blur_type', blur_type.value, '-kernel_size', 5, '-output_folder', TEMPPATH];
        bus.emit('imageAugment', params);
      },

      imageElastic() {
        if (elastic_alpha.value < 100 || elastic_alpha.value > 500 || elastic_sigma.value < 5 || elastic_sigma.value > 20) {
          this.notifyError("参数设置不合理");
        }
        else if (elastic_alpha.value === null || elastic_sigma.value === null) {
          this.notifyError("参数设置不全");
        }

        const params = [PYFUNCTESTPATH + 'imageElastic.py', '-input_folder', TEMPPATH,
          '-alpha', elastic_alpha.value, '-sigma', elastic_sigma.value, '-output_folder', TEMPPATH];
        bus.emit('imageAugment', params);
      },

      imageGrid() {
        if (intensity.value < 5 || intensity.value > 50 || grid_num.value < 25 || grid_num.value > 250) {
          this.notifyError("参数设置不合理");
          return;
        }
        if (intensity.value === null || grid_num.value === null) {
          this.notifyError("参数设置不全");
        }

        let grid_size = Math.sqrt(grid_num.value);
        grid_size = Math.ceil(grid_size);

        const params = [PYFUNCTESTPATH + 'imageGrid.py', '-input_folder', TEMPPATH,
          '-grid_size', grid_size, grid_size, '-intensity', intensity.value, '-output_folder', TEMPPATH];
        bus.emit('imageAugment', params);
      },

      cycleGANRun() {
        if (cycleGANName.value === null) {
          this.notifyError("参数设置不全");
          return;
        }
        const params = [PYFUNCTESTPATH + 'imageCycleGAN.py', '--dataroot', TEMPPATH,
          '--name', cycleGANName.value, '--model', 'test', '--no_dropout', '--results_dir', TEMPPATH];
        bus.emit('imageAugment', params);
      },

      Pix2PixRun() {
        if (Pix2PixName.value === null) {
          this.notifyError("参数设置不全");
          return;
        }
        const params = [PYFUNCTESTPATH + 'imagePix2Pix.py', '--dataroot', TEMPPATH, '--name', 'day2night',
                '--model', 'test', '--netG', 'unet_256', '--dataset_mode', 'single', '--norm', 'batch', '--results_dir', TEMPPATH];
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
