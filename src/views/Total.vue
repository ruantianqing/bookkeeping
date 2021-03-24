<template>
  <Layout class-prefix="layout">
    <!-- topbar -->
    <Topbar />
    <!-- 金额 -->
    <Money />
    <!-- 总计 -->
    <Statistics />
    <Type />
  </Layout>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Provide } from "vue-property-decorator";
import Topbar from "@/components/Total/Topbar.vue";
import Money from "@/components/Total/Money.vue";
import Statistics from "@/components/Total/Statistics.vue";
import Type from "@/components/Total/Type.vue";

@Component({
  // @Component 声明组件
  components: { Type, Statistics, Money, Topbar },
})
export default class Total extends Vue {
  // 父组件不便于向子组件传递数据，就把数据通过provide传递下去，然后子组件通过Inject来获取
  @Provide() eventBus = new Vue();
}
</script>

<style lang="scss" scoped>
@import "~@/assets/style/reset.scss";
</style>