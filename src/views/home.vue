<script setup lang="ts">
import { ElMessage } from "element-plus";
import homeTitleSvg from "@/assets/svg/homeTitle.svg";
import homeButton1Svg from "@/assets/svg/homeButton1.svg";
import homeButton2Svg from "@/assets/svg/homeButton2.svg";
import homeButton3Svg from "@/assets/svg/homeButton3.svg";
import homeText1Svg from "@/assets/svg/homeText1.svg";
import homeText2Svg from "@/assets/svg/homeText2.svg";
import homeText3Svg from "@/assets/svg/homeText3.svg";
import bg1Png from "@/assets/img/bg1.png";
import bg2Png from "@/assets/img/bg2.png";
import bg3Png from "@/assets/img/bg3.png";
const imgRef = ref<any>(null);
const timer = ref<any>(null);
const animationState = ref<boolean>(false);
const imgList = [bg1Png, bg2Png, bg3Png];
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
      <div class="home-button" :style="{ left: `calc(50vw - 12vh` }">
        <img
          :src="homeText2Svg"
          alt=""
          class="home-button-icon"
          :class="{ 'item-big': animationState }"
        />
        <img :src="homeButton2Svg" alt="" class="home-button-img" />
      </div>
      <div class="home-button" :style="{ right: '8vw' }">
        <img
          :src="homeText3Svg"
          alt=""
          class="home-button-icon"
          :class="{ 'item-big': animationState }"
        />
        <img :src="homeButton3Svg" alt="" class="home-button-img" />
      </div>
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
          <div>
            同时也是给乡亲以及所有后代子孙了解祠堂文化，了解当地发展史的一个重要载体。
          </div>
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
      top: 16vh;
      left: 6vw;
      position: absolute;
      z-index: 2;
      width: 800px;
      font-size: 14px;
      font-family: FangSong, STSong !important;
      color: #ffffff;
      line-height: 28px;
      .home-text-img {
        width: 28vw;
        margin-bottom: 2vh;
      }
    }
  }
  .home-nav {
    width: 100%;
    height: 35vh;
    position: fixed;
    left: 0px;
    bottom: 0px;
    position: absolute;
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
    height: 12vh;
    top: 1vh;
    right: 5vh;
  }
}
</style>
