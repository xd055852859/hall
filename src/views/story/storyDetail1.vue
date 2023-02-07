<script setup lang="ts">
import { ElMessage } from "element-plus";
import Flipbook from "flipbook-vue";
import story1Jpg from "@/assets/img/1.jpg";
import story2Jpg from "@/assets/img/2.jpg";
import story3Jpg from "@/assets/img/3.jpg";
import story4Jpg from "@/assets/img/4.jpg";
import closeSvg from "@/assets/svg/close.svg";
const route = useRoute();
const bookRef = ref<any>(null);
const storyKey = ref<string>("");
const pages1 = [story1Jpg, story2Jpg, story3Jpg, story4Jpg];
onMounted(() => {
  storyKey.value = route.params.id as string;
});
</script>
<template>
  <div class="story-detail">
    <div class="story-detail-book">
      <div class="book-container dp-center-center book-bottom">
        <div class="book-container dp-center-center book-bottom">
          <div class="book-container dp-center-center book-bottom">
            <div
              class="book-container dp-center-center book-bottom book-bottom"
            >
              <div class="book-container">
                <flipbook
                  class="flipbook"
                  :pages="pages1"
                  :zooms="[1]"
                  v-if="storyKey === '1'"
                  ref="bookRef"
                />
                <!-- <div class="book-line"></div> -->
              </div>
              <div class="book-line"></div>
            </div>
            <div class="book-line"></div>
          </div>
          <div class="book-line"></div>
        </div>
        <div class="book-line"></div>
      </div>
    </div>
    <div class="story-detail-page" v-if="bookRef">
      {{ Math.round(bookRef.page / 2) }} /
      {{ Math.round(bookRef.numPages / 2) }}
    </div>
    <div class="story-detail-button" @click="$router.replace('/story')">
      <img :src="closeSvg" alt="" />
    </div>
  </div>
</template>
<style scoped lang="scss"></style>
<style lang="scss">
.story-detail {
  width: 100vw;
  height: 100vh;
  position: relative;
  z-index: 1;
  align-content: flex-start;
  padding-top: 40px;
  @include flex(center, center, wrap);
  .story-detail-book {
    background: linear-gradient(0deg, #92cbd7, #e2faf2 49%, #91cbd7);
    box-shadow: 0px 2px 12px 0px #46838d;
    padding: 10px;
    .book-container {
      background: #f7f6f3;
      padding:2px  5px;
      border: 1px solid #eee;
      .flipbook {
        width: 1460px;
        height: 780px;
        .page {
          width: 735.7px;
          height: 756px;
          background: linear-gradient(
            270deg,
            #e7e4da,
            rgba(255, 255, 255, 0) 63%
          );
        }
      }
    }
    // .book-bottom {
    //   position: relative;
    //   z-index: 1;
    //   .book-line {
    //     width: 5px;
    //     height: 100%;
    //     position: absolute;

    //     background: rgba(0, 0, 0, 0.2);
    //     // linear-gradient(
    //     //   270deg,
    //     //   #e7e4da,
    //     //   rgba(255, 255, 255, 0) 63%
    //     // );
    //     z-index: -1;
    //   }
    // }
  }
  .story-detail-page {
    width: 100%;
    height: 100px;
    line-height: 100px;
    text-align: center;
    color: #fff;
  }
  .story-detail-button {
    width: 108px;
    height: 108px;
    position: fixed;
    top: 55px;
    right: 33px;
    cursor: pointer;
    z-index: 5;
    img {
      width: 100%;
      height: 100%;
    }
  }
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    backdrop-filter: blur(12px);
    z-index: -1;
    background: linear-gradient(
      0deg,
      rgba(145, 203, 215, 0.7),
      rgba(226, 250, 242, 0.7)
    );

    // background-color: rgba(255,255,255,0.2);
  }
}
</style>
