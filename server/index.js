const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const createUser = require('./utils/createUser');
const createNewMonth = require('./utils/createNewMonth');
require('dotenv').config();

const admin = require('./firebaseAdmin');
const db = admin.database();
const ref = db.ref('users');

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.post('/createUser', (req, res) => {
  const { userId, name } = req.body;
  const user = createUser(userId, name);

  ref.update(user, (error) => {
    if (error) {
      console.error('Error updating database:', error);
      res.status(500).send('Error updating database:', error);
    } else {
      console.log('Database updated successfully');
      res.status(200).json({ message: 'Database updated successfully' });
    }
  });
});

// app.post('/add-new-month', (req, res) => {
//   const { uid, month } = req.body;
//   const newMonth = createNewMonth(uid, month); //create a function to do this
// });
app.post('/createNewMonthForUser', (req, res) => {
  const { userId, monthName } = req.body;

  if (!userId || !monthName) {
    return res.status(400).json({ error: 'Missing userId or monthName' });
  }

  const year = new Date().getFullYear();
  const monthRef = db.ref(`users/${userId}/attendance/years/${year}`);

  try {
    const newMonthData = createNewMonth(monthName);

    monthRef.update(newMonthData, (error) => {
      if (error) {
        console.error('Error updating database:', error);
        res.status(500).send('Error updating database:', error);
      } else {
        console.log('Database updated successfully');
        res
          .status(200)
          .json({ message: 'Database updated successfully', newMonthData });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000; // Use the PORT environment variable if it's set, otherwise use 5000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
