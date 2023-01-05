import { ref } from "vue";
import { defineStore } from "pinia";
import { Hall } from "@/interface/Hall";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";

// 使用setup模式定义
export const hallStore = defineStore("hallStore", () => {
  const hallList = ref<Hall[]>([]);
  const searchHallList = ref<Hall[]>([]);
  const getHallData = async () => {
    const dateRes = (await api.request.get("hall/list")) as ResultProps;
    if (dateRes.msg === "OK") {
      hallList.value = [...dateRes.data];
    }
  };
  const setSearchHallList = (list: Hall[]) => {
    searchHallList.value = list;
  };
  return {
    hallList,
    getHallData,
    searchHallList,
    setSearchHallList,
  };
});
