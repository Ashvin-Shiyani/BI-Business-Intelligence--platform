const pool = require('../config/db')

const customers = [
  { name: 'Alice Johnson', email: 'alice@email.com', city: 'Toronto' },
  { name: 'Bob Smith', email: 'bob@email.com', city: 'Vancouver' },
  { name: 'Carol White', email: 'carol@email.com', city: 'Montreal' },
  { name: 'David Brown', email: 'david@email.com', city: 'Calgary' },
  { name: 'Emma Davis', email: 'emma@email.com', city: 'Ottawa' },
]

const products = [
  { name: 'Laptop Pro', category: 'Electronics', price: 1299.99 },
  { name: 'Wireless Mouse', category: 'Electronics', price: 29.99 },
  { name: 'Office Chair', category: 'Furniture', price: 399.99 },
  { name: 'Standing Desk', category: 'Furniture', price: 599.99 },
  { name: 'Coffee Maker', category: 'Appliances', price: 89.99 },
]

async function seed() {
  console.log('Seeding database...')

  for (const c of customers) {
    await pool.query(
      'INSERT INTO customers (name, email, city) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
      [c.name, c.email, c.city]
    )
  }
  console.log(' Customers seeded')

  for (const p of products) {
    await pool.query(
      'INSERT INTO products (name, category, price) VALUES ($1, $2, $3)',
      [p.name, p.category, p.price]
    )
  }
  console.log('Products seeded')

  for (let i = 0; i < 50; i++) {
    const customerId = Math.floor(Math.random() * 5) + 1
    const productId = Math.floor(Math.random() * 5) + 1
    const quantity = Math.floor(Math.random() * 5) + 1
    const price = products[productId - 1].price * quantity
    const date = new Date(2026, Math.floor(Math.random() * 6), Math.floor(Math.random() * 28) + 1)

    await pool.query(
      'INSERT INTO orders (customer_id, product_id, quantity, total_price, order_date) VALUES ($1, $2, $3, $4, $5)',
      [customerId, productId, quantity, price, date]
    )
  }
  console.log(' Orders seeded')
  console.log(' Database seeded successfully!')
  process.exit(0)
}

seed()