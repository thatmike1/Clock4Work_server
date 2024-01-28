const admin = require('../firebaseAdmin');
const db = admin.database();
const ref = db.ref('users');

function capitalizeWord(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function createUser(userId, name) {
  const user = {
    [userId]: {
      name: name,
      role: 'asign',
      attendance: {
        years: {
          [new Date().getFullYear()]: {},
        },
      },
    },
  };

  // Get the current year
  const currentYear = new Date().getFullYear();

  // Iterate through all months and create attendance for each
  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    const currentDate = new Date(currentYear, monthIndex, 1);
    const currentMonthKey = getCurrentMonth(currentDate);

    user[userId].attendance.years[currentYear][currentMonthKey] =
      createMonthAttendance(currentDate);
  }

  return user;
}

// Modify getCurrentMonth to accept a date parameter
function getCurrentMonth(date) {
  const month = date.toLocaleString('cs-CZ', { month: 'long' });
  return capitalizeWord(month);
}

// Modify createMonthAttendance to accept a date parameter
function createMonthAttendance(date) {
  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  let attendance = {};
  for (let i = 1; i <= daysInMonth; i++) {
    const day = i < 10 ? `0${i}` : `${i}`;
    attendance[`attendanceId_${day}`] = {
      date: formatDate(new Date(date.getFullYear(), date.getMonth(), i)),
      hoursWorked: '',
      description: '',
      paid: '',
    };
  }
  attendance.sumOfHours = '';
  attendance.sumOfPaid = '';
  return attendance;
}

// Function to format date
function formatDate(date) {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

module.exports = createUser;
