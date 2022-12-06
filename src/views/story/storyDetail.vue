<script setup lang="ts">
import { ElMessage } from "element-plus";
import Flipbook from "flipbook-vue";
import bg1Jpg from "@/assets/img/bg1.jpg";
import bg2Jpg from "@/assets/img/bg2.jpg";
import bg3Jpg from "@/assets/img/bg3.jpg";
const pages = [null, bg1Jpg, bg2Jpg, bg3Jpg, bg1Jpg, bg2Jpg, bg3Jpg, bg3Jpg];
</script>
<template>
  <!-- <flipbook class="flipbook" :pages="pages" :zooms="[1]"> </flipbook> -->
</template>
<style scoped lang="scss"></style>
<style lang="scss">
.flipbook {
  width: 90vw;
  height: 90vh;
}
</style>
