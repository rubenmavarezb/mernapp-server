const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors')

//Creating the server
const app = express();

//Connecting to the DB
connectDB();

//Enable cors
app.use(cors());

//Able express.json
app.use(express.json({ extended: true }));

//App port, it's assigned by Heroku. In case it doesn't exists, then the port will be 4000
const port = process.env.PORT || 4000;

//importing routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));


//Starting app
app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running in this port: ${port}`);
})