import { useState, useEffect } from 'react'
import { getKPIs, getRevenueByMonth, getTopProducts, getRevenueByCategory } from './services/api'
import { Line, Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import './App.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

const chartOptions = {
  responsive: true,
  plugins: { legend: { labels: { color: '#aaa' } } },
  scales: { x: { ticks: { color: '#aaa' } }, y: { ticks: { color: '#aaa' } } }
}

export default function App() {
  const [kpis, setKpis] = useState(null)
  const [revenue, setRevenue] = useState([])
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      try {
        const [k, r, p, c] = await Promise.all([
          getKPIs(),
          getRevenueByMonth(),
          getTopProducts(),
          getRevenueByCategory()
        ])
        setKpis(k.data)
        setRevenue(r.data)
        setProducts(p.data)
        setCategories(c.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  if (loading) return <div className="loading">Loading dashboard...</div>

  const revenueData = {
    labels: revenue.map(r => r.month),
    datasets: [{
      label: 'Revenue',
      data: revenue.map(r => r.revenue),
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99,102,241,0.1)',
      tension: 0.4
    }]
  }

  const productsData = {
    labels: products.map(p => p.name),
    datasets: [{
      label: 'Revenue',
      data: products.map(p => p.revenue),
      backgroundColor: ['#6366f1', '#22d3ee', '#f59e0b', '#10b981', '#f43f5e']
    }]
  }

  const categoryData = {
    labels: categories.map(c => c.category),
    datasets: [{
      data: categories.map(c => parseFloat(c.revenue)),
      backgroundColor: ['#6366f1', '#22d3ee', '#f59e0b']
    }]
  }

  return (
    <div className="dashboard">
      <header className="header">
        <h1>BI Platform</h1>
        <p>Business Intelligence Dashboard</p>
      </header>

      <div className="kpi-grid">
        <div className="kpi-card">
          <p>Total Revenue</p>
          <h2>${kpis?.total_revenue?.toLocaleString()}</h2>
        </div>
        <div className="kpi-card">
          <p>Total Orders</p>
          <h2>{kpis?.total_orders}</h2>
        </div>
        <div className="kpi-card">
          <p>Total Customers</p>
          <h2>{kpis?.total_customers}</h2>
        </div>
        <div className="kpi-card">
          <p>Avg Order Value</p>
          <h2>${kpis?.avg_order_value}</h2>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Revenue Over Time</h3>
          <Line data={revenueData} options={chartOptions} />
        </div>
        <div className="chart-card">
          <h3>Top Products</h3>
          <Bar data={productsData} options={chartOptions} />
        </div>
        <div className="chart-card">
          <h3>Revenue by Category</h3>
          <Pie data={categoryData} options={{ responsive: true, plugins: { legend: { labels: { color: '#aaa' } } } }} />
        </div>
      </div>
    </div>
  )
}