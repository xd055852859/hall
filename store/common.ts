import { ref } from "vue";
import { defineStore } from "pinia";
import { User } from "@/interface/User";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { Editor } from "@tiptap/vue-3";
import dayjs from "dayjs";

// 使用setup模式定义
export const commonStore = defineStore("commonStore", () => {
  const deviceType = ref<string>("computer");

  const locale = ref<string>("");
  const size = ref<boolean>(false);
  const chooseDate = ref<number>(dayjs().valueOf());
  const chooseMonth = ref<number>(
    dayjs().startOf("month").startOf("day").valueOf()
  );
  const dark = ref<boolean>(!!localStorage.getItem("DARK"));
  const editorInfo = ref<Editor | null>(null);
  const noticeNum = ref<number>(0);
  const statusHeight = ref<string | null>(null);
  const navigationHeight = ref<string | null>(null);
  const isHidden = ref<string | null>(null);
  const deviceWidth = ref<number>(0);
  const deviceSize = ref<string>("md");
  const musicSrc=ref<number>(0);
  const updateLoading=ref<boolean>(false);

  const setDeviceType = (newDeviceType: string) => {
    deviceType.value = newDeviceType;
  };
  const setSrc = (newSrc: number) => {
    musicSrc.value = newSrc;
  };
  const setCommonDark = (newDark: boolean) => {
    dark.value = newDark;
  };
  const setCommonLocale = (newLocale: string) => {
    locale.value = newLocale;
  };
  const setEditor = (info: Editor) => {
    editorInfo.value = info;
  };
  const setDate = (date: number) => {
    chooseDate.value = date;
  };
  const setMonth = (date: number) => {
    chooseMonth.value = date;
  };
  const setDeviceWidth = (width: number) => {
    deviceWidth.value = width;
    if (width < 550) {
      deviceSize.value = "xs";
    } else if (550 <= width) {
      deviceSize.value = "sm";
    } else if (768 <= width) {
      deviceSize.value = "md";
    } else if (992 <= width) {
      deviceSize.value = "lg";
    } else if (1200 <= width) {
      deviceSize.value = "xl";
    }
  };
  const setCommonSize = (newSize: boolean) => {
    size.value = newSize;
  };
  const setUpdateLoading = (newUpdateLoading: boolean) => {
    updateLoading.value = newUpdateLoading;
  };
  const setMobileHeader = (
    newStatusHeight,
    newNavigationHeight,
    newIsHidden
  ) => {
    statusHeight.value = newStatusHeight;
    navigationHeight.value = newNavigationHeight;
    isHidden.value = newIsHidden;
  };
  watchEffect(() => {
    if (statusHeight.value)
      localStorage.setItem("statusHeight", statusHeight.value);
    if (navigationHeight.value)
      localStorage.setItem("navigationHeight", navigationHeight.value);
    if (isHidden.value) localStorage.setItem("isHidden", isHidden.value);
  });
  return {
    deviceType,
    setDeviceType,
    dark,
    setCommonDark,
    locale,
    setCommonLocale,
    size,
    setCommonSize,
    editorInfo,
    setEditor,
    chooseDate,
    setDate,
    chooseMonth,
    setMonth,
    noticeNum,
    statusHeight,
    navigationHeight,
    isHidden,
    setMobileHeader,
    deviceWidth,
    setDeviceWidth,
    deviceSize,
    musicSrc,
    setSrc,
    updateLoading,
    setUpdateLoading,
  };
});
