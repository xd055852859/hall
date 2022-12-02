<script setup lang="ts"></script>
<template>
  <router-view></router-view>
  <audio
    ref="musicRef"
    src=""
    :style="{ position: 'fixed', zIndex: -5, opacity: 0 }"
  >
    您的浏览器不支持 audio 标签。
  </audio>
</template>
<style scoped lang="scss">
*::-webkit-scrollbar {
  width: 4px;
  height: 2px;
}

*::-webkit-scrollbar-thumb {
  background: var(--diary-font-color);
  border-radius: 100px;
}
</style>
<style></style>
