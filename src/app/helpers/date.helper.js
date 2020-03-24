import { addHours, addDays, addMonths, startOfHour } from 'date-fns';

const periodMonth = ({ period, dateCurrent }) => {
  return addMonths(startOfHour(dateCurrent), period * -1);
};

const periodDay = ({ period, dateCurrent }) => {
  return addDays(startOfHour(dateCurrent), period * -1);
};

const periodHour = ({ period, dateCurrent }) => {
  return addHours(startOfHour(dateCurrent), period * -1);
};

export default {
  periodMonth,
  periodDay,
  periodHour,
};
