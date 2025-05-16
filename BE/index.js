require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const database = require('./src/config/database');
const routes = require('./src/routes/index.route');
const {errorHandler, notFound} = require('./src/middlewares/error.middleware');

const app = express();
const port = process.env.PORT || 3000;

database.connect();

app.use(cors());
app.use(express.json());

routes(app);

app.use(notFound);
app.use(errorHandler);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
