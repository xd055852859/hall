import { ref } from "vue";
import { defineStore } from "pinia";
import { Hall } from "@/interface/Hall";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";

// 使用setup模式定义
export const hallStore = defineStore("hallStore", () => {
  const hallList = ref<Hall[]>([]);
  const getHallData = async () => {
    const dateRes = (await api.request.get("hall/list")) as ResultProps;
    if (dateRes.msg === "OK") {
      hallList.value = dateRes.data.map((item) => {
        item.cover = item.cover.replace("8860A5FD", "hall_test1");
        item.cover = item.cover.replace("520CAA47", "hall_test2");
        item.cover = item.cover.replace("63E8EBAE", "hall_test3");
        item.cover = item.cover.replace("BE1A360F", "hall_test4");
        item.cover = item.cover.replace("9203EF08", "hall_test5");
        item.cover = item.cover.replace("2785BD8E", "hall_test6");
        item.cover = item.cover.replace("58338D19", "hall_test7");
        item.cover = item.cover.replace("23386627", "hall_test8");
        return item;
      });
    }
  };

  return {
    hallList,
    getHallData,
  };
});
