<template>
  <q-toolbar inset>
    <q-btn size="md" flat @click="importDir">
      <q-item-label class="text-grey-4 text-subtitle1">
        数据导入
      </q-item-label>
    </q-btn>

    <q-toolbar-title />

    <q-space />

    <q-btn flat padding="xs" icon="add" @click="folderNameDOpen = true">
      <q-tooltip class="text-subtitle2">
        创建文件夹
      </q-tooltip>
    </q-btn>

    <q-dialog v-model="folderNameDOpen" persistent>
      <q-card flat class="full-width">
        <q-card-section class="q-pt-lg">
          <q-input dense outlined v-model="folderName" placeholder="请输入文件夹名称" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn dense flat label="取消" @click="folderNameDOpen = false" v-close-popup />
          <q-btn dense flat label="确定" @click="createFolder" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-input dense outlined bg-color="grey-9" v-model="audioName" class="q-ml-md">
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>
  </q-toolbar>
</template>

<script>
import { ref, getCurrentInstance, watch } from 'vue';
import { useQuasar } from 'quasar';
import { FOLDERPATH } from "src/utils/global-args";

export default {
  name: "ToolBar",

  setup() {
    const fs = require('fs');
    const $q = useQuasar();
    const emit = getCurrentInstance().emit;
    const { dialog } = require('@electron/remote');

    const text = ref("");
    const folderName = ref("");
    const audioName = ref('');
    const folderNameDOpen = ref(false);
    const selectedFolderPath = ref("");

    watch(audioName, () => {
      emit("searchImageName", audioName.value);
    });

    return {
      text,
      folderName,
      folderNameDOpen,
      audioName,

      createFolder() {
        fs.mkdir(FOLDERPATH + folderName.value, err => {
          if (err) {
            console.log(err);
            $q.notify({
              message: "创建失败，请重试",
              color: 'write'
            });

            return;
          }

          emit("newFolder", folderName.value);
        })
      },

      importDir() {
        selectedFolderPath.value = "";  // 先重置导入文件夹路径
        // 使用electron的dialog功能，能够打开本机文件夹
        dialog.showOpenDialog({
          properties: ['openDirectory'],
        }).then((res) => {
          if (!res.canceled && res.filePaths.length > 0) {
            selectedFolderPath.value = res.filePaths[0];
            console.log(selectedFolderPath.value);
            emit("importFolderPath", selectedFolderPath.value);
          }
        });
      }
    }
  },
}
</script>

<style lang="sass" scoped>
//48, 49, 52
</style>
