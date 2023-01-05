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
const timer1 = ref<any>(null);
const timer2 = ref<any>(null);
const firstArray = ref<boolean[]>([false, false, false]);
const normalState = ref<boolean>(false);

const fullRef = ref<any>(null);
const carouselRef = ref<any>(null);
const firstRef = ref<any>(null);
const secondRef = ref<any>(null);
const thirdRef = ref<any>(null);
const firstVideoRef = ref<any>(null);
const secondVideoRef = ref<any>(null);
const thirdVideoRef = ref<any>(null);
const currentScroll = ref<number>(0);
const toScroll = ref<number>(0);
const choosePoint = ref<number>(0);
onMounted(() => {
  panoWidth.value = document.documentElement.offsetWidth;
  panoHeight.value = document.documentElement.offsetHeight;
  panoSrc.value = pano1Mp4;
  timer1.value = setTimeout(() => {
    normalState.value = true;
    firstVideoRef.value.play();
  }, 5000);
  timer2.value = setTimeout(() => {
    if (timer1.value) {
      clearInterval(timer1.value);
      timer1.value = null;
    }
    firstArray.value[0] = true;
  }, 7500);
});
const toTarget = (type) => {
  // switch (type) {
  //   case "first":
  //     choosePoint.value = 0;
  //     toScroll.value = 0;
  //     // fullRef.value.scrollLeft = 0;
  //     if (!firstArray.value[0]) {
  //       if (timer1.value) {
  //         clearInterval(timer1.value);
  //         timer1.value = null;
  //       }
  //       firstVideoRef.value.play();
  //       timer1.value = setTimeout(() => {
  //         firstArray.value[0] = true;
  //       }, 5000);
  //     }
  //     break;
  //   case "second":
  //     choosePoint.value = 1;
  //     toScroll.value = panoWidth.value;
  //     // firstArray.value[2] = false;
  //     // fullRef.value.scrollLeft = panoWidth.value;
  //     // fullRef.value.scrollTo(panoWidth.value, 0);
  //     if (!firstArray.value[1]) {
  //       if (timer1.value) {
  //         clearInterval(timer1.value);
  //         timer1.value = null;
  //       }
  //       secondVideoRef.value.play();
  //       timer1.value = setTimeout(() => {
  //         firstArray.value[1] = true;
  //       }, 5000);
  //     }
  //     break;
  //   case "third":
  //     choosePoint.value = 2;
  //     toScroll.value = panoWidth.value * 2;
  //     // firstArray.value[1] = false;
  //     // fullRef.value.scrollLeft = panoWidth.value * 2;
  //     // fullRef.value.scrollTo(panoWidth.value * 2, 0);
  //     if (!firstArray.value[2]) {
  //       if (timer1.value) {
  //         clearInterval(timer1.value);
  //         timer1.value = null;
  //       }
  //       thirdVideoRef.value.play();
  //       timer1.value = setTimeout(() => {
  //         firstArray.value[2] = true;
  //       }, 5000);
  //     }
  //     break;
  // }
  // if (timer2.value) {
  //   clearInterval(timer2.value);
  //   timer2.value = null;
  // }
  // timer2.value = setInterval(scrollFn, 2);
};
const scrollFn = () => {
  if (toScroll.value <= Math.abs(fullRef.value.offsetLeft)) {
    fullRef.value.style.left = fullRef.value.offsetLeft + 10 + "px";
    if (toScroll.value <= fullRef.value.offsetLeft) {
      clearInterval(timer2.value);
      timer2.value = null;
    }
  } else {
    fullRef.value.style.left = fullRef.value.offsetLeft - 10 + "px";
    if (toScroll.value <= Math.abs(fullRef.value.offsetLeft)) {
      clearInterval(timer2.value);
      timer2.value = null;
    }
  }
};
</script>
<template>
  <cheader title="云游祠堂" routeName="/" />
  <div class="pano" v-if="!normalState">
    <video
      :width="panoWidth"
      :height="panoHeight"
      :src="pano1Mp4"
      autoplay
      class="pano-video"
      muted
    />
  </div>
  <div class="pano-full-box">
    <!-- <div class="pano-full" ref="fullRef">
      <div class="pano-full-video" ref="firstRef">
        <video
          :width="panoWidth"
          :height="panoHeight"
          :src="pano2Mp4"
          class="pano-video-top"
          ref="firstVideoRef"
          muted
          v-if="!firstArray[0]"
        />
        <video
          :width="panoWidth"
          :height="panoHeight"
          :src="pano3Mp4"
          autoplay
          class="pano-video-bottom"
          muted
          loop
        />
      </div>
      <div class="pano-full-video" ref="secondRef">
        <video
          :width="panoWidth"
          :height="panoHeight"
          :src="pano4Mp4"
          class="pano-video-top"
          ref="secondVideoRef"
          muted
          v-if="!firstArray[1]"
        />
        <video
          :width="panoWidth"
          :height="panoHeight"
          :src="pano5Mp4"
          autoplay
          class="pano-video-bottom"
          muted
          loop
        />
      </div>
      <div class="pano-full-video" ref="thirdRef">
        <video
          :width="panoWidth"
          :height="panoHeight"
          :src="pano6Mp4"
          class="pano-video-top"
          ref="thirdVideoRef"
          muted
          v-if="!firstArray[2]"
        />
        <video
          :width="panoWidth"
          :height="panoHeight"
          :src="pano7Mp4"
          autoplay
          class="pano-video-bottom"
          muted
          loop
        />
      </div>
    </div> -->
    <el-carousel
      height="100vh"
      :autoplay="false"
      arrow="never"
      indicator-position="none"
      ref="carouselRef"
    >
      <el-carousel-item>
        <div class="pano-full-video">
          <video
            :width="panoWidth"
            :height="panoHeight"
            :src="pano2Mp4"
            class="pano-video-top"
            ref="firstVideoRef"
            muted
          />
          <video
            :width="panoWidth"
            :height="panoHeight"
            :src="pano3Mp4"
            autoplay
            class="pano-video-bottom"
            muted
            loop
          />
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="pano-full-video">
          <video
            :width="panoWidth"
            :height="panoHeight"
            :src="pano2Mp4"
            class="pano-video-top"
            ref="firstVideoRef"
            muted
            v-if="!firstArray[0]"
          />
          <video
            :width="panoWidth"
            :height="panoHeight"
            :src="pano3Mp4"
            autoplay
            class="pano-video-bottom"
            muted
            loop
          />
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="pano-full-video">
          <video
            :width="panoWidth"
            :height="panoHeight"
            :src="pano2Mp4"
            class="pano-video-top"
            ref="firstVideoRef"
            muted
            v-if="!firstArray[0]"
          />
          <video
            :width="panoWidth"
            :height="panoHeight"
            :src="pano3Mp4"
            autoplay
            class="pano-video-bottom"
            muted
            loop
          />
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>

  <div class="pano-button" v-if="normalState">
    <div class="pano-line"></div>
    <div class="pano-button-item" @click="toTarget(0)">
      <div
        :class="{
          'pano-choose-point': choosePoint === 0,
          'pano-button-point': choosePoint !== 0,
        }"
      >
        <div class="pano-choose-dot" v-if="choosePoint === 0"></div>
      </div>
      <div
        class="pano-button-title"
        :class="{
          'pano-choose-title': choosePoint === 0,
        }"
      >
        孔庙
      </div>
    </div>
    <div class="pano-button-item" @click="toTarget(1)">
      <div
        :class="{
          'pano-choose-point': choosePoint === 1,
          'pano-button-point': choosePoint !== 1,
        }"
      >
        <div class="pano-choose-dot" v-if="choosePoint === 1"></div>
      </div>
      <div
        class="pano-button-title"
        :class="{
          'pano-choose-title': choosePoint === 1,
        }"
      >
        太庙
      </div>
    </div>
    <div class="pano-button-item" @click="toTarget(2)">
      <div
        :class="{
          'pano-choose-point': choosePoint === 2,
          'pano-button-point': choosePoint !== 2,
        }"
      >
        <div class="pano-choose-dot" v-if="choosePoint === 2"></div>
      </div>
      <div
        class="pano-button-title"
        :class="{
          'pano-choose-title': choosePoint === 2,
        }"
      >
        陈家祠
      </div>
    </div>
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
  .pano-video {
    object-fit: fill;
  }
}

.pano-full-video {
  width: 100vw;
  height: 100vh;
  position: relative;
  z-index: 1;
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
  }
}

.pano-button {
  width: 100vw;
  height: 92px;
  position: fixed;
  left: 0px;
  bottom: 10px;
  z-index: 5;
  @include flex(center, center, null);
  .pano-line {
    width: 100%;
    height: 2px;
    position: absolute;
    left: 0px;
    top: 0px;
    z-index: -1;
    border-top: 4px solid;
    border-image: linear-gradient(
        44deg,
        rgba(255, 255, 255, 0) 0%,
        #ffffff 52%,
        rgba(255, 255, 255, 0) 99%
      )
      4 4;
  }
  .pano-button-item {
    width: 120px;
    height: 100%;
    color: #fff;
    position: relative;
    z-index: 1;
    cursor: pointer;
    @include flex(center, center, wrap);
    .pano-button-point {
      width: 12px;
      height: 12px;
      background: #ffffff;
      border-radius: 50%;
      position: absolute;
      top: -5px;
      left: 54px;
      z-index: 2;
    }
    .pano-choose-point {
      width: 34px;
      height: 34px;
      background: #ffffff;
      border: 2px solid #87b940;
      border-radius: 50%;
      position: absolute;
      top: -17px;
      left: 43px;
      z-index: 2;
      @include flex(center, center, null);
      .pano-choose-dot {
        width: 14px;
        height: 14px;
        background: #87b940;
        border-radius: 50%;
      }
    }
    .pano-button-title {
      width: 100%;
      height: 50px;
      font-size: 36px;
      font-weight: 700;
      text-align: center;
      line-height: 50px;
      text-shadow: 0px 1px 1px 0px rgba(0, 0, 0, 0.5);
      margin-top: 10px;
    }
    .pano-choose-title {
      font-size: 40px;
      color: #87b940;
      line-height: 56px;
      text-shadow: 0px 1px 1px 0px rgba(255, 255, 255, 0.5);
      margin-top: 5px;
    }
    &:nth-child(3) {
      margin: 0px 167px;
    }
  }
}
.fullImage-button {
  width: 108px;
  height: 108px;
  position: fixed;
  top: 55px;
  right: 33px;
  z-index: 5;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
<style></style>
