<script setup lang="ts">
import { ElMessage } from "element-plus";
import "@/services/turn.js";
import $ from "jquery";
import story1Jpg from "@/assets/img/1.jpg";
import story2Jpg from "@/assets/img/2.jpg";
import story3Jpg from "@/assets/img/3.jpg";
import story4Jpg from "@/assets/img/4.jpg";
import detailBg from "@/assets/img/splash-bg.jpeg";
import { storeToRefs } from "pinia";
import appStore from "@/store";
const { deviceWidth, deviceHeight } = storeToRefs(appStore.commonStore);
const currentPage = ref(1);
const imgList = [story1Jpg, story2Jpg, story3Jpg, story4Jpg];
const props = defineProps<{
  name?: string;
  link: string;
}>();
const emits = defineEmits<{
  (e: "close"): void;
}>();
onMounted(() => {
  //   console.log(turn);
  onTurn();
});
const onTurn = () => {
  nextTick(() => {
    console.log($("#flipbook"));
    $("#flipbook").turn({
      height: deviceHeight.value * 0.75, //高度
      width: deviceWidth.value * 0.7, //宽度
      display: "double", //单页显示/双页显示  single/double
      elevation: 150,
      duration: 500, //翻页速度(毫秒), 默认600ms
      gradients: true, //翻页时的阴影渐变, 默认true
      autoCenter: true, //自动居中, 默认false
      acceleration: true, //硬件加速, 默认true, 如果是触摸设备设置为true
      page: 1, //设置当前显示第几页
      pages: imgList.length, //总页数
      when: {
        //监听事件
        turning: function (e, page, view) {
          console.log(e, page, view);
          // 翻页前触发
        },
        turned: function (e, page) {
          console.log(e, page);
          currentPage.value = page;
          // 翻页后触发
        },
      },
    });
  });
};

const toPage = (i) => {
  currentPage.value = i + 1;
  $("#flipbook").turn("page", currentPage.value); //进度条跳转到对应的页数
};
const toPrevious = () => {
  $("#flipbook").turn("previous");
};
const toNext = () => {
  $("#flipbook").turn("next");
};
</script>
<template>
  <div class="story-detail" :style="{ backgroundImage: `url(${detailBg})` }">
    <cheader
      :title="name ? name : '书籍'"
      :clickState="true"
      @clickBack="emits('close')"
    />
    <div id="flipbook">
      <img
        v-for="(item, index) in imgList"
        :key="index"
        :src="item"
        alt=""
        srcset=""
        class="flipbook-image"
      />

      <!-- <el-button type="primary" @click="toPrevious()">上一页</el-button>
      <el-button type="primary" @click="toNext()">下一页</el-button> -->
    </div>
    <div class="story-detailr-bar">
      <div class="slider-bar">
        <div
          v-for="(item, index) in imgList"
          :key="index"
          class="slider"
          :class="{ 'slider-current': index + 1 == currentPage }"
          @click="toPage(index)"
        ></div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.story-detail {
  width: 100vw;
  height: 100vh;
  // background: linear-gradient(0deg, rgba(145, 203, 215), rgba(226, 250, 242));
  // background-color: #f3efe9;
  background-repeat: repeat-x;
  background-position: top left;
  background-size: auto 100%;
  align-content: center;
  @include flex(center, center, wrap);
  .flipbook-image {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
}
.story-detailr-bar {
  width: 100vw;
  height: 8px;
  margin-top: 50px;
  @include flex(center, center, null);

  .slider-bar {
    width: 50vw;
    height: 8px;
    border-radius: 5px;
    background-color: #ccc;
    margin-top: 15px;
    display: flex;
    overflow: hidden;
    .slider {
      flex: 1;
      cursor: pointer;
    }
    .slider-current {
      background-color: #666;
      border-radius: 5px;
    }
  }
}
</style>
<style></style>
