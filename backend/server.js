// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users'); // Import users routes
const hospitalsRoutes = require('./routes/hospitals');
const doctorsRoutes = require('./routes/doctors'); // Import doctors routes
const appointmentRoutes = require('./routes/appointments')
const recordsRoutes = require('./routes/records'); // Import the new routes
const allergieRoutes = require('./routes/allergies'); // Import the new routes

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(bodyParser.json());
 // Correct: using the middleware function

app.use('/auth', authRoutes);
app.use('/users', usersRoutes); // Mount users routes
app.use('/hospitals', hospitalsRoutes); // Mount hospitals routes
app.use('/doctors', doctorsRoutes); // Corrected base path
app.use('/appointments', appointmentRoutes)
app.use('/records', recordsRoutes); // Use the new routes
app.use('/allergies', allergieRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});