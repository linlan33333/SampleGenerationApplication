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
    label="添加高斯噪声"
    v-model="addGaussianNoiseFunc"
  >
    <q-card>
      <q-card-section>
        <q-input outlined dense color="grey-14" placeholder="请输入最小振幅" type="number" v-model="min_amp"
                 step="0.001" min="0" max="10" :rules="[val => val >= 0 && val <= 10]" />
        <q-input outlined dense color="grey-14" placeholder="请输入最大振幅" type="number" v-model="max_amp"
                 step="0.001" min="0" max="10" :rules="[val => val >= 0.0 && val <= 10]" />
      </q-card-section>

      <q-card-actions align="evenly">
        <q-btn flat @click="addGaussianNoise">应用</q-btn>
        <q-btn flat @click="(min_amp=0.001) && (max_amp = 0.015)  && (possible = null)">取消</q-btn>
      </q-card-actions>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    switch-toggle-side
    label="音频时间平移"
    v-model="audioShiftFunc"
  >
    <q-card>
      <q-card-section>
        <q-input outlined dense color="grey-14" placeholder="请输入最小总时长分数" type="number" v-model="min_fraction"
                 step="0.1" min="-1" max="1" :rules="[val => val >= -1 && val <= 1]" />
        <q-input outlined dense color="grey-14" placeholder="请输入最大总时长分数" type="number" v-model="max_fraction"
                 step="0.1" min="-1" max="1" :rules="[val => val >= -1 && val <= 1]" />
      </q-card-section>

      <q-card-actions align="evenly">
        <q-btn flat @click="audioShift">应用</q-btn>
        <q-btn flat @click="(min_fraction = -0.5) && (max_fraction = 0.5)">取消</q-btn>
      </q-card-actions>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    switch-toggle-side
    label="添加短时噪声"
    v-model="addShortNoiseFunc"
  >
    <q-card>
      <q-card-section>
        <q-select outlined dense color="grey-14" label="请选择噪声文件" v-model="shortNoiseFile"
                  :options="['hens', 'sheep']" />
        <q-input outlined dense color="grey-14" class="q-pt-sm" placeholder="请输入最小信噪比" type="number" v-model="min_snr_db" />
        <q-input outlined dense color="grey-14" class="q-pt-sm" placeholder="请输入最大信噪比" type="number" v-model="max_snr_db" />
        <q-select outlined dense color="grey-14" class="q-pt-sm" label="请选择根均方值" v-model="noiseRMS"
                  :options="['relative', 'absolute']" />
      </q-card-section>

      <q-card-actions align="evenly">
        <q-btn flat @click="addShortNoise">应用</q-btn>
        <q-btn flat @click="(min_snr_db = -6.0) && (max_snr_db = 18.0) && (shortNoiseFile = noiseRMS = null)">取消</q-btn>
      </q-card-actions>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    switch-toggle-side
    label="音频增益"
    v-model="gainAudioFunc"
  >
    <q-card>
      <q-card-section>
        <q-input outlined dense color="grey-14" placeholder="请输入最小增益" type="number" v-model="min_gain_db"
                 step="1" min="-50" max="50" :rules="[val => val >= -50 && val <= 50]" />
        <q-input outlined dense color="grey-14" placeholder="请输入最大增益" type="number" v-model="max_gain_db"
                 step="1" min="-50" max="50" :rules="[val => val >= -50 && val <= 50]"/>
      </q-card-section>

      <q-card-actions align="evenly">
        <q-btn flat @click="gainAudio">应用</q-btn>
        <q-btn flat @click="(min_gain_db = -12.0) && (max_gain_db = 12.0)">取消</q-btn>
      </q-card-actions>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    switch-toggle-side
    label="带通滤波"
    v-model="bandPassFunc"
  >
    <q-card>
      <q-card-section>
        <q-input outlined dense color="grey-14" placeholder="请输入最小中心频率" type="number" v-model="min_center_freq"
                 min="0" :rules="[val => val >= 0]"/>
        <q-input outlined dense color="grey-14" placeholder="请输入最大中心频率" type="number" v-model="max_center_freq"
                 min="0" :rules="[val => val >= 0]" />
        <q-input outlined dense color="grey-14" placeholder="请输入最小频带宽度" type="number" v-model="min_bandwidth_fraction"
                 step="0.1" min="0" max="2.0" :rules="[val => val >= 0 && val <= 2.0]"/>
        <q-input outlined dense color="grey-14" placeholder="请输入最大频带宽度" type="number" v-model="max_bandwidth_fraction"
                 step="0.1" min="0" max="2.0" :rules="[val => val >= 0 && val <= 2.0]"/>
        <q-input outlined dense color="grey-14" placeholder="请输入最小滚降率" type="number" v-model="min_rolloff"
                 min="0" :rules="[val => val >= 0]"/>
        <q-input outlined dense color="grey-14" placeholder="请输入最大滚降率" type="number" v-model="max_rolloff"
                 min="0" :rules="[val => val >= 0]"/>
      </q-card-section>

      <q-card-actions align="evenly">
        <q-btn flat @click="bandPass">应用</q-btn>
        <q-btn flat @click="min_center_freq = max_center_freq = min_bandwidth_fraction = max_bandwidth_fraction = min_rolloff = max_rolloff = null">取消</q-btn>
      </q-card-actions>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    switch-toggle-side
    label="带阻滤波"
    v-model="bandStopFunc"
  >
    <q-card>
      <q-card-section>
        <q-input outlined dense color="grey-14" placeholder="请输入最小中心频率" type="number" v-model="min_center_freq_stop"
                 min="0" :rules="[val => val >= 0]"/>
        <q-input outlined dense color="grey-14" placeholder="请输入最大中心频率" type="number" v-model="max_center_freq_stop"
                 min="0" :rules="[val => val >= 0]" />
        <q-input outlined dense color="grey-14" placeholder="请输入最小频带宽度" type="number" v-model="min_bandwidth_fraction_stop"
                 step="0.1" min="0" max="2.0" :rules="[val => val >= 0 && val < 2.0]"/>
        <q-input outlined dense color="grey-14" placeholder="请输入最大频带宽度" type="number" v-model="max_bandwidth_fraction_stop"
                 step="0.1" min="0" max="2.0" :rules="[val => val >= 0 && val < 2.0]"/>
        <q-input outlined dense color="grey-14" placeholder="请输入最小滚降率" type="number" v-model="min_rolloff_stop"
                 min="0" :rules="[val => val >= 0]"/>
        <q-input outlined dense color="grey-14" placeholder="请输入最大滚降率" type="number" v-model="max_rolloff_stop"
                 min="0" :rules="[val => val >= 0]"/>
      </q-card-section>

      <q-card-actions align="evenly">
        <q-btn flat @click="bandStop">应用</q-btn>
        <q-btn flat @click="min_center_freq_stop = max_center_freq_stop = min_bandwidth_fraction_stop =
                    max_bandwidth_fraction_stop = min_rolloff_stop = max_rolloff_stop = null">取消</q-btn>
      </q-card-actions>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    switch-toggle-side
    label="剪裁失真"
    v-model="clipDistortionFunc"
  >
    <q-card>
      <q-card-section>
        <q-input outlined dense color="grey-14" placeholder="请输入最小百分位阈值" type="number" v-model="min_percentile_threshold"
                 step="1" min="0" :rules="[val => val >= 0 && val < 100]" />
        <q-input outlined dense color="grey-14" placeholder="请输入最大中心频率" type="number" v-model="max_percentile_threshold"
                 step="1" min="0" :rules="[val => val >= 0 && val < 100]" />
      </q-card-section>

      <q-card-actions align="evenly">
        <q-btn flat @click="clipDistortion">应用</q-btn>
        <q-btn flat @click="(min_percentile_threshold = 0) && (max_percentile_threshold = 40)">取消</q-btn>
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

    const audioShiftFunc = ref(false);
    const min_fraction = ref(-0.5);
    const max_fraction = ref(-0.5);

    const addShortNoiseFunc = ref(false);
    const shortNoiseFile = ref(null);
    const min_snr_db = ref(-6.0);
    const max_snr_db = ref(18.0);
    const noiseRMS = ref(null);

    const gainAudioFunc = ref(false);
    const min_gain_db = ref(-12);
    const max_gain_db = ref(12);

    const bandPassFunc = ref(false);
    const min_center_freq = ref(null);
    const max_center_freq = ref(null);
    const min_bandwidth_fraction = ref(null);
    const max_bandwidth_fraction = ref(null);
    const min_rolloff = ref(null);
    const max_rolloff = ref(null);

    const bandStopFunc = ref(false);
    const min_center_freq_stop = ref(null);
    const max_center_freq_stop = ref(null);
    const min_bandwidth_fraction_stop = ref(null);
    const max_bandwidth_fraction_stop = ref(null);
    const min_rolloff_stop = ref(null);
    const max_rolloff_stop = ref(null);

    const clipDistortionFunc = ref(false);
    const min_percentile_threshold = ref(0);
    const max_percentile_threshold = ref(40);

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

      audioShiftFunc,
      min_fraction,
      max_fraction,

      addShortNoiseFunc,
      shortNoiseFile,
      min_snr_db,
      max_snr_db,
      noiseRMS,

      gainAudioFunc,
      min_gain_db,
      max_gain_db,

      bandPassFunc,
      min_center_freq,
      max_center_freq,
      min_bandwidth_fraction,
      max_bandwidth_fraction,
      min_rolloff,
      max_rolloff,

      bandStopFunc,
      min_center_freq_stop,
      max_center_freq_stop,
      min_bandwidth_fraction_stop,
      max_bandwidth_fraction_stop,
      min_rolloff_stop,
      max_rolloff_stop,

      clipDistortionFunc,
      min_percentile_threshold,
      max_percentile_threshold,

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
          || max_amp.value < 0 || max_amp.value > 1) {
          notifyError("参数设置错误");
          return;
        }

        if (min_amp.value >= max_amp.value) {
          notifyError("参数设置不合理");
          return;
        }

        const params = [AUDIOAUGMENTFUNCPATH + "add-gaussian-noise.py", "--min_amp", min_amp.value, "--max_amp", max_amp.value, "--p", 1.0,
                        "--input_folder", TEMPPATH, "--output_folder", TEMPPATH];
        bus.emit('audioAugment', params);

      },

      audioShift() {
        if (min_fraction.value < -1 || min_fraction.value > 1
          || max_fraction.value < -1 || max_fraction.value > 1) {
          notifyError("参数设置错误");
          return;
        }

        if (min_fraction.value >= max_fraction.value) {
          notifyError("参数设置不合理");
          return;
        }

        const params = [AUDIOAUGMENTFUNCPATH + "shift.py", "--input_folder", TEMPPATH, "--output_folder", TEMPPATH,
              "--min_fraction", min_fraction.value, "--max_fraction", max_fraction.value, "--p", 1.0];
        bus.emit('audioAugment', params);
      },

      addShortNoise() {
        if (min_snr_db.value >= max_snr_db.value) {
          notifyError("参数设置不合理");
          return;
        }

        const params = [AUDIOAUGMENTFUNCPATH + "add-short-noises.py", "--input_folder", TEMPPATH, "--output_folder", TEMPPATH,
          "--noise_files_path", AUDIOAUGMENTFUNCPATH + "noises/" + shortNoiseFile.value + ".ogg", "--min_snr_db", min_snr_db.value,
          "--max_snr_db", max_snr_db.value, "--p", 1.0, "--noise_rms", noiseRMS.value];
        bus.emit('audioAugment', params);
      },

      gainAudio() {
        if (min_gain_db.value < -50 || min_gain_db.value > 50 || max_gain_db.value < -50 || max_gain_db.value > 50) {
          notifyError("参数设置错误");
          return;
        }
        if (min_gain_db.value >= max_gain_db.value) {
          notifyError("参数设置不合理");
          return;
        }

        const params = [AUDIOAUGMENTFUNCPATH + "gain.py", "--input_folder", TEMPPATH, "--output_folder", TEMPPATH,
          "--min_gain_db", min_gain_db.value, "--max_gain_db", max_gain_db.value, "--p", 1.0];
        bus.emit('audioAugment', params);
      },

      bandPass() {
        if (min_center_freq.value <= 0 || min_bandwidth_fraction.value <= 0 || min_rolloff.value <= 0
          || min_bandwidth_fraction.value > 2.0 || max_bandwidth_fraction.value > 2.0) {
          notifyError("参数设置错误");
          return;
        }

        if (min_center_freq.value >= max_center_freq.value || min_bandwidth_fraction.value >= max_bandwidth_fraction.value ||
            min_rolloff.value >= max_rolloff.value) {
          notifyError("参数设置不合理");
          return;
        }

        const params = [AUDIOAUGMENTFUNCPATH + "band-passorstop-filter.py", "--input_folder", TEMPPATH, "--output_folder", TEMPPATH,
          "--filter_type", "bandpass", "--min_center_freq", min_center_freq.value, "--max_center_freq", max_center_freq.value,
          "--min_bandwidth_fraction", min_bandwidth_fraction.value, "--max_bandwidth_fraction", max_bandwidth_fraction.value,
          "--min_rolloff", min_rolloff.value, "--max_rolloff", max_rolloff.value, "--p", 1.0];
        bus.emit('audioAugment', params);
      },

      bandStop() {
        if (min_center_freq_stop.value <= 0 || min_bandwidth_fraction_stop.value <= 0 || min_rolloff_stop.value <= 0
          || min_bandwidth_fraction_stop.value >= 2.0 || max_bandwidth_fraction_stop.value >= 2.0) {
          notifyError("参数设置错误");
          return;
        }

        if (min_center_freq_stop.value >= max_center_freq_stop.value || min_bandwidth_fraction_stop.value >= max_bandwidth_fraction_stop.value ||
          min_rolloff_stop.value >= max_rolloff_stop.value) {
          notifyError("参数设置不合理");
          return;
        }

        const params = [AUDIOAUGMENTFUNCPATH + "band-passorstop-filter.py", "--input_folder", TEMPPATH, "--output_folder", TEMPPATH,
          "--filter_type", "bandstop", "--min_center_freq", min_center_freq_stop.value, "--max_center_freq", max_center_freq_stop.value,
          "--min_bandwidth_fraction", min_bandwidth_fraction_stop.value, "--max_bandwidth_fraction", max_bandwidth_fraction_stop.value,
          "--min_rolloff", min_rolloff_stop.value, "--max_rolloff", max_rolloff_stop.value, "--p", 1.0];
        bus.emit('audioAugment', params);
      },

      clipDistortion() {
        if (min_percentile_threshold.value < 0 || min_percentile_threshold.value > 100
          || max_percentile_threshold.value < 0 || max_percentile_threshold.value > 100) {
          notifyError("参数设置错误");
          return;
        }

        if (min_percentile_threshold.value >= max_percentile_threshold.value) {
          notifyError("参数设置不合理");
          return;
        }

        const params = [AUDIOAUGMENTFUNCPATH + "clipping-distortion.py", "--input_folder", TEMPPATH, "--output_folder", TEMPPATH,
          "--min_percentile_threshold", min_percentile_threshold.value, "--max_percentile_threshold", max_percentile_threshold.value, "--p", 1.0];
        bus.emit('audioAugment', params);
      },
    }
  }
}
</script>

<style scoped>

</style>
