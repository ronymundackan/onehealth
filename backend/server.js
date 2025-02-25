// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users'); // Import users routes
const hospitalsRoutes = require('./routes/hospitals');



dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(bodyParser.json());
 // Correct: using the middleware function

app.use('/auth', authRoutes);
app.use('/users', usersRoutes); // Mount users routes
app.use('/hospitals', hospitalsRoutes); // Mount hospitals routes

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});