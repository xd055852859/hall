<script setup lang="ts">
import CMap from "@/components/map/cMap.vue";
import { ElMessage } from "element-plus";


</script>
<template>
  <div class="hall">
    <CMap :mapId="'hallMap'" :width="'100%'" :height="'100%'" />
  </div>
</template>
<style scoped lang="scss">
.hall {
  width: 100vw;
  height: 100vh;
}
</style>
<style></style>
