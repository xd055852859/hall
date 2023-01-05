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

</style>
<style></style>
