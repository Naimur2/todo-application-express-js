const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const todoHandler = require('./routeHandler/todoHandler');
const userHandler = require('./routeHandler/userHandler');

// initialize the app
const app = express();
dotenv.config();
app.use(express.json());

// detabase connection with mongoose
mongoose
    .connect('mongodb://localhost:27017/todos')
    .then(() => console.log('connection successful'))
    .catch((err) => console.log(err));

// application routs
app.use('/todo', todoHandler);
app.use('/user', userHandler);

// default error handler
const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    return res.status(500).json({ error: err });
};

app.listen(3000, () => {
    console.log('app listining at port 3000');
});
