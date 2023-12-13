const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const pinRoute = require('./routes/pins');
const userRoute = require('./routes/users');
const PORT = process.env.PORT || 8800

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

app.listen(PORT, () => {
    console.log('server is running...');
});
