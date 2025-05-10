<template>
  <div class="column full-height justify-around q-pl-md q-pr-md">
    <div class="full-width">
      <q-input v-model="imgName" outlined dense input-class="text-center" disable>

      </q-input>
    </div>

    <div class="full-width q-pt-md">
      <q-card flat>
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label>所属文件夹: </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1">{{selectedImgFolderName}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>图片分辨率: </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1" v-if="imgDimension">{{imgDimension.width}} × {{imgDimension.height}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>图片大小: </q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label lines="1">
                {{imgFileSize}}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>

    <div class="column q-pt-md">
      <div>
        <q-btn class="full-width q-dark" flat label="移动文件" @click="openRemoveImgDialog" />
      </div>

      <div class="q-pt-sm">
        <q-btn class="full-width q-dark" flat label="重命名" @click="renameImgDialogOpen = true" />
      </div>

      <div class="q-pt-sm">
        <q-btn class="full-width q-dark" flat label="删除" />
      </div>
    </div>
  </div>

  <q-dialog v-model="removeImgDialogOpen" persistent>
    <q-card flat class="full-width">
      <q-card-section class="q-pt-lg">
        <q-select outlined class="full-width" v-model="selectNewFolderName"
                  :options="imgFolderNames" label="选择目标文件夹" virtual-scroll-slice-size="2" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn dense flat label="取消" @click="closeRemoveImgDialog" v-close-popup />
        <q-btn dense flat label="确定" @click="removeImage" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="renameImgDialogOpen" persistent>
    <q-card flat class="full-width">
      <q-card-section class="q-pt-lg">
        <q-input dense outlined v-model="newImgName" placeholder="请输入文件名称" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn dense flat label="取消" @click="closeRenameImgDialog" v-close-popup />
        <q-btn dense flat label="确定" @click="renameImage" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import {ref, getCurrentInstance, watch} from 'vue';
import { toRaw } from '@vue/reactivity';
import {FOLDERPATH} from "src/utils/global-args";

export default {
  name: "ImageInfo",

  props: [
    "imgUrl",
    "beforeModifyFolder",   // 修改前的文件夹数组
  ],

  emits: [
    "afterModifyFolder",
    "renameImage"
  ],

  setup() {
    const fs = require('fs');
    const fsextra = require('fs-extra');
    const path = require('path');
    const sizeOf = require('image-size');

    const imageUrl = ref(null);
    const imgName = ref(null);
    const imgFolder = ref(null);
    const selectedImgFolderName = ref(null);
    const imgDimension = ref(null);
    const imgFileSize = ref("");
    const imgFolderNames = ref([]);
    const selectNewFolderName = ref(null);   // 移动文件的新文件夹名称
    const newImgName = ref(null);   // 图片重命名后的名称

    const removeImgDialogOpen = ref(false);
    const renameImgDialogOpen = ref(false);

    const emit = getCurrentInstance().emit;
    const props = getCurrentInstance().props;

    watch(() => props.imgUrl, () => {
      console.log("监听到的mapart传过来的imgUrl是", props.imgUrl);
      imageUrl.value = props.imgUrl;
      if (props.imgUrl) {
        let imgUrlSlice = props.imgUrl.split('/');
        imgName.value = imgUrlSlice[imgUrlSlice.length - 1];
        selectedImgFolderName.value = imgUrlSlice[imgUrlSlice.length - 2];

        const buffer = fs.readFileSync(imageUrl.value);
        fs.stat(imageUrl.value, (err, stats) => {
          if (err) {
            imgFileSize.value = null;
          }

          let fileSizeInBytes = stats.size;
          if (fileSizeInBytes >= 1024 * 1024) {
            fileSizeInBytes /= 1024 * 1024;
            imgFileSize.value = fileSizeInBytes.toFixed(2).toString() + "M";
          }
          else if (stats.size >= 1024) {
            fileSizeInBytes /= 1024;
            imgFileSize.value = fileSizeInBytes.toFixed(2).toString() + "KB";
          }
          else {
            imgFileSize.value = fileSizeInBytes + "B";
          }
        });
        imgDimension.value = sizeOf(buffer);
      }
    })

    watch(() => props.beforeModifyFolder, () => {
      imgFolder.value = props.beforeModifyFolder;
    })

    return {
      thumbStyle: ref({                     // 设置侧边滚动条样式的
        width: '0px',
      }),
      imageUrl,
      imgName,
      selectedImgFolderName,
      imgDimension,
      imgFileSize,
      removeImgDialogOpen,
      renameImgDialogOpen,
      selectNewFolderName,       // 移动文件功能选择的新文件夹名称
      imgFolderNames,            // 移动文件功能可以选择的文件夹名称
      newImgName,                // 图片重命名后的名称

      // 取消移动文件
      closeRemoveImgDialog() {
        selectNewFolderName.value = null;
        imgFolderNames.value = [];
        removeImgDialogOpen.value = false;
      },

      removeImage() {
        const newImgUrl = FOLDERPATH + selectNewFolderName.value + '/' + imgName.value;
        // 修改imgFolder数组
        let folderList = toRaw(imgFolder.value);
        for (let item of folderList) {
          if (item.dirName === selectedImgFolderName.value) {
            for (let index in item.imgUrls) {
              if (item.imgUrls[index] === imageUrl.value) {
                item.imgUrls.splice(index, 1);
              }
            }
          }

          if (item.dirName === selectNewFolderName.value) {
            item.imgUrls.push(newImgUrl);
          }
        }
        // 修改图片信息卡片
        selectedImgFolderName.value = selectNewFolderName.value;
        // 修改imgFolder，因为向managment-part组件传递修改后的imgFolder是不会再从managment-part组件传递回来的
        imgFolder.value = folderList;
        // 清空数据
        imgFolderNames.value = [];
        selectNewFolderName.value = null;
        // 移动文件
        fsextra.moveSync(imageUrl.value, newImgUrl);
        // 把结果传递出去
        emit('afterModifyFolder', imgFolder.value);
      },

      openRemoveImgDialog() {
        const folderList = toRaw(imgFolder.value);
        for (let folder of folderList) {
          if (folder.dirName !== selectedImgFolderName.value) {
            imgFolderNames.value.push(folder.dirName);
          }
        }

        removeImgDialogOpen.value = true;
      },

      closeRenameImgDialog() {
        newImgName.value = null;
        renameImgDialogOpen.value = false;
      },

      // 这个功能本来不想做成弹窗的，应当做成在图片下方的命名框中直接修改的
      renameImage() {
        const renameImageData = {
          dirName: selectedImgFolderName.value,
          newName: newImgName.value,
          imgUrl: imageUrl.value,
          newImgUrl: FOLDERPATH + selectedImgFolderName.value + '/' + newImgName.value
        }
        fs.renameSync(imageUrl.value, FOLDERPATH + selectedImgFolderName.value + '/' + newImgName.value);
        emit("renameImgData", renameImageData);
        imageUrl.value = FOLDERPATH + selectedImgFolderName.value + '/' + newImgName.value;
        renameImgDialogOpen.value = false;
      },
    }
  },
}
</script>

<style scoped>

</style>
