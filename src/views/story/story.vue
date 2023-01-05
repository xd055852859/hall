<script setup lang="ts">
import storyBgPng from "@/assets/img/storyBg.png";
import mountainPng from "@/assets/img/mountain.png";
import story1Svg from "@/assets/svg/story1.svg";
import storyg1Svg from "@/assets/svg/storyg1.svg";
import story2Svg from "@/assets/svg/story2.svg";
import storyg2Svg from "@/assets/svg/storyg2.svg";
import story3Svg from "@/assets/svg/story3.svg";
import storyg3Svg from "@/assets/svg/storyg3.svg";
const storyRef = ref<any>(null);
const chooseIndex = ref<number>(0);
const titleArray = [
  [
    "你知道“祠堂”有多少个名字吗？",
    "祠堂文化的演变",
    "祠堂，中国最早的众创空间",
    // "祠堂，老百姓最早的SOSHOW场",
    "祠堂，被误读了的信仰",
  ],
  [
    "宗族、家族、家庭傻傻分不清",
    "你知道“退休返聘”是古人的发明吗？",
    "祠堂，宗族精神的产化物",
    "祠堂，宗族和谐的象征",
    "祖先崇拜≈个人崇拜？",
  ],
  [
    "祠堂里的年味",
    "祠堂中的非遗传承",
    "祠堂，贫困家庭的救赎",
    "祠堂，弘扬中华好家风",
    "祠堂，寄托乡愁的载体",
  ],
];
const wheelStory = (e) => {
  e.preventDefault();
  console.log("????");
  storyRef.value.scrollLeft += e.deltaY;
};
</script>
<template>
  <div class="story" :style="{ backgroundImage: `url(${storyBgPng})` }">
    <cheader title="画说祠堂" routeName="/" />
    <div class="story-nav">
      <div
        style="margin-right: 57px"
        @click="chooseIndex = 0"
        :class="{
          'story-nav-choose': chooseIndex === 0,
          'story-nav-item': chooseIndex !== 0,
        }"
      >
        <div class="nav-item-icon">
          <img
            :src="chooseIndex === 0 ? storyg1Svg : story1Svg"
            alt=""
            :style="{ height: chooseIndex !== 0 ? '46px' : '64px' }"
          />
        </div>
        <div class="nav-item-title">祠堂新语</div>
      </div>
      <div
        style="margin-right: 57px"
        @click="chooseIndex = 1"
        :class="{
          'story-nav-choose': chooseIndex === 1,
          'story-nav-item': chooseIndex !== 1,
        }"
      >
        <div class="nav-item-icon">
          <img :src="chooseIndex === 1 ? storyg2Svg : story2Svg" alt="" />
        </div>
        <div class="nav-item-title">祠堂与家族</div>
      </div>
      <div
        @click="chooseIndex = 2"
        :class="{
          'story-nav-choose': chooseIndex === 2,
          'story-nav-item': chooseIndex !== 2,
        }"
      >
        <div class="nav-item-icon">
          <img :src="chooseIndex === 2 ? storyg3Svg : story3Svg" alt="" />
        </div>
        <div class="nav-item-title">祠堂与家庭</div>
      </div>
    </div>
    <div class="story-container" @wheel="wheelStory" ref="storyRef">
      <div class="story-item" @click="$router.push('/storyDetail/1')" v-if="chooseIndex===0">
        <div class="story-item-icon"><img :src="mountainPng" alt="" /></div>
        <div class="story-item-text">祠堂里的共和国</div>
        <div class="story-item-button">查看详情</div>
      </div>
      <div
        class="story-item"
        v-for="(item, index) in titleArray[chooseIndex]"
        :key="'story' + index"
      >
        <div class="story-item-icon"><img :src="mountainPng" alt="" /></div>
        <div class="story-item-text">{{ item }}</div>
        <div class="story-item-button">查看详情</div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.story {
  width: 100vw;
  height: 100vh;
  background-size: 100% 100%;
  .story-nav {
    width: 100%;
    height: 22vh;
    cursor: pointer;
    @include flex(center, center, null);
    .story-nav-item {
      width: 220px;
      height: 100%;
      .nav-item-icon {
        width: 100%;
        height: 50px;
        margin-top: 50px;
        @include flex(center, center, null);
        img {
          width: 50px;
          height: 50px;
        }
      }
      .nav-item-title {
        width: 100%;
        height: 58px;
        font-size: 30px;
        font-weight: 400;
        text-align: center;
        color: rgb(102, 102, 102, 0.66);
        line-height: 58px;
        margin-top: 4px;
      }
    }
    .story-nav-choose {
      width: 220px;
      height: 240px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 0px 0px 100px 100px;
      box-shadow: 3px 3px 12px 0px rgba(255, 255, 255, 0.5) inset;
      backdrop-filter: blur(10px);
      .nav-item-icon {
        width: 100%;
        height: 70px;
        margin-top: 40px;
        @include flex(center, center, null);
        img {
          width: 70px;
          height: 70px;
        }
      }
      .nav-item-title {
        width: 100%;
        height: 58px;
        font-size: 36px;
        font-weight: 700;
        text-align: center;
        color: #333333;
        line-height: 58px;
        margin-top: 4px;
      }
    }
  }
  .story-container {
    width: 100%;
    height: 59vh;
    margin-top: 38px;
    padding: 0px 250px;
    box-sizing: border-box;
    overflow-x: scroll;
    overflow-y: hidden;
    user-select: none;
    @include flex(flex-start, center, null);
    .story-item {
      width: 180px;
      height: 59vh;
      overflow: hidden;
      border-radius: 100px 20px 100px 20px;
      position: relative;
      z-index: 1;
      align-content: space-between;
      padding: 34px 0px;
      box-sizing: border-box;
      margin-right: 125px;
      cursor: pointer;
      flex-shrink: 0;
      @include flex(center, center, wrap);
      .story-item-icon {
        width: 100%;
        height: 28px;
        @include flex(center, center, null);
        img {
          width: 80px;
          height: 28px;
        }
      }
      .story-item-text {
        max-height: 392px;
        font-size: 30px;
        font-weight: 700;
        color: #333333;
        line-height: 60px;
        letter-spacing: 18px;
        writing-mode: vertical-rl;
      }
      .story-item-button {
        width: 100%;
        height: 28px;
        font-size: 20px;
        text-align: center;
        color: #333333;
        line-height: 28px;
      }
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(231, 239, 220, 0.8);
        backdrop-filter: blur(10px);
        z-index: -1;
      }
      &:nth-child(2n) {
        background: rgba(231, 239, 220, 0.8);
      }
    }
    &::-webkit-scrollbar {
      width: 0px;
      height: 0px;
    }
  }
}
</style>
<style></style>
