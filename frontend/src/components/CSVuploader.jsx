import { useState } from 'react'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function CSVUploader({ onUploadSuccess }) {
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const handleUpload = async (file) => {
    if (!file) return
    setLoading(true)
    setMessage(null)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await axios.post(`${API_BASE_URL}/api/upload/csv`, formData)
      setMessage(res.data.message)
      onUploadSuccess()
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="uploader-card">
      <h3>Upload Sales Data</h3>
      <p>Upload a CSV file with columns: customer_id, product_id, quantity, total_price, order_date</p>
      <div
        className={`drop-zone ${dragging ? 'dragging' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleUpload(e.dataTransfer.files[0]) }}
        onClick={() => document.getElementById('csv-input').click()}
      >
        {loading ? 'Uploading...' : 'Drag & drop a CSV file here or click to browse'}
        <input
          id="csv-input"
          type="file"
          accept=".csv"
          style={{ display: 'none' }}
          onChange={(e) => handleUpload(e.target.files[0])}
        />
      </div>
      {message && <p className="upload-success">{message}</p>}
      {error && <p className="upload-error">{error}</p>}
    </div>
  )
}