<template>
  <!-- slideChangeTransitionEnd回调函数，swiper从一个slide过渡到另一个slide结束时执行,可选Swiper实例作为参数 -->
  <swiper
    :options="swiperOption"
    class="swiper"
    @slideChangeTransitionEnd="slideChangeTransitionEnd"
    ref="mySwiper"
  >
    <!-- 总览 -->
    <swiper-slide>
      <TagRecordList
        :data="this.childPages[0]"
        :top="this.topRecordList"
      ></TagRecordList>
    </swiper-slide>
    <!-- 明细 -->
    <swiper-slide>
      <DateRecordList
        :data="this.childPages[1]"
        :earningMonthTotal="this.earningMonthTotal"
        :payMonthTotal="this.payMonthTotal"
      ></DateRecordList>
    </swiper-slide>
    <!-- 类别 -->
    <swiper-slide>
      <IcoRecordList :data="this.childPages[2]"></IcoRecordList>
    </swiper-slide>
    <!-- 排行 -->
    <swiper-slide>
      <OutputRecordList :data="this.childPages[3]"></OutputRecordList>
    </swiper-slide>
  </swiper>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Inject, Provide, Watch } from "vue-property-decorator";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/swiper-bundle.css";
// 引入swiper配置
import SwiperOptions from "@/components/Statement/Swiper/SwiperOptions"; //
import TagRecordList from "@/components/Statement/Swiper/SwiprIterm/Tag/TagRecordList.vue";
import DateRecordList from "@/components/Statement/Swiper/SwiprIterm/Date/DateRecordList.vue";
import IcoRecordList from "@/components/Statement/Swiper/SwiprIterm/IcoRecordList.vue";
import OutputRecordList from "@/components/Statement/Swiper/SwiprIterm/Output/OutputRecordList.vue";

@Component({
  components: {
    OutputRecordList,
    IcoRecordList,
    DateRecordList,
    TagRecordList,
    Swiper,
    SwiperSlide,
  },
})
export default class Swiper2 extends Vue {
  @Inject() eventBus!: Vue;

  index = 0;

  swiperOption: {} = SwiperOptions;
  /*
                要传四个参数
                1. 按支出收入 => 总览 => recordList.selectedTag
                2. 按时间排序 => 明细 => recordList.selectedDate
                3. 按类别排序 => 类别 => recordList.selectedIco
                4. 按金额排序 => 排行 => recordList.output
        */

  childPages: Record<string, any> = [
    {
      tagRecordList: [this.earning, this.pay, this.earningTotal, this.payTotal], // 收入，支出，收入总和， 支出总和
    },
    { dateRecordList: this.dateRecordList }, // 根据时间排序的记账记录
    { icoRecordList: [this.earningTotal, this.payTotal, this.balance] }, // 收入总和，支出总和，余额
    { outputRecordList: this.outputRecordList }, // 支出大小排序，由大到小
  ];

  payMonthArr: string[] = [
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
  ];
  earningMonthArr: string[] = [
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
  ];

  // 发布事件更改轮播Index,可选Swiper实例作为参数,realIndex:当前活动块的索引
  slideChangeTransitionEnd(swiper: any) {
    this.eventBus.$emit("changeIndex", swiper.realIndex);
  }

  mounted() {
    // 订阅components/statement/Item.vue组件的updateIndex事件，更新swiper的index
    this.eventBus.$on("updateIndex", (index: number) => {
      this.mySwiper.slideTo(index + 1, 100);
    });
  }

  // TS 不识别，没办法
  get mySwiper() {
    return (this.$refs.mySwiper as Vue & { $swiper: any }).$swiper;
  }
  // 获取记账记录
  get recordList() {
    return this.$store.state.recordList;
  }

  // 获取支出记录数组并按照创记账日期排序
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

  // 获取支出总和
  get payTotal() {
    return this.pay.reduce((sum: number, item: { output: string }) => {
      return sum + Number(item.output);
    }, 0);
  }

  // 获取收入记录数组并且按照记账日期排序
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

  // 获取收入总和
  get earningTotal() {
    return this.earning.reduce((sum: number, item: { output: string }) => {
      return sum + Number(item.output);
    }, 0);
  }
  // 获取余额
  get balance() {
    return this.earningTotal - this.payTotal;
  }
  // 获取根据时间排序的记账记录
  get dateRecordList() {
    return this.recordList.concat([]).sort((a: recordItem, b: recordItem) => {
      return (
        new Date(b.selectedDate).getTime() - new Date(a.selectedDate).getTime()
      );
    });
  }
  // 获取根据记账类型的首字母ascii排序
  get icoRecordList() {
    return this.recordList.concat([]).sort((a: recordItem, b: recordItem) => {
      return a.selectedIco > b.selectedIco ? 1 : -1;
    });
  }

  // 根据支出大小排序，从大到小
  get outputRecordList() {
    return this.recordList.concat([]).sort((a: recordItem, b: recordItem) => {
      return parseInt(a.output) > parseInt(b.output) ? -1 : 1;
    });
  }

  // 截取支出排序前三个
  get topRecordList() {
    return this.outputRecordList.slice(0, 3);
  }

  // 获取每月的支出总和
  get payMonthTotal() {
    this.pay.forEach((i: { selectedDate: string; output: string }) => {
      const index = new Date(i.selectedDate).getMonth();
      this.payMonthArr[index] =
        parseInt(this.payMonthArr[index]) + parseInt(i.output) + "";
    });
    return this.payMonthArr;
  }

  // 获取每月的收入总和
  get earningMonthTotal() {
    this.earning.forEach((i: { selectedDate: string; output: string }) => {
      const index = new Date(i.selectedDate).getMonth();
      this.earningMonthArr[index] =
        parseInt(this.earningMonthArr[index]) + parseInt(i.output) + "";
    });
    return this.earningMonthArr;
  }
}
</script>


<style lang="scss" scoped>
.swiper {
  margin-top: 25px;
  width: 100vw;

  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    background-position: center;
    background-size: cover;
    color: #fff;
  }
}
</style>