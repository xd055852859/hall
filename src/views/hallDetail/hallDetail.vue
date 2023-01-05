<script setup lang="ts">
import { ResultProps } from "@/interface/Common";
import { Hall, HallDetail } from "@/interface/Hall";
import api from "@/services/api";
import appStore from "@/store";
import { ElMessage, linkEmits } from "element-plus";
import { storeToRefs } from "pinia";
import router from "@/router";
import Carousel from "@/components/carousel.vue";

import "swiper/css/bundle";
const route = useRoute();
const { hallList, searchHallList } = storeToRefs(appStore.hallStore);
const { getHallData } = appStore.hallStore;
const hallKey = ref<string>("");
const carouselList = ref<Hall[]>([]);
const hallDetail = ref<HallDetail | null>(null);
const hallIndex = ref<number>(0);
const carouselRef = ref<any>(null);

onMounted(() => {
  if (searchHallList.value.length > 0) {
    carouselList.value = [...searchHallList.value];
  } else {
    if (hallList.value.length === 0) {
      getHallData();
    }
  }

  hallKey.value = route.params.id as string;
});
const getHallDetail = async (key, list) => {
  const dateRes = (await api.request.get("hall/detail", {
    hallKey: key,
  })) as ResultProps;
  if (dateRes.msg === "OK") {
    hallDetail.value = { ...dateRes.data };
    hallIndex.value = list.findIndex((item) => item._key === key);
  }
};
const setTargetIndex = (index) => {
  hallKey.value = carouselList.value[index]._key;
};
watch(
  [hallKey, hallList],
  ([newKey, newList]) => {
    if (newKey && newList.length > 0) {
      if (searchHallList.value.length === 0) {
        carouselList.value = [...hallList.value];
      }
      getHallDetail(newKey, carouselList.value);
    }
  },
  { immediate: true }
);
watch;
</script>
<template>
  <div
    class="hall-detail"
    :style="
      searchHallList.length > 2
        ? {
            padding: '40px 100px 0px 100px',
          }
        : {}
    "
  >
    <cheader title="祠堂详情" routeName="/hall" />
    <!--    @change="changeHallDetail" -->
    <template v-if="hallDetail && carouselList.length > 0">
      <!-- <el-carousel
        :interval="4000"
        type="card"
        height="60vh"
        class="hall-detail-imageList"
        :autoplay="false"
        :pause-on-hover="false"
        :initial-index="hallIndex"
        indicator-position="none"
        ref="carouselRef"
      >
        <el-carousel-item v-for="(item, index) in hallList" :key="item._key">
          <div
            class="hall-detail-img-box"
            :class="{ 'hall-detail-filter': hallIndex !== index }"
          >
            <img :src="item.cover + `_cover?imageView2/1/w/600/h/400`" alt="" />
          </div>
        </el-carousel-item>
      </el-carousel> -->
      <div v-if="searchHallList.length < 3" class="hall-detail-single">
        <img :src="hallDetail.cover + '_cover'" alt="" />
      </div>
      <Carousel
        :list="searchHallList"
        :initialIndex="hallIndex"
        @setTargetIndex="setTargetIndex"
        v-else
      />
    </template>
    <div
      class="hall-detail-info"
      v-if="hallDetail"
      :style="
        searchHallList.length < 3
          ? {
              color: '#fff',
              background: 'rgba(0,0,0,0.3)',
            }
          : {}
      "
    >
      <div class="hall-detail-title">{{ hallDetail.name }}</div>
      <div>祠堂所在地 : {{ hallDetail.address }}</div>
      <div v-if="hallDetail.hall !== '不详'">堂号 : {{ hallDetail.hall }}</div>
      <div>{{ hallDetail?.description }}</div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.hall-detail {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
    0deg,
    rgba(145, 203, 215, 0.7),
    rgba(226, 250, 242, 0.7)
  );
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
    filter: blur(8px);
  }
  .hall-detail-info {
    width: 100%;
    max-height: calc(50vh - 140px);
    font-size: 25px;
    line-height: 50px;
    margin-top: 30px;
    position: fixed;
    left: 0px;
    bottom: 0px;
    z-index: 1;
    padding: 20px 100px;
    box-sizing: border-box;
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
}
</style>
<style lang="scss"></style>
