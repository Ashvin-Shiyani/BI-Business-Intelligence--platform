const pool = require('../config/db')

// Total revenue, orders, customers, avg order value
const getKPIs = async (req, res) => {
  try {
    const revenue = await pool.query('SELECT SUM(total_price) as total_revenue FROM orders')
    const orders = await pool.query('SELECT COUNT(*) as total_orders FROM orders')
    const customers = await pool.query('SELECT COUNT(*) as total_customers FROM customers')
    const avgOrder = await pool.query('SELECT AVG(total_price) as avg_order_value FROM orders')

    res.json({
      total_revenue: parseFloat(revenue.rows[0].total_revenue),
      total_orders: parseInt(orders.rows[0].total_orders),
      total_customers: parseInt(customers.rows[0].total_customers),
      avg_order_value: parseFloat(avgOrder.rows[0].avg_order_value).toFixed(2)
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Revenue by month
const getRevenueByMonth = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        TO_CHAR(order_date, 'YYYY-MM') as month,
        SUM(total_price) as revenue
      FROM orders
      GROUP BY month
      ORDER BY month ASC
    `)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Top products by revenue
const getTopProducts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.name,
        SUM(o.total_price) as revenue,
        SUM(o.quantity) as units_sold
      FROM orders o
      JOIN products p ON o.product_id = p.id
      GROUP BY p.name
      ORDER BY revenue DESC
    `)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Revenue by category
const getRevenueByCategory = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        p.category,
        SUM(o.total_price) as revenue
      FROM orders o
      JOIN products p ON o.product_id = p.id
      GROUP BY p.category
      ORDER BY revenue DESC
    `)
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { getKPIs, getRevenueByMonth, getTopProducts, getRevenueByCategory }