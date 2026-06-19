const express = require('express')
const cors = require('cors')
const pool = require('./config/db')

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
  const result = await pool.query('SELECT NOW()')
  res.json({ message: 'BI Platform API is running!', db_time: result.rows[0].now })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})