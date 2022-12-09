<script setup lang="ts">
import { ElMessage } from "element-plus";
import pano1Mp4 from "@/assets/source/pano1.mp4";
import pano2Mp4 from "@/assets/source/pano2.mp4";
import pano3Mp4 from "@/assets/source/pano3.mp4";
import pano4Mp4 from "@/assets/source/pano4.mp4";
import pano5Mp4 from "@/assets/source/pano5.mp4";
import pano6Mp4 from "@/assets/source/pano6.mp4";
import pano7Mp4 from "@/assets/source/pano7.mp4";

const panoWidth = ref<number>(0);
const panoHeight = ref<number>(0);
const panoSrc = ref<any>(null);
const loopState = ref<boolean>(false);
let timer = ref<any>(null);
let firstArray = ref<boolean[]>([false, false, false]);
onMounted(() => {
  panoWidth.value = document.documentElement.offsetWidth;
  panoHeight.value = document.documentElement.offsetHeight;
  panoSrc.value = pano1Mp4;
  timer.value = setTimeout(() => {}, 5000);
});
</script>
<template>
  <cheader title="云游祠堂" routeName="/" />
  <div class="pano">
    <video
      :width="panoWidth"
      :height="panoHeight"
      :src="panoSrc"
      autoplay
      class="pano-video"
      muted
      :loopState="loopState"
    />
  </div>
  <div class="pano-button">
    <div @click="panoSrc = !firstArray[0] ? pano3Mp4 : pano2Mp4">孔庙</div>
    <div @click="panoSrc = !firstArray[1] ? pano5Mp4 : pano4Mp4">太庙</div>
    <div @click="panoSrc = !firstArray[1] ? pano7Mp4 : pano6Mp4">程家祠</div>
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
