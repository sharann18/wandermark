const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const pinRoute = require('./routes/pins');
const userRoute = require('./routes/users');

const app = express();
dotenv.config();

app.use(express.json());

app.use(cors());

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log('mongodb connected...'))
    .catch((error) => console.log(error));


app.use('/api/pins', pinRoute);
app.use('/api/users', userRoute);

app.listen(8800, () => {
    console.log('server is running...');
});