<script setup lang="ts">
import AMapLoader from "@amap/amap-jsapi-loader";
import { commonMapData } from "./cMap";
import buildPng from "@/assets/img/build.png";
import pointPng from "@/assets/img/point.png";
import { Hall } from "@/interface/Hall";
const props = defineProps<{
  mapId: string;
  width: string;
  height: string;
  cMapData: Hall[];
  changeState: boolean;
}>();
const emits = defineEmits<{
  (e: "setProvince", name: string): void;
  (e: "setCity", name: string): void;
}>();
const amap = shallowRef<any>(null);
const amapData = shallowRef<any>(null);
const marker = shallowRef<any>(null);
const polygon = shallowRef<any>(null);
const cluster = shallowRef<any>(null);
const clusterList = shallowRef<any>([]);
const LabelsData = ref<any>([]);
const randomIndex = ref<number>(0);
const timer1 = ref<any>(null);
const timer2 = ref<any>(null);
const countIndex = ref<number>(0);
const count = ref<number>(0);
onMounted(() => {
  formatData(props.cMapData);
  initMap(props.cMapData);
});
onUnmounted(() => {
  if (amap.value) {
    // amap.value.clearEvents("click");
    if (marker.value) {
      amap.value.remove(marker.value);
      marker.value = null;
    }
    if (cluster.value) {
      cluster.value.setMap(null);
      cluster.value = null;
    }
    if (polygon.value) {
      amap.value.remove(polygon.value);
      polygon.value = null;
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
          fillColor: "#eee",
          strokeColor: "#88f",
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
        //5,8,10
        setCluster(newData);
        amap.value.setFitView();
        amap.value.panTo([94, 39]);
        amap.value.setZoom(amap.value.getZoom() + 0.6);
        amap.value.on("zoomchange", mapZoom);
        // amap.value.AmbientLight = new AMap.Lights.AmbientLight([1, 1, 1], 0.5);
        // // 设置平行光源
        // amap.value.DirectionLight = new AMap.Lights.DirectionLight(
        //   [0, 0, 1],
        //   [1, 1, 1],
        //   1
        // );

        // var object3Dlayer = new AMap.Object3DLayer({});
        // amap.value.add(object3Dlayer);

        // var opts = {
        //   subdistrict: 0,
        //   extensions: "all",
        //   level: "country",
        // };

        // //利用行政区查询获取边界
        // var district = new AMap.DistrictSearch(opts);
        // district.search("中国", function (status, result) {
        //   console.log(result);
        //   var bounds = result.districtList[0].boundaries;
        //   var height = 1400000;
        //   var color = "rgba(0,136,255,0.6)"; //rgba
        //   var wall = new AMap.Object3D.Wall({
        //     path: bounds,
        //     height: height,
        //     color: color,
        //   });
        //   wall.backOrFront = "both";
        //   wall.transparent = true;
        //   object3Dlayer.add(wall);
        //   // var prism = new AMap.Object3D.Prism({
        //   //   path: bounds,
        //   //   height: height,
        //   //   color: color,
        //   // });
        //   // prism.transparent = true;
        //   // object3Dlayer.add(prism);
        // });
      });
    })
    .catch((e) => {
      console.log(e);
    });
};
const setCluster = (pointArray) => {
  if (cluster.value) {
    cluster.value.setMap(null);
  }
  let markers: any = [];
  for (var i = 0; i < pointArray.length; i += 1) {
    let lng = parseFloat((pointArray[i].lng + "").replace(",", ""));
    let lat = parseFloat((pointArray[i].lat + "").replace(",", ""));
    markers.push(
      new amapData.value.Marker({
        position: [lng, lat],
        content: `<div class="clusterMarker">
           
            <img src="${buildPng}" class="build"/>
        </div>`,
        // offset: new amapData.value.Pixel(-15, -15),
        extData: {
          ...pointArray[i],
        },
      })
    );
  }
  //  <div class="point-box"  style="background-image:url(${pointPng})">
  // <div class="point">1</div>
  //         </div>
  amap.value.plugin("AMap.MarkerClusterer", function () {
    cluster.value = new amapData.value.MarkerClusterer(amap.value, markers, {
      renderClusterMarker: renderClusterMarker, // 自定义聚合点样式
      zoomOnClick: false,
    });
    //setStyles(styles:Array)
    cluster.value.on("click", clickCluster);
    if (!props.changeState) {
      timer1.value = setInterval(() => {
        if (cluster.value) {
          count.value = cluster.value.getClustersCount();
        } else {
          count.value = 30;
        }
        randomIndex.value = Math.floor(Math.random() * count.value);
      }, 3000);
    }
  });
};
const renderClusterMarker = (context) => {
  context.marker.setContent(
    `<div class="clusterMarker">
        <div class="point-box" style="background-image:url(${pointPng})">
          <div class="point">${context.count}</div>
        </div>
        <img src="${buildPng}" class="build"/>
     </div>`
  );
};
const clickCluster = (obj) => {
  console.log(obj.markers[0]?.w?.extData?.province);
  if (obj.markers[0]?.w?.extData?.province) {
    emits("setProvince", obj.markers[0].w.extData.province);
  }
};
const mapZoom = () => {
  console.log(amap.value.getZoom());
};
// const clearMap = (e) => {
//   amap.value.remove(marker.value);
// };
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
    if (cluster.value) {
      cluster.value.setMap(null);
    }
    if (newVal.length > 0) {
      setCluster(newVal);
      amap.value.setFitView();
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
// defineExpose({
//   setCluster,
// });
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
.clusterMarker {
  width: 78px;
  height: 65px;
  position: relative;
  z-index: 1;
  .point-box {
    width: 47px;
    height: 65px;
    position: absolute;
    bottom: 0px;
    left: 0px;
    z-index: 3;
    background-size: 100% 100%;
    transform: scale(1);
    .point {
      width: 34px;
      height: 34px;
      background-color: #fff;
      color: #7dc0cc;
      border-radius: 50%;
      margin-top: 6.6px;
      margin-left: 6.6px;
      text-align: center;
      font-size: 20px;
      line-height: 34px;
      font-weight: 900;
    }
  }

  .build {
    width: 54px;
    height: 38px;
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
