const { Pool } = require('pg')

const pool = new Pool({
  database: 'bi_platform',
  host: 'localhost',
  port: 5432,
})

module.exports = pool