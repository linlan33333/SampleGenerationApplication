<template>
  <q-expansion-item
    switch-toggle-side
    label="谱减法"
    v-model="pujianfaFunc"
  >
    <q-card>
      <q-card-section>
        <q-input outlined dense color="grey-14" placeholder="请输入噪声谱阈值" type="number" v-model="pujianfa_t"
              step="1" min="0" max="10" :rules="[val => val >= 0 && val <= 10]" />
        <q-input outlined dense color="grey-14" class="q-pt-sm" placeholder="请输入谱下限参数" v-model="pujianfa_b"
              step="0.01" min="0" max="10" :rules="[val => val >= 0.0 && val <= 1.0]" />
      </q-card-section>

      <q-card-actions align="evenly">
        <q-btn flat @click="pujianfa">应用</q-btn>
        <q-btn flat @click="(pujianfa_t=3) && (pujianfa_b = 0.02)">取消</q-btn>
      </q-card-actions>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    switch-toggle-side
    label="高斯噪声"
    v-model="addGaussianNoiseFunc"
  >
    <q-card>
      <q-card-section>
        <q-input outlined dense color="grey-14" placeholder="请输入最小振幅" type="number" v-model="min_amp"
                 step="0.001" min="0" max="10" :rules="[val => val >= 0 && val <= 10]" />
        <q-input outlined dense color="grey-14" class="q-pt-sm" placeholder="请输入最大振幅" v-model="max_amp"
                 step="0.001" min="0" max="10" :rules="[val => val >= 0.0 && val <= 10]" />
        <q-input outlined dense color="grey-14" class="q-pt-sm" placeholder="请输入转换概率" v-model="possible"
                 step="0.1" min="0" max="10" :rules="[val => val >= 0.0 && val <= 1.0]" />
      </q-card-section>

      <q-card-actions align="evenly">
        <q-btn flat @click="addGaussianNoise">应用</q-btn>
        <q-btn flat @click="(min_amp=0.001) && (max_amp = 0.015)  && (possible = null)">取消</q-btn>
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
import {useQuasar} from "quasar";
import {AUDIOAUGMENTFUNCPATH, AUDIOCLEANFUNCPATH, TEMPPATH} from "src/utils/global-args";

export default {
  name: "FunctionList",

  setup() {
    const pujianfaFunc = ref(false);
    const addGaussianNoiseFunc = ref(false);

    const $q = useQuasar();

    // 谱减法相关参数
    const pujianfa_t = ref(3);
    const pujianfa_b = ref(0.02);

    // 高斯噪声相关参数
    const min_amp = ref(0.001);
    const max_amp = ref(0.015);
    const possible = ref(null);

    const notifyError = (msg) => {
      $q.notify({
        message: msg,
        position: "top",
        type: "negative"
      })
    };

    return {
      pujianfaFunc,
      pujianfa_t,
      pujianfa_b,

      addGaussianNoiseFunc,
      min_amp,
      max_amp,
      possible,

      cancelSelect() {
        bus.emit('cancelSelect', true);
      },

      pujianfa() {
        if (pujianfa_t.value < 0 || pujianfa_t.value > 10
            || pujianfa_b.value < 0.0 || pujianfa_b.value > 1.0) {
          notifyError("参数设置错误");
          return;
        }

        const params = [AUDIOCLEANFUNCPATH + "pu_jian_fa/pujianfa.py", "-f", TEMPPATH, "-t", pujianfa_t.value, "-b", pujianfa_b.value];
        bus.emit('audioAugment', params);
      },

      addGaussianNoise() {
        if (min_amp.value < 0 || min_amp.value > 10
          || max_amp.value < 0 || max_amp.value > 10
          || possible.value < 0 || possible.value > 1) {
          notifyError("参数设置错误");
          return;
        }

        if (min_amp.value >= max_amp.value) {
          notifyError("参数设置不合理");
          return;
        }

        const params = [AUDIOAUGMENTFUNCPATH + "add-gaussian-noise.py", "--min_amp", min_amp.value, "--max_amp", max_amp.value, "--p", possible.value,
                        "--input_folder", TEMPPATH, "--output_folder", TEMPPATH];
        bus.emit('audioAugment', params);

      }
    }
  }
}
</script>

<style scoped>

</style>
