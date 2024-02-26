<template>
  <q-list class="full-width" v-for="(folder, listIndex) in imgFolder"
          :key="listIndex">
    <q-expansion-item
      switch-toggle-side
      v-model="folder.expanded">
      <template v-slot:header>
        <q-item-section>
          <q-item-label class="text-subtitle1">
            {{folder.dirName}}
          </q-item-label>
        </q-item-section>

        <q-item-section side v-close-popup>
          <div class="row" v-close-popup>
            <q-btn size="md" padding="xs sm" flat @click.stop="selectFolders(listIndex)">
              <q-item-label class="text-grey-2 text-subtitle2">
                选择文件夹
              </q-item-label>
            </q-btn>

            <q-btn size="md" flat @click.stop="selectFiles(listIndex)">
              <q-item-label class="text-grey-2 text-subtitle2">
                选择文件
              </q-item-label>
            </q-btn>
          </div>
        </q-item-section>
      </template>
      <q-card flat>
        <q-card-section>
          <div class="image-container flex wrap justify-start q-gutter-sm">
            <q-item v-for="(imgUrl, index) in folder.imgUrls" :key="index"
                    class="image-item column">
              <q-item-section class="full-width">
                <q-img :src="imgUrl"
                       class="rounded-borders clickable-img"
                       ratio="1" >
<!--                  <q-checkbox v-show="folder.showCheckbox" class="absolute-top-left all-pointer-events"-->
<!--                              v-model="selectedImages" :val="imgUrl" color="orange" size="xs" />-->
                  <q-checkbox v-show="folder.showCheckbox" class="all-pointer-events"
                              v-model="selectedImages" :val="imgUrl" color="orange" size="sm" />
                </q-img>
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
import { ref, onMounted, watch, getCurrentInstance, onBeforeUnmount } from 'vue';
import bus from "src/utils/bus";
import { PYTESTIMAGEPATH, TEMPPATH } from "src/utils/global-args";

export default {
  name: "ImageList",

  setup() {
    const fs = require('fs');
    const props = getCurrentInstance().props;
    const spawn = require('child_process').spawn;

    const imgFolder = ref([]);      // 工作目录下的所有文件夹以及里面的图片信息都会存放到这里
    const urlTemp = ref(PYTESTIMAGEPATH);
    const selectedImages = ref([]);   // 被选中需要修改的图片文件

    // 这里假设本软件管理的图片文件夹的路径在这个文件夹中，这里将用户的所有图片文件夹读出来并展示在前端
    onMounted( () => {
      fs.readdir(PYTESTIMAGEPATH, (err, dirs) => {
        if (err) {
          console.log("读取目录失败：", err);
          return;
        }

        for (let dir of dirs) {
          // 定义一个临时变量，等把当前文件夹中的图片的url都存放好后再添加进imgFolder
          let temp = {
            dirName: dir,
            expanded: false,
            imgUrls: [],
            showCheckbox: false // 控制多选框显示与隐藏的状态
          }

          fs.readdir(PYTESTIMAGEPATH + '/' + dir, (err, files) => {
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
    })

    onMounted(() => {
      bus.on('imageAugment', params => {
        console.log(params);
        // 先将选中的图片全部拷贝到temp文件夹下

        const py = spawn('python', params);
        py.stdout.on('data', function (data) {
          console.log("翻转已完成");
        })
        py.stderr.on('data', res => {
          let data = res.toString();
          console.log(data);
        })
      })
    })

    onBeforeUnmount(() => {
      bus.off('imageAugment');
    })

    return {
      imgFolder,
      urlTemp,
      selectedImages,

      selectFiles(listIndex) {
        // 将当前列表项的多选框显示状态设置为true，其他列表项的多选框隐藏
        imgFolder.value.forEach((folder, index) => {
          if (index === listIndex) {
            folder.showCheckbox = true;
          }
        });
      },

      selectFolders(listIndex) {
        // 将当前列表项的多选框显示状态设置为true，其他列表项的多选框隐藏
        imgFolder.value.forEach((folder, index) => {
          if (index === listIndex) {
            folder.showCheckbox = true;
            for (let item of folder.imgUrls) {
              if (!selectedImages.value.includes(item)) {
                selectedImages.value.push(item);
              }
            }
          }
        });
      }
    }
  },
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
