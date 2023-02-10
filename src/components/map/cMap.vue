<script setup lang="ts">
import AMapLoader from "@amap/amap-jsapi-loader";
import { commonMapData } from "./cMap";
import buildPng from "@/assets/img/build.png";
import pointPng from "@/assets/img/point.png";
import { Hall } from "@/interface/Hall";
import appStore from "@/store";
import { storeToRefs } from "pinia";
const { hallList } = storeToRefs(appStore.hallStore);
const props = defineProps<{
  mapId: string;
  width: string;
  height: string;
  cMapData: Hall[];
  changeState: boolean;
}>();
const emits = defineEmits<{
  (e: "setMapValue", parmas: { type: string; value: string }): void;
}>();
const amap = shallowRef<any>(null);
const amapData = shallowRef<any>(null);
const markers = shallowRef<any>([]);
const LabelsData = ref<any>([]);
const randomIndex = ref<number>(0);
const timer1 = ref<any>(null);
const timer2 = ref<any>(null);
const timer3 = ref<any>(null);
const originZoom = ref<number>(0);
const zoomType = ref<string>("move");
const count = ref<number>(0);
onMounted(() => {
  formatData(props.cMapData);
  initMap(props.cMapData);
});
onUnmounted(() => {
  if (amap.value) {
    // amap.value.clearEvents("click");
    if (markers.value) {
      amap.value.remove(markers.value);
      markers.value = null;
    }
    amapData.value = null;
    amap.value.destroy();
    amap.value = null;
    if (timer1.value) {
      clearInterval(timer1.value);
      timer1.value = null;
    }
    if (timer2.value) {
      clearTimeout(timer2.value);
      timer2.value = null;
    }
    if (timer3.value) {
      clearTimeout(timer3.value);
      timer3.value = null;
    }
  }
});

const formatData = (newData) => {
  for (let i = 0; i < commonMapData.districts.length; i++) {
    let config: any = {
      name: "",
      position: [116.12, 39.11],
      zooms: [1, 4.7],
      zIndex: 1,
      opacity: 1,
      text: {
        content: "",
        direction: "center",
        offset: [0, 0],
        zooms: [1, 4.5],
        style: {
          fontSize: 14,
          fontWeight: "normal",
          fillColor: "#333",
          strokeWidth: 2,
        },
      },
    };
    let district = commonMapData.districts[i];
    let name = district.name;
    config.text.content = name;
    config.position = district.center.split(",");
    if (commonMapData.directions[name]) {
      config.text.direction = commonMapData.directions[name];
    }
    LabelsData.value.push(config);
  }
};

const initMap = (newData) => {
  AMapLoader.load({
    key: "70beeffb8fc9537f6d450fd3747b70c9", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "1.4.15", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.Geocoder", "AMap.DistrictSearch", "AMap.MarkerClusterer"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      amap.value = new AMap.Map(props.mapId, {
        center: [92, 38],
        showIndoorMap: false,
        zoom: 4.5,
        zooms: [4.5, 9],
        // isHotspot: false,
        // defaultCursor: "pointer",
        // touchZoomCenter: 1,
        mapStyle: "amap://styles/61aa41120d9281ca215a0244f9186e18", //设置地图的显示样式
        pitch: 0,
        // layers: [disCountry, new AMap.createDefaultLayer()],
        viewMode: "3D",
      });

      amap.value.on("complete", function () {
        var layer = new AMap.LabelsLayer({
          // 开启标注避让，默认为开启，v1.4.15 新增属性
          collision: false,
          // 开启标注淡入动画，默认为开启，v1.4.15 新增属性
          animation: true,
        });
        for (var i = 0; i < LabelsData.value.length; i++) {
          var labelsMarker = new AMap.LabelMarker(LabelsData.value[i]);
          layer.add(labelsMarker);
        }
        amap.value.add(layer);
        amapData.value = AMap;
        console.log(newData);
        setMarkers(newData);
        // amap.value.setFitView();
        amap.value.panTo([95, 38.5]);
        // originZoom.value=amap.value.getZoom()
        // amap.value.setZoom(amap.value.getZoom() + 0.4);
        amap.value.on("zoomchange", mapZoom);
      });
    })
    .catch((e) => {
      console.log(e);
    });
};
const setMarkers = (pointArray) => {
  if (markers.value.length > 0) {
    amap.value.remove(markers.value);
    markers.value = [];
  }
  for (var i = 0; i < pointArray.length; i += 1) {
    console.log(pointArray[i].count);
    let marker = new amapData.value.Marker({
      position: pointArray[i].location,
      content: `<div class="map-clusterMarker">
          ${
            pointArray[i].count > 1
              ? `<div class="map-point-box" style="background-image:url(${pointPng});zoom:${
                  pointArray[i].cover ? 2 : 1
                };left: ${pointArray[i].cover ? "-10px" : "0px"}">
            <div class="map-point">${
              pointArray[i].cover
                ? `<img src="${pointArray[i].cover}_cover?imageView2/1/w/100">`
                : pointArray[i].count
            }
              </div>  
          </div>`
              : ""
          }
        <img src="${buildPng}" class="map-build"/>
        </div>`,
      extData: {
        ...pointArray[i],
      },
    });
    //
    marker.on("click", clickMarkers);
    markers.value.push(marker);
  }
  console.log(markers.value);
  amap.value.add(markers.value);
};
const clickMarkers = (e) => {
  if (e.target?.w?.extData) {
    zoomType.value = "click";
    switch (e.target?.w?.extData?.type) {
      case "province":
        emits("setMapValue", {
          type: "province",
          value: e.target?.w?.extData?.name,
        });
        amap.value.setCenter([e.lnglat.lng, e.lnglat.lat]);
        amap.value.setZoom(6.5);
        // amap.value.panBy(300, 0);
        // amap.value.setFitView();
        break;
      case "city":
        emits("setMapValue", {
          type: "city",
          value: e.target?.w?.extData?.name,
        });
        amap.value.setCenter([e.lnglat.lng, e.lnglat.lat]);
        amap.value.setZoom(8.5);
        // amap.value.panBy(300, 0);
        break;
      case "single":
        emits("setMapValue", {
          type: "single",
          value: e.target?.w?.extData?._key,
        });
        amap.value.setCenter([e.lnglat.lng, e.lnglat.lat]);
        amap.value.setZoom(9);
        break;
    }
    console.log("click");
    timer3.value = setTimeout(() => {
      zoomType.value = "move";
    }, 2000);
  }
};
const chickSearch = (obj) => {
  if (obj) {
    zoomType.value = "click";
    switch (obj.type) {
      case "province":
        amap.value.setCenter([obj.lng, obj.lat]);
        amap.value.setZoom(6.5);
        // amap.value.panBy(300, 0);
        // amap.value.setFitView();
        break;
      case "city":
        amap.value.setCenter([obj.lng, obj.lat]);
        amap.value.setZoom(8.5);
        // amap.value.panBy(300, 0);
        break;
    }
    timer3.value = setTimeout(() => {
      zoomType.value = "move";
    }, 2000);
  }
};
const mapZoom = () => {
  if (zoomType.value === "move") {
    console.log(amap.value.getZoom());
    if (amap.value.getZoom() <= 6.5) {
      emits("setMapValue", { type: "type", value: "province" });
      //省
    } else if (amap.value.getZoom() > 6.5 && amap.value.getZoom() <= 8) {
      emits("setMapValue", { type: "type", value: "city" });
      //市
    } else if (amap.value.getZoom() == 9) {
      emits("setMapValue", { type: "type", value: "single" });
    }
  }
};
const clickMarker = (lnglat) => {
  zoomType.value = "click";
  amap.value.setCenter(lnglat);
  amap.value.setZoom(9);
  timer3.value = setTimeout(() => {
    zoomType.value = "move";
  }, 2000);
};
// watch(
//   () => props.pointCode,
//   (newVal) => {
//     if (newVal.length > 0) {
//       if (cluster.value) {
//         cluster.value.setMap(null);
//       }
//       initMap();
//     }
//   }
// );
watch(
  () => props.cMapData,
  (newVal) => {
    if (newVal.length > 0) {
      console.log("newVal", newVal);
      setMarkers(newVal);
      // amap.value.setFitView();
    }
  }
);
watch(count, (newCount) => {
  for (let index = 0; index < newCount; index++) {
    if (document.getElementsByClassName("point-box")[index]?.id) {
      document.getElementsByClassName("point-box")[index].id = "point" + index;
    }
  }
});
watch(
  () => props.changeState,
  (newState) => {
    console.log(newState);
    if (newState) {
      console.log(timer1.value);
      console.log(timer2.value);
      if (timer1.value) {
        clearInterval(timer1.value);
        timer1.value = null;
      }
      if (timer2.value) {
        clearTimeout(timer2.value);
        timer2.value = null;
      }
    }
  }
);
watch(randomIndex, (newIndex) => {
  if (document.getElementById("point" + newIndex)) {
    document.getElementById("point" + newIndex)?.classList.add("item-move");
    if (!props.changeState) {
      timer2.value = setTimeout(() => {
        document
          .getElementById("point" + newIndex)
          ?.classList.remove("item-move");
      }, 2500);
    }
  }
});
defineExpose({
  clickMarker,
  chickSearch,
});
</script>
<template>
  <div
    :id="props.mapId"
    :style="{ width: width, height: height }"
    class="common-map"
  ></div>
</template>
<style scoped lang="scss"></style>
<style lang="scss">
.common-map {
  padding-right: 1px;
  .amap-layer {
    width: calc(100% + 1px) !important;
  }
}
.map-clusterMarker {
  width: 40px;
  height: 43px;
  position: relative;
  z-index: 1;
  .map-point-box {
    width: 31px;
    height: 43px;
    position: absolute;
    bottom: 0px;
    left: 0px;
    z-index: 3;
    background-size: 100% 100%;
    transform: scale(1);
    .map-point {
      width: 22.6px;
      height: 22.6px;
      background-color: #fff;
      color: #7dc0cc;
      border-radius: 50%;
      margin-top: 4.4px;
      margin-left: 4.4px;
      text-align: center;
      font-size: 13px;
      line-height: 22.6px;
      font-weight: 900;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .map-build {
    width: 27px;
    height: 19px;
    position: absolute;
    bottom: 0px;
    right: 0px;
    z-index: 2;
  }
}
.item-move {
  animation: move 2s;
  animation-fill-mode: forwards;
}
@keyframes move {
  0% {
    bottom: 0px;
    transform: scale(1);
  }
  50% {
    bottom: 10px;
    transform: scale(1.2);
  }
  100% {
    bottom: 0px;
    transform: scale(1);
  }
}
.amap-logo {
  display: none !important;
}
</style>
