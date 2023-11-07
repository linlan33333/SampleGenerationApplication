<template>
  <q-layout view="lHh Lpr Lpr">
    <q-drawer show-if-above
      bordered
      side="left"
    >
      <q-list padding class="q-gutter-sm">
        <q-expansion-item icon="storage"
                          label="数据管理"
                          header-class="text-subtitle1"
                          :header-style="expansionHeaderStyle"
                          default-opened>
          <q-item clickable
                  v-ripple
                  :active="this.$route.name === 'aaa'"
                  active-class="my-menu-link"
                  class="q-mt-sm"
                  to="">
            <q-item-section avatar />
            <q-item-section>
              <q-item-label class="text-subtitle1">图片管理</q-item-label>
            </q-item-section>
            <q-item-section avatar side>
              <q-icon name="image" />
            </q-item-section>
          </q-item>

          <q-item clickable
                  v-ripple
                  :active="this.$route.name === 'bbb'"
                  active-class="my-menu-link"
                  class="q-mt-sm"
                  to="">
            <q-item-section avatar />
            <q-item-section>
              <q-item-label class="text-subtitle1">音频管理</q-item-label>
            </q-item-section>
            <q-item-section avatar side>
              <q-icon name="graphic_eq" />
            </q-item-section>
          </q-item>

          <q-item clickable
                  v-ripple
                  :active="this.$route.name === 'ccc'"
                  active-class="my-menu-link"
                  class="q-mt-sm"
                  to="">
            <q-item-section avatar />
            <q-item-section>
              <q-item-label class="text-subtitle1">文本管理</q-item-label>
            </q-item-section>
            <q-item-section avatar side>
              <q-icon name="subject" />
            </q-item-section>
          </q-item>
        </q-expansion-item>

        <q-item clickable
                v-ripple
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

        <q-item clickable
                v-ripple
                :active="this.$route.name === 'bbb'"
                active-class="my-menu-link"
                to="">
          <q-item-section avatar>
            <q-icon name="playlist_add" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-subtitle1">样本生成</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable
                v-ripple
                :active="this.$route.name === 'ccc'"
                active-class="my-menu-link"
                to="">
          <q-item-section avatar>
            <q-icon name="developer_board" />
          </q-item-section>
          <q-item-section>
            <q-item-label>仿真模型</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'
import EssentialLink from 'components/EssentialLink.vue'

const linksList = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    const $q = useQuasar()
    $q.dark.set(true)

    const leftDrawerOpen = ref(false)
    const rightDrawerOpen = ref(false)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      rightDrawerOpen,
      expansionHeaderStyle: {
        // backgroundColor: '#E4E9F3'
        borderRadius: '5px'
      },

      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>

<style lang="sass" scoped>
.q-item
  border-radius: 5px

.my-menu-link
  background-color: grey
</style>
