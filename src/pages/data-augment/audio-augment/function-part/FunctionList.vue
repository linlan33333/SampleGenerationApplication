<template>
  <div class="column q-pt-md q-pl-md q-pr-md">
    <div class="q-pt-sm">
      <q-btn class="full-width q-dark" flat label="清空选择" @click="cancelSelect" />
    </div>
  </div>
</template>

<script>
import bus from "src/utils/bus";

export default {
  name: "FunctionList",

  setup() {
    return {
      cancelSelect() {
        bus.emit('cancelSelect', true);
      }
    }
  }
}
</script>

<style scoped>

</style>
