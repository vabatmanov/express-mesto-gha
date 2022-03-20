//const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
//const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

/*app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));*/

mongoose.connect('mongodb://localhost:27017/mestodb');

/*
app.use('/films', require('./routes/films'));
app.use('/directors', require('./routes/directors'));

app.use(express.static(path.join(__dirname, 'public')));*/

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(PORT, () => {
    console.log('Ссылка на сервер');
});