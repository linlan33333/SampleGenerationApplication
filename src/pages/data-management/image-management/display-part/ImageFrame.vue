<template>
  <div class="flex flex-center">
    <q-img :src="imageUrl"
           class="image-style rounded-borders" :ratio="10/9" fit="contain" />
  </div>
</template>

<script>
import { ref, watch, getCurrentInstance } from 'vue';

export default {
  name: "ImageFrame",

  props: ["imgUrl"],

  setup() {
    const imageUrl = ref(null);
    const props = getCurrentInstance().props;

    watch(() => {
      imageUrl.value = props.imgUrl;
    })

    return {
      imageUrl
    }
  }
}
</script>

<style lang="sass" scoped>
.image-style
  max-width: calc(90%)
</style>
