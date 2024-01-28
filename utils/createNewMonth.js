const admin = require('../firebaseAdmin');
const db = admin.database();

const ref = db.ref('users');

const currentYear = new Date().getFullYear();
const monthRef = db.ref(`${currentYear}`); // ref for index.js after function is done, dont think i need it here

const monthNameToNumber = {
  Leden: '01',
  Únor: '02',
  Březen: '03',
  Duben: '04',
  Květen: '05',
  Červen: '06',
  Červenec: '07',
  Srpen: '08',
  Září: '09',
  Říjen: '10',
  Listopad: '11',
  Prosinec: '12',
};

function capitalizeWord(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function getCurrentMonth() {
  const now = new Date();
  const month = now.toLocaleString('cs-CZ', { month: 'long' });
  const capitalMonth = capitalizeWord(month);
  return `${capitalMonth}`;
}

function formatDate(day, monthName) {
  const month = monthNameToNumber[monthName];
  const year = new Date().getFullYear();
  //   const formattedDay = day < 10 ? `0${day}` : `${day}`;
  return `${day}.${month}.${year}`;
}

function createMonthAttendance(monthName) {
  const daysInMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  ).getDate();
  let attendance = {};
  for (let i = 1; i <= daysInMonth; i++) {
    const day = i < 10 ? `0${i}` : `${i}`;
    attendance[`attendanceId_${day}`] = {
      date: formatDate(day, monthName),
      hoursWorked: '',
      description: '',
      paid: '',
    };
  }
  attendance.sumOfHours = '';
  attendance.sumOfPaid = '';
  return attendance;
}

function createNewMonth(monthName) {
  console.log(`Creating new month ${monthName}`);
  return (month = {
    [monthName]: createMonthAttendance(monthName),
  });
}

module.exports = createNewMonth;
