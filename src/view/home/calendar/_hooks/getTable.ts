//这个hook用于对日程列表的生成进行封装，导出了生成的对应格式的表格数据

import { newPersonSchedule } from '@/service/http/modules/calendar';
import { status, times, contentType, weekStatus } from '../_type/status';

//日程表第一行的内容
const row = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'];
//日程表第一列的内容
const column = [
  '8:00-10:00',
  '10:00-12:00',
  '14:00-16:00',
  '16:00-18:00',
  // '18:00-20:00',
  // '20:00-22:00',
];
//生成日程表的内容
const width = row.length;
const heigh = column.length + 1;
//一个表格雏形
const table: Ref<contentType>[][] = [];
//随机获取一个状态值
let scheduleData: any;
async function getStudyStatus(weekNum: number, dayTime: number) {
  if (weekNum == 0 && dayTime == 0) {
    await newPersonSchedule()
      .then((res) => {
        console.log(res);
        // scheduleData = res.data.data;
        scheduleData = [];
      })
      .then(() => {
        console.log(`${scheduleData[weekStatus[weekNum]]}`[dayTime]);
        return +`${scheduleData[weekStatus[weekNum]]}`[dayTime];
      });
  } else {
    return +`${scheduleData[weekStatus[weekNum]]}`[dayTime - 1];
  }
}

//根据第一行与第一列的长度填充状态与坐标
for (let i = 0; i < width; i++) {
  table[i] = [];
  for (let j = 0; j < heigh; j++) {
    let state = await getStudyStatus(i, j);
    if (state === status.outside) state = status.nothing;
    table[i][j] = ref({
      state,
      x: i,
      y: j,
      time: times.future,
      name: '',
      checked: false,
    });
  }
}
//填充第一行与第一列的内容
row.forEach((day, index) => {
  table[index][0].value.name = day;
  table[index][0].value.state = status.outside;
});
column.forEach((when, index) => {
  table[0][index + 1].value.name = when;
  table[0][index + 1].value.state = status.outside;
});
//获取当前时间
const now = new Date();
const day = ((now.getDay() + 6) % 7) + 1;
//将过去日期的时间状态改为old
for (let i = 1; i < width; i++) {
  if (i < day) {
    for (let j = 1; j < heigh; j++) {
      table[i][j].value.time = times.past;
    }
  }
}
//将小时转换为对应的日程时间段
let hour = Math.floor(now.getHours() / 2 - 3);
//如果此时在工作时间段内，则将对应时间的状态改为now

if (!(hour < 0 || hour === 3 || hour > heigh)) {
  if (hour > 3 && hour <= heigh) {
    hour--;
  }
  table[day][hour].value.time = times.now;
  for (let j = 1; j < hour; j++) {
    table[day][j].value.time = times.past;
  }
}

export { row, column, table };
