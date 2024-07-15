import { DateTime } from "luxon";

class MyCalendar {
  #year;
  #month;
  constructor(year, month) {
    this.#year = year;
    this.#month = month;
    if (month === true) {
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
    const startOfMonth = DateTime.local(year, month, 1);
    const endOfMonth = startOfMonth.endOf("month").day;
    this.#displayRestOfDates(year, month, endOfMonth);
  }

  #displayRestOfDates(year, month, endOfMonth) {
    let daysInString = "";
    for (let date = 1; date <= endOfMonth; date++) {
      const weekDay = DateTime.local(year, month, date).weekday;
      if (date === 1) {
        const startIndex = weekDay % 7;
        for (let i = 0; i < startIndex; i++) {
          daysInString += "   ";
        }
      }
      daysInString = daysInString + " " + date.toString().padStart(2, " ");
      if (weekDay === 6) {
        daysInString = daysInString + "\n";
      }
    }
    console.log(daysInString);
  }

  #getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return new Intl.DateTimeFormat("ja-JP", { month: "long" }).format(date);
  }
}

export default MyCalendar;
