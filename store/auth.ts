import { ref } from "vue";
import { defineStore, storeToRefs } from "pinia";
import { User } from "@/interface/User";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { is_mobile, loadFont } from "@/services/util";
// 使用setup模式定义
export const authStore = defineStore("authStore", () => {
  const token = ref<string>("");
  const user = ref<User | null>(null);
  const friend = ref<User | null>(null);
  const mateList = ref<User[]>([]);
  const fontName = ref<string>("");
  const fontUrl = ref<string>("");
  const fontSize = ref<number>(12);
  const setToken = (newToken: string) => {
    token.value = newToken;
  };
  const setUserInfo = (newUserInfo: User) => {
    user.value = newUserInfo;
  };
  const changeFont = (newFontInfo: { name: string; url: string }) => {
    fontName.value = newFontInfo.name;
    fontUrl.value = newFontInfo.url;
  };
  const changeFontSize = (newFontSize: number) => {
    fontSize.value = newFontSize;
  };
  const setFriendInfo = (newFriendInfo: User) => {
    friend.value = newFriendInfo;
  };
  const getUserInfo = async () => {
    const userInfoRes = (await api.request.get("user")) as ResultProps;
    if (userInfoRes.msg === "OK") {
      user.value = { ...userInfoRes.data };
      if (user.value?.config?.fontUrl) {
        fontName.value = user.value.config.fontName;
        fontUrl.value = user.value.config.fontUrl;
        loadFont(fontName.value, fontUrl.value);
      }
      const deviceWidth = document.documentElement.offsetWidth;
      if ((is_mobile() || deviceWidth < 700) && user.value?.config.mobileSize) {
        fontSize.value = user.value.config.mobileSize;
      } else if (user.value?.config.computerSize) {
        fontSize.value = user.value.config.computerSize;
      }
    }                             
  };
  const getMateList = async () => {
    const mateRes: any = (await api.request.get("partner")) as ResultProps;
    if (mateRes.msg === "OK") {
      mateList.value = [...mateRes.data];
    }
  };
  const addMateList = async (mateItem: User) => {
    mateList.value = [...mateList.value, mateItem];
  };
  const changeMateList = async (oldIndex: number, newIndex: number) => {
    let item = { ...mateList.value[oldIndex] };
    console.log(mateList.value);
    mateList.value.splice(oldIndex, 1);
    mateList.value.splice(newIndex, 0, item);
  };
  const updateMateList = async (mateItem: User) => {
    mateList.value = mateList.value.map((item: User) => {
      if (item._key === mateItem._key) {
        item = { ...item, ...mateItem };
      }
      return item;
    });
  };

  const delMateList = async (mateKey: string) => {
    mateList.value = mateList.value.filter((item) => item._key !== mateKey);
  };

  return {
    token,
    user,
    setToken,
    setUserInfo,
    getUserInfo,
    friend,
    setFriendInfo,
    mateList,
    getMateList,
    addMateList,
    delMateList,
    changeMateList,
    updateMateList,
    fontName,
    fontUrl,
    changeFont,
    fontSize,
    changeFontSize,
  };
});
