<template>
  <div class="column full-width flex flex-center full-height">
    <div class="full-width">
      <tool-bar @newFolder="getNewFolderName" @searchTextName="getSearchTextName" @importFolderPath="getImportFolderPath" />
    </div>

    <q-separator color="white" />

    <!-- 这个q-scroll-area是为了让图片多的时候能在左半界面上下滚动，
        而不是让整个窗口上下滚动，右边出现滚动条很难看 -->
    <!--  这个窗口的高度以后再改，能不能改成自适应的  -->
    <q-scroll-area :thumb-style="thumbStyle" class="scroll-area-height full-width">
      <folder-list v-if="show" @selectedTextUrl="getSelectedTextUrl" :searchTextName="searchTextName"
                   :newFolderName="newFolderName" :importFolderPath="importFolderPath"
                   :afterModFolder="afterModFolder" :renameImgData="renameImgData" />
    </q-scroll-area>
  </div>
</template>

<script>
import { ref, watch, getCurrentInstance, provide, nextTick } from 'vue';
import ToolBar from "pages/data-management/text-management/management-part/ToolBar.vue";
import FolderList from "pages/data-management/text-management/management-part/FolderList.vue";

export default {
  name: "ManagementPart",

  components: {
    ToolBar,
    FolderList
  },

  props: [
    "afterModifyFolder",  // display-part组件进行移动文件、重命名文件等操作后修改之后的imgFolder会传过来
    "renameImgData",      // display-part组件传过来的更新组件的数据
  ],

  emits:[
    "selectedImgUrl",
    "newFolder",
    "searchAudioName",
    "importFolderPath"
  ],

  setup() {
    const emit = getCurrentInstance().emit;
    const props = getCurrentInstance().props;

    const newFolderName = ref("");
    const searchTextName = ref('');
    const importFolderPath = ref("");
    const afterModFolder = ref(null);
    const show = ref(true);

    watch(() => props.afterModifyFolder, () => {
      afterModFolder.value = props.afterModifyFolder;
    });

    provide("show", () => {
      show.value = false;
      nextTick(() => {
        show.value = true;
      });
    });

    return {
      thumbStyle: ref({                     // 设置侧边滚动条样式的，理论上不应该写在这里中，后期要改
        width: '0px',
      }),
      newFolderName,     // toolbar上的新增文件夹功能要求输入的文件夹名称
      searchTextName,   // toolbar上的搜索框中输入的图片名称，需要交给FolderList组件进行响应式搜索
      importFolderPath,   // 数据导入功能所传入的文件夹路径
      afterModFolder,
      show,

      getSelectedTextUrl(audioUrl, audioFolder) {
        emit("imgPartSelectedImg", audioUrl, audioFolder);
      },

      // 拿到toolbar中输入的待搜索的图片名称
      getSearchTextName(data) {
        searchTextName.value = data;
      },

      // toolbar新创建文件夹时会将文件夹名称发过来，这里接收到名称后需要传给子组件FolderList进行更新
      getNewFolderName(data) {
        newFolderName.value = data;
      },

      // toolbar上的数据导入功能会将被导入的文件夹路径传过来，这里需要转交给FolderList组件
      getImportFolderPath(data) {
        importFolderPath.value = data;
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.scroll-area-height
  height: calc(90vh)
</style>
