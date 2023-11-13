<template>
  <q-toolbar inset>
    <q-btn size="md" flat>
      <q-item-label class="text-grey-4 text-subtitle1">
        数据导入
      </q-item-label>
    </q-btn>

    <q-toolbar-title />

    <q-space />

    <q-btn flat padding="xs" icon="add">
      <q-tooltip class="text-subtitle2">
        创建文件夹
      </q-tooltip>
    </q-btn>

    <q-input dense outlined bg-color="grey-9" v-model="text" class="q-ml-md">
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>
  </q-toolbar>
</template>

<script>
import { ref } from 'vue'

export default {
  name: "ToolBar",

  setup() {
    const text = ref("")

    return {
      text
    }
  }
}
</script>

<style lang="sass" scoped>
//48, 49, 52
</style>
