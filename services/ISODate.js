module.exports = (date) => {
  if (typeof date === 'undefined' || date == null || date === '') {
    return null;
  }
  const newDate = date.split('/');

  const year = newDate[2];
  const month = newDate[1];
  const day = newDate[0];

  // set Date
  const formatDate = new Date(year, month - 1, day, 0, 0, 0, 0);

  // normalize to 1-12 month
  const formatMonth = formatDate.getMonth() + 1;

  // format ISO format
  const ISODate = `${
    formatDate.getFullYear()}-${(
    formatMonth.toString().length === 1 ? '0' : '') + formatMonth}-${(
    formatDate.getDate().toString().length === 1 ? '0' : '') + formatDate.getDate()}`;

  return ISODate;
};
