const express = require('express');
const cors = require('cors');
const patch = require('path')
const router = require('./router');
const handlerError = require('./handlerError/handler');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/public/images', express.static(patch.resolve(__dirname, '..', '..', 'public/images')));
app.use(router);
app.use(handlerError);

module.exports = app;
