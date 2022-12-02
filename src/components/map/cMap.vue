<script setup lang="ts">
import AMapLoader from "@amap/amap-jsapi-loader";
import { cMapData } from "./cMap";
const props = defineProps<{
  mapId: string;
  width: string;
  height: string;
  pointArray?: any;
  pointCode?: any;
  type?: string;
}>();
const emits = defineEmits<{
  (e: "setName", name: string, address: any): void;
  (e: "searchEvent", lng: number, lat: number): void;
}>();
const amap = shallowRef<any>(null);
const amapData = shallowRef<any>(null);
const marker = shallowRef<any>(null);
const polygon = shallowRef<any>(null);
const cluster = shallowRef<any>(null);
const LabelsData = ref<any>([]);
const count = ref<number>(0);
onMounted(() => {
  count.value = cMapData.points.length;
  formatData();
  initMap();
});
// onUnmounted(() => {
//   if (amap.value) {
//     amap.value.clearEvents("click");
//     if (marker.value) {
//       amap.value.remove(marker.value);
//       marker.value = null;
//     }
//     if (cluster.value) {
//       cluster.value.setMap(null);
//       cluster.value = null;
//     }
//     if (polygon.value) {
//       amap.value.remove(polygon.value);
//       polygon.value = null;
//     }
//     amapData.value = null;
//     amap.value.destroy();
//     amap.value = null;
//     console.log(polygon.value);
//   }
// });
// const initPath = () => {
//   if (polygon.value) {
//     amap.value.remove(polygon.value);
//   }
//   let adCode = domain.value?.regionCode.substring(0, 6);
//   amap.value.plugin("AMap.DistrictSearch", function () {
//     new amapData.value.DistrictSearch({
//       extensions: "all",
//       subdistrict: 0,
//     }).search(adCode, function (status, result) {
//       // 外多边形坐标数组和内多边形坐标数组
//       // const canvas = document.createElement("canvas");
//       // const ctx: any = canvas.getContext("2d");
//       // // 将 canvas 宽高设置为地图实例的宽高
//       // canvas.width = amap.value.getSize().width;
//       // canvas.height = amap.value.getSize().height;
//       // const image = new Image();
//       // image.src = homePng;
//       // image.onload = function (event) {
//       //   ctx.drawImage(
//       //     image,
//       //     0,
//       //     0,
//       //     amap.value.getSize().width,
//       //     amap.value.getSize().height
//       //   );
//       //   // 创建一个自定义图层
//       //   var customLayer = new amapData.value.CustomLayer(canvas, {
//       //     zIndex: 12,
//       //   });
//       var outer = [
//         new amapData.value.LngLat(-360, 90, true),
//         new amapData.value.LngLat(-360, -90, true),
//         new amapData.value.LngLat(360, -90, true),
//         new amapData.value.LngLat(360, 90, true),
//       ];
//       var holes = result.districtList[0].boundaries;
//       var pathArray = [outer];
//       pathArray.push.apply(pathArray, holes);
//       polygon.value = new amapData.value.Polygon({
//         pathL: pathArray,
//         strokeColor: props.type === "screen" ? "#0a071a" : "#a0cfff", //城市边界颜色
//         strokeWeight: 2,
//         fillColor: props.type === "screen" ? "#0a071a" : "#a0cfff", // 遮罩背景色黑色
//         fillOpacity: 1,
//       });
//       polygon.value.setPath(pathArray);
//       // amap.value.add(customLayer);
//       amap.value.add(polygon.value);
//       // };
//     });
//   });
// };
// let SOC = "CHN";
// let colors = {};
const formatData = () => {
  for (let i = 0; i < cMapData.districts.length; i++) {
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
    let district = cMapData.districts[i];
    let name = district.name;
    config.text.content = name;
    config.position = district.center.split(",");
    if (cMapData.directions[name]) {
      config.text.direction = cMapData.directions[name];
    }
    LabelsData.value.push(config);
  }
};

// const getColorByDGP = (adcode) => {
//   if (!colors[adcode]) {
//     var gdp = cMapData.GDPSpeed[adcode];
//     if (!gdp) {
//       colors[adcode] = "rgb(227,227,227)";
//     } else {
//       var rg = 255 - Math.floor(((gdp - 5) / 5) * 255);
//       colors[adcode] = "rgb(" + rg + "," + rg + ",255)";
//     }
//   }
//   return colors[adcode];
// };

const initMap = () => {
  AMapLoader.load({
    key: "70beeffb8fc9537f6d450fd3747b70c9", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "1.4.15", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.Geocoder", "AMap.DistrictSearch", "AMap.MarkerClusterer"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
  })
    .then((AMap) => {
      // var disCountry = new AMap.DistrictLayer.Country({
      //   zIndex: 10,
      //   SOC: "CHN",
      //   depth: 2,
      //   styles: {
      //     "nation-stroke": "white",
      //     "coastline-stroke": "white",
      //     "province-stroke": "rgba(0,0,0,0.3)",
      //     "city-stroke": "rgba(0,0,0,0.03)", //中国特有字段
      //     // "city-stroke": "#333",
      //     // fill: "#fff",
      //     // function (props) {
      //     //   //中国特有字段
      //     //   // return getColorByDGP(props.adcode_pro);
      //     //   return getColorByDGP(props.adcode_pro);
      //     // },
      //   },
      // });
      // 绘制世界地图国家轮廓
      // var disWorld = new AMap.DistrictLayer.World({
      //   zIndex: 10,
      //   styles: {
      //     // 颜色格式: #RRGGBB、rgba()、rgb()、[r, g, b, a]
      //     // 国境线
      //     //'nation-stroke': nationStroke,
      //     // 海岸线
      //     //'coastline-stroke': '',
      //     // 填充
      //     fill: function (props) {
      //       if (props.SOC == "CHN") {
      //         return "rgba(255,255,25)";
      //       } else {
      //         return "white";
      //       }
      //     },
      //   },
      // });
      amap.value = new AMap.Map(props.mapId, {
        center: [118, 38],
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
        setCluster(cMapData.points);

        // amap.value.AmbientLight = new AMap.Lights.AmbientLight([1, 1, 1], 0.5);
        // // 设置平行光源
        // amap.value.DirectionLight = new AMap.Lights.DirectionLight(
        //   [0, 0, 1],
        //   [1, 1, 1],
        //   1
        // );

        var object3Dlayer = new AMap.Object3DLayer({});
        amap.value.add(object3Dlayer);

        var opts = {
          subdistrict: 0,
          extensions: "all",
          level: "country",
        };

        //利用行政区查询获取边界
        var district = new AMap.DistrictSearch(opts);
        district.search("中国", function (status, result) {
          console.log(result);
          var bounds = result.districtList[0].boundaries;
          var height = 1400000;
          var color = "rgba(0,136,255,0.6)"; //rgba
          var wall = new AMap.Object3D.Wall({
            path: bounds,
            height: height,
            color: color,
          });
          wall.backOrFront = "both";
          wall.transparent = true;
          object3Dlayer.add(wall);
          // var prism = new AMap.Object3D.Prism({
          //   path: bounds,
          //   height: height,
          //   color: color,
          // });
          // prism.transparent = true;
          // object3Dlayer.add(prism);
        });
      });
      // ,
      // console.log(map.value);
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
    markers.push(
      new amapData.value.Marker({
        position: pointArray[i]["lnglat"],
        content:
          '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
        offset: new amapData.value.Pixel(-15, -15),
      })
    );
  }
  amap.value.plugin("AMap.MarkerClusterer", function () {
    console.log(amapData.value, amap.value);
    cluster.value = new amapData.value.MarkerClusterer(amap.value, markers, {
      renderClusterMarker: renderClusterMarker, // 自定义聚合点样式
      // renderMarker: renderMarker, // 自定义非聚合点样式
      gridSize: 60,
    });
    // cluster.value.on("click", clickCluster);
  });
};
const renderClusterMarker = (context) => {
  var factor = Math.pow(context.count / count.value, 1 / 18);
  var div = document.createElement("div");
  var Hue = 180 - factor * 180;
  var bgColor = "hsla(" + Hue + ",100%,50%,0.7)";
  var fontColor = "hsla(" + Hue + ",100%,20%,1)";
  var borderColor = "hsla(" + Hue + ",100%,40%,1)";
  var shadowColor = "hsla(" + Hue + ",100%,50%,1)";
  div.style.backgroundColor = bgColor;
  var size = Math.round(30 + Math.pow(context.count / count.value, 1 / 5) * 20);
  div.style.width = div.style.height = size + "px";
  div.style.border = "solid 1px " + borderColor;
  div.style.borderRadius = size / 2 + "px";
  div.style.boxShadow = "0 0 1px " + shadowColor;
  div.innerHTML = context.count;
  div.style.lineHeight = size + "px";
  div.style.color = fontColor;
  div.style.fontSize = "14px";
  div.style.textAlign = "center";
  context.marker.setOffset(new amapData.value.Pixel(-size / 2, -size / 2));
  context.marker.setContent(div);
};
const renderMarker = (context) => {
  var content =
    '<div style="background-color: hsla(180, 100%, 50%, 0.3); height: 18px; width: 18px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 3px;"></div>';
  var offset = new amapData.value.Pixel(-9, -9);
  context.marker.setContent(content);
  context.marker.setOffset(offset);
};
// const clickCluster = (e) => {
//   // e.stopPropagation();
//   console.log(e);
//   console.log(parseInt(amap.value.getZoom()));
//   console.log(e.lnglat.lng, e.lnglat.lat);
//   if (e.clusterData.length === 1) {
//     console.log(e.clusterData);
//   } else {
//     amap.value.setZoom(amap.value.getZoom() + 1);
//     amap.value.setCenter([e.lnglat.lng, e.lnglat.lat]);
//   }
// };
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
// watch(
//   () => props.pointArray,
//   (newVal) => {
//     if (newVal.length > 0) {
//       if (cluster.value) {
//         cluster.value.setMap(null);
//       }
//       initMap();
//     }
//   }
// );
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
</style>
