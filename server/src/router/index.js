const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const contestRoutes = require('./contestRoutes');
const chatRoutes = require('./chatRoutes')

router.use('/', userRoutes);
router.use('/', contestRoutes);
router.use('/', chatRoutes);

module.exports = router;
