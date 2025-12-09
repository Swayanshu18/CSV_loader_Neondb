const express = require('express');
const { getSales, getFilters } = require('../controllers/salesController');

const router = express.Router();

router.get('/', getSales);
router.get('/filters', getFilters);

module.exports = router;
