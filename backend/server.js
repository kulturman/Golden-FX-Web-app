require("dotenv").config();
require('express-async-errors');
const express = require("express");
const app = express();
const cors = require('cors');
const path = require('path');
const PORT = process.env.NODE_PORT;
const errorMiddleware = require('./middlewares/error');

app.use(cors());
app.use(express.json());
require('./startup/routes')(app);
require('./startup/logging')();

if(process.env.NODE_ENV !== 'development') {
    app.use(express.static(path.resolve(__dirname , '..' , 'client' , 'build')));
    app.get('*' , (req , res) => {
        return res.sendFile(path.resolve(__dirname , '..' , 'client' , 'build' , 'index.html'));
    })
    app.use(errorMiddleware);
}

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
