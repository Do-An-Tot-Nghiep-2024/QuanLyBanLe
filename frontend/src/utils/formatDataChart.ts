const DataFormater = (number: number) => {
  if (number > 1000000000) {
    return (number / 1000000000).toString() + "Tỉ";
  } else if (number > 1000000) {
    return (number / 1000000).toString() + "M";
  } else if (number > 1000) {
    return (number / 1000).toString() + "K";
  } else {
    return number.toString();
  }
};

export default DataFormater;
