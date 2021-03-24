<template>
  <div class="month">
    <span
      :class="[
        {
          'month-class': isCurrentMonth(
            getDateHtml(day.year, day.month, day.day)
          ),
        },
        { todayBg: isCurrentDay(getDateHtml(day.year, day.month, day.day)) },
        { selected: changeType(day) === selectedDate },
      ]"
      :key="index"
      @click="handleClickDay(day)"
      v-for="(day, index) in calendarArr"
    >
      {{ formatDate(day.day) }}
    </span>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import helper from "@/components/Record/Calendar/helper";

@Component
export default class SwiperItem extends Vue {
  // 从swiper.vue组件中接收date参数
  @Prop() date!: { year: number; month: number; day: number };

  //从store中取出选中的日期
  get selectedDate() {
    return this.$store.state.selectedDate;
  }

  // 返回对象格式的年月日
  get dateObject() {
    const date = new Date(this.date.year, this.date.month, 1);
    return {
      year: date.getFullYear(),
      month: date.getMonth(),
      day: date.getDate(),
    };
  }

  // 返回当前月的第一天
  get currentFirstDay() {
    return helper.getDate(this.dateObject.year, this.dateObject.month, 1); // 日期的day设为0，返回一月中的最后一天，设为1，返回第一天
  }

  // 返回星期中的第几天
  get weekDay() {
    return this.currentFirstDay.getDay();
  }

  get startTime() {
    return this.currentFirstDay.getDate() - this.weekDay;
  }

  // 如果当月的第一天是星期五或者星期六或者星期天的话，页面一共要显示42天（6*7），否则的话页面要显示35（5*7）天
  get monthDayNum() {
    return this.weekDay === 5 || this.weekDay === 6 || this.weekDay === 7
      ? 42
      : 35;
  }

  // 返回一页的日期列表
  get calendarArr() {
    const arr = [];
    for (let i = 0; i < this.monthDayNum; i++) {
      arr.push({
        year: this.dateObject.year,
        month: this.dateObject.month,
        day: this.startTime + i,
      });
    }
    return arr;
  }

  // 返回当前的日期
  changeType(day: any) {
    const dateObject = helper.getDate(day.year, day.month, day.day);
    const object = helper.getNewDate(dateObject);
    return object.year + "-" + (object.month + 1) + "-" + object.day;
  }

  // 返回当前月份的最后一天
  currentMonthMaxDay = () => {
    const date = this.date;
    return new Date(date.year, date.month + 1, 0).getDate(); // 日期的day设为0，返回一月中的最后一天，设为1，返回第一天
  };

  // 返回上个月的最后一天
  prevMonthEndDay = () => {
    const date = this.date;
    const currentMonthLastDay = new Date(
      date.year,
      date.month + 1,
      0
    ).getDate(); // 当前月的最后一天
    const end = new Date(date.year, date.month, currentMonthLastDay);
    return end.getDate();
  };

  getDateHtml = (year: number, month: number, day: number) => {
    return new Date(year, month, day);
  };

  // 格式化显示日期
  formatDate = (date: number | string) => {
    date = Number(date);
    if (date < 0) {
      // 属于上一个月
      date = this.prevMonthEndDay() + date;
    } else if (date === 0) {
      // 上个月最后一天
      date = this.prevMonthEndDay();
    } else if (date === 1) {
      // 本月
      const ddd = this.dateObject.month + 1;
      if (ddd < 10) {
        date = `0${ddd}` + "月";
      }
      if (ddd >= 10) {
        date = ddd + "月";
      }
    } else if (date > this.currentMonthMaxDay()) {
      // 下个月
      if (date - this.currentMonthMaxDay() === 1) {
        const temp = this.dateObject.month + 2;
        if (temp <= 9) {
          date = `0${temp}` + "月";
        }

        if (temp == 10) {
          date = `${temp}` + "月";
        }
        if (temp == 11) {
          date = `${temp}` + "月";
        }
        if (temp == 12) {
          date = `${temp}` + "月";
        }
        if (temp > 12) {
          date = `0${temp - 12}` + "月";
        }
      } else {
        date = date - this.currentMonthMaxDay();
      }
    }
    return date < 10 ? `0${date}` : date;
  };

  // 是否是本月
  isCurrentMonth(date: Date) {
    const { year: currentYear, month: currentMonth } = helper.getNewDate(
      helper.getDate(this.date.year, this.date.month, 1)
    );
    const { year, month } = helper.getNewDate(date);

    return currentYear === year && currentMonth === month;
  }

  // 是否是今天
  isCurrentDay(date: Date) {
    const {
      year: currentYear,
      month: currentMonth,
      day: currentDay,
    } = helper.getNewDate(
      helper.getDate(this.date.year, this.date.month, this.date.day)
    );
    const { year, month, day } = helper.getNewDate(date);
    return currentYear === year && currentMonth === month && currentDay === day;
  }

  // 操作点击日期，将选中的日期存储在store中
  handleClickDay(day: { year: number; month: number; day: number }) {
    this.$store.commit("handleClickDay", day);
  }
}
</script>

<style lang="scss" scoped>
@import "~@/assets/style/helper.scss";

.month {
  margin-top: 50px;
  padding-bottom: 50px;
  display: flex;
  max-width: 100vw;
  min-width: 14.2857%;
  justify-content: space-between;
  flex-wrap: wrap;

  > span {
    height: 14.2857vw;
    width: 14.2857vw;
    font-size: 12px;
    color: $color-gray;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 10px;

    &:nth-child(7n).month-class {
      color: $color-graygreen;
    }

    &:nth-child(7n-6).month-class {
      color: $color-grayred;
    }

    &.selected::before {
      position: absolute;
      content: " ";
      left: 7px;
      right: 7px;
      top: 7px;
      bottom: 7px;
      border: $color-blueborder;
      border-radius: 50%;
    }
  }

  > .month-class {
    color: $color-normal;
  }

  > .todayBg {
    background: $todayBg;
    border-radius: 50%;
    background-clip: content-box;
  }
}
</style>