import minimist from "minimist";
import { DateTime } from "luxon";
import MyCalendar from "./MyCalendar.js";

const currentDateTime = DateTime.now();

const args = minimist(process.argv.slice(2), {
  default: {
    m: currentDateTime.month,
    y: currentDateTime.year,
  },
  alias: {
    m: "month",
    y: "year",
  },
});

const month = args.m;
const year = args.y;

const myCalendar = new MyCalendar(year, month);
myCalendar.showCalendar();
