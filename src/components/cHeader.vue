<script setup lang="ts">
import { ElMessage } from "element-plus";
import leftArrowSvg from "@/assets/svg/leftArrow.svg";
const props = defineProps<{
  title: string;
  routeName?:string
}>();
</script>
<template>
  <div class="common-header">
    <img
      class="common-header-img"
      :src="leftArrowSvg"
      alt=""
      @click="routeName?$router.push(routeName):$router.back()"
    />
    <div class="common-header-title">{{ title }}</div>
  </div>
</template>
<style scoped lang="scss">
.common-header {
  height: 66px;
  padding-left: 37px;
  box-sizing: border-box;
  position: fixed;
  top: 44px;
  left: 37px;
  z-index: 10;
  @include flex(flex-start, center, null);
  .common-header-img {
    width: 85px;
    height: 85px;
    cursor: pointer;
  }
  .common-header-title {
    font-size: 40px;
    font-weight: bold;
    color: #333333;
    margin: 0px 21px 0px 7px;
    margin-bottom: 10px;
  }
}
</style>
<style></style>
