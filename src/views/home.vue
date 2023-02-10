<script setup lang="ts">
import homeTitleSvg from "@/assets/svg/homeTitle.svg";
import homeButton1Svg from "@/assets/svg/homeButton1.svg";
import homeButton2Svg from "@/assets/svg/homeButton2.svg";
import homeButton3Svg from "@/assets/svg/homeButton3.svg";
import homeLogoSvg from "@/assets/svg/homeLogo.svg";
import homeNavPng from "@/assets/img/homeNav.png";
import bg1Jpg from "@/assets/img/banner1.jpg";
import bg2Jpg from "@/assets/img/banner2.jpg";
import bg3Jpg from "@/assets/img/banner3.jpg";
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
      <img :src="homeNavPng" alt="" class="home-nav-bg" />
      <div class="home-button home-button1" @click="$router.push('/hall')">
        <img :src="homeButton1Svg" alt="" class="home-button-img" />
        <div class="home-button-text">探索祠堂</div>
      </div>
      <div class="home-button home-button2" @click="$router.push('/pano')">
        <img :src="homeButton2Svg" alt="" class="home-button-img" />
        <div class="home-button-text">云游祠堂</div>
        <div></div>
      </div>
      <div class="home-button home-button3" @click="$router.push('/story')">
        <img :src="homeButton3Svg" alt="" class="home-button-img" />
        <div class="home-button-text">画说祠堂</div>
      </div>
    </div>
    <div class="home-bottom">
      主办 <img style="margin: 0px 10px" :src="homeLogoSvg" alt="" /> ©2022
      时光科技 提供技术支持
    </div>
    <div class="home-bg">
      <el-carousel
        height="100vh"
        :interval="5000"
        :pause-on-hover="false"
        arrow="never"
      >
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
    height: 100vh;
    position: relative;
    z-index: 1;
    .home-img-box {
      width: 100%;
      height: 100vh;
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

      div {
        margin-left: 20px;
      }
      .home-text-img {
        width: 608px;
        height: 137px;
        margin-bottom: 20px;
        margin-left: 0px;
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

    .home-nav-bg {
      width: 100%;
      height: 386px;
      position: absolute;
      left: 0px;
      bottom: 0px;
      z-index: 2;
    }
    .home-button {
      width: 261px;
      height: 261px;
      position: absolute;
      z-index: 2;
      cursor: pointer;
      font-size: 40px;
      font-weight: 700;
      color: #ffffff;
      border-radius: 50%;
      align-content: space-between;
      padding:45px 0px;
      box-sizing: border-box;
      @include flex(center, center, wrap);
      .home-button-img {
        height: 100%;
      }
      .home-button-text {
        width: 100%;
        height: 56px;
        font-size: 40px;
        font-weight: 700;
        text-align: center;
        color: #ffffff;
        line-height: 56px;
      }
    }
    .home-button1 {
      background: #39bde1;
      left: 458px;
      bottom: 97px;
      .home-button-img {
        width: 70px;
        height: 96px;
      }
    }
    .home-button2 {
      background: #80b140;
      left: 931px;
      bottom: 170px;
      .home-button-img {
        width: 99px;
        height: 92px;
      }
    }
    .home-button3 {
      background: #f2ac51;
      right: 199px;
      bottom: 151px;
      .home-button-img {
        width: 77px;
        height: 97px;
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
</style>
