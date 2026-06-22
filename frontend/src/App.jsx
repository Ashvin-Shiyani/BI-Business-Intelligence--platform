import { useState, useEffect } from 'react'
import CSVUploader from './components/CSVuploader'
import { getKPIs, getRevenueByMonth, getTopProducts, getRevenueByCategory, getForecast, getAnomalies } from './services/api'
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
  const [forecast, setForecast] = useState(null)
  const [anomalies, setAnomalies] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      try {
        const [k, r, p, c, f, a] = await Promise.all([
          getKPIs(),
          getRevenueByMonth(),
          getTopProducts(),
          getRevenueByCategory(),
          getForecast(),
          getAnomalies()
        ])
        setKpis(k.data)
        setRevenue(r.data)
        setProducts(p.data)
        setCategories(c.data)
        setForecast(f.data)
        setAnomalies(a.data)
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

  const forecastData = forecast ? {
    labels: [
      ...forecast.historical.map(h => h.month),
      ...forecast.forecast.map(f => f.month)
    ],
    datasets: [
      {
        label: 'Historical Revenue',
        data: [
          ...forecast.historical.map(h => h.revenue),
          ...forecast.forecast.map(() => null)
        ],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99,102,241,0.1)',
        tension: 0.4
      },
      {
        label: 'Forecasted Revenue',
        data: [
          ...forecast.historical.map(() => null),
          ...forecast.forecast.map(f => f.predicted_revenue)
        ],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245,158,11,0.1)',
        borderDash: [5, 5],
        tension: 0.4
      }
    ]
  } : null

  return (
    <div className="dashboard">
      <header className="header">
        <h1>BI Platform</h1>
        <p>Business Intelligence Dashboard</p>
      </header>
      <CSVUploader onUploadSuccess={() => window.location.reload()} />

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
        {forecastData && (
          <div className="chart-card">
            <h3>Revenue Forecast <span className={`trend ${forecast.trend}`}>{forecast.trend === 'up' ? 'Trending Up' : 'Trending Down'}</span></h3>
            <Line data={forecastData} options={chartOptions} />
          </div>
        )}
      </div>

      {anomalies && anomalies.anomalies.length > 0 && (
        <div className="anomaly-card">
          <h3>Anomalies Detected</h3>
          <p>Days with unusual sales activity:</p>
          <div className="anomaly-list">
            {anomalies.anomalies.map((a, i) => (
              <div key={i} className="anomaly-item">
                <span>{a.date}</span>
                <span>${parseFloat(a.daily_revenue).toLocaleString()}</span>
                <span className="z-score">Z-Score: {parseFloat(a.z_score).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}