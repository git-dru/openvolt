function areDatesEqual(dateStr1, dateStr2) {
  const date1 = new Date(dateStr1);
  const date2 = new Date(dateStr2);

  return date1.getTime() === date2.getTime();
}

module.exports = areDatesEqual