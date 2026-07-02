const express = require('express');
const checkToken = require('../middlewares/checkToken');
const router = express.Router();

const userRoutes = require('./userRoutes');
const contestRoutes = require('./contestRoutes');
const chatRoutes = require('./chatRoutes')

router.post('/getUser', checkToken.checkAuth);

router.use('/', userRoutes);
router.use('/', contestRoutes);
router.use('/', chatRoutes);

module.exports = router;
