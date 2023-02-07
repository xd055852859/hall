<script setup lang="ts">
import { Hall } from "@/interface/Hall";

const props = defineProps<{
  list: Hall[];
}>();
const emits = defineEmits<{
  (e: "chooseHall", key: string): void;
}>();
</script>
<template>
  <div class="hall-image">
    <div class="hall-image-container">
      <div
        class="hall-image-item"
        v-for="item in list"
        :key="item._key"
        @click="emits('chooseHall', item._key)"
      >
        <div class="hall-item-top">
          <!-- :style="{
        width: imgWidth + 'px',
        height: imgWidth * 0.66 + 'px',
      }" -->
          <img
            :src="`${item.cover}_cover?imageView2/1/w/500`"
            alt=""
            v-if="item.cover"
          />
        </div>
        <div class="hall-item-bottom">
          <div class="hall-item-title">{{ item.name }}</div>
          <div class="hall-item-subtitle">{{ item.address }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.hall-image {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 4;
  background-color: #ffffff;
  padding: 25px 0px;
  box-sizing: border-box;
  .hall-image-container {
    width: 100%;
    height: 100%;
    padding: 0px 25px;
    box-sizing: border-box;
    align-content: flex-start;
    @include flex(flex-start, center, wrap);
    @include scroll();
    .hall-image-item {
      width: 430px;
      height: 447px;
      margin-right: 28px;
      background: rgba(255, 255, 255, 0.6);
      border: 1px solid #dddddd;
      border-radius: 6px;
      margin-bottom: 22px;
      cursor: pointer;

      .hall-item-top {
        width: 100%;
        height: 335px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .hall-item-bottom {
        width: 100%;
        height: 112px;
        padding: 14px 24px;
        box-sizing: border-box;
        .hall-item-title {
          width: 100%;
          height: 42px;
          font-size: 30px;
          font-weight: 700;
          color: #000000;
          line-height: 42px;
          margin-bottom: 10px;
        }
        .hall-item-subtitle {
          width: 120px;
          height: 28px;
          font-size: 20px;
          color: #666666;
          line-height: 28px;
        }
      }
      &:nth-child(3n) {
        margin-right: 0px;
      }
    }
    &::-webkit-scrollbar {
      width: 0px;
      height: 0px;
    }
  }
}
.to-left {
  animation: left 0.5s;
  animation-fill-mode: forwards;
}
.to-right {
  animation: right 0.5s;
  animation-fill-mode: forwards;
}
</style>
<style lang="scss">
@keyframes left {
  0% {
    right: -500px;
  }
  100% {
    right: 0px;
  }
}
@keyframes right {
  0% {
    right: 0px;
  }
  100% {
    right: -500px;
  }
}
</style>
