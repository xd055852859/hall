<script setup lang="ts">
import { ElMessage } from "element-plus";
import leftArrowSvg from "@/assets/svg/leftArrow.svg";
import imgLocationSvg from "@/assets/svg/imgLocation.svg";
import imgSearchSvg from "@/assets/svg/imgSearch.svg";
import closeSvg from "@/assets/svg/close.svg";
import backSvg from "@/assets/svg/back.svg";
import { ArrowDown, ArrowRight, CircleClose } from "@element-plus/icons-vue";
import { storeToRefs } from "pinia";
import appStore from "@/store";
import { first } from "lodash";
import api from "@/services/api";
import { ResultProps } from "@/interface/Common";
import { Hall } from "@/interface/Hall";
const { hallList } = storeToRefs(appStore.hallStore);
const { getHallData } = appStore.hallStore;
const searchVisible = ref<boolean>(false);
const firstState = ref<boolean>(false);
const searchNameState = ref<string>("menu");
const searchProvinceState = ref<string>("list");
const searchState = ref<string>("province");
const searchList = ref<Hall[]>([]);
const enList = ref<string[]>(["All"]);
const nameList = ref<{ surname: string; count: number }[]>([]);
const provinceList = ref<{ province: string; count: number }[]>([]);
const cityList = ref<{ city: string; count: number }[]>([]);
const searchNameList = ref<{ surname: string; count: number }[]>([]);
const province = ref<string>("");
const city = ref<string>("");
const surname = ref<string>("");
const chooseBlphaIndex = ref<number>(0);
const chooseNameIndex = ref<number>(-1);
const chooseProvinceIndex = ref<number>(-1);
const chooseCityIndex = ref<number>(-1);

onMounted(() => {
  if (hallList.value.length === 0) {
    getHallData();
  }
});
const getProvinceData = async (surname) => {
  const dateRes = (await api.request.get("address/province", {
    surname: surname,
  })) as ResultProps;
  if (dateRes.msg === "OK") {
    // provinceList.value = dateRes.data.map((item) => {
    //   return item.replace("省", "").replace("市", "");
    // });
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
    // city.value = dateRes.data.map((item) => {
    //   return item.replace("市", "");
    // });
    cityList.value = sortArray(dateRes.data);
  }
};
const sortArray = (array) => {
  array.sort((a, b) => a.length - b.length);
  return array;
};
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
    let arr = dateRes.data.map((item) => item.toUpperCase());
    enList.value = ["All", ...arr];
  }
};
const searchData = () => {
  searchList.value = [];
  hallList.value.forEach((item, index) => {
    if (
      item.province?.includes(province.value) &&
      item.city?.includes(city.value) &&
      item.surname?.includes(surname.value)
    ) {
      searchList.value.push(item);
    }
  });
};
const searchNameData = async (name: string) => {
  const dateRes = (await api.request.get("surname/byBlpha", {
    alpha: name.toLowerCase(),
    province: province.value,
    city: city.value,
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

watch(
  [hallList],
  ([newList]) => {
    if (newList) {
      searchList.value = [...newList];
    }
  },
  { immediate: true }
);
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
watch([province, city, surname], ([newProvince, newCity, newName]) => {
  if (!newProvince && !newCity && !newName) {
    searchList.value = [...hallList.value];
  }
});
</script>
<template>
  <div class="hall-image">
    <div class="hall-image-header">
      <img
        class="hall-image-img"
        :src="leftArrowSvg"
        alt=""
        @click="$router.push('/')"
      />
      <div class="hall-image-title">探索祠堂</div>
      <div class="hall-image-subtitle">共收录{{ searchList.length }}座</div>
    </div>
    <div class="hall-image-container">
      <div
        class="hall-image-item"
        v-for="item in searchList"
        :key="item._key"
        @click="$router.push(`/hallDetail/${item._key}`)"
      >
        <div class="hall-item-top">
          <!-- :style="{
        width: imgWidth + 'px',
        height: imgWidth * 0.66 + 'px',
      }" -->
          <img
            :src="`${item.cover}_cover?imageView2/1/w/500`"
            alt=""
            v-if="item.cover"
          />
        </div>
        <div class="hall-item-bottom">
          <div class="hall-item-title">{{ item.name }}</div>
          <div class="hall-item-subtitle">{{ item.address }}</div>
        </div>
      </div>
    </div>
    <div class="hall-image-button">
      <img :src="imgLocationSvg" alt="" @click="$router.push('/hall')" />
      <img
        :src="imgSearchSvg"
        alt=""
        @click="
          searchVisible = true;
          firstState = true;
        "
      />
    </div>
    <div
      class="hall-image-search"
      :class="{
        'to-left': searchVisible,
        'to-right': !searchVisible && firstState,
      }"
    >
      <div class="image-search-title">
        高级检索
        <div class="search-title-close" @click="searchVisible = false">
          <img :src="closeSvg" alt="" />
        </div>
      </div>
      <div
        class="image-search-nav"
        @click="
          searchNameState = searchNameState === 'menu' ? 'list' : 'menu';
          searchProvinceState = 'list';
          searchState = 'province';
        "
      >
        <div class="search-box-title">
          {{ surname ? surname : "全部姓氏" }}
          <div
            class="search-box-close"
            @click.stop="
              surname = '';
              chooseBlphaIndex = 0;
              chooseNameIndex = -1;
            "
            v-if="surname"
          >
            <el-icon><CircleClose /></el-icon>
          </div>
        </div>
        <div class="search-box-icon" v-if="searchNameState === 'list'">
          <el-icon><ArrowRight /></el-icon>
        </div>
        <div class="search-box-icon" v-else>
          <el-icon><ArrowDown /></el-icon>
        </div>
      </div>
      <div class="image-search-subtitle" v-if="searchNameState !== 'list'">
        请选择姓氏
      </div>
      <div class="image-search-container" v-if="searchNameState !== 'list'">
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
              'search-container-fourth': item.surname.length === 4,
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
            "
          >
            <div class="container-item-top">{{ item.surname }}</div>
            <div class="container-item-bottom">{{ item.count }}</div>
          </div>
        </div>
      </div>
      <div
        class="image-search-nav"
        @click="
          searchProvinceState =
            searchProvinceState === 'menu' ? 'list' : 'menu';
          searchNameState = 'list';
        "
      >
        <div class="search-box-title">
          {{
            province ? (city ? `${province} > ${city}` : province) : "全部地点"
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
        <div class="search-box-icon" v-if="searchProvinceState === 'list'">
          <el-icon><ArrowRight /></el-icon>
        </div>
        <div class="search-box-icon" v-else>
          <el-icon><ArrowDown /></el-icon>
        </div>
      </div>
      <div class="image-search-subtitle" v-if="searchProvinceState !== 'list'">
        请选择{{ searchState === "province" ? "省份" : "城市" }}
        <div
          v-if="searchState === 'city'"
          class="dp-center-center icon-point"
          @click="
            searchState = 'province';
            chooseCityIndex = -1;
            city = '';
          "
        >
          <img
            :src="backSvg"
            alt=""
            style="width: 15px; height: 15px; margin-right: 5px"
          />
          返回上一级
        </div>
      </div>
      <div class="image-search-container" v-if="searchProvinceState !== 'list'">
        <div
          class="search-container-right"
          style="width: 100%"
          v-if="searchState === 'province'"
        >
          <div
            :class="{
              'search-container-fourth': item.province.length > 4,
            }"
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
            <div class="container-item-top">{{ item.province }}</div>
            <div class="container-item-bottom">{{ item.count }}</div>
          </div>
        </div>

        <div class="search-container-right" style="width: 100%" v-else>
          <div
            :class="{
              'search-container-fourth': item.city.length > 4,
            }"
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
            "
          >
            <div class="container-item-top">{{ item.city }}</div>
            <div class="container-item-bottom">{{ item.count }}</div>
          </div>
        </div>
      </div>
      <div
        class="image-search-button"
        @click="surname || province || city ? searchData() : null"
        :style="{ opacity: surname || province ? 1 : 0.5 }"
      >
        确定
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.hall-image {
  width: 100%;
  height: 100vh;
  padding-top: 44px;
  box-sizing: border-box;
  .hall-image-header {
    width: 100%;
    height: 66px;
    margin-bottom: 48px;
    padding-left: 37px;
    box-sizing: border-box;
    @include flex(flex-start, center, null);
    .hall-image-img {
      width: 94px;
      height: 94px;
    }
    .hall-image-title {
      font-size: 48px;
      font-weight: bold;
      color: #333333;
      margin: 0px 21px 0px 7px;
      margin-bottom: 10px;
    }
    .hall-image-subtitle {
      font-size: 20px;
      font-weight: 400;
      color: #666666;
    }
  }
  .hall-image-container {
    width: 100%;
    height: calc(100% - 158px);
    padding-left: 124px;
    box-sizing: border-box;
    align-content: flex-start;
    @include flex(flex-start, center, wrap);
    @include scroll();
    .hall-image-item {
      width: 530px;
      height: 447px;
      margin-right: 28px;
      background: rgba(255, 255, 255, 0.6);
      border: 1px solid #dddddd;
      border-radius: 6px;
      margin-bottom: 22px;
      cursor: pointer;

      .hall-item-top {
        width: 100%;
        height: 335px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .hall-item-bottom {
        width: 100%;
        height: 112px;
        padding: 14px 24px;
        box-sizing: border-box;
        .hall-item-title {
          width: 100%;
          height: 42px;
          font-size: 30px;
          font-weight: 700;
          color: #000000;
          line-height: 42px;
          margin-bottom: 10px;
        }
        .hall-item-subtitle {
          width: 120px;
          height: 28px;
          font-size: 20px;
          color: #666666;
          line-height: 28px;
        }
      }
      &:nth-child(3n) {
        margin-right: 0px;
      }
    }
  }
  .hall-image-button {
    width: 94px;
    height: 188px;
    position: fixed;
    top: 45px;
    right: 37px;
    z-index: 4;
    img {
      width: 94px;
      height: 94px;
      cursor: pointer;
    }
  }
  .hall-image-search {
    width: 500px;
    height: 100vh;
    position: absolute;
    top: 0px;
    right: -500px;
    z-index: 5;
    //  background-color: transparent;
    box-shadow: 0px 2px 6px 0px #46838d;
    padding: 31px 45px 0px 45px;
    box-sizing: border-box;
    .image-search-title {
      width: 100%;
      height: 56px;
      font-size: 40px;
      font-weight: 700;
      color: #333333;
      margin-bottom: 26px;
      @include flex(space-between, center, null);
      .search-title-close {
        width: 56px;
        height: 56px;
        cursor: pointer;
        img {
          width: 56px;
          height: 56px;
          margin-top: 10px;
          margin-left: 28px;
        }
      }
    }
    .image-search-nav {
      width: 100%;
      height: 60px;
      background: rgba(255, 255, 255, 0.5);
      border: 1px solid #ffffff;
      border-radius: 4px;
      box-sizing: border-box;
      padding: 9px 20px;
      box-sizing: border-box;
      margin-bottom: 20px;
      cursor: pointer;
      @include flex(space-between, center, null);
      .search-box-title {
        width: calc(100% - 30px);
        height: 100%;
        font-size: 30px;
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
    .image-search-subtitle {
      width: 100%;
      height: 35px;
      font-size: 20px;
      color: #fff;
      @include flex(space-between, center, null);
      padding: 0px 10px;
      box-sizing: border-box;
    }
    .image-search-container {
      width: 100%;
      height: calc(100% - 415px);
      box-sizing: border-box;
      margin-bottom: 20px;
      @include flex(space-between, center, null);
      .search-container-left {
        width: 85px;
        height: 100%;
        border-right: 1px solid #ffffff;
        padding-right: 14.5px;
        box-sizing: border-box;
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
    .image-search-button {
      width: calc(100% - 90px);
      height: 60px;
      background-color: #fff;
      border: 2px solid #84b840;
      border-radius: 4px;
      position: absolute;
      bottom: 40px;
      left: 45px;
      text-align: center;
      line-height: 60px;
      font-size: 30px;
      color: #87b940;
      cursor: pointer;
    }
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      backdrop-filter: blur(16px);
      z-index: -1;
      background: linear-gradient(
        0deg,
        rgba(145, 203, 215, 0.7),
        rgba(226, 250, 242, 0.7)
      );

      // background-color: rgba(255,255,255,0.2);
    }
  }
}
.to-left {
  animation: left 0.5s;
  animation-fill-mode: forwards;
}
.to-right {
  animation: right 0.5s;
  animation-fill-mode: forwards;
}
</style>
<style lang="scss">
@keyframes left {
  0% {
    right: -500px;
  }
  100% {
    right: 0px;
  }
}
@keyframes right {
  0% {
    right: 0px;
  }
  100% {
    right: -500px;
  }
}
</style>
