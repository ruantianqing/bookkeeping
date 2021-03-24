<template>
  <div class="keyboard">
    <!-- 键盘title -->
    <div class="title">
      <span></span>
      <span>Moze安全键盘</span>
      <span @click="offKeyboard">↓</span>
    </div>
    <!-- 键盘 -->
    <div class="key">
      <!-- 键盘数字部分 -->
      <div @click="inputContent" class="number">
        <button :key="button.text" v-for="button in buttonArr">
          {{ button.text }}
        </button>
      </div>
      <!-- 键盘功能部分 -->
      <div class="function">
        <div
          :key="name.name"
          @click="matching(name.name)"
          class="icon-warp"
          v-for="name in keyboardIconArr"
        >
          <Icon :name="name.name" class="icon"> </Icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Inject, Prop } from "vue-property-decorator";

@Component
export default class Keyboard extends Vue {
  @Inject() eventBus!: Vue;
  @Prop() keyboardIconArr!: [{}]; // 键盘功能键图表列表
  @Prop() buttonArr!: [{}]; // 键盘数字列表

  output = "";
  offkeyboard = false;

  created() {
    this.eventBus.$on("initOutput", (output: string) => {
      // 绑定了initOutput事件，在Message.vue中触发initOutput事件
      this.output = output;
    });
  }

  // 按键盘数字键进行输入
  inputContent(event: MouseEvent) {
    const button = event.target as HTMLButtonElement;
    const input = button.textContent!.trim();
    if (this.output.length === 8) {
      return;
    }
    if (this.output === "0") {
      if ("0123456789".indexOf(input) >= 0) {
        this.output = input;
        this.updateOutput();
      } else {
        this.output += input;
        this.updateOutput();
      }
      return;
    }
    if (this.output.indexOf(".") >= 0 && input === ".") {
      return;
    }
    this.output += input;
    this.updateOutput();
  }

  // 按键盘功能键进行操作，name是功能键图表名称
  matching(name: string) {
    if (name === "backspace") {
      this.remove();
    }
    if (name === "empty") {
      this.clear();
    }
    if (name === "true") {
      this.ok();
    }
  }
  mounted() {
    this.eventBus.$on("reset", () => {
      this.output = "";
    });
  }

  // 键盘删除功能键
  remove() {
    if (this.output.length === 1) {
      this.output = "0";
      this.updateOutput();
    } else {
      this.output = this.output.slice(0, -1);
      this.updateOutput();
    }
  }

  // 键盘清除功能键，清除输入
  clear() {
    this.output = "0";
    this.updateOutput();
  }

  // 键盘ok功能键，输入完成并且提交输入
  ok() {
    this.updateOutput();
    this.offKeyboard();
    this.$emit("update");
    this.output = "";
    this.updateOutput();
  }

  updateOutput() {
    this.eventBus.$emit("updateOutput", this.output); // 更新金额输出，触发updateOutput事件，在Once.vue组件中监听此事件
  }

  offKeyboard() {
    this.$emit("updateOffKeyboard", this.offkeyboard); // 关闭键盘，在Once.vue组件中监听此事件
  }
}
</script>

<style lang="scss" scoped>
@import "Keyboard";
</style>