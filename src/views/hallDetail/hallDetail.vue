<script setup lang="ts">
import { ResultProps } from "@/interface/Common";
import { Hall, HallDetail } from "@/interface/Hall";
import api from "@/services/api";
import appStore from "@/store";
import { ElMessage, linkEmits } from "element-plus";
import { storeToRefs } from "pinia";
import router from "@/router";
import Carousel from "@/components/carousel.vue";
const route = useRoute();
const { hallList } = storeToRefs(appStore.hallStore);
const { getHallData } = appStore.hallStore;
const hallKey = ref<string>("");
const hallDetail = ref<HallDetail | null>(null);
const hallIndex = ref<number>(0);
const carouselRef = ref<any>(null);
onMounted(() => {
  if (hallList.value.length === 0) {
    getHallData();
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
const setTargetIndex=((index)=>{
  hallKey.value=hallList.value[index]._key
})
watch([hallKey, hallList], ([newKey, newList]) => {
  if (newKey && newList.length > 0) {
    getHallDetail(newKey, newList);
  }
});
watch;
</script>
<template>
  <div class="hall-detail">
    <cheader title="祠堂详情" routeName="/hall" />
    <!--    @change="changeHallDetail" -->
    <template v-if="hallDetail && hallList.length > 0">
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
      <Carousel :list="hallList" :initialIndex="hallIndex" @setTargetIndex="setTargetIndex"/>
    </template>
    <div class="hall-detail-info" v-if="hallDetail">
      <div class="hall-detail-title">{{ hallDetail.name }}</div>
      <div>祠堂所在地:{{ hallDetail.address }}</div>
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
  padding: 40px 100px 0px 100px;
  box-sizing: border-box;
  .hall-detail-info {
    width: 100%;
    height: calc(50vh - 140px);
    font-size: 25px;
    line-height: 50px;
    margin-top: 30px;
    @include scroll();
    .hall-detail-title {
      font-size: 40px;
      margin-bottom: 10px;
      font-weight: 900;
    }
  }
}
</style>
<style lang="scss"></style>
