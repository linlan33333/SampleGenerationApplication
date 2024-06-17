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
        <q-input outlined dense color="grey-14" placeholder="请输入谱下限参数" v-model="pujianfa_b"
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
    label="MMSE算法"
    v-model="MMSEFunc"
  >
    <q-card>
      <q-card-section>
        <q-input outlined dense color="grey-14" placeholder="请输入gamma值" type="number" v-model="max_gamma"
                 step="1" min="0" max="100" :rules="[val => val >= 0 && val <= 100]" />
        <q-input outlined dense color="grey-14" placeholder="请输入VAD参数" v-model="mu_VAD"
                 step="0.01" min="0.9" max="0.99" :rules="[val => val >= 0.9 && val <= 0.99]" />
      </q-card-section>

      <q-card-actions align="evenly">
        <q-btn flat @click="MMSE">应用</q-btn>
        <q-btn flat @click="(max_gamma = 40) && (mu_VAD = 0.98)">取消</q-btn>
      </q-card-actions>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    switch-toggle-side
    label="Wiener算法"
    v-model="WienerFunc"
  >
    <q-card>
      <q-card-section>
        <q-input outlined dense color="grey-14" placeholder="请输入信噪比增益值" type="number" v-model="wiener_alpha"
                 step="1" min="0" max="10" :rules="[val => val >= 0 && val <= 10]" />
        <q-input outlined dense color="grey-14" placeholder="请输入噪声估计阈值" v-model="wiener_beta"
                 step="0.01" min="0.01" max="0.1" :rules="[val => val >= 0.01 && val <= 0.1]" />
      </q-card-section>

      <q-card-actions align="evenly">
        <q-btn flat @click="Wiener">应用</q-btn>
        <q-btn flat @click="(wiener_alpha = 4) && (wiener_beta = 0.01)">取消</q-btn>
      </q-card-actions>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    switch-toggle-side
    label="Subspace算法"
    v-model="SubspaceFunc"
  >
    <q-card>
      <q-card-section>
        <q-input outlined dense color="grey-14" placeholder="请输入噪声协方差矩阵更新阈值" type="number" v-model="vad_thre"
                 step="0.1" min="0" max="10" :rules="[val => val >= 0 && val <= 10]" />
        <q-input outlined dense color="grey-14" placeholder="请输入噪声协方差矩阵更新速度" v-model="subspace_mu_vad"
                 step="0.01" min="0.01" max="1" :rules="[val => val >= 0.01 && val <= 1]" />
      </q-card-section>

      <q-card-actions align="evenly">
        <q-btn flat @click="Subspace">应用</q-btn>
        <q-btn flat @click="(vad_thre = 1.2) && (subspace_mu_vad = 0.98)">取消</q-btn>
      </q-card-actions>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    switch-toggle-side
    label="SEGAN"
    v-model="SEGANFunc"
  >
    <q-card>
      <q-card-actions align="evenly">
        <q-btn flat @click="SEGAN">应用</q-btn>
      </q-card-actions>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    switch-toggle-side
    label="DTLN"
    v-model="DTLNFunc"
  >
    <q-card>
      <q-card-actions align="evenly">
        <q-btn flat @click="DTLN">应用</q-btn>
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
    const $q = useQuasar();

    // 谱减法相关参数
    const pujianfaFunc = ref(false);
    const pujianfa_t = ref(3);
    const pujianfa_b = ref(0.02);

    // MMSE相关参数
    const MMSEFunc = ref(false);
    const max_gamma = ref(40);
    const mu_VAD = ref(0.98);

    // Wiener相关参数
    const WienerFunc = ref(false);
    const wiener_alpha = ref(4);
    const wiener_beta = ref(0.01);

    // SubspaceFunc相关参数
    const SubspaceFunc = ref(false);
    const vad_thre = ref(1.2);
    const subspace_mu_vad = ref(0.98);

    // SEGAN相关参数
    const SEGANFunc = ref(false);

    // DTLN相关参数
    const DTLNFunc = ref(false);

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

      MMSEFunc,
      max_gamma,
      mu_VAD,

      WienerFunc,
      wiener_alpha,
      wiener_beta,

      SubspaceFunc,
      vad_thre,
      subspace_mu_vad,

      SEGANFunc,

      DTLNFunc,

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
        bus.emit('audioClean', params);
      },

      MMSE() {
        if (max_gamma.value < 0 || max_gamma.value > 100
            || mu_VAD.value < 0.9 || mu_VAD.value > 0.98) {
          notifyError("参数设置错误");
          return;
        }

        const params = [AUDIOCLEANFUNCPATH + "MMSE/mmse.py", "-f", TEMPPATH, "-o", TEMPPATH, "-g", max_gamma.value, "-v", mu_VAD.value];
        bus.emit("audioClean", params);
      },

      Wiener() {
        if (wiener_alpha.value < 0 || wiener_alpha.value > 10
          || wiener_beta.value < 0.01 || wiener_beta.value > 0.1) {
          notifyError("参数设置错误");
          return;
        }

        const params = [AUDIOCLEANFUNCPATH + "wiener/wiener.py", "-f", TEMPPATH, "-o", TEMPPATH, "-b", wiener_beta.value, "-a", wiener_alpha.value];
        bus.emit("audioClean", params);
      },

      Subspace() {
        if (vad_thre.value < 0 || vad_thre.value > 10
          || subspace_mu_vad.value < 0.01 || subspace_mu_vad.value > 1) {
          notifyError("参数设置错误");
          return;
        }

        const params = [AUDIOCLEANFUNCPATH + "subspace/subspace.py", "-f", TEMPPATH, "-o", TEMPPATH, "-v", vad_thre.value, "-m", subspace_mu_vad.value];
        bus.emit("audioClean", params);
      },

      SEGAN() {
        const params = [AUDIOCLEANFUNCPATH + "SEGAN_ludong/segan.py", "-f", TEMPPATH, "-o", TEMPPATH, "--epoch_name", AUDIOCLEANFUNCPATH + "SEGAN_ludong/segan_model/generator-9.pkl"];
        bus.emit("audioClean", params);
      },

      DTLN() {
        const params = [AUDIOCLEANFUNCPATH + "DTLN/DTLN.py", "-f", TEMPPATH, "-o", TEMPPATH, "-m", AUDIOCLEANFUNCPATH + "DTLN/pretrained_model/model.h5"];
        bus.emit("audioClean", params);
      }
    }
  }
}
</script>

<style scoped>

</style>
