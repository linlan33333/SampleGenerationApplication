<template>
  <q-toolbar inset>
    <q-btn round flat icon="keyboard_backspace" color="white" @click="giveUpAugment" />

    <q-toolbar-title>
      增强结果
    </q-toolbar-title>

    <div v-show="!multiSelect">
      <q-btn flat padding="xs md" @click="selectMultiFiles">
        <div class="text-subtitle1 ">
          批量选择
        </div>
      </q-btn>
    </div>
    <div v-show="multiSelect">
      <q-btn flat padding="xs sm" @click="cancelSelectMultiFiles">
        <div class="text-subtitle1 ">
          取消
        </div>
      </q-btn>
      <q-btn flat padding="xs md" @click="">
        <div class="text-subtitle1 ">
          批量保存
        </div>
      </q-btn>
    </div>
  </q-toolbar>
</template>

<script>
import {ref} from "vue";
import { useRouter } from "vue-router";
import bus from "src/utils/bus";
import {TEMPPATH} from "src/utils/global-args";

export default {
  name: "AugResToolBar",

  setup() {
    const multiSelect = ref(false);
    const router = useRouter();
    const fs = require('fs-extra');

    return {
      multiSelect,

      selectMultiFiles() {
        multiSelect.value = true;
        bus.emit('selectMultiFiles', multiSelect.value);
      },

      cancelSelectMultiFiles() {
        multiSelect.value = false;
        bus.emit('cancelSelectMultiFiles', multiSelect.value);
      },

      /**
       * 返回上一界面则清空temp文件夹里的全部内容
       */
      giveUpAugment() {
        fs.emptyDir(TEMPPATH);
        router.back();
      }
    }
  },
}
</script>

<style scoped>

</style>
