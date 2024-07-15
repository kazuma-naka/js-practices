import { DateTime } from "luxon";

class MyCalendar {
  #year;
  #month;
  constructor(year, month) {
    this.#year = year;
    this.#month = month;
  }

  show() {
    if (this.#year > 2100 || this.#year < 1970) return;
    if (this.#month < 1 || this.#month > 12) return;
    this.#displayCalendarHeader(this.#month, this.#year);
    this.#displayDayofWeek();
    this.#displayDatesOfMonth(this.#month, this.#year);
  }

  #displayCalendarHeader() {
    console.log(`       ${this.#getMonthName(this.#month)} ${this.#year}`);
  }

  #displayDayofWeek() {
    console.log("日 月 火 水 木 金 土");
  }

  #displayDatesOfMonth(month, year) {
    const startOfMonth = DateTime.local(year, month,1);
    const firstWeekDay = startOfMonth.weekday;
    this.#displayFirstWeek(firstWeekDay);
  }

  #displayFirstWeek(firstWeekDay) {
    const startIndex = this.#getStartIndexForFirstWeekDay(firstWeekDay);
    let dates = "";
    for (let i = 0; i < startIndex; i++) {
        dates += "   ";
    }
    for (let i = 1; i <= 7 - startIndex; i++) {
        dates += ' ' + i + " ";
    }
    console.log(dates);
  }

  #getDatesOfMonth(month, year) {
    const startOfMonth = DateTime.local(year, month, 1);
    const endOfMonth = startOfMonth.endOf("month");
    let current = startOfMonth;
    const dates = [];
    while (current <= endOfMonth) {
      dates.push({
        date: current.toISODate(),
        dayOfWeek: current.weekdayLong,
      });
      current = current.plus({ days: 1 });
    }
    return dates;
  }

  #getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return new Intl.DateTimeFormat("ja-JP", { month: "long" }).format(date);
  }

  #getStartIndexForFirstWeekDay(firstWeekDay){
    if(firstWeekDay === 7){
      return 0;
    }else {
      return firstWeekDay;
    }
  }
}

export default MyCalendar;
