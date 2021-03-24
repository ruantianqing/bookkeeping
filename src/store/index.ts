import Vue from 'vue'
import Vuex from 'vuex'
import helper from '@/components/Record/Calendar/helper';

Vue.use(Vuex)

function format(number: any) {
    return number < 10 ? `0${number}` : number
}
const date = helper.getNewDate(new Date())
const time = helper.getCurrentTime(new Date())
export default new Vuex.Store({
    state: {
        selectedDate: date.year + '-' + (date.month + 1) + '-' + date.day,
        currentTime: format(time.hours) + ':' + format(time.minutes),
        recordList: localStorage.recordList ? JSON.parse(localStorage.recordList) : []
    },
    mutations: {
        // 更改选中的日期
        handleClickDay(state, day: { year: number; month: number; day: number }) {
            const temp = helper.getNewDate(new Date(day.year, day.month, day.day))
            state.selectedDate = temp.year + '-' + (temp.month + 1) + '-' + temp.day
        },
        // 更新记录
        updateRecordList(state, recordItem) {
            // 将新记录合并到记录数组。concat() 方法用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组
            state.recordList = state.recordList.concat(recordItem)
        },

    },
    actions: {
    },
    modules: {
    }
})
