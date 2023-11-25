<template>

    <q-list class="full-width" v-for="(folder, listIndex) in imgFolder"
            :key="listIndex">
      <q-expansion-item
        switch-toggle-side>
        <template v-slot:header>
          <q-item-section>
            <q-item-label>
              {{folder.dirName}}
            </q-item-label>
          </q-item-section>

          <q-item-section side v-close-popup>
            <div class="row" v-close-popup>
              <q-btn flat padding="xs" icon="add" @click.stop="" v-close-popup>
                <q-tooltip class="text-subtitle2">
                  导入图片
                </q-tooltip>
              </q-btn>

              <q-btn flat padding="xs" icon="edit" @click.stop="" v-close-popup>
                <q-tooltip class="text-subtitle2">
                  重命名
                </q-tooltip>
              </q-btn>
            </div>
          </q-item-section>
        </template>
        <q-card>
          <q-card-section>
            <div class="image-container flex wrap justify-start q-gutter-sm">
              <q-item v-for="(imgUrl, index) in folder.imgUrls" :key="index"
                      class="image-item column">
                <q-item-section class="full-width">
                  <q-img :src="imgUrl"
                         class="rounded-borders clickable-img"
                         :class="{'highlighted-img': index === selectedImageIndex && listIndex === selectedListIndex}"
                         @click="selectImage(imgUrl, index, listIndex)"
                         ratio="1" />
                </q-item-section>
                <q-item-label class="self-center q-pt-sm col-auto" lines="1">
                  {{imgUrl.split('/').pop()}}
                </q-item-label>
              </q-item>
            </div>
          </q-card-section>
        </q-card>

      </q-expansion-item>

    </q-list>

</template>

<script>
import { ref, onMounted, defineEmits, getCurrentInstance } from 'vue';

export default {
  name: "FolderList",

  setup() {
    const fs = require('fs');

    const emit = getCurrentInstance().emit;

    const imgFolder = ref([]);

    // 这里假设本软件管理的图片文件夹的路径在这个文件夹中，这里将用户的所有图片文件夹读出来并展示在前端
    onMounted( () => {
      fs.readdir('E:/programing/QuasarDemo/SampleGenerationApp/imgFolder', (err, dirs) => {
        if (err) {
          console.log("读取目录失败：", err);
          return;
        }

        for (let dir of dirs) {
          // 定义一个临时变量，等把当前文件夹中的图片的url都存放好后再添加进imgFolder
          let temp = {
            dirName: dir,
            imgUrls: []
          }

          fs.readdir('E:/programing/QuasarDemo/SampleGenerationApp/imgFolder/' + dir, (err, files) => {
            if (err) {
              console.log("读取图片文件失败：", err);
              return;
            }

            for (let file of files) {
              temp.imgUrls.push(urlTemp.value + dir + '/' + file);
            }
          })

          imgFolder.value.push(temp);
        }
      });
      // folderNames.value = window.folder.getFolderNames();
      // console.log(window.folder);
    })

    const urlTemp = ref("E:/programing/QuasarDemo/SampleGenerationApp/imgFolder/");

    return {
      imgFolder,
      urlTemp,

      // 为了控制选中的图片显示高亮的样式，需要记录选中的图片的index和所在列表项的index
      selectedImageIndex: ref(-1),
      selectedListIndex: ref(-1),

      selectImage(imgUrl, index, listIndex) {
        this.selectedImageIndex = index;
        this.selectedListIndex = listIndex;
        emit("selectedImgUrl", imgUrl);
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.image-container
  //display: flex
  //flex-wrap: wrap
  //justify-content: space-between
  width: 100%
  margin: 0 auto

.image-item
  width: calc(20% - 8px)
  margin-bottom: 20px
  //aspect-ratio: 1

.clickable-img
  cursor: pointer

.highlighted-img
  border: 2px solid #1976D2
</style>
