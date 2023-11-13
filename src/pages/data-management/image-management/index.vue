<template>
<!--  <q-page class="flex flex-center">-->
<!--    <div class="row full-width">-->
<!--      <div class="col-8">-->
<!--        <management-part />-->
<!--      </div>-->
<!--      <div class="col-4">-->
<!--        <display-part />-->
<!--      </div>-->
<!--    </div>-->
<!--  </q-page>-->
  <q-page class="col-8">
    <management-part />
  </q-page>
<!--  <q-separator />-->
  <q-page class="col-4 flex flex-center">
    <display-part />
  </q-page>
</template>

<script>
import ManagementPart from "src/pages/data-management/image-management/management-part/index.vue"
import DisplayPart from "src/pages/data-management/image-management/display-part/index.vue"

export default {
  name: "ImageManagement",

  components: {
    ManagementPart,
    DisplayPart
  },
}
</script>

<style scoped>

</style>
