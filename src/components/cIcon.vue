<script setup lang="ts">
import { ElMessage } from "element-plus";
const props = defineProps<{
  name?: string;
  color?: string;
  fillColor?:string
  size: number;
  iconStyle?:any
}>();
</script>
<template>
  <iconpark-icon :name="name" :size="size" :color="color ? color : 'var(--diary-font-color)'" :fillColor="fillColor"/>
</template>
<style scoped lang="scss"></style>
<style></style>
