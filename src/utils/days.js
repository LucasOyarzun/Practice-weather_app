export const shortWeekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const shortMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const formatCurrentDate = (date) => {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  return `${shortWeekDays[(d.getDay() + 6) % 7]},${day} ${
    shortMonths[month - 1]
  }`;
};
