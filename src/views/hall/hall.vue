<script setup lang="ts">
import CMap from "@/components/map/cMap.vue";
import { ResultProps } from "@/interface/Common";
import { Hall } from "@/interface/Hall";
import api from "@/services/api";
import leftArrowSvg from "@/assets/svg/leftArrow.svg";

import toImgSvg from "@/assets/svg/toImg.svg";
import { ArrowDown, ArrowRight, CircleClose } from "@element-plus/icons-vue";

import hallItem from "./hallItem.vue";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import appStore from "@/store";
const { hallList } = storeToRefs(appStore.hallStore);
const { getHallData } = appStore.hallStore;
const province = ref<string>("");
const city = ref<string>("");
const surname = ref<string>("");

const searchList = ref<Hall[]>([]);
const randomList = ref<Hall[]>([]);
const nameList = ref<{ surname: string; count: number }[]>([]);
const searchNameList = ref<{ surname: string; count: number }[]>([]);
const searchState = ref<string>("list");
const leftRef = ref<any>(null);
const enList = ref<string[]>(["All"]);
const chooseIndex = ref<number>(0);
const changeState = ref<boolean>(false);
onMounted(() => {
  if (hallList.value.length === 0) {
    getHallData();
  }
  for (var i = 0; i < 26; i++) {
    enList.value.push(String.fromCharCode(65 + i));
  }
});
const getRandomData = async (limit) => {
  const dateRes = (await api.request.get("hall/random", {
    limit: limit,
  })) as ResultProps;
  if (dateRes.msg === "OK") {
    randomList.value = [...dateRes.data];
  }
};
const getNameData = async () => {
  const dateRes = (await api.request.get("surname")) as ResultProps;
  if (dateRes.msg === "OK") {
    nameList.value = [...dateRes.data];
    chooseEn(0);
  }
};
const getEnData = async () => {
  const dateRes = (await api.request.get("surname/alpha")) as ResultProps;
  if (dateRes.msg === "OK") {
    let arr = dateRes.data.map((item) => item.toUpperCase());
    enList.value = ["All", ...arr];
  }
};
const searchData = (province, city, surname) => {
  if (searchState.value !== "list") {
    searchList.value = [];
    if (!province && !city && !surname) {
      searchState.value = "menu";
      chooseIndex.value = 0;
    } else {
      searchState.value = "search";
      hallList.value.forEach((item) => {
        if (
          (item.province === province || !province) &&
          (item.city === city || !city) &&
          (item.surname === surname || !surname)
        ) {
          searchList.value.push(item);
        }
      });
    }
  }
};
const searchNameData = async (name: string) => {
  const dateRes = (await api.request.get("surname/byBlpha", {
    alpha: name.toLowerCase(),
  })) as ResultProps;
  if (dateRes.msg === "OK") {
    searchNameList.value = [...dateRes.data];
  }
};
const chooseEn = (index: number) => {
  chooseIndex.value = index;
  if (index) {
    searchNameData(enList.value[index]);
  } else {
    searchNameList.value = [...nameList.value];
  }
};
const setProvince = (newProvince) => {
  searchState.value = "search";
  province.value = newProvince;
  surname.value = "";
};
const setCity = (newCity) => {
  searchState.value = "search";
  city.value = newCity;
  surname.value = "";
};
watch([province, city, surname], ([newProvince, newCity, newSurname]) => {
  searchData(newProvince, newCity, newSurname);
});
// watch(surname, () => {
//   if (surname) {
//     province.value = "";
//     city.value = "";
//   }
// });
watch(
  [searchState, hallList],
  ([newState, newList]) => {
    if (newState === "list") {
      // let limit = parseInt(
      //   (leftRef.value.offsetHeight - 130) / (imgWidth.value * 0.66 + 15) + ""
      // );
      let limit = 15;
      getRandomData(limit);
      province.value = "";
      city.value = "";
      surname.value = "";
      if (newList) {
        searchList.value = [...newList];
      }
    } else if (newState === "menu") {
      searchList.value = [...newList];
      if (nameList.value.length === 0) {
        getNameData();
        getEnData();
      }
    }
  },
  { immediate: true }
);
</script>
<template>
  <div class="hall" @click="changeState = true" @touch="changeState = true">
    <div class="hall-left" ref="leftRef">
      <div class="hall-left-header">
        <img
          class="hall-left-img"
          :src="leftArrowSvg"
          alt=""
          @click="$router.push('/')"
        />
        <div class="hall-left-title">探索祠堂</div>
        <div class="hall-left-subtitle">共收录{{ hallList.length }}座</div>
      </div>
      <div class="hall-left-search">
        <div
          v-if="searchState === 'list'"
          class="left-search-title"
          @click="searchState = 'menu'"
        >
          全部姓氏
        </div>
        <!-- <el-input
          class="left-search-input"
          v-model="surname"
          placeholder="全部姓氏"
          style="width: calc(100% - 25px)"
          @click.stop=""
          clearable
          v-else
        /> -->
        <div v-else class="left-search-title">
          {{
            searchState === "search"
              ? surname
                ? surname
                : province
                ? city
                  ? province + " > " + city
                  : province
                : province
              : "全部姓氏"
          }}
          <div
            class="left-search-close"
            @click.stop="
              surname = '';
              province = '';
              city = '';
            "
            v-if="surname || province"
          >
            <el-icon><CircleClose /></el-icon>
          </div>
        </div>
        <div
          class="left-search-icon"
          @click="searchState = 'menu'"
          v-if="searchState === 'list'"
        >
          <el-icon><ArrowRight /></el-icon>
        </div>
        <div class="left-search-icon" @click="searchState = 'list'" v-else>
          <el-icon><ArrowDown /></el-icon>
        </div>
      </div>
      <div class="hall-left-container">
        <div class="hall-box" v-if="searchState === 'list'">
          <hall-item :list="randomList" />
        </div>
        <div class="hall-box" v-else-if="searchState === 'search'">
          <hall-item :list="searchList" />
        </div>
        <div class="hall-name" v-else>
          <div class="hall-name-left">
            <div
              class="hall-name-choose"
              v-for="(item, index) in enList"
              :key="`en${index}`"
              @click="chooseEn(index)"
              :style="
                index === chooseIndex
                  ? { color: '#84b840', border: '2px solid #84b840' }
                  : {}
              "
            >
              {{ item }}
            </div>
          </div>
          <div class="hall-name-right">
            <div
              :class="{
                'hall-name-second': item.surname.length === 2,
                'hall-name-fourth': item.surname.length === 4,
              }"
              class="hall-name-item"
              v-for="(item, index) in searchNameList"
              :key="`searchName${index}`"
              @click="
                surname = item.surname;
                searchState = 'search';
              "
            >
              <div class="name-item-top">{{ item.surname }}</div>
              <div class="name-item-bottom">{{ item.count }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <CMap
      :mapId="'hallMap'"
      :width="'100%'"
      :height="'100%'"
      :cMapData="searchList"
      :changeState="changeState"
      @setProvince="setProvince"
      @setCity="setCity"
      v-if="hallList.length > 0"
    />
    <div class="hall-message-box" v-if="surname || province || city">
      <div class="hall-message">
        {{ surname ? surname + "氏" : province ? province : city ? city : "" }}
        共收录{{ searchList.length }}座祠堂
      </div>
    </div>
    <div class="hall-to-img" @click="$router.push('/hallImage')">
      <img :src="toImgSvg" alt="" />
    </div>
  </div>
</template>
<style scoped lang="scss">
.hall {
  width: 100vw;
  height: 100vh;
  position: relative;
  z-index: 1;
  .hall-left {
    width: 500px;
    height: 100vh;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 4;
    //  background-color: transparent;
    box-shadow: 0px 2px 6px 0px #46838d;
    .hall-left-header {
      width: 100%;
      height: 94px;
      @include flex(flex-start, center, null);
      margin-top: 23px;
      box-sizing: border-box;
      .hall-left-img {
        width: 94px;
        height: 94px;
      }
      .hall-left-title {
        font-size: 48px;
        font-weight: bold;
        color: #333333;
        margin-right: 10px;
        margin-bottom: 10px;
      }
      .hall-left-subtitle {
        font-size: 20px;
        font-weight: 400;
        color: #666666;
        margin-bottom: 8px;
      }
    }
    .hall-left-search {
      width: calc(100% - 90px);
      height: 60px;
      background: rgba(255, 255, 255, 0.5);
      border: 1px solid #ffffff;
      border-radius: 4px;
      box-sizing: border-box;
      margin: 21px 0px 33px 45px;
      padding: 9px 20px;
      box-sizing: border-box;
      cursor: pointer;
      @include flex(space-between, center, null);
      .left-search-title {
        width: calc(100% - 30px);
        height: 100%;
        font-size: 30px;
        position: relative;
        z-index: 1;
        @include flex(space-between, center, null);
        .left-search-close {
          width: 40px;
          height: 40px;
          margin-top: 10px;
        }
      }

      .left-search-icon {
        width: 15px;
        height: 8.5px;
        flex-shrink: 0;
        @include flex(center, center, null);
      }
    }
    .hall-left-container {
      width: 100%;
      height: calc(100% - 219px);
      padding-left: 45px;
      box-sizing: border-box;
      .hall-box {
        width: 100%;
        height: 100%;
        @include scroll();
      }
      .hall-name {
        width: 100%;
        height: 100%;
        padding-right: 45px;
        box-sizing: border-box;
        @include flex(space-between, center, null);
        .hall-name-left {
          width: 85px;
          height: 100%;
          border-right: 1px solid #ffffff;
          padding-right: 14.5px;
          box-sizing: border-box;
          @include scroll();
          @include flex(center, center, wrap);
          .hall-name-choose {
            width: 70px;
            height: 70px;
            margin-bottom: 10px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 4px;
            color: #999999;
            text-align: center;
            font-size: 30px;
            line-height: 70px;
            font-family: yahei !important;
            cursor: pointer;
          }
        }
        .hall-name-right {
          width: calc(100% - 70px);
          height: 100%;
          border-right: 1px solid #ffffff;
          padding-left: 10px;
          align-content: flex-start;
          @include scroll();
          @include flex(flex-start, center, wrap);
          .hall-name-item {
            width: 68px;
            height: 98px;
            margin-right: 10px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 4px;
            margin-top: 10px;
            cursor: pointer;
            @include p-number(10px, 10px);
            .name-item-top {
              width: 100%;
              height: 45px;
              @include flex(center, center, null);
              text-align: center;
              font-size: 30px;
              text-align: center;
              color: #333333;
            }
            .name-item-bottom {
              width: 100%;
              height: 35px;
              font-size: 20px;
              text-align: center;
              line-height: 35px;
              color: #999999;
            }
          }
          .hall-name-second {
            width: 146px;
          }
          .hall-name-fourth {
            width: 100%;
          }
        }
      }
    }

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      backdrop-filter: blur(12px);
      z-index: -1;
      background: linear-gradient(
        0deg,
        rgba(145, 203, 215, 0.7),
        rgba(226, 250, 242, 0.7)
      );

      // background-color: rgba(255,255,255,0.2);
    }
  }
  .hall-message-box {
    width: 100%;
    height: 35px;
    position: fixed;
    top: 20px;
    left: 0px;
    z-index: 3;
    @include flex(center, center, null);
    .hall-message {
      height: 100%;
      border: 2px solid #ffffff;
      border-radius: 18px;
      position: relative;
      z-index: 1;
      overflow: hidden;
      font-size: 16px;
      @include flex(center, center, null);
      @include p-number(40px, 5px);
      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        backdrop-filter: blur(3px);
        z-index: -1;
        background: rgba(255, 255, 255, 0.5);

        // background-color: rgba(255,255,255,0.2);
      }
    }
  }
  .hall-to-img {
    width: 94px;
    height: 94px;
    position: fixed;
    top: 45px;
    right: 37px;
    z-index: 5;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
<style lang="scss">
.left-search-input {
  height: 100%;
  font-size: 30px;
  .el-input__wrapper {
    width: 100%;
    height: 100%;
    background-color: transparent;
    border: 0px;
    box-shadow: none;
    padding: 0px;
    .el-input__inner {
      font-family: FangSong, STSong !important;
      color: #333;
      &::placeholder {
        color: #666666;
        line-height: 42px;
      }
    }
  }
}
</style>
