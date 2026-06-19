const express = require('express')
const router = express.Router()
const { getKPIs, getRevenueByMonth, getTopProducts, getRevenueByCategory } = require('../controllers/analyticsController')

router.get('/kpi', getKPIs)
router.get('/revenue', getRevenueByMonth)
router.get('/products', getTopProducts)
router.get('/category', getRevenueByCategory)

module.exports = router