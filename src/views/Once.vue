<template>
  <Layout class-prefix="layout">
    <Topbar @update="saveRecord"></Topbar>
    <Tabs @selectedTab="selectedTab"></Tabs>
    <Ico
      :earningArr="earningArr"
      :payArr="payArr"
      @updateSelectedIco="selectedIco"
    ></Ico>
    <Message
      @updateNote="userNote"
      @updateOutput="userOutput"
      @updateShowKeyboard="showKeyboard"
    />
    <Keyboard
      :buttonArr="buttonArr"
      :keyboardIconArr="keyboardIconArr"
      @update="saveRecord"
      @updateOffKeyboard="offKeyboard"
      v-show="isShowKeyboard"
    />
  </Layout>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Provide } from "vue-property-decorator";
import Topbar from "@/components/Once/Topbar.vue";
import Tabs from "@/components/Once/Tabs.vue";
import Ico from "@/components/Once/Ico.vue";
import Message from "@/components/Once/Message.vue";
import Keyboard from "@/components/Once/Keyboard.vue";
import clone from "@/lib/clone"; // 引入深复制函数

@Component({
  components: { Keyboard, Message, Ico, Tabs, Topbar },
})
export default class Once extends Vue {
  @Provide() eventBus = new Vue();

  isShowKeyboard = false;
  recordItem: recordItem = {
    selectedTag: "支出",
    selectedIco: "eat",
    selectedText: "饮食",
    selectedDate: this.selectedDate,
    currentTime: this.$store.state.currentTime,
    output: "",
    note: "",
  };
  // 支出方式数组
  payArr: {} = [
    { name: "eat", text: "饮食" },
    { name: "traffic", text: "交通" },
    { name: "recreation", text: "娱乐" },
    { name: "hospital", text: "医院" },
    { name: "family", text: "家庭" },
    { name: "shop", text: "购物" },
    { name: "other", text: "其他" },
  ];
  // 收入方式数组
  earningArr: {} = [
    { name: "wage", text: "工资" },
    { name: "bonus", text: "奖金" },
    { name: "repayment", text: "还款" },
    { name: "interest", text: "利息" },
    { name: "otherCopy", text: "其他" },
  ];
  // 键盘功能键图表列表
  keyboardIconArr: {} = [
    { name: "backspace" },
    { name: "empty" },
    { name: "true" },
  ];
  // 键盘数字列表
  buttonArr: {} = [
    { text: "1" },
    { text: "2" },
    { text: "3" },
    { text: "4" },
    { text: "5" },
    { text: "6" },
    { text: "7" },
    { text: "8" },
    { text: "9" },
    { text: "." },
    { text: "0" },
    { text: "00" },
  ];

  // 选择的日期
  get selectedDate() {
    return this.$store.state.selectedDate;
  }

  // 保存支出或者消费种类
  selectedIco(icoName: string, icoText: string) {
    this.recordItem.selectedIco = icoName;
    this.recordItem.selectedText = icoText;
  }

  // 保存记账是支出还是收入
  selectedTab(tagName: string) {
    this.recordItem.selectedTag = tagName;
  }

  // 保存用户的输入金额
  userOutput(output: string) {
    if (output == "0") {
      window.alert("请输入金额");
      this.eventBus.$emit("reset");
    }
    if (output == "00") {
      window.alert("请输入金额");
      this.eventBus.$emit("reset");
    }
    if (output == "000") {
      window.alert("请输入金额");
      this.eventBus.$emit("reset");
    }
    this.recordItem.output = output;
  }

  // 更新备注
  userNote(value: string) {
    this.recordItem.note = value;
  }

  // 关闭键盘事件回调函数
  offKeyboard(off: boolean) {
    this.isShowKeyboard = off;
  }

  // 显示键盘
  showKeyboard(showKeyboard: boolean) {
    this.isShowKeyboard = showKeyboard;
  }

  // 保存记录
  saveRecord() {
    if (this.recordItem.selectedTag !== "") {
      if (this.recordItem.selectedIco !== "") {
        if (this.recordItem.output !== "") {
          const newRecordItem = clone(this.recordItem); // 深复制

          this.$store.commit("updateRecordList", newRecordItem); // 更改store中的记账记录
          window.localStorage.setItem(
            // 保存在localStorage中
            "recordList",
            JSON.stringify(this.$store.state.recordList)
          );
          this.eventBus.$emit("reset"); // 保存后重置
          alert("已保存");
        } else {
          window.alert("请输入金额");
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>