import { ref } from "vue";
import { defineStore } from "pinia";
import { User } from "@/interface/User";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { is_mobile, loadFont } from "@/services/util";
// 使用setup模式定义
export const authStore = defineStore("authStore", () => {
  const token = ref<string>("");
  const user = ref<User | null>(null);
  const setToken = (newToken: string) => {
    token.value = newToken;
  };
  const setUserInfo = (newUserInfo: User) => {
    user.value = newUserInfo;
  };

  const getUserInfo = async () => {
    const userInfoRes = (await api.request.get("user")) as ResultProps;
    if (userInfoRes.msg === "OK") {
      user.value = { ...userInfoRes.data };
    }
  };

  return {
    token,
    user,
    setToken,
    setUserInfo,
    getUserInfo,
  };
});
