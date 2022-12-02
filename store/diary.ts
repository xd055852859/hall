import { ref } from "vue";
import { defineStore } from "pinia";
import { User } from "@/interface/User";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { Diary } from "@/interface/Diary";
import dayjs from "dayjs";
import i18n from "@/language/i18n";

// 使用setup模式定义
export const diaryStore = defineStore("diaryStore", () => {
  const diaryList = ref<Diary[]>([]);
  const diaryFriendList = ref<Diary[]>([]);
  const diaryPublicList = ref<Diary[]>([]);
  const diaryMonth = ref<string[]>([]);
  const diaryFriendMonth = ref<string[]>([]);
  const diaryDateText = ref<string>("");
  const diaryDetail = ref<Diary | null>(null);
  const page = ref<number>(1);
  const total = ref<number>(0);
  const friendPage = ref<number>(1);
  const friendTotal = ref<number>(0);
  const publicPage = ref<number>(1);
  const publicTotal = ref<number>(0);
  const imageList = ref<string[]>([]);
 
  const getDiaryList = async (
    newPage: number,
    friendKey?: string,
    filterDate?: number,
    shareToUserKey?: string
  ) => {
    const infoRes = (await api.request.get("card/list", {
      friendKey: friendKey,
      filterDate: filterDate,
      shareToUserKey: shareToUserKey,
      page: newPage,
      limit: 30,
    })) as ResultProps;
    if (infoRes.msg === "OK") {
      if (newPage === 1) {
        diaryDateText.value = "";
        if (friendKey) {
          friendPage.value = 1;
          diaryFriendList.value = [];
        } else {
          page.value = 1;
          diaryList.value = [];
        }
      }
      infoRes.data = infoRes.data.map((diaryItem, diaryIndex) => {
        let diaryDate = [
          dayjs(diaryItem.storyTime).month() + 1,
          dayjs(diaryItem.storyTime).date(),
          // dayjs(diaryItem.storyTime).day(),
        ];
        let dateText = dayjs(diaryItem.storyTime).format(
          `YYYY${i18n.global.t("year")}MM${i18n.global.t(
            "month"
          )}DD${i18n.global.t("day")}`
        );
        let dateShow = false;
        if (diaryDateText.value !== dateText) {
          dateShow = true;
          diaryDateText.value = dateText;
        }
        diaryItem = {
          diaryDate: diaryDate,
          dateShow: dateShow,
          diaryDateText: diaryDateText,
          ...diaryItem,
        };
        return diaryItem;
      });
      if (friendKey) {
        diaryFriendList.value = [...diaryFriendList.value, ...infoRes.data];
        friendTotal.value = infoRes.total as number;
      } else {
        diaryList.value = [...diaryList.value, ...infoRes.data];
        total.value = infoRes.total as number;
      }
    }
  };
  const getPublicDiaryList = async (newPage: number, friendKey?: string) => {
    const infoRes = (await api.request.get("card/list/public", {
      friendKey: friendKey,
      page: newPage,
      limit: 30,
    })) as ResultProps;
    if (infoRes.msg === "OK") {
      if (newPage === 1) {
        diaryDateText.value = "";

        publicPage.value = 1;
        diaryPublicList.value = [];
      }
      infoRes.data = infoRes.data.map((diaryItem, diaryIndex) => {
        let diaryDate = [
          dayjs(diaryItem.storyTime).month() + 1,
          dayjs(diaryItem.storyTime).date(),
          // dayjs(diaryItem.storyTime).day(),
        ];
        let dateText = dayjs(diaryItem.storyTime).format(
          `YYYY${i18n.global.t("year")}MM${i18n.global.t(
            "month"
          )}DD${i18n.global.t("day")}`
        );
        let dateShow = false;
        if (diaryDateText.value !== dateText) {
          dateShow = true;
          diaryDateText.value = dateText;
        }
        diaryItem = {
          diaryDate: diaryDate,
          dateShow: dateShow,
          diaryDateText: diaryDateText,
          ...diaryItem,
        };
        return diaryItem;
      });

      diaryPublicList.value = [...diaryFriendList.value, ...infoRes.data];
      publicTotal.value = infoRes.total as number;
    }
  };
  const getDiaryMonth = async (friendKey?: string, filterTime?: number) => {
    const monthRes = (await api.request.get("card/month", {
      friendKey: friendKey,
      filterTime: filterTime,
    })) as ResultProps;
    if (monthRes.msg === "OK") {
      if (friendKey) {
        diaryFriendMonth.value = monthRes.data.map((diaryItem, diaryIndex) => {
          return diaryItem.ctime;
        });
      } else {
        diaryMonth.value = monthRes.data.map((diaryItem, diaryIndex) => {
          return diaryItem.ctime;
        });
      }
    }
  };
  const getDiaryDetail = async (key: string) => {
    const infoRes = (await api.request.get("card", {
      cardKey: key,
    })) as ResultProps;
    if (infoRes.msg === "OK") {
      diaryDetail.value = { ...infoRes.data };
    }
  };
  const setDiaryDetail = async (detail) => {
    console.log(detail);
    if (detail) {
      diaryDetail.value = { ...diaryDetail.value, ...detail };
    } else {
      diaryDetail.value = null;
    }
  };
  const setPage = (newPage: number) => {
    page.value = newPage;
  };
  const setFriendPage = (newPage: number) => {
    friendPage.value = newPage;
  };
  const setPublicPage = (newPage: number) => {
    publicPage.value = newPage;
  };
  const setImageList = (newList: string[]) => {
    imageList.value = [...newList];
  };
  return {
    diaryList,
    diaryFriendList,
    diaryPublicList,
    getDiaryList,
    diaryMonth,
    diaryFriendMonth,
    getDiaryMonth,
    diaryDetail,
    getDiaryDetail,
    setDiaryDetail,
    total,
    friendTotal,
    publicTotal,
    page,
    setPage,
    friendPage,
    setFriendPage,
    publicPage,
    setPublicPage,
    getPublicDiaryList,
    imageList,
    setImageList,
  };
});
