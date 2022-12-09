<script setup lang="ts">
import { ElMessage } from "element-plus";
import closeSvg from "@/assets/svg/close.svg";
const props = defineProps<{
  list: any;
  initialIndex: number;
}>();
const emits = defineEmits<{
  (e: "setTargetIndex", index:number): void;
}>();
const currentIndex = ref<number>(0);
const currentSrc = ref<string>("");
const currentTitle = ref<string>("");
const fullVisible = ref<boolean>(false);
const swiper = ref<any>(null);
onMounted(() => {
  currentIndex.value = props.initialIndex;
  const swiperitem = document.getElementById("swiper"); //获取父元素
  //@ts-ignore
  swiper.value = swiperitem.getElementsByTagName("div"); //获取合集
});
watch(currentIndex,(newIndex)=>{
  emits('setTargetIndex',newIndex)
})
</script>
<template>
  <div class="swiper" id="swiper">
    <template v-for="(item, index) in list" :key="'test' + item" v-if="swiper">
      <div
        class="hall-detail-img-box prev"
        v-if="
          (currentIndex === 0 && index === swiper.length - 1) ||
          currentIndex - 1 === index
        "
        @click="
          currentIndex =
            currentIndex === 0 ? swiper.length - 1 : currentIndex - 1
        "
      >
        <img :src="item.cover + `_cover?imageView2/1/w/600/h/400`" alt="" />
      </div>
      <div
        class="hall-detail-img-box target"
        v-else-if="currentIndex === index"
        @click="
          currentTitle = item.name;
          currentSrc = item.cover;
          fullVisible = true;
        "
      >
        <img :src="item.cover + `_cover?imageView2/1/w/900/h/600`" alt="" />
      </div>
      <div
        class="hall-detail-img-box next"
        v-else-if="
          (currentIndex === swiper.length - 1 && index === 0) ||
          currentIndex + 1 === index
        "
        @click="
          currentIndex =
            currentIndex === swiper.length - 1 ? 0 : currentIndex + 1
        "
      >
        <img :src="item.cover + `_cover?imageView2/1/w/600/h/400`" alt="" />
      </div>
      <div class="hall-detail-img-box normal" v-else>
        <img :src="item.cover + `_cover?imageView2/1/w/840/h/560`" alt="" />
      </div>
    </template>
  </div>
  <div class="hall-detail-fullImage" v-if="fullVisible">
    <img :src="currentSrc" alt="" />
    <div class="fullImage-button" @click="fullVisible = false">
      <img :src="closeSvg" alt="" />
    </div>
  </div>
</template>
<style scoped lang="scss">
.hall-detail-fullImage {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 20;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
    // object-fit: contain;
  }
  .fullImage-button {
    width: 108px;
    height: 108px;
    position: absolute;
    top: 55px;
    right: 33px;
    z-index: 5;
    cursor: pointer;
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
.swiper,
#swiper {
  width: 100vw;
  height: 560px;
  position: relative;
  z-index: 1;
}

.swiper div {
  display: block;
  position: absolute;
  width: 900px;
  height: 600px;
  overflow: hidden;
  left: 420px;
  top: 0;
  transition: 0.5s;
  color: #fff;
  font-size: 50px;
  text-align: center;
  line-height: 200px;
}
.hall-detail-img-box {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 4px solid #fff;
  box-sizing: border-box;
  // box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.4);
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.hall-detail-filter {
}

.swiper .next {
  width: 480px;
  height: 320px;
  margin-top: 180px;
  opacity: 1;
  z-index: 23;
  filter: blur(4px);
  -webkit-transform: translateX(800px);
  -ms-transform: translateX(800px);
  transform: perspective(500px) translateX(820px);
}

.swiper .target {
  opacity: 1;
  z-index: 33;
  -webkit-transform: translateX(0);
  -ms-transform: translateX(0);
  transform: translateX(0);
  cursor: pointer;
}

.swiper .prev {
  width: 480px;
  height: 320px;
  margin-top: 180px;
  opacity: 1;
  z-index: 23;
  filter: blur(4px);
  -webkit-transform: translateX(570px);
  -ms-transform: translateX(570px);
  transform: perspective(500px) translateX(-420px);
}

.swiper .normal {
  opacity: 0;
  z-index: -1;
  -webkit-transform: translateX(0);
  -ms-transform: translateX(0);
  transform: perspective(500px);
}
</style>
<style></style>
