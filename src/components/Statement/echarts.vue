<template>
  <div class="wrapper" ref="wrapper"></div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import echarts, { EChartOption, ECharts } from "echarts";

@Component
export default class Chart extends Vue {
  @Prop() options?: EChartOption;
  chart?: ECharts;

  mounted() {
    if (this.options === undefined) {
      return console.error("options 为空");
    }
    this.chart = echarts.init(this.$refs.wrapper as HTMLDivElement); // 基于准备好的dom，初始化echarts实例
    this.chart.setOption(this.options); // 使用刚指定的配置项和数据显示图表
  }

  // 监听配置变化更新配置
  @Watch("options")
  onOptionsChange(newValue: EChartOption) {
    //   如果编译器不能够去除 null或 undefined，你可以使用类型断言手动去除。 语法是添加 !后缀： identifier!从 identifier的类型里去除了 null和 undefined
    this.chart!.setOption(newValue);
  }
}
</script>

<style scoped lang="scss">
.wrapper {
  width: 85vw;
}
</style>
