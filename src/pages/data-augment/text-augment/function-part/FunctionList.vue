<template>
  <q-expansion-item
    switch-toggle-side
    label="AEDA"
    v-model="AEDAFunc"
  >
    <q-card>
      <q-card-section>
        <q-input outlined dense color="grey-14" placeholder="请输入插入标点符号概率" type="number" v-model="insert_mark_possible"
                 step="0.1" min="0" max="1" :rules="[val => val >= 0 && val < 1]" />
      </q-card-section>

      <q-card-actions align="evenly">
        <q-btn flat @click="AEDA">应用</q-btn>
        <q-btn flat @click="insert_mark_possible = 0">取消</q-btn>
      </q-card-actions>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    switch-toggle-side
    label="随机插入"
    v-model="randomDeletionFunc"
  >
    <q-card>
      <q-card-section>
        <q-input outlined dense color="grey-14" placeholder="请输入删除标点符号概率" type="number" v-model="delete_word_possible"
                 step="0.1" min="0" max="1" :rules="[val => val >= 0 && val < 1]" />
      </q-card-section>

      <q-card-actions align="evenly">
        <q-btn flat @click="randomDeletion">应用</q-btn>
        <q-btn flat @click="insert_mark_possible = 0">取消</q-btn>
      </q-card-actions>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    switch-toggle-side
    label="随机删除"
    v-model="randomInsertFunc"
  >
    <q-card>
      <q-card-section>
        <q-input outlined dense color="grey-14" placeholder="请输入删除标点符号概率" type="number" v-model="insert_mark_possible"
                 step="0.1" min="0" max="1" :rules="[val => val >= 0 && val < 1]" />
      </q-card-section>

      <q-card-actions align="evenly">
        <q-btn flat @click="randomInsert">应用</q-btn>
        <q-btn flat @click="insert_mark_possible = 0">取消</q-btn>
      </q-card-actions>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    switch-toggle-side
    label="随机交换"
    v-model="randomSwapFunc"
  >
    <q-card>
      <q-card-section>
        <q-input outlined dense color="grey-14" placeholder="请输入交换单词次数" type="number" v-model="swapNum"
                 step="1" min="0" max="100" :rules="[val => val >= 0 && val < 100]" />
      </q-card-section>

      <q-card-actions align="evenly">
        <q-btn flat @click="randomSwap">应用</q-btn>
        <q-btn flat @click="swapNum = 0">取消</q-btn>
      </q-card-actions>
    </q-card>
  </q-expansion-item>

  <q-expansion-item
    switch-toggle-side
    label="同义词交换"
    v-model="synonymSwapFunc"
  >
    <q-card>
      <q-card-section>
        <q-input outlined dense color="grey-14" placeholder="请输入交换单词次数" type="number" v-model="synSwapNum"
                 step="1" min="0" max="100" :rules="[val => val >= 0 && val < 100]" />
      </q-card-section>

      <q-card-actions align="evenly">
        <q-btn flat @click="synonymSwap">应用</q-btn>
        <q-btn flat @click="synSwapNum = 0">取消</q-btn>
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
import {AUDIOAUGMENTFUNCPATH, AUDIOCLEANFUNCPATH, TEMPPATH, TEXTAUGMENTFUNCPATH} from "src/utils/global-args";

export default {
  name: "FunctionList",

  setup() {
    const $q = useQuasar();

    // AEDA函数相关参数
    const AEDAFunc = ref(false);
    const insert_mark_possible = ref(0);

    // RandomDeletion函数相关参数
    const randomDeletionFunc = ref(false);
    const delete_word_possible = ref(0);

    const randomInsertFunc = ref(false);
    const insert_word_possible = ref(0);

    const randomSwapFunc = ref(false);
    const swapNum = ref(0);

    const synonymSwapFunc = ref(false);
    const synSwapNum = ref(0);

    const notifyError = (msg) => {
      $q.notify({
        message: msg,
        position: "top",
        type: "negative"
      })
    };

    return {
      AEDAFunc,
      insert_mark_possible,

      randomDeletionFunc,
      delete_word_possible,

      randomInsertFunc,
      insert_word_possible,

      randomSwapFunc,
      swapNum,

      synonymSwapFunc,
      synSwapNum,

      cancelSelect() {
        bus.emit('cancelSelect', true);
      },

      AEDA() {
        if (insert_mark_possible.value < 0 || insert_mark_possible.value >= 1) {
          notifyError("参数设置错误");
          return;
        }

        const params = [TEXTAUGMENTFUNCPATH + "AEDA.py", TEMPPATH, TEMPPATH, "--pro", insert_mark_possible.value];
        bus.emit('textAugment', params);
      },

      randomDeletion() {
        if (delete_word_possible.value < 0 || delete_word_possible.value >=1) {
          notifyError("参数设置错误");
          return;
        }

        const params = [TEXTAUGMENTFUNCPATH + "Random_Deletion.py", TEMPPATH, TEMPPATH, "--pro", delete_word_possible.value];
        bus.emit('textAugment', params);
      },

      randomInsert() {
        if (insert_word_possible.value < 0 || insert_word_possible.value >=1) {
          notifyError("参数设置错误");
          return;
        }

        const params = [TEXTAUGMENTFUNCPATH + "Random_Insert.py", TEMPPATH, TEMPPATH, "--pro", insert_word_possible.value];
        bus.emit('textAugment', params);
      },

      randomSwap() {
        if (swapNum.value < 0 || swapNum.value >= 100) {
          notifyError("参数设置错误");
          return;
        }

        const params = [TEXTAUGMENTFUNCPATH + "Random_Swap.py", TEMPPATH, TEMPPATH, "--num", swapNum.value];
        bus.emit('textAugment', params);
      },

      synonymSwap() {
        if (swapNum.value < 0 || swapNum.value >= 100) {
          notifyError("参数设置错误");
          return;
        }

        const params = [TEXTAUGMENTFUNCPATH + "Synonym_Replacement.py", TEMPPATH, TEMPPATH, "--num", synSwapNum.value];
        bus.emit('textAugment', params);
      }
    }
  }
}
</script>

<style scoped>

</style>
