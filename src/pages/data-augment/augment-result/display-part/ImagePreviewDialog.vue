<template>
  <q-dialog class="full-width" v-model="openIPDialog">
    <q-card class="full-width">
      <q-card-section>
        <div class="text-h6">图片预览</div>
      </q-card-section>

      <q-img :src="imageSrc" contain />

      <q-card-actions align="right">
        <q-btn flat label="关闭" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";
import { getCurrentInstance, onMounted, onBeforeUnmount} from "vue";
import bus from "src/utils/bus";

export default {
  name: "ImagePreviewDialog",

  setup() {
    const openIPDialog = ref(false);
    const imageSrc = ref("");

    onMounted(() => {
      bus.on("openImagePreviewDialog", param => {
        openIPDialog.value = true;
        imageSrc.value = param;
      })
    });

    onBeforeUnmount(() => {
      bus.off("openImagePreviewDialog");
    });

    return {
      openIPDialog,
      imageSrc
    }
  }
}
</script>

<style scoped>

</style>
