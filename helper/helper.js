const moment = require("moment");

const datesTillSaturday = (offDays = []) => {
  const today = moment();
  const saturday = today.clone().day(6);

  if (today.day() === 0) {
    saturday.add(7, "days");
  }

  const dates = [];
  let current = today.clone();

  while (current.isSameOrBefore(saturday)) {
    const dayName = current.format("dddd");

    dates.push({
      date: current.toDate(),
      isOffDay: offDays
        .map((d) => d.toLowerCase())
        .includes(dayName.toLowerCase()),
    });
    current.add(1, "day");
  }

  return dates;
};

module.exports = {
  datesTillSaturday,
};
