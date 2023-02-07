<script setup lang="ts">
import { ElMessage } from "element-plus";
import detailBg from "@/assets/img/splash-bg.jpeg";
const props = defineProps<{
  name?: string;
  link: string;
}>();
const emits = defineEmits<{
  (e: "close"): void;
}>();
</script>
<template>
  <div class="story-detail" :style="{ backgroundImage: `url(${detailBg})` }">
    <cheader
      :title="name ? name : '书籍'"
      :clickState="true"
      @clickBack="emits('close')"
    />
    <iframe
      :src="link"
      width="100%"
      height="100%"
      frameborder="no"
      allowfullscreen="true"
    />
  </div>
</template>
<style scoped lang="scss">
.story-detail {
  width: 100vw;
  height: 100vh;
  // background: linear-gradient(0deg, rgba(145, 203, 215), rgba(226, 250, 242));
  // background-color: #f3efe9;
  background-repeat: repeat-x;
  background-position: top left;
  background-size: auto 100%;
}
</style>
<style></style>
