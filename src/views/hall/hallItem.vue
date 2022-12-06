<script setup lang="ts">
import { Hall } from "@/interface/Hall";
import { ElMessage } from "element-plus";
const props = defineProps<{
  list: Hall[];
}>();
</script>
<template>
  <div class="hall-item" v-for="item in list" :key="item._key">
    <div class="hall-item-img">
      <!-- :style="{
        width: imgWidth + 'px',
        height: imgWidth * 0.66 + 'px',
      }" -->
      <img
        :src="`${item.cover}_cover?imageView2/1/w/400`"
        alt=""
        v-if="item.cover"
      />
    </div>
    <div class="hall-item-info">
      <div class="hall-item-name">{{ item.name }}</div>
      <div class="hall-item-address">{{ item.address }}</div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.hall-item {
  width: 100%;
  height: 120px;
  margin-bottom: 26px;
  @include flex(space-between, center, null);
  .hall-item-img {
    width: 190px;
    height: 120px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .hall-item-info {
    width: calc(100% - 206px);
    height: 100%;
    align-content: space-between;
    @include flex(null, center, wrap);
    .hall-item-name {
      width: 100%;
      height: 40px;
      font-size: 28px;
      color: #000000;
      line-height: 40px;
    }
    .hall-item-address {
      width: 100%;
      height: 28px;
      font-size: 20px;
      color: #666666;
      line-height: 28px;
    }
  }
}
</style>
<style></style>
