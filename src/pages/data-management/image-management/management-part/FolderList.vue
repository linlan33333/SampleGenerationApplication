<template>
  <q-list class="full-width" v-for="(folder, index) in imgFolder"
          :key="index">
    <q-expansion-item
      switch-toggle-side
      :label="folder.dirName">

      <q-card class="full-width">
        <q-img :src="imgUrl"
               v-for="(imgUrl, index) in folder.imgUrls" :key="index"
               class="rounded-borders"
               style="max-height: 200px" fit="contain"
        />
      </q-card>

    </q-expansion-item>

<!--    <q-separator />-->
  </q-list>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue';

export default {
  name: "FolderList",

  setup() {
    const fs = require('fs');

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
      urlTemp
    }
  }
}
</script>

<style scoped>

</style>
