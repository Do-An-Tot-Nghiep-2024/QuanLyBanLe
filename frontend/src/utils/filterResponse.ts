import currentDate from "../constants/day";

const convertDateFromString = (date: string) => {
  const [day, month, year] = date.split("-").map(Number);
  const res = new Date(year, month - 1, day);
  return res;
};
const filterRessponse = (data: any) => {
  const res = [...(Array.isArray(data) ? data : [])];
  const filter = res?.filter(
    (item: any) => convertDateFromString(item.date) <= currentDate
  );
  return filter;
};
export default filterRessponse;
