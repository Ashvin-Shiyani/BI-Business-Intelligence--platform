const pool = require('../config/db')
const { parseCSV } = require('../utils/csvParser')
const fs = require('fs')

const uploadCSV = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })

    const rows = await parseCSV(req.file.path)

    if (rows.length === 0) return res.status(400).json({ error: 'CSV file is empty' })

    const columns = Object.keys(rows[0]).map(c => c.toLowerCase().trim())
    let inserted = 0

    for (const row of rows) {
      const values = Object.values(row).map(v => v.trim())

      if (columns.includes('customer_id') && columns.includes('product_id')) {
        const customerIdx = columns.indexOf('customer_id')
        const productIdx = columns.indexOf('product_id')
        const quantityIdx = columns.indexOf('quantity')
        const priceIdx = columns.indexOf('total_price')
        const dateIdx = columns.indexOf('order_date')

        await pool.query(
          'INSERT INTO orders (customer_id, product_id, quantity, total_price, order_date) VALUES ($1, $2, $3, $4, $5)',
          [
            values[customerIdx],
            values[productIdx],
            values[quantityIdx] || 1,
            values[priceIdx],
            values[dateIdx] || new Date()
          ]
        )
        inserted++
      }
    }

    fs.unlinkSync(req.file.path)

    res.json({
      message: `Successfully imported ${inserted} records`,
      total_rows: rows.length,
      inserted
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { uploadCSV }