<script setup lang="ts">
import CMap from "@/components/map/cMap.vue";
import { ResultProps } from "@/interface/Common";
import { Hall } from "@/interface/Hall";
import api from "@/services/api";
import leftArrowSvg from "@/assets/svg/leftArrow.svg";
import backSvg from "@/assets/svg/back.svg";
import toImgSvg from "@/assets/svg/toImg.svg";
import {
  ArrowDown,
  ArrowRight,
  CircleClose,
  Back,
} from "@element-plus/icons-vue";

import hallItem from "./hallItem.vue";
import hallImage from "@/views/hallImage/hallImage.vue";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import appStore from "@/store";
import router from "@/router";
const { hallList } = storeToRefs(appStore.hallStore);
const { getHallData, setSearchHallList } = appStore.hallStore;
const province = ref<string>("");
const city = ref<string>("");
const surname = ref<string>("");

const searchList = ref<Hall[]>([]);
const nameList = ref<{ surname: string; count: number }[]>([]);
const searchNameList = ref<{ surname: string; count: number }[]>([]);
const searchState = ref<string>("province");
const leftRef = ref<any>(null);
const enList = ref<string[]>(["All"]);
const chooseIndex = ref<number>(0);
const changeState = ref<boolean>(false);
const nameVisible = ref<boolean>(false);
const provinceVisible = ref<boolean>(false);
const showState = ref<string>("map");
const zoomType = ref<string>("");
const addressList = ref<any>([]);
const provinceList = ref<
  { province: string; count: number; location: string[] }[]
>([]);
const cityList = ref<{ city: string; count: number; location: string[] }[]>([]);
const chooseBlphaIndex = ref<number>(0);
const chooseNameIndex = ref<number>(-1);
const chooseProvinceIndex = ref<number>(-1);
const chooseCityIndex = ref<number>(-1);
const mapRef = ref<any>(null);

onMounted(() => {
  if (hallList.value.length === 0) {
    getHallData();
  }
  //获取坐标
  getAddress("", "", "");
});

const getNameData = async (province, city) => {
  const dateRes = (await api.request.get("surname", {
    province: province,
    city: city,
  })) as ResultProps;
  if (dateRes.msg === "OK") {
    nameList.value = [...dateRes.data];
    chooseEn(0);
  }
};
const getEnData = async (province, city) => {
  const dateRes = (await api.request.get("surname/alpha", {
    province: province,
    city: city,
  })) as ResultProps;
  if (dateRes.msg === "OK") {
    enList.value = ["All", ...dateRes.data];
  }
};
const getProvinceData = async (surname) => {
  const dateRes = (await api.request.get("address/province", {
    surname: surname,
  })) as ResultProps;
  if (dateRes.msg === "OK") {
    provinceList.value = sortArray(dateRes.data);
  }
};
const getCityData = async (surname, province) => {
  searchState.value = "city";
  const dateRes = (await api.request.get("address/city", {
    surname: surname,
    province: province,
  })) as ResultProps;
  if (dateRes.msg === "OK") {
    cityList.value = sortArray(dateRes.data);
  }
};
const getAddress = async (province, city, surname) => {
  console.log(province, city, surname);
  const dateRes = (await api.request.get("address", {
    surname: surname,
    province: province,
    city: city,
  })) as ResultProps;
  if (dateRes.msg === "OK") {
    addressList.value = [];
    let arr: any = [];
    let addressArr: string[] = [];
    console.log(city);
    // if (city) {
    dateRes.data.forEach((item) => {
      if (item.location) {
        item.location = [
          (+item.location[0]).toFixed(3),
          (+item.location[1]).toFixed(3),
        ];
        let locationStr = item.location.join(",");
        let index = addressArr.indexOf(locationStr);
        if (index === -1) {
          addressArr.push(item.location.join(","));
          arr.push(item);
        } else {
          arr[index].count = arr[index].count + 1;
        }
      }
    });
    // } else {
    //   arr = [...dateRes.data];
    // }
    arr.forEach((item) => {
      if (item.location) {
        addressList.value.push(item);
      }
    });
    console.log(arr);
  }
};
const getAddressType = async (type) => {
  console.log(province, city, surname);
  const dateRes = (await api.request.get("address/map", {
    surname: surname.value,
    province: province.value,
    city: city.value,
    type: type,
  })) as ResultProps;
  if (dateRes.msg === "OK") {
    // let arr: any = [];
    // let addressArr: string[] = [];
    // if (city.value) {
    //   dateRes.data.forEach((item) => {
    //     let locationStr = item.location.join(",");
    //     let index = addressArr.indexOf(locationStr);
    //     if (index === -1) {
    //       addressArr.push(locationStr);
    //       arr.push(item);
    //     } else {
    //       arr[index].count = arr[index].count + 1;
    //     }
    //   });
    //   addressList.value = [...arr];
    // } else {
    addressList.value = [...dateRes.data];
    // }
    console.log(addressList.value);
  }
};
const searchData = (province, city, surname) => {
  searchList.value = [];
  hallList.value.forEach((item, index) => {
    if (
      item.province?.includes(province) &&
      item.city?.includes(city) &&
      item.surname?.includes(surname)
    ) {
      searchList.value.push(item);
    }
  });
  if (city) {
    mapRef.value.chickSearch({
      type: "city",
      lng: searchList.value[0].lng,
      lat: searchList.value[0].lat,
    });
  } else if (province) {
    mapRef.value.chickSearch({
      type: "province",
      lng: searchList.value[0].lng,
      lat: searchList.value[0].lat,
    });
  }
};
const searchNameData = async (name: string) => {
  const dateRes = (await api.request.get("surname/byBlpha", {
    alpha: name,
  })) as ResultProps;
  if (dateRes.msg === "OK") {
    searchNameList.value = [...dateRes.data];
  }
};
const chooseEn = (index: number) => {
  chooseBlphaIndex.value = index;
  if (index) {
    searchNameData(enList.value[index]);
  } else {
    searchNameList.value = [...nameList.value];
  }
};

const setMapValue = (parmas: { type: string; value: string }) => {
  console.log(parmas.value);
  switch (parmas.type) {
    case "province":
      province.value = parmas.value;
      console.log(parmas.value);
      break;
    case "city":
      city.value = parmas.value;
      break;
    case "single":
      router.push(`/hallDetail/${parmas.value}`);
      break;
    case "type":
      zoomType.value = parmas.value;
      break;
  }
};
const clearName = () => {
  surname.value = "";
  chooseBlphaIndex.value = 0;
  chooseNameIndex.value = -1;
  // if (showState.value === "map") {
  //   province.value = "";
  //   city.value = "";
  // }
};
const clearProvince = () => {
  searchState.value = "province";
  chooseCityIndex.value = -1;
  city.value = "";
};
const sortArray = (array) => {
  array.sort((a, b) => a.length - b.length);
  return array;
};
const clickMapMark = (parmas) => {
  mapRef.value.clickMarker(parmas.lnglat);
  addressList.value = [
    {
      count: 1,
      location: parmas.lnglat,
      name: parmas.item.name,
      type: "single",
      cover: parmas.item.cover,
      _key: parmas.item._key,
    },
  ];
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
watch([province, city, surname], ([newProvince, newCity, newName]) => {
  if (!newProvince && !newCity && !newName) {
    searchList.value = [...hallList.value];
  }
  getAddress(newProvince, newCity, newName);
});
watch(zoomType, (newType) => {
  console.log(newType);
  getAddressType(newType);
});
watch(
  surname,
  (newName) => {
    getProvinceData(newName);
  },
  { immediate: true }
);
watch(
  [province, city],
  ([newProvince, newCity]) => {
    getNameData(newProvince, newCity);
    getEnData(newProvince, newCity);
  },
  { immediate: true }
);
watch(
  hallList,
  (newList) => {
    if (newList.length > 0) {
      searchList.value = [...newList];
    }
  },
  { immediate: true }
);
watch(
  searchList,
  (newList) => {
    console.log("search", newList);
    setSearchHallList([...newList]);
  },
  { immediate: true }
);
watch(showState, () => {
  nameVisible.value = false;
  provinceVisible.value = false;
});
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
        <div class="hall-left-subtitle">共收录500座</div>
      </div>
      <div class="hall-left-container">
        <!--  :style="{
            height:
              nameVisible || provinceVisible
                ? showState === 'map'
                  ? '100%'
                  : 'calc(100% - 50px)'
                : showState === 'map'
                ? '50px'
                : '110px',
          }" -->
        <div
          class="hall-left-search"
          :style="{
            height:
              nameVisible || provinceVisible ? 'calc(100% - 50px)' : '110px',
          }"
        >
          <div
            class="hall-search-nav"
            @click="
              nameVisible = !nameVisible;
              provinceVisible = false;
              searchState = 'province';
            "
            style="margin-bottom: 20px"
          >
            <div class="search-box-title">
              {{ surname ? surname : "全部姓氏" }}
              <!-- {{ province && showState === "map" ? province : "" }}
              {{ city && showState === "map" ? " > " + city : "" }}
              {{
                (!surname && !province && !city && showState === "map") ||
                (!surname && showState === "image")
                  ? "全部姓氏"
                  : ""
              }} -->
              <div
                class="search-box-close"
                @click.stop="clearName()"
                v-if="surname"
              >
                <el-icon><CircleClose /></el-icon>
              </div>
            </div>
            <div class="search-box-icon" v-if="nameVisible">
              <el-icon><ArrowDown /></el-icon>
            </div>
            <div class="search-box-icon" v-else>
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
          <div class="hall-search-box" v-if="nameVisible">
            <div class="hall-search-container">
              <div class="search-container-left">
                <div
                  class="search-container-choose"
                  v-for="(item, index) in enList"
                  :key="`en${index}`"
                  @click="chooseEn(index)"
                  :style="
                    index === chooseBlphaIndex
                      ? { color: '#84b840', border: '2px solid #84b840' }
                      : {}
                  "
                >
                  {{ item }}
                </div>
              </div>
              <div class="search-container-right">
                <div
                  :class="{
                    'search-container-second': item.surname.length === 2,
                    'search-container-fourth': item.surname.length >= 4,
                  }"
                  class="search-container-item"
                  v-for="(item, index) in searchNameList"
                  :style="
                    index === chooseNameIndex
                      ? { color: '#84b840', border: '2px solid #84b840' }
                      : {}
                  "
                  :key="`searchName${index}`"
                  @click="
                    surname = item.surname;
                    chooseNameIndex = index;
                    nameVisible = false;
                  "
                >
                  <div class="container-item-top">{{ item.surname }}</div>
                  <div class="container-item-bottom">{{ item.count }}</div>
                </div>
              </div>
            </div>
          </div>

          <!--<template v-if="showState === 'image'"> -->
          <div
            class="hall-search-nav"
            @click="
              provinceVisible = !provinceVisible;
              nameVisible = false;
            "
          >
            <div class="search-box-title">
              {{
                province
                  ? city
                    ? `${province} > ${city}`
                    : province
                  : "全部地点"
              }}
              <div
                class="search-box-close"
                @click.stop="
                  province = '';
                  city = '';
                  chooseProvinceIndex = -1;
                  chooseCityIndex = -1;
                  searchState = 'province';
                "
                v-if="province"
              >
                <el-icon><CircleClose /></el-icon>
              </div>
            </div>
            <div class="search-box-icon" v-if="provinceVisible">
              <el-icon><ArrowDown /></el-icon>
            </div>
            <div class="search-box-icon" v-else>
              <el-icon><ArrowRight /></el-icon>
            </div>
          </div>
          <div class="hall-search-box" v-if="provinceVisible">
            <div class="hall-search-subtitle" v-if="provinceVisible">
              请选择{{ searchState === "province" ? "省份" : "城市" }}
              <div
                v-if="searchState === 'city'"
                class="dp-center-center icon-point"
                @click="clearProvince()"
              >
                <!-- <img
                  :src="backSvg"
                  alt=""
                  style="width: 15px; height: 15px; margin-right: 5px"
                /> -->
                <el-icon :size="15" style="margin-right: 5px"><Back /></el-icon>
                返回上一级
              </div>
            </div>
            <div class="hall-search-container" v-if="provinceVisible">
              <div
                class="search-container-right"
                style="width: 100%"
                v-if="searchState === 'province'"
              >
                <!--   :class="{
                    'search-container-fourth':
                      item.province.slice(0, 2).length > 4,
                  }" -->
                <div
                  class="search-container-item province-item"
                  v-for="(item, index) in provinceList"
                  :key="`province${index}`"
                  :style="
                    index === chooseProvinceIndex
                      ? { color: '#84b840', border: '2px solid #84b840' }
                      : {}
                  "
                  @click="
                    province = item.province;
                    chooseProvinceIndex = index;
                    getCityData(surname, province);
                  "
                >
                  <div class="container-item-top">
                    {{ item.province.slice(0, 2) }}
                  </div>
                  <div class="container-item-bottom">{{ item.count }}</div>
                </div>
              </div>

              <div class="search-container-right" style="width: 100%" v-else>
                <!--  :class="{
                    'search-container-fourth': item.city.slice(0, 2).length > 4,
                  }" -->
                <div
                  class="search-container-item province-item"
                  v-for="(item, index) in cityList"
                  :key="`city${index}`"
                  :style="
                    index === chooseCityIndex
                      ? { color: '#84b840', border: '2px solid #84b840' }
                      : {}
                  "
                  @click="
                    city = item.city;
                    chooseCityIndex = index;
                    provinceVisible = false;
                  "
                >
                  <div class="container-item-top">
                    {{ item.city.slice(0, 2) }}
                  </div>
                  <div class="container-item-bottom">{{ item.count }}</div>
                </div>
              </div>
            </div>
          </div>
          <!-- </template>-->
        </div>
        <div class="hall-box" v-if="showState === 'map'">
          <hall-item :list="searchList" @clickMapMark="clickMapMark" />
        </div>
      </div>
    </div>

    <div class="hall-right">
      <CMap
        :mapId="'hallMap'"
        :width="'100%'"
        :height="'100%'"
        :cMapData="addressList"
        :changeState="changeState"
        @setMapValue="setMapValue"
        ref="mapRef"
        v-if="addressList.length > 0"
      />
      <hallImage :list="searchList" v-if="showState === 'image'" />
    </div>
    <div
      class="hall-message-box"
      v-if="(surname || province || city) && showState !== 'image'"
    >
      <div class="hall-message">
        {{ surname ? surname + "氏" : "" }} {{ province ? province : "" }}
        {{ city ? city : "" }} 共收录{{ searchList.length }}座祠堂
      </div>
    </div>
    <div
      class="hall-to-img"
      @click="showState = showState === 'map' ? 'image' : 'map'"
    >
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
  @include flex(space-between, center, null);
  .hall-left {
    width: 500px;
    height: 100vh;
    position: relative;
    // top: 0px;
    // left: 0px;
    z-index: 1;
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

    .hall-left-container {
      width: 100%;
      height: calc(100% - 105px);
      padding-left: 45px;
      box-sizing: border-box;
      .hall-left-search {
        width: calc(100% - 45px);
        border-radius: 4px;
        margin: 21px 45px 33px 0px;
        box-sizing: border-box;
        position: relative;
        z-index: 1;
        cursor: pointer;
        .hall-search-nav {
          width: 100%;
          height: 60px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.5);
          box-sizing: border-box;
          padding: 9px 20px;
          box-sizing: border-box;
          border: 1px solid #ffffff;
          cursor: pointer;
          @include flex(space-between, center, null);
          .search-box-title {
            width: calc(100% - 30px);
            height: 100%;
            font-size: 25px;
            position: relative;
            z-index: 1;
            @include flex(space-between, center, null);
            .search-box-close {
              width: 40px;
              height: 40px;
              margin-top: 10px;
            }
          }
          .search-box-icon {
            width: 15px;
            height: 8.5px;
            flex-shrink: 0;
            @include flex(center, center, null);
          }
        }
        .hall-search-box {
          width: 100%;
          height: calc(100% - 140px);
          .hall-search-subtitle {
            width: 100%;
            height: 45px;
            font-size: 20px;
            color: #333;
            @include flex(space-between, center, null);
            padding: 0px 10px;
            box-sizing: border-box;
          }
          .hall-search-container {
            width: 100%;
            height: calc(100% - 20px);
            box-sizing: border-box;
            margin-bottom: 20px;
            @include flex(space-between, center, null);
            .search-container-left {
              width: 85px;
              height: 100%;
              border-right: 1px solid #ffffff;
              padding-right: 14.5px;
              box-sizing: border-box;
              align-content: flex-start;
              @include scroll();
              @include flex(center, center, wrap);
              .search-container-choose {
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
              &::-webkit-scrollbar {
                width: 0px;
                height: 0px;
              }
            }
            .search-container-right {
              width: calc(100% - 70px);
              height: 100%;
              border-right: 1px solid #ffffff;
              padding-left: 10px;
              align-content: flex-start;
              @include scroll();
              @include flex(flex-start, center, wrap);
              .search-container-item {
                width: 68px;
                height: 98px;
                margin-right: 10px;
                background: rgba(255, 255, 255, 0.8);
                border-radius: 4px;
                margin-top: 10px;
                color: #333333;
                cursor: pointer;
                @include p-number(10px, 10px);
                .container-item-top {
                  width: 100%;
                  height: 45px;
                  @include flex(center, center, null);
                  text-align: center;
                  font-size: 30px;
                  text-align: center;
                }
                .container-item-bottom {
                  width: 100%;
                  height: 35px;
                  font-size: 20px;
                  text-align: center;
                  line-height: 35px;
                  color: #999999;
                }
              }
              .province-item {
                width: 120px;
              }
              .search-container-second {
                width: 146px;
              }
              .search-container-fourth {
                width: 100%;
              }
              &::-webkit-scrollbar {
                width: 0px;
                height: 0px;
              }
            }
          }
        }
      }
      .hall-box {
        width: 100%;
        height: calc(100% - 210px);
        @include scroll();
      }
      // .hall-name {
      //   width: 100%;
      //   height: 100%;
      //   padding-right: 45px;
      //   box-sizing: border-box;
      //   @include flex(space-between, center, null);
      //   .hall-name-left {
      //     width: 85px;
      //     height: 100%;
      //     border-right: 1px solid #ffffff;
      //     padding-right: 14.5px;
      //     box-sizing: border-box;
      //     @include scroll();
      //     @include flex(center, center, wrap);
      //     .hall-name-choose {
      //       width: 70px;
      //       height: 70px;
      //       margin-bottom: 10px;
      //       background: rgba(255, 255, 255, 0.8);
      //       border-radius: 4px;
      //       color: #999999;
      //       text-align: center;
      //       font-size: 30px;
      //       line-height: 70px;
      //       font-family: yahei !important;
      //       cursor: pointer;
      //     }
      //   }
      //   .hall-name-right {
      //     width: calc(100% - 70px);
      //     height: 100%;
      //     border-right: 1px solid #ffffff;
      //     padding-left: 10px;
      //     align-content: flex-start;
      //     @include scroll();
      //     @include flex(flex-start, center, wrap);
      //     .hall-name-item {
      //       width: 68px;
      //       height: 98px;
      //       margin-right: 10px;
      //       background: rgba(255, 255, 255, 0.8);
      //       border-radius: 4px;
      //       margin-top: 10px;
      //       cursor: pointer;
      //       @include p-number(10px, 10px);
      //       .name-item-top {
      //         width: 100%;
      //         height: 45px;
      //         @include flex(center, center, null);
      //         text-align: center;
      //         font-size: 30px;
      //         text-align: center;
      //         color: #333333;
      //       }
      //       .name-item-bottom {
      //         width: 100%;
      //         height: 35px;
      //         font-size: 20px;
      //         text-align: center;
      //         line-height: 35px;
      //         color: #999999;
      //       }
      //     }
      //     .hall-name-second {
      //       width: 146px;
      //     }
      //     .hall-name-fourth {
      //       width: 100%;
      //     }
      //   }
      // }
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
  .hall-right {
    width: calc(100% - 500px);
    height: 100%;
    position: relative;
    z-index: 1;
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
