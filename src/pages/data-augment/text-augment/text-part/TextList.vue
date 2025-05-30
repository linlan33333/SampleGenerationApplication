<template>
  <q-list class="full-width" v-for="(folder, listIndex) in textFolder"
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
            <q-item v-for="(textUrl, index) in folder.textUrls" :key="index"
                    class="image-item column">
              <q-item-section class="full-width">
                <q-img src="~assets/text.jpg"
                       class="rounded-borders clickable-img"
                       ratio="1" >
                  <q-checkbox v-show="folder.showCheckbox" class="all-pointer-events"
                              v-model="selectedTexts" :val="textUrl" color="orange" size="sm" />
                </q-img>
              </q-item-section>
              <q-item-label class="self-center q-pt-sm col-auto" lines="1">
                {{textUrl.split('/').pop()}}
              </q-item-label>
            </q-item>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-list>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from "vue-router";
import bus from "src/utils/bus";
import { useQuasar } from "quasar";
import {TEMPPATH, SGATextEnvPath, TEXTFOLDERPATH} from "src/utils/global-args";

export default {
  name: "TextList",

  setup() {
    const fs = require('fs');
    const spawn = require('child_process').spawn;
    const $q = useQuasar();
    const router = useRouter();

    const textFolder = ref([]);      // 工作目录下的所有文件夹以及里面的图片信息都会存放到这里
    const urlTemp = ref(TEXTFOLDERPATH);
    const selectedTexts = ref([]);   // 被选中需要修改的图片文件

    // 这里假设本软件管理的图片文件夹的路径在这个文件夹中，这里将用户的所有图片文件夹读出来并展示在前端
    onMounted( () => {
      fs.readdir(TEXTFOLDERPATH, (err, dirs) => {
        if (err) {
          console.log("读取目录失败：", err);
          return;
        }

        for (let dir of dirs) {
          // 定义一个临时变量，等把当前文件夹中的图片的url都存放好后再添加进textFolder
          let temp = {
            dirName: dir,
            expanded: false,
            textUrls: [],
            showCheckbox: false // 控制多选框显示与隐藏的状态
          }

          fs.readdir(TEXTFOLDERPATH + dir, (err, files) => {
            if (err) {
              console.log("读取文本文件失败：", err);
              return;
            }

            for (let file of files) {
              temp.textUrls.push(urlTemp.value + dir + '/' + file);
            }
          })

          textFolder.value.push(temp);
        }
      });
    })

    onMounted(() => {
      bus.on('textAugment', params => {
        const notif = $q.notify({
          group: false,
          timeout: 0,   // 一直显示
          spinner: true,
          message: '处理中，请勿执行其他操作...',
        })
        // 先将选中的图片全部拷贝到temp文件夹下
        for (let textUrl of selectedTexts.value) {
          // 先给图片名称起名，将原图片的路径作为新图片的名称，以此保留原图片的信息
          let newName = textUrl.replace(/\//g, '^');   // 将原图片路径的\替换成#，不然无法作为文件名
          newName = newName.replace(':', '@');        // 将原图片路径的:替换成@，不然无法作为文件名
          let newTextUrl = TEMPPATH + newName;
          fs.copyFileSync(textUrl, newTextUrl);
        }

        const py = spawn(SGATextEnvPath, params);
        console.log(params);

        // 界面跳转

        py.stdout.on('data', data => {
          notif({
            icon: 'done',
            spinner: false,
            message: '文件处理已完成',
            timeout: 2000 // 2秒后该提示框自动消失
          })
          router.push('/data-augment/text-augment-result');
        })

        py.stderr.on('data', err => {
          notif({
            icon: 'error',
            spinner: false,
            message: '文件处理失败，请重试',
            timeout: 2000 // 2秒后该提示框自动消失
          })
          const decoder = new TextDecoder('utf-8');
          const utf8String = decoder.decode(err);
          console.log(utf8String);
        })
      })

      bus.on('cancelSelect', () => {
        selectedTexts.value = [];
      })
    })

    onBeforeUnmount(() => {
      bus.off('textAugment');
      bus.off('cancelSelect');
    })

    return {
      textFolder,
      urlTemp,
      selectedTexts,

      selectFiles(listIndex) {
        // 将当前列表项的多选框显示状态设置为true，其他列表项的多选框隐藏
        textFolder.value.forEach((folder, index) => {
          if (index === listIndex) {
            folder.showCheckbox = true;
          }
        });
      },

      selectFolders(listIndex) {
        // 将当前列表项的多选框显示状态设置为true，其他列表项的多选框隐藏
        textFolder.value.forEach((folder, index) => {
          if (index === listIndex) {
            folder.showCheckbox = true;
            for (let item of folder.textUrls) {
              if (!selectedTexts.value.includes(item)) {
                selectedTexts.value.push(item);
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
