import { DateTime } from "luxon";

class MyCalendar {
  #year;
  #month;
  constructor(year, month) {
    this.#year = year;
    this.#month = month;
    if(month === true){
      this.#month = 1;
    }
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
    console.log(" 日 月 火 水 木 金 土");
  }

  #displayDatesOfMonth(month, year) {
    const startOfMonth = DateTime.local(year, month,1);
    const endOfMonth = startOfMonth.endOf('month');
    const firstWeekDay = startOfMonth.weekday;
    const allDatesInMonth = this.#getAllDatesInMonth(startOfMonth,endOfMonth);
    this.#displayFirstWeek(firstWeekDay);
    this.#displayRestOfDates(year, month, firstWeekDay, allDatesInMonth)
  }

  #displayFirstWeek(firstWeekDay) {
    const startIndex = this.#getStartIndexForFirstWeekDay(firstWeekDay);
    let dates = "";
    for (let i = 0; i < startIndex; i++) {
        dates += "    ";
    }
    for (let i = 1; i <= 7 - startIndex; i++) {
        dates += ' ' + i + " ";
    }
    console.log(dates);
  }

  #displayRestOfDates(year, month, firstWeekDay,allDatesInMonth){
    const numberOfDatesInFirstWeek = this.#getNumberOfDatesInFirstWeek(firstWeekDay);
    let daysInString = '';
    for(let date = numberOfDatesInFirstWeek; date < allDatesInMonth.length + 1; date++){
      const weekDay = DateTime.local(year,month,date).weekday;
      daysInString = daysInString + ' ' + date.toString().padStart(2,' ');;
      if(weekDay === 6){
        daysInString = daysInString + '\n';
      }
    }
    console.log(daysInString);
  }

  #getAllDatesInMonth(startOfMonth, endOfMonth){
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

  #getNumberOfDatesInFirstWeek(firstWeekDay){
    if(firstWeekDay === 7){
      return firstWeekDay + 1;
    }else{
      return 8 - firstWeekDay;
    }
  }

}

export default MyCalendar;
