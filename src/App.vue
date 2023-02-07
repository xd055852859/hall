<script setup lang="ts">
import appStore from './store';

const { setDeviceWidth } = appStore.commonStore;
onBeforeMount(() => {
  let url = window.location.href;
  //自动切换为https
  if (url.indexOf("http://localhost") === -1 && url.indexOf("https") < 0) {
    url = url.replace("http:", "https:");
    window.location.replace(url);
  }
  setDeviceWidth(
    document.documentElement.offsetWidth,
    document.documentElement.offsetHeight
  );
})
</script>
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
