<template>
  <div class="statistics">
    <div class="content">
      <span class="text"><Icon name="directory" /> 总计 </span>
      <span class="placeholder"></span>
    </div>
    <echarts :options="totalOptions" class="total"></echarts>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Inject } from "vue-property-decorator";
import Echarts from "@/components/Statement/echarts.vue";

@Component({
  components: { Echarts },
})
export default class Statistics extends Vue {
  @Inject() eventBus!: Vue;

  created() {
    this.eventBus.$emit("updateBalance", this.balance);
  }
  // 余额
  get balance() {
    return this.earningTotal - this.payTotal;
  }
  // 从store中获取账单的存取记录，recordList是一个数组，里面是存储每一条记录的对象
  get recordList() {
    return this.$store.state.recordList;
  }

  // 获取支出的记录并且按照时间排序
  get pay() {
    return this.recordList
      .filter((i: { selectedTag: string }) => i.selectedTag === "支出")
      .sort((a: any, b: any) => {
        return (
          new Date(b.selectedDate).getTime() -
          new Date(a.selectedDate).getTime()
        );
      });
  }

  // 获取支出的金额总和
  get payTotal() {
    return this.pay.reduce((sum: number, item: { output: string }) => {
      return sum + Number(item.output);
    }, 0);
  }

  // 获取收入的记录并且按照时间排序
  get earning() {
    return this.recordList
      .filter((i: { selectedTag: string }) => i.selectedTag === "收入")
      .sort((a: any, b: any) => {
        return (
          new Date(b.selectedDate).getTime() -
          new Date(a.selectedDate).getTime()
        );
      });
  }

  // 获取收入的金额总和
  get earningTotal() {
    return this.earning.reduce((sum: number, item: { output: string }) => {
      return sum + Number(item.output);
    }, 0);
  }

  // echart的配置
  get totalOptions() {
    return {
      dataset: {
        source: [
          ["sum", "type"],
          [this.earningTotal, "收入"],
          [this.payTotal, "支出"],
          [this.earningTotal - this.payTotal, "余额"],
        ],
      },
      grid: {
        top: "15%", // grid 组件离容器上侧的距离
        bottom: "10%",
        left: "22%",
        right: "3%",
        width: "66%",
      },
      xAxis: {
        // 直角坐标系 grid 中的 x 轴
        name: "元",
        show: false, // 是否显示 x 轴
        splitLine: { show: false }, // 坐标轴在 grid 区域中的分隔线
        axisLabel: {
          // 坐标轴刻度标签的相关设置
          color: "#999",
        },
        axisTick: {
          //x轴刻度线
          show: false, // 是否显示坐标轴刻度
        },
        axisLine: {
          //x轴
          show: false, // 是否显示坐标轴轴线
        },
      },
      yAxis: {
        type: "category",
        //maxInterval: 300,
        splitLine: { show: false },
        fontSize: "35",
        axisLabel: {
          margin: 12,
          textStyle: {
            fontSize: 12, //更改坐标轴文字大小
          },
          color: function (params: any, index: any) {
            const colorList = ["#9fd26a", "#ea5e69", "#a4789f"];
            return colorList[index];
          },
        },
        axisTick: {
          //y轴刻度线
          show: false,
        },
        axisLine: {
          //y轴
          show: false,
        },
      },
      series: [
        {
          type: "bar", // 柱状图（或称条形图）是一种通过柱形的高度
          barWidth: 7,
          encode: {
            // 以定义 data 的哪个维度被编码成什么
            // Map the "sum" column to X axis.
            x: "sum",
            // Map the "type" column to Y axis
            y: "type",
          },

          itemStyle: {
            // 图形样式
            normal: {
              label: {
                formatter: "￥" + "{@sum}" + "元",
                show: true,
                position: "right",
                textStyle: {
                  fontWeight: "bolder",
                  fontSize: "8",
                  color: "#fff",
                },
              },
              /*
                                随机显示
                                color:function(d){
                                    return "#"+Math.floor(Math.random()*(256*256*256-1)).toString(16);
                                }*/

              /*定制显示（按顺序）*/
              color: function (params: any) {
                const colorList = ["#9fd26a", "#ea5e69", "#a4789f"];
                return colorList[params.dataIndex];
              },
            },
          },
        },
      ],
    };
  }
}
</script>

<style lang="scss" scoped>
.statistics {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  > .total {
    height: 80px;
    width: 100vw;
  }
  > .content {
    display: flex;
    justify-content: space-around;
    align-items: center;
    > .text {
      display: flex;
      flex-direction: row;
      align-items: center;
      text-align: center;
      > .icon {
        margin-right: 5px;
      }
    }
  }
}
</style>