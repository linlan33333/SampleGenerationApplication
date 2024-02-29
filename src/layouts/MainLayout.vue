<template>
  <q-layout view="lpp Lpp Lpp">
    <q-drawer
      show-if-above
      class="q-pa-sm"
    >
      <q-list padding class="q-gutter-sm">
        <q-expansion-item icon="storage"
                          label="数据管理"
                          header-class="text-subtitle1"
                          :header-style="expansionHeaderStyle"
                          default-opened>
          <q-item clickable
                  v-ripple="{ color: 'grey'}"
                  :active="this.$route.name === 'imageManagement'"
                  active-class="my-menu-link"
                  class="q-mt-sm"
                  to="/data-management/image-management">
            <q-item-section avatar />
            <q-item-section>
              <q-item-label class="text-subtitle1 text-white">图片管理</q-item-label>
            </q-item-section>
            <q-item-section avatar side>
              <q-icon name="image" />
            </q-item-section>
          </q-item>

          <q-item clickable
                  v-ripple="{ color: 'grey'}"
                  :active="this.$route.name === 'audioManagement'"
                  active-class="my-menu-link"
                  class="q-mt-sm"
                  to="/data-management/audio-management">
            <q-item-section avatar />
            <q-item-section>
              <q-item-label class="text-subtitle1 text-white">音频管理</q-item-label>
            </q-item-section>
            <q-item-section avatar side>
              <q-icon name="graphic_eq" />
            </q-item-section>
          </q-item>

          <q-item clickable
                  v-ripple="{ color: 'grey'}"
                  :active="this.$route.name === 'textManagement'"
                  active-class="my-menu-link"
                  class="q-mt-sm"
                  to="/data-management/text-management">
            <q-item-section avatar />
            <q-item-section>
              <q-item-label class="text-subtitle1 text-white">文本管理</q-item-label>
            </q-item-section>
            <q-item-section avatar side>
              <q-icon name="subject" />
            </q-item-section>
          </q-item>
        </q-expansion-item>

        <q-item clickable
                v-ripple="{ color: 'grey'}"
                :active="this.$route.name === 'aaa'"
                active-class="my-menu-link"
                to="">
          <q-item-section avatar>
            <q-icon name="cleaning_services" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-subtitle1">数据清洗</q-item-label>
          </q-item-section>
        </q-item>

<!--        <q-item clickable-->
<!--                v-ripple-->
<!--                :active="this.$route.name === 'bbb'"-->
<!--                active-class="my-menu-link"-->
<!--                to="">-->
<!--          <q-item-section avatar>-->
<!--            <q-icon name="playlist_add" />-->
<!--          </q-item-section>-->
<!--          <q-item-section>-->
<!--            <q-item-label class="text-subtitle1">样本生成</q-item-label>-->
<!--          </q-item-section>-->
        <q-expansion-item icon="storage"
                          label="数据增广"
                          header-class="text-subtitle1"
                          :header-style="expansionHeaderStyle"
                          default-opened>
          <q-item clickable
                  v-ripple="{ color: 'grey'}"
                  :active="this.$route.name === 'imageAugment'"
                  active-class="my-menu-link"
                  class="q-mt-sm"
                  to="/data-augment/image-augment">
            <q-item-section avatar />
            <q-item-section>
              <q-item-label class="text-subtitle1 text-white">图像增广</q-item-label>
            </q-item-section>
            <q-item-section avatar side>
              <q-icon name="playlist_add" />
            </q-item-section>
          </q-item>

          <q-item clickable
                  v-ripple="{ color: 'grey'}"
                  :active="this.$route.name === 'augmentResult'"
                  active-class="my-menu-link"
                  class="q-mt-sm"
                  to="/data-augment/augment-result">
            <q-item-section avatar />
            <q-item-section>
              <q-item-label class="text-subtitle1 text-white">音频增广</q-item-label>
            </q-item-section>
            <q-item-section avatar side>
              <q-icon name="graphic_eq" />
            </q-item-section>
          </q-item>

          <q-item clickable
                  v-ripple="{ color: 'grey'}"
                  :active="this.$route.name === 'textAugment'"
                  active-class="my-menu-link"
                  class="q-mt-sm"
                  to="/data-augment/text-augment">
            <q-item-section avatar />
            <q-item-section>
              <q-item-label class="text-subtitle1 text-white">文本增广</q-item-label>
            </q-item-section>
            <q-item-section avatar side>
              <q-icon name="subject" />
            </q-item-section>
          </q-item>
        </q-expansion-item>

        <q-item clickable
                v-ripple
                :active="this.$route.name === 'ccc'"
                active-class="my-menu-link"
                to="">
          <q-item-section avatar>
            <q-icon name="developer_board" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-subtitle1">仿真模型</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container class="row q-pl-sm flex flex-center">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'MainLayout',

  components: {

  },

  setup () {
    const $q = useQuasar()
    $q.dark.set(true)

    const leftDrawerOpen = ref(false)
    const rightDrawerOpen = ref(false)

    return {
      leftDrawerOpen,
      rightDrawerOpen,
      expansionHeaderStyle: {
        // backgroundColor: '#E4E9F3'
        borderRadius: '5px'
      }
    }
  }
})
</script>

<style lang="sass" scoped>
.q-item
  border-radius: 5px

.my-menu-link
  background-color: #4a4a4d
</style>
