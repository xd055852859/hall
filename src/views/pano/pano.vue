<script setup lang="ts">
import { ElMessage } from "element-plus";
import pano1Mp4 from "/source/pano1.mp4";
import pano2Mp4 from "/source/pano2.mp4";
import closeSvg from "@/assets/svg/close.svg";
import cloudPng from "@/assets/img/cloud.png";
import cloudTopPng from "@/assets/img/cloudTop.png";
import cloudBottomPng from "@/assets/img/cloudBottom.png";
import bridLeftGif from "@/assets/img/bridLeft.gif";
import bridRightGif from "@/assets/img/bridRight.gif";
import pointUpSvg from "@/assets/svg/pointUp.svg";
import pointDownSvg from "@/assets/svg/pointDown.svg";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";

const panoWidth = ref<number>(0);
const panoHeight = ref<number>(0);
const pointWidth = ref<number>(0);
const pointHeight = ref<number>(0);
const panoSrc = ref<any>(null);
const timer1 = ref<any>(null);
const timer2 = ref<any>(null);
const videoState = ref<boolean>(false);
const firstState = ref<boolean>(true);
const videoTopRef = ref<any>(null);
const videoTopSrc = ref<string>("");
const videoBottomRef = ref<any>(null);
const videoBottomSrc = ref<string>("");
const videoBigTopRef = ref<any>(null);
const videoBigBottomRef = ref<any>(null);
const panoVisible = ref<boolean>(false);
const panoUrl = ref<string>("");
const closeVisible = ref<boolean>(false);
const hallList = ref<any>([]);
const pointList = ref<any>([]);
const pointSingleList = ref<any>([]);
const choosePointIndex = ref<number>(0);
onMounted(() => {
  panoWidth.value = document.documentElement.offsetWidth;
  panoHeight.value = document.documentElement.offsetHeight;
  getPanoData();
  // videoBigBottomRef.value.pause();
});
const getPanoData = async () => {
  const panoRes = (await api.request.get("hallPano/list")) as ResultProps;
  if (panoRes.msg === "OK") {
    panoRes.data.forEach((item) => {
      if (item.type === "background") {
        hallList.value = item.panoConfig.pointList;
        pointWidth.value = item.panoConfig.hallWidth;
        pointHeight.value = item.panoConfig.hallHeight;
      } else {
        pointList.value.push(item);
      }
    });
  }
};
onUnmounted(() => {
  if (timer1.value) {
    clearTimeout(timer1.value);
    timer1.value = null;
  }
  if (timer2.value) {
    clearTimeout(timer2.value);
    timer2.value = null;
  }
});
// const toTarget = (type) => {
//   closeVisible.value = true;
//   switch (type) {
//     case "孔庙":
//       changeVideo(pano2Mp4, pano3Mp4);
//       break;
//     case "太庙":
//       changeVideo(pano4Mp4, pano5Mp4);
//       break;
//     case "陈家祠":
//       changeVideo(pano6Mp4, pano7Mp4);
//   }
// };
const playVideo = (ref, type) => {
  if (type === "first") {
    firstState.value = true;
  } else {
    videoState.value = true;
    ref.play();
  }
};
const changeVideo = (videoTop, videoBottom, name) => {
  closeVisible.value = true;
  videoState.value = false;
  videoTopSrc.value = videoTop;
  videoBottomSrc.value = videoBottom;
  videoBottomRef.value.style.opacity = 0;
  pointSingleList.value = [];
  let index = pointList.value.findIndex((item) => item.name === name);
  console.log(index);
  if (index !== -1) {
    console.log(pointList.value[index]);
    pointSingleList.value = [...pointList.value[index].panoConfig.pointList];
  }
  if (timer1.value) {
    clearTimeout(timer1.value);
    timer1.value = null;
  }
  nextTick(() => {
    videoTopRef.value.play();
    videoBottomRef.value.pause();
  });
  timer1.value = setTimeout(() => {
    videoBottomRef.value.style.opacity = 1;
  }, 4000);
};
const closePano = () => {
  closeVisible.value = false;
  panoVisible.value = false;
  videoState.value = false;
  videoTopSrc.value = "";
  videoBottomSrc.value = "";
  panoUrl.value = "";
};
watch(videoState, (newState) => {

  if (newState && pointSingleList.value.length > 0) {
    choosePointIndex.value = 0;
    timer2.value = setInterval(() => {
      console.log(choosePointIndex.value);
      choosePointIndex.value = choosePointIndex.value + 1;
      if (choosePointIndex.value === pointSingleList.value.length) {
        choosePointIndex.value = 0;
      }
    }, 2000);
  } else if (timer2.value) {
    clearInterval(timer2.value);
    timer2.value = null;
    choosePointIndex.value = -1000;
  }
});
</script>
<template>
  <cheader title="云游祠堂" routeName="/" />
  <div class="pano">
    <!-- <video
      :width="panoWidth"
      :height="panoHeight"
      :src="pano1Mp4"
      autoplay
      ref="videoBigTopRef"
      class="pano-video-top"
      muted
      @ended="playVideo('', 'first')"
      v-if="!firstState"
    /> -->
    <img :src="cloudPng" alt="" class="pano-cloud" />
    <img
      src="https://cdn-icare.qingtime.cn/pano_bg.png"
      alt=""
      class="pano-bg"
    />
    <!-- <video
      :width="panoWidth"
      :height="panoHeight"
      :src="pano2Mp4"
      ref="videoBigBottomRef"
      autoplay
      loop
      class="pano-video"
      muted
    /> -->
    <div
      class="pano-button-box"
      @click="changeVideo(item.videoTop, item.videoBottom, item.name)"
      v-for="(item, index) in hallList"
      :key="'hall' + index"
      :style="{
        width: (item.width / pointWidth) * 100 + 'vw',
        height: (item.height / pointHeight) * 100 + 'vh',
        left: (item.left / pointWidth) * 100 + 'vw',
        top: (item.top / pointHeight) * 100 + 'vh',
      }"
    ></div>
  </div>
  <div class="pano-full-video" :style="{ zIndex: closeVisible ? 10 : -1 }">
    <video
      :width="panoWidth"
      :height="panoHeight"
      :src="videoTopSrc"
      class="pano-video-top"
      ref="videoTopRef"
      autoplay
      muted
      @ended="playVideo(videoBottomRef, 'second')"
      v-if="!videoState"
    />
    <video
      :width="panoWidth"
      :height="panoHeight"
      :src="videoBottomSrc"
      class="pano-video-bottom"
      ref="videoBottomRef"
      autoplay
      muted
      loop
    />

    <template v-if="videoState">
      <div
        class="pano-point-box"
        v-for="(item, index) in pointSingleList"
        :key="'point' + index"
        @click="
          panoVisible = true;
          panoUrl = item.url;
        "
        :style="{
          width: (item.width / pointWidth) * 100 + 'vw',
          height: `calc(${(item.height / pointHeight) * 100}vh + 2px)`,
          left: (item.left / pointWidth) * 100 + 'vw',
          top: (item.top / pointHeight) * 100 + 'vh',
        }"
        :class="{ 'item-move': choosePointIndex === index }"
      >
        {{ item.name }}
        <img :src="pointUpSvg" alt="" />
        <img :src="pointDownSvg" alt="" />
      </div>
    </template>
  </div>
  <div class="pano-close-button" @click="closePano()" v-if="closeVisible">
    <img :src="closeSvg" alt="" />
  </div>
  <!-- <div class="pano-close-button" @click="closePano()" v-if="closeVisible">
    <img :src="closeSvg" alt="" />
  </div> -->
  <img :src="bridLeftGif" alt="" class="pano-left-brid" />
  <img :src="bridRightGif" alt="" class="pano-right-brid" />
  <img :src="cloudTopPng" alt="" class="pano-top-cloud" />
  <img :src="cloudBottomPng" alt="" class="pano-bottom-cloud" />
  <!-- <div
    class="pano-close-button"
    @click="
      closeVisible = false;
      panoVisible = false;
      videoState = false;
      videoTopSrc = '';
      videoBottomSrc = '';
      panoUrl = '';
    "
    v-if="closeVisible"
  >
    <img :src="closeSvg" alt="" />
  </div> -->
  <div class="pano-video-pano" v-if="panoVisible">
    <iframe
      :src="panoUrl"
      width="100%"
      height="100%"
      frameborder="no"
      allowfullscreen="true"
    />
  </div>
</template>
<style scoped lang="scss">
.pano {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0px;
  top: 0px;
  z-index: 2;

  .pano-bg {
    width: 100vw;
    height: 100vh;
  }
  // .pano-video {
  //   object-fit: fill;
  // }
  // .pano-video-top {
  //   position: absolute;
  //   left: 0px;
  //   top: 0px;
  //   z-index: 2;
  //   object-fit: fill;
  // }

  .pano-left {
    left: 425px;
    top: 400px;
  }
  .pano-top {
    left: 930px;
    top: 30px;
  }
  .pano-right {
    left: 1280px;
    top: 400px;
  }
}
.pano-button-box {
  position: absolute;
  z-index: 3;
  background-color: transparent;
  cursor: pointer;
}
.pano-point-box {
  position: absolute;
  z-index: 3;
  cursor: pointer;
  border: 1px solid #d3a052;
  border-radius: 18px 0px 18px 0px;
  letter-spacing: 5px;
  writing-mode: vertical-rl;
  color: #fff;
  overflow: hidden;
  font-size: 16px;
  padding-top: 12px;
  box-sizing: border-box;
  @include flex(flex-start, center, wrap);
  img {
    width: 10px;
    height: 5px;
    &:nth-child(1) {
      margin-top: 7px;
      margin-bottom: 2px;
    }
  }
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    backdrop-filter: blur(4px);
    z-index: -1;
    background: rgba(2, 7, 22, 0.3);
    // background-color: rgba(255,255,255,0.2);
  }
}
.pano-close-button {
  width: 108px;
  height: 108px;
  position: fixed;
  top: 55px;
  right: 33px;
  z-index: 250;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
  }
}
.pano-video-pano {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 100;
}
.pano-full-video {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0px;
  top: 0px;
  z-index: 10;
  .pano-video-top {
    position: absolute;
    left: 0px;
    top: 0px;
    z-index: 2;
    object-fit: fill;
  }
  .pano-video-bottom {
    width: 100vw;
    height: 100vh;
    object-fit: fill;
    z-index: -1;
    cursor: pointer;
  }
}
.item-move {
  animation: move 2s;
  animation-fill-mode: forwards;
}
.pano-cloud {
  width: 130vw;
  height: 100vh;
  position: fixed;
  left: -30vw;
  top: 0px;
  z-index: 50;
  animation: cloudmove linear 8s infinite;
  pointer-events: none;
}
.pano-bottom-cloud {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0px;
  top: 0px;
  z-index: 52;
  animation: cloudLeft linear 6s;
  animation-fill-mode: forwards;
  pointer-events: none;
}
.pano-top-cloud {
  width: 100vw;
  height: 100vh;
  position: fixed;
  right: 0px;
  top: 0px;
  z-index: 51;
  animation: cloudRight linear 6s;
  animation-fill-mode: forwards;
  pointer-events: none;
}
.pano-left-brid {
  width: 250px;
  height: 250px;
  position: fixed;
  left: -2000px;
  top: 50vh;
  z-index: 52;
  animation: birdLeft linear 12s infinite;
  pointer-events: none;
}
.pano-right-brid {
  width: 450px;
  height: 450px;
  position: fixed;
  right: -700px;
  top: 70vh;
  z-index: 52;
  animation: birdRight linear 12s infinite;
  pointer-events: none;
}
</style>
<style>
@keyframes move {
  0% {
    bottom: 0px;
    transform: scale(1);
  }
  50% {
    bottom: 10px;
    transform: scale(1.2);
  }
  100% {
    bottom: 0px;
    transform: scale(1);
  }
}
@keyframes cloudmove {
  0% {
    left: -15vw;
  }
  50% {
    left: -10vw;
  }
  100% {
    left: -15vw;
  }
}
@keyframes cloudLeft {
  0% {
    left: 0px;
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    left: -55vw;
    opacity: 0;
  }
}
@keyframes cloudRight {
  0% {
    right: 0px;
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    right: -55vw;
    opacity: 0;
  }
}
@keyframes birdLeft {
  0% {
    left: -2000px;
    top: 40vh;
  }
  100% {
    left: 90vw;
    top: -300px;
  }
}
@keyframes birdRight {
  0% {
    right: -700px;
    top: 20vh;
  }
  100% {
    right: 50vw;
    top: -300px;
  }
}
</style>
