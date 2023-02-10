<script setup lang="ts">
import CMap from "@/components/map/cMap.vue";
import { ResultProps } from "@/interface/Common";
import { Hall } from "@/interface/Hall";
import api from "@/services/api";
import leftArrowSvg from "@/assets/svg/leftArrow.svg";
import searchCloseSvg from "@/assets/svg/searchClose.svg";
import toImgSvg from "@/assets/svg/toImg.svg";
import {
  ArrowDown,
  ArrowRight,
  CircleClose,
  Back,
} from "@element-plus/icons-vue";

import hallItem from "./hallItem.vue";
import hallImage from "@/views/hallImage/hallImage.vue";
import hallDetail from "@/views/hallDetail/hallDetail.vue";
import { ElMessage } from "element-plus";
import { storeToRefs } from "pinia";
import appStore from "@/store";
import router from "@/router";
import { onClickOutside } from "@vueuse/core";

const { hallList } = storeToRefs(appStore.hallStore);
const { getHallData, setSearchHallList } = appStore.hallStore;
const province = ref<string>("");
const city = ref<string>("");
const surname = ref<string>("");
const category = ref<string>("");
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
const categoryVisible = ref<boolean>(false);
const showState = ref<string>("map");
const zoomType = ref<string>("");
const addressList = ref<any>([]);
const provinceList = ref<
  { province: string; count: number; location: string[] }[]
>([]);
const categoryList = ref<{ category: string; count: number }[]>([]);
const cityList = ref<{ city: string; count: number; location: string[] }[]>([]);
const chooseBlphaIndex = ref<number>(0);

const chooseCityIndex = ref<number>(-1);
const mapRef = ref<any>(null);
const searchRef = ref(null);
const hallDetailVisible = ref<boolean>(false);
const hallDetailKey = ref<string>("");
onMounted(() => {
  if (hallList.value.length === 0) {
    getHallData();
  }
  //获取坐标
  getAddress("", "", "", "");
});

const getNameData = async (province, city, category) => {
  const dateRes = (await api.request.get("surname", {
    province: province,
    city: city,
    category: category,
  })) as ResultProps;
  if (dateRes.msg === "OK") {
    nameList.value = [...dateRes.data];
    chooseEn(0);
  }
};
const getEnData = async (province, city, category) => {
  const dateRes = (await api.request.get("surname/alpha", {
    province: province,
    city: city,
    category: category,
  })) as ResultProps;
  if (dateRes.msg === "OK") {
    enList.value = ["All", ...dateRes.data];
  }
};
const getProvinceData = async (surname, category) => {
  const dateRes = (await api.request.get("address/province", {
    surname: surname,
    category: category,
  })) as ResultProps;
  if (dateRes.msg === "OK") {
    provinceList.value = sortArray(dateRes.data);
  }
};
const getCityData = async (surname, province, category) => {
  searchState.value = "city";
  const dateRes = (await api.request.get("address/city", {
    surname: surname,
    category: category,
    province: province,
  })) as ResultProps;
  if (dateRes.msg === "OK") {
    cityList.value = sortArray(dateRes.data);
  }
};
const getCategoryData = async (surname, province, city) => {
  const dateRes = (await api.request.get("hall/category", {
    surname: surname,
    province: province,
    city: city,
  })) as ResultProps;
  if (dateRes.msg === "OK") {
    categoryList.value = sortArray(dateRes.data);
  }
};
const getAddress = async (province, city, surname, category) => {
  console.log(province, city, surname);
  const dateRes = (await api.request.get("address", {
    surname: surname,
    province: province,
    city: city,
    category: category,
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
const searchData = (province, city, surname, category) => {
  searchList.value = [];
  hallList.value.forEach((item, index) => {
    if (
      item.province?.includes(province) &&
      item.city?.includes(city) &&
      item.surname?.includes(surname) &&
      item.category?.includes(category)
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
const searchNameData = async (
  name: string,
  province?: string,
  city?: string,
  category?: string
) => {
  const dateRes = (await api.request.get("surname/byBlpha", {
    alpha: name,
    province: province,
    city: city,
    category: category,
  })) as ResultProps;
  if (dateRes.msg === "OK") {
    searchNameList.value = [...dateRes.data];
  }
};
const chooseEn = (index: number) => {
  chooseBlphaIndex.value = index;
  if (index) {
    searchNameData(
      enList.value[index],
      province.value,
      city.value,
      category.value
    );
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
      chooseHall(parmas.value);
      // router.push(`/hallDetail/${parmas.value}`);
      break;
    case "type":
      zoomType.value = parmas.value;
      break;
  }
};
const chooseHall = (key) => {
  hallDetailVisible.value = true;
  hallDetailKey.value = key;
};
const clearName = () => {
  surname.value = "";
  chooseBlphaIndex.value = 0;
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

onClickOutside(searchRef, () => {
  nameVisible.value = false;
  provinceVisible.value = false;
  categoryVisible.value = false;
});

// watch(
//   [province, city, surname, category],
//   ([newProvince, newCity, newSurname, newCategroy]) => {
//     searchData(newProvince, newCity, newSurname, newCategroy);
//   }
// );
// watch(surname, () => {
//   if (surname) {
//     province.value = "";
//     city.value = "";
//   }
// });
watch(
  [province, city, surname, category],
  ([newProvince, newCity, newName, newCategroy]) => {
    if (!newProvince && !newCity && !newName && !newCategroy) {
      searchList.value = [...hallList.value];
    } else {
      searchData(newProvince, newCity, newName, newCategroy);
    }
    getAddress(newProvince, newCity, newName, newCategroy);
  }
);
watch(zoomType, (newType) => {
  console.log(newType);
  getAddressType(newType);
});
watch(
  [surname, category],
  ([newName, newCategroy]) => {
    getProvinceData(newName, newCategroy);
  },
  { immediate: true }
);
watch(
  [province, city, category],
  ([newProvince, newCity, newCategroy]) => {
    getNameData(newProvince, newCity, newCategroy);
    getEnData(newProvince, newCity, newCategroy);
  },
  { immediate: true }
);
watch(
  [province, city, surname],
  ([newProvince, newCity, newName]) => {
    getCategoryData(newName, newProvince, newCity);
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
        <div class="hall-left-search" ref="searchRef">
          <el-popover
            trigger="click"
            :offset="8"
            :show-arrow="false"
            popper-class="hall-left-surname"
            :visible="nameVisible"
            :teleported="false"
          >
            <template #reference>
              <div
                class="search-box-title"
                @click="
                  nameVisible = true;
                  provinceVisible = false;
                  categoryVisible = false;
                "
                :style="{
                  border: surname ? '1px solid #84B840' : '1px solid #999',
                }"
              >
                {{ surname ? surname : "姓氏" }}
              </div>
            </template>
            <template #default>
              <div class="hall-search-container hall-search-box-surname">
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
                      item.surname === surname
                        ? { color: '#84b840', border: '2px solid #84b840' }
                        : {}
                    "
                    :key="`searchName${index}`"
                    @click="
                      surname = item.surname;
                      nameVisible = false;
                    "
                  >
                    <div class="container-item-top">{{ item.surname }}</div>
                    <div class="container-item-bottom">{{ item.count }}</div>
                  </div>
                </div>
              </div>
            </template>
          </el-popover>
          <el-popover
            trigger="click"
            :show-arrow="false"
            :offset="8"
            popper-class="hall-left-province"
            :visible="provinceVisible"
            :teleported="false"
          >
            <template #reference>
              <div
                class="search-box-title"
                @click="
                  nameVisible = false;
                  provinceVisible = true;
                  categoryVisible = false;
                "
                :style="{
                  border: province ? '1px solid #84B840' : '1px solid #999',
                }"
              >
                {{
                  province
                    ? city
                      ? city.slice(0, 2)
                      : province.slice(0, 2)
                    : "地点"
                }}
              </div>
            </template>
            <template #default>
              <div class="hall-search-box">
                <div class="hall-search-subtitle">
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
                    <el-icon :size="15" style="margin-right: 5px"
                      ><Back
                    /></el-icon>
                    返回上一级
                  </div>
                </div>
                <div class="hall-search-container">
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
                        province === item.province
                          ? { color: '#84b840', border: '2px solid #84b840' }
                          : {}
                      "
                      @click="
                        province = item.province;
                        getCityData(surname, province, category);
                      "
                    >
                      <div class="container-item-top">
                        {{ item.province.slice(0, 2) }}
                      </div>
                      <div class="container-item-bottom">{{ item.count }}</div>
                    </div>
                  </div>

                  <div
                    class="search-container-right"
                    style="width: 100%"
                    v-else
                  >
                    <!--  :class="{
                    'search-container-fourth': item.city.slice(0, 2).length > 4,
                  }" -->
                    <div
                      class="search-container-item province-item"
                      v-for="(item, index) in cityList"
                      :key="`city${index}`"
                      :style="
                        item.city === city
                          ? { color: '#84b840', border: '2px solid #84b840' }
                          : {}
                      "
                      @click="
                        city = item.city;
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
            </template>
          </el-popover>
          <el-popover
            trigger="click"
            :offset="8"
            :show-arrow="false"
            popper-class="hall-left-category"
            :visible="categoryVisible"
            :teleported="false"
          >
            <template #reference>
              <div
                class="search-box-title"
                @click="
                  nameVisible = false;
                  provinceVisible = false;
                  categoryVisible = true;
                "
                :style="{
                  border: category ? '1px solid #84B840' : '1px solid #999',
                }"
              >
                {{ category ? category.slice(0, 2) : "分类" }}
              </div>
            </template>
            <template #default>
              <div class="hall-search-container hall-search-box-category">
                <div class="search-container-right" style="width: 100%">
                  <!--   :class="{
                    'search-container-fourth':
                      item.province.slice(0, 2).length > 4,
                  }" -->
                  <div
                    class="search-container-item province-item"
                    v-for="(item, index) in categoryList"
                    :key="`province${index}`"
                    :style="
                      item.category === category
                        ? { color: '#84b840', border: '2px solid #84b840' }
                        : {}
                    "
                    @click="
                      category = item.category;
                      categoryVisible = false;
                    "
                  >
                    <div class="container-item-top">
                      {{ item.category.slice(0, 2) }}
                    </div>
                    <div class="container-item-bottom">{{ item.count }}</div>
                  </div>
                </div>
              </div>
            </template>
          </el-popover>
        </div>
        <div class="hall-left-clean" v-if="surname || province || category">
          已选 :
          <div class="hall-clean-item" v-if="surname" @click="clearName()">
            {{ surname }}
            <img :src="searchCloseSvg" alt="" class="hall-clean-img" />
          </div>
          <div
            class="hall-clean-item"
            v-if="province"
            @click="
              province = '';
              clearProvince();
            "
          >
            {{
              city
                ? `${province.slice(0, 2)} > ${city.slice(0, 2)}`
                : province.slice(0, 2)
            }}
            <img :src="searchCloseSvg" alt="" class="hall-clean-img" />
          </div>
          <div class="hall-clean-item" v-if="category" @click="category = ''">
            {{ category.slice(0, 2) }}
            <img :src="searchCloseSvg" alt="" class="hall-clean-img" />
          </div>
        </div>
        <div
          class="hall-box"
          v-if="showState === 'map'"
          :class="{
            'hall-box-noclean': !surname && !province && !category,
            'hall-box-clean': surname || province || category,
          }"
        >
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
      <hallImage
        :list="searchList"
        v-if="showState === 'image'"
        @chooseHall="chooseHall"
      />
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
  <div v-if="hallDetailVisible" class="hall-detail-full">
    <hallDetail @close="hallDetailVisible = false" :id="hallDetailKey" />
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
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 5;
    //  background-color: transparent;
    box-shadow: 0px 2px 6px 0px #999;
    .hall-left-header {
      width: 100%;
      height: 94px;
      @include flex(flex-start, center, null);
      margin-top: 36px;
      box-sizing: border-box;
      padding-left: 23px;
      .hall-left-img {
        width: 94px;
        height: 94px;
      }
      .hall-left-title {
        font-size: 48px;
        font-weight: bold;
        color: #333333;
        margin-left: 7px;
        margin-right: 10px;
        margin-bottom: 10px;
      }
      .hall-left-subtitle {
        font-size: 20px;
        font-weight: 400;
        color: #666666;
      }
    }

    .hall-left-container {
      width: 100%;
      height: calc(100% - 85px);
      padding-left: 37px;
      box-sizing: border-box;
      .hall-left-search {
        width: 100%;
        border-radius: 4px;
        box-sizing: border-box;
        position: relative;
        z-index: 1;
        height: 60px;
        margin-top: 21px;
        cursor: pointer;
        @include flex(null, center, null);

        .search-box-title {
          width: 120px;
          height: 60px;
          cursor: pointer;
          font-size: 30px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 4px;
          margin-right: 20px;
          font-weight: 700;
          text-align: center;
          color: #666666;
          @include flex(center, center, null);
        }
      }
      .hall-left-search-show {
        height: calc(100% - 50px);
      }
      .hall-left-clean {
        width: 100%;
        height: 33px;
        font-size: 24px;
        color: #000000;
        line-height: 33px;
        margin-top: 10px;
        @include flex(null, center, null);
        .hall-clean-item {
          margin-left: 16px;
          cursor: pointer;
          @include flex(center, center, null);
          .hall-clean-img {
            width: 20px;
            height: 20px;
            margin-left:10px;
          }
        }
      }
      .hall-box {
        width: 100%;
        margin-top: 33px;
        @include scroll();
      }
      .hall-box-noclean {
        width: 100%;
        height: calc(100% - 140px);
        @include scroll();
      }
      .hall-box-clean {
        width: 100%;
        height: calc(100% - 185px);
        @include scroll();
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
      // background: linear-gradient(
      //   0deg,
      //   rgba(145, 203, 215, 0.7),
      //   rgba(226, 250, 242, 0.7)
      // );
      background-color: rgba(255, 255, 255, 0.5);
    }
  }
  .hall-right {
    width: 100%;
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
.hall-detail-full {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 100;
}
.hall-search-container {
  width: 480px;
  height: calc(100vh - 235px);
  box-sizing: border-box;
  @include flex(space-between, center, null);
  .search-container-left {
    width: 85px;
    height: 100%;
    border-right: 1px solid #999999;
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
      width: 22%;
      height: 98px;
      margin-right: 10px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 4px;
      border: 1px solid #999999;
      margin-bottom: 10px;
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
    .search-container-second {
      width: calc(45% + 10px);
    }
    .search-container-fourth {
      width: 100%;
    }
  }
}
.hall-search-box {
  width: 480px;
  height: calc(100vh - 235px);
  padding: 20px;
  box-sizing: border-box;

  .hall-search-subtitle {
    width: 100%;
    height: 25px;
    font-size: 20px;
    color: #333;
    @include flex(space-between, center, null);
    padding: 0px 10px;
    box-sizing: border-box;
    margin-bottom: 10px;
  }
  .hall-search-container {
    width: 100%;
    height: calc(100% - 30px);
    @include scroll();
    .province-item {
      width: 22.5%;
    }
  }
}
.hall-search-box-category {
  height: 260px;
  padding: 20px 10px;
  box-sizing: border-box;
}
.hall-search-box-surname {
  padding: 20px;
  box-sizing: border-box;
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
.hall-left-province {
  width: 480px !important;
  left: 5px !important;
  padding: 0px !important;
}
.hall-left-surname {
  width: 480px !important;
  left: 5px !important;
  padding: 0px !important;
}
.hall-left-category {
  width: 480px !important;
  left: -135px !important;
  padding: 0px !important;
}
</style>
