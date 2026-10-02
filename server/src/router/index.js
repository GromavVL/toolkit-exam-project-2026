const express = require('express');
const userRoutes = require('./userRoutes');
const contestRoutes = require('./contestRoutes');
const chatRoutes = require('./chatRoutes')

const router = express.Router();

router.use('/', userRoutes);
router.use('/', contestRoutes);
router.use('/', chatRoutes);

module.exports = router;
