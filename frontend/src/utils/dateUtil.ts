const convertDate = (date: Date) => {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [day, month, year].join("-");
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
};
const formatDateTime = (date: Date) => {
  return new Date(date).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
};
const generateDate = () => {
  const date = new Date();

  // Helper function to get the last day of a month
  const getLastDayOfMonth = (year:number, month:number) => new Date(year, month + 1, 0).getDate();

  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const lastDayOfMonth = getLastDayOfMonth(year, month);

  const fromDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;

  let toDate;
  if (day === lastDayOfMonth) {
    // If it's the last day of the month, move to the first day of the next month
    const nextMonth = new Date(year, month + 1, 1);
    toDate = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, "0")}-01`;
  } else {
    // Otherwise, increment the day
    toDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day + 1).padStart(2, "0")}`;
  }

  return {
    fromDate,
    toDate,
  };
};


export { convertDate, formatDate, formatDateTime, generateDate };
