import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const ANALYTICS_URL = import.meta.env.VITE_ANALYTICS_URL || 'http://127.0.0.1:8000'

const api = axios.create({ baseURL: API_BASE_URL })
const analyticsApi = axios.create({ baseURL: ANALYTICS_URL })

export const getKPIs = () => api.get('/api/analytics/kpi')
export const getRevenueByMonth = () => api.get('/api/analytics/revenue')
export const getTopProducts = () => api.get('/api/analytics/products')
export const getRevenueByCategory = () => api.get('/api/analytics/category')
export const getForecast = () => analyticsApi.get('/analytics/forecast')
export const getAnomalies = () => analyticsApi.get('/analytics/anomalies')
export const getKPISummary = () => analyticsApi.get('/analytics/kpi/summary')