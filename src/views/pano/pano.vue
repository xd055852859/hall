<script setup lang="ts">
import { ElMessage } from "element-plus";
import panoMp4 from "@/assets/source/pano.mp4";
const panoWidth = ref<number>(0);
const panoHeight = ref<number>(0);
onMounted(() => {
  panoWidth.value = document.body.offsetWidth;
  panoHeight.value = document.body.offsetHeight;
});
onMounted;
</script>
<template>
  <cheader title="云游祠堂" routeName="/" />
  <div class="pano">
    <!-- <video
      :width="panoWidth"
      :height="panoHeight"
      :src="panoMp4"
      autoplay
      class="pano-video"
      controls
      muted
      loop
    /> -->
    <!-- <div class="pano-box">
      <div></div>
      <div></div>
      <div></div>
    </div> -->
    <iframe
      src="https://ad9pw33f2.wasee.com/wt/ad9pw33f2?def_sid=0"
      frameborder="0"
      width="100%"
      height="100%"
    ></iframe>
  </div>
</template>
<style scoped lang="scss">
.pano {
  width: 100vw;
  height: 100vh;
  overflow-x: auto;
  overflow-y: hidden;
  .pano-video {
    object-fit: fill;
  }
}
</style>
<style></style>
