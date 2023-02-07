<script setup lang="ts">
import { ResultProps } from "@/interface/Common";
import { Hall, HallDetail } from "@/interface/Hall";
import api from "@/services/api";
import appStore from "@/store";
import { ElMessage, linkEmits } from "element-plus";
import { storeToRefs } from "pinia";
import router from "@/router";
import Carousel from "@/components/carousel.vue";
import arrowLeftSvg from "@/assets/svg/arrowLeft.svg";
import arrowRightSvg from "@/assets/svg/arrowRight.svg";
// import "swiper/css/bundle";
const route = useRoute();
const { deviceWidth, deviceHeight } = storeToRefs(appStore.commonStore);
const { hallList, searchHallList } = storeToRefs(appStore.hallStore);
const { getHallData } = appStore.hallStore;
const hallKey = ref<string>("");
const hallIndex = ref<number>(0);
const carouselList = ref<any>([]);
const hallDetail = ref<HallDetail | null>(null);
const carouselRef = ref<any>(null);
const props = defineProps<{
  id: any;
}>();
const emits = defineEmits<{
  (e: "close"): void;
}>();
onMounted(() => {
  getHallDetail(props.id);
  // else {
  //   if (hallList.value.length === 0) {
  //     getHallData();
  //   }
  // }
  hallKey.value = props.id as string;
});
const getHallDetail = async (key) => {
  const dateRes = (await api.request.get("hall/detail", {
    hallKey: key,
  })) as ResultProps;
  if (dateRes.msg === "OK") {
    hallDetail.value = { ...dateRes.data };
    if (searchHallList.value.length === 0) {
      carouselList.value.push(hallDetail.value);
    } else {
      carouselList.value = [...searchHallList.value];
      hallIndex.value = carouselList.value.findIndex(
        (item) => item._key === props.id
      );
    }
    if (hallDetail.value?.cover) {
      let imgSrc: any = new Image();
      imgSrc.src = hallDetail.value.cover;
      if (imgSrc.complete) {
        let img: any = document.getElementById(
          "hallImage" + hallDetail.value?._key
        );
        console.log("complete");
        //发现缓存则加载缓存
        img.setAttribute("src", hallDetail.value.cover);
        return;
      }
      imgSrc.onload = function () {
        let img: any = document.getElementById(
          "hallImage" + hallDetail.value?._key
        );
        console.log(img);
        //图片加载完成后替换图片
        img.setAttribute("src", hallDetail.value?.cover);
      };
    }
  }
};
const changeCarouselIndex = (index) => {
  getHallDetail(carouselList.value[index]._key);
};
// const setTargetIndex = (index) => {
//   hallKey.value = carouselList.value[index]._key;
// };
// watch(
//   [hallKey, hallList],
//   ([newKey, newList]) => {
//     if (newKey && newList.length > 0) {
//       getHallDetail(newKey);
//     }
//   },
//   { immediate: true }
// );
</script>
<template>
  <div class="hall-detail">
    <!--  :style="
      searchHallList.length > 2
        ? {
            padding: '40px 100px 0px 100px',
          }
        : {}
    " -->
    <cheader title="祠堂详情" :clickState="true" @clickBack="emits('close')" />
    <!--    @change="changeHallDetail" -->
    <template v-if="hallDetail && carouselList.length > 0">
      <el-carousel
        :interval="4000"
        height="100vh"
        class="hall-detail-imageList"
        :autoplay="false"
        :pause-on-hover="false"
        arrow="never"
        indicator-position="none"
        :initial-index="hallIndex"
        ref="carouselRef"
        @change="changeCarouselIndex"
      >
        <el-carousel-item
          v-for="(item, index) in carouselList"
          :key="item._key"
        >
          <div class="hall-detail-img-box">
            <img
              :src="`${item.cover}_cover?imageView2/1/w/${deviceWidth / 2}/h/${
                deviceHeight / 2
              }`"
              alt=""
              :id="'hallImage' + item._key"
            />
          </div>
        </el-carousel-item>
      </el-carousel>
      <!--  + `_cover?imageView2/1/w/600/h/400` -->
      <!-- <div v-if="searchHallList.length < 3" class="hall-detail-single">
        <img :src="hallDetail.cover + '_cover'" alt="" />
      </div> -->
      <!-- <Carousel
        :list="searchHallList"
        :initialIndex="hallIndex"
        @setTargetIndex="setTargetIndex"
        v-else
      /> -->
    </template>
    <div class="hall-detail-info" v-if="hallDetail">
      <div class="hall-detail-title">{{ hallDetail.name }}</div>
      <div>祠堂所在地 : {{ hallDetail.address }}</div>
      <div v-if="hallDetail.hall !== '不详'">堂号 : {{ hallDetail.hall }}</div>
      <div>{{ hallDetail?.description }}</div>
    </div>
    <template v-if="carouselList.length > 1">
      <img
        :src="arrowLeftSvg"
        alt=""
        class="hall-arrow-left"
        @click="carouselRef.prev()"
      />
      <img
        :src="arrowRightSvg"
        alt=""
        class="hall-arrow-right"
        @click="carouselRef.next()"
      />
    </template>
  </div>
</template>
<style scoped lang="scss">
.hall-detail {
  width: 100vw;
  height: 100vh;
  // background-color: #fff;
  background: linear-gradient(0deg, rgba(145, 203, 215), rgba(226, 250, 242));
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  .hall-detail-single {
    width: 100vw;
    height: 100vh;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .hall-detail-img-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
    // border: 4px solid #fff;
    box-sizing: border-box;
    // box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.4);
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .hall-detail-filter {
    filter: blur(8px);
  }
  .hall-detail-info {
    width: 100%;
    height: 35vh;
    font-size: 25px;
    line-height: 50px;
    margin-top: 30px;
    position: fixed;
    left: 0px;
    bottom: 0px;
    z-index: 1;
    padding: 20px 50px;
    box-sizing: border-box;
    color: #fff;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0), #000000);
    @include scroll();
    .hall-detail-title {
      font-size: 40px;
      margin-bottom: 10px;
      font-weight: 900;
    }
    &::-webkit-scrollbar {
      width: 0px;
      height: 0px;
    }
  }
  .el-carousel__arrow {
    width: 40px;
    height: 40px;
    i {
      font-size: 24px;
    }
  }
  .hall-arrow-left {
    width: 50px;
    height: 100px;
    position: fixed;
    top: 400px;
    left: 0px;
    z-index: 10;
    cursor: pointer;
  }
  .hall-arrow-right {
    width: 50px;
    height: 100px;
    position: fixed;
    top: 400px;
    right: 0px;
    z-index: 10;
    cursor: pointer;
  }
}
</style>
<style lang="scss">
.hall-detail {
  .el-carousel__arrow {
    width: 60px;
    height: 60px;
    i {
      font-size: 35px;
    }
  }
}
</style>
