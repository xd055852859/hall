<script setup lang="ts">
import { ResultProps } from "@/interface/Common";
import { HallDetail } from "@/interface/Hall";
import api from "@/services/api";
import appStore from "@/store";
import leftArrowSvg from "@/assets/svg/leftArrow.svg";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
const route = useRoute();
const { hallList } = storeToRefs(appStore.hallStore);
const hallKey = ref<string>("");
const hallDetail = ref<HallDetail | null>(null);
onMounted(() => {
  hallKey.value = route.params.id as string;
  getHallDetail(hallKey.value);
});
const getHallDetail = async (key) => {
  const dateRes = (await api.request.get("hall/detail", {
    hallKey: key,
  })) as ResultProps;
  if (dateRes.msg === "OK") {
    hallDetail.value = { ...dateRes.data };
  }
};
</script>
<template>
  <div class="hall-detail">
    <div class="hall-detail-header">
      <img
        class="hall-detail-img"
        :src="leftArrowSvg"
        alt=""
        @click="$router.back()"
      />
      <div class="hall-detail-title">祠堂详情</div>
    </div>
    <template v-if="hallDetail">
      <el-carousel
        :interval="4000"
        type="card"
        height="50vh"
        class="hall-detail-imageList"
      >
        <el-carousel-item v-for="item in hallDetail.imageList" :key="item">
          <div class="hall-detail-img-box">
            <img :src="item" alt="" />
          </div>
        </el-carousel-item>
      </el-carousel>
    </template>
    <div class="hall-detail-info">
      <div class="hall-detail-title">{{ hallDetail?.name }}</div>
      <div>拍摄地点:{{ hallDetail?.address }}</div>
      <div v-if="hallDetail?.imageDimensions">
        照片精度:{{ hallDetail?.imageDimensions }}
      </div>
      <div>{{ hallDetail?.description }}</div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.hall-detail {
  width: 100vw;
  height: 100vh;
  position: relative;
  z-index: 1;
  padding-top: 44px;
  box-sizing: border-box;
  .hall-detail-header {
    width: 100%;
    height: 66px;
    padding-left: 37px;
    box-sizing: border-box;
    @include flex(flex-start, center, null);
    .hall-detail-img {
      width: 94px;
      height: 94px;
    }
    .hall-detail-title {
      font-size: 48px;
      font-weight: bold;
      color: #333333;
      margin: 0px 21px 0px 7px;
      margin-bottom: 10px;
    }
  }
  .hall-detail-imageList {
    .hall-detail-img-box {
      width: 50vw;
      height: 50vh;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.4);
      }
    }
  }
  .hall-detail-info {
    width: 100%;
    height: calc(50vh - 160px);
    padding: 0px 142px;
    box-sizing: border-box;
    font-size: 25px;
    line-height: 50px;
    @include scroll();
    .hall-detail-title {
      font-size: 40px;
      margin-bottom: 10px;
    }
  }
}
</style>
<style></style>
+
