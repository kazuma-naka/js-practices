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
    const dateStartOfMonth = this.#getDatesOfMonth(month, year)[0].dayOfWeek;
    let datesOfMonthInString = "";
    for (
      let i = this.#displayFirstDayOfWeek(dateStartOfMonth) + 1;
      i < this.#getDatesOfMonth(month, year).length;
      i++
    ) {
      if (i < 10) {
        if (this.#getDayName(month, year, i) === "Saturday") {
          datesOfMonthInString += ` ${i}` + "  " + "\n";
        } else {
          datesOfMonthInString += ` ${i}` + " ";
        }
      } else {
        if (this.#getDayName(month, year, i) === "Saturday") {
          datesOfMonthInString += `${i}` + " " + "\n";
        } else {
          datesOfMonthInString += `${i}` + " ";
        }
      }
    }
    console.log(`${datesOfMonthInString}`);
  }

  #displayFirstDayOfWeek(dateStartOfMonth) {
    switch (dateStartOfMonth) {
      case "Sunday":
        console.log(" 1  2  3  4  5  6  7");
        return 7;
      case "Monday":
        console.log("    1  2  3  4  5  6");
        return 6;
      case "Tuesday":
        console.log("       1  2  3  4  5");
        return 5;
      case "Wednesday":
        console.log("          1  2  3  4");
        return 4;
      case "Thursday":
        console.log("             1  2  3");
        return 3;
      case "Friday":
        console.log("                1  2");
        return 2;
      case "Saturday":
        console.log("                   1");
        return 1;
      default:
        break;
    }
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

  #getDayName(month, year, day) {
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(date);
  }
}

export default MyCalendar;
