<script setup lang="ts">
import { ElMessage } from "element-plus";
import homeTitleSvg from "@/assets/svg/homeTitle.svg";
import homeButton1Svg from "@/assets/svg/homeButton1.svg";
import homeButton2Svg from "@/assets/svg/homeButton2.svg";
import homeButton3Svg from "@/assets/svg/homeButton3.svg";
import homeText1Svg from "@/assets/svg/homeText1.svg";
import homeText2Svg from "@/assets/svg/homeText2.svg";
import homeText3Svg from "@/assets/svg/homeText3.svg";
import homeLogoSvg from "@/assets/svg/homeLogo.svg";
import bg1Jpg from "@/assets/img/bg1.jpg";
import bg2Jpg from "@/assets/img/bg2.jpg";
import bg3Jpg from "@/assets/img/bg3.jpg";
const imgRef = ref<any>(null);
const timer = ref<any>(null);
const animationState = ref<boolean>(false);
const imgList = [bg1Jpg, bg2Jpg, bg3Jpg];
onMounted(() => {
  timer.value = setTimeout(() => {
    animationState.value = true;
  }, 1500);
});
onUnmounted(() => {
  if (timer.value) {
    clearTimeout(timer.value);
    timer.value = null;
  }
});
</script>
<template>
  <div class="home">
    <div class="home-nav">
      <div
        class="home-button"
        :class="{ 'item-big': animationState }"
        :style="{ left: '8vw' }"
        @click="$router.push('/hall')"
      >
        <img
          :src="homeText1Svg"
          alt=""
          class="home-button-icon"
          :class="{ 'item-big': animationState }"
        />
        <img :src="homeButton1Svg" alt="" class="home-button-img" />
      </div>
      <div
        class="home-button"
        :style="{ left: `calc(50vw - 12vh` }"
        @click="$router.push('/pano')"
      >
        <img
          :src="homeText2Svg"
          alt=""
          class="home-button-icon"
          :class="{ 'item-big': animationState }"
        />
        <img :src="homeButton2Svg" alt="" class="home-button-img" />
      </div>
      <div
        class="home-button"
        :style="{ right: '8vw' }"
        @click="$router.push('/story')"
      >
        <img
          :src="homeText3Svg"
          alt=""
          class="home-button-icon"
          :class="{ 'item-big': animationState }"
        />
        <img :src="homeButton3Svg" alt="" class="home-button-img" />
      </div>
    </div>
    <div class="home-bottom">
      主办 <img style="margin: 0px 10px" :src="homeLogoSvg" alt="" /> ©2022
      时光科技 提供技术支持
    </div>
    <div class="home-bg">
      <el-carousel height="83vh" :interval="5000" :pause-on-hover="false">
        <el-carousel-item v-for="item in imgList" :key="item">
          <div class="home-img-box">
            <img :src="item" alt="" />
          </div>
        </el-carousel-item>
      </el-carousel>
      <div class="home-text">
        <img :src="homeTitleSvg" alt="" class="home-text-img" />
        <div>
          <div>祠堂，是维系海外乡亲与本土血缘关系，</div>
          <div>同时也是给乡亲以及所有后代子孙了解祠堂文化，</div>
          <div>了解当地发展史的一个重要载体。</div>
          <div>祠堂，一个民俗博物馆，一部家族变迁史。</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.home {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  .home-bg {
    width: 100vw;
    height: 83vh;
    position: relative;
    z-index: 1;
    .home-img-box {
      width: 100%;
      height: 83vh;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .home-text {
      width: 608px;
      position: absolute;
      top: 20vh;
      left: 6vw;
      z-index: 2;
      font-size: 16px;
      color: #ffffff;
      line-height: 25px;
      .home-text-img {
        width: 608px;
        height: 137px;
        margin-bottom: 20px;
      }
    }
  }
  .home-nav {
    width: 100%;
    height: 35vh;
    position: fixed;
    left: 0px;
    bottom: 0px;
    z-index: 10;
    overflow: hidden;
    .home-button {
      height: 25vh;
      position: absolute;
      z-index: 2;
      animation: up 1.5s;
      animation-fill-mode: forwards;
      cursor: pointer;
      .home-button-img {
        height: 100%;
      }
      .home-button-icon {
        height: 0vh;
        position: absolute;
        z-index: 3;
      }
    }
  }
  .home-bottom {
    position: fixed;
    left: 0px;
    bottom: 0px;
    z-index: 9;
    width: 100%;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: #999999;
    padding-bottom: 10px;
    @include flex(center, flex-end, null);
  }
}
.item-big {
  animation: big 2s;
  animation-fill-mode: forwards;
}
</style>
<style lang="scss">
.home {
  .home-bg {
    .el-carousel__indicators {
      display: none !important;
    }
  }
}
@keyframes up {
  0% {
    opacity: 0;
    top: 30vh;
  }
  100% {
    opacity: 1;
    top: 0px;
  }
}
@keyframes big {
  0% {
    opacity: 0;
    height: 0vh;
    top: 8vh;
    right: 7vh;
  }
  100% {
    opacity: 1;
    height: 12.5vh;
    top: 0.7vh;
    right: 2.7vh;
  }
}
</style>
