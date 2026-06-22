import { useState } from 'react'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default function CSVUploader({ onUploadSuccess }) {
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [uploadedFile, setUploadedFile] = useState(null)

  const handleUpload = async (file) => {
    if (!file) return
    setLoading(true)
    setResult(null)
    setError(null)
    setUploadedFile(file)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await axios.post(`${API_BASE_URL}/api/upload/csv`, formData)
      setResult(res.data)
      setTimeout(() => onUploadSuccess(), 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    return (bytes / 1024).toFixed(2) + ' KB'
  }

  const handleRemove = () => {
    setUploadedFile(null)
    setResult(null)
    setError(null)
  }

  return (
    <div className="uploader-card">
      <h3>Upload Sales Data</h3>
      <p>Upload a CSV file with columns: customer_id, product_id, quantity, total_price, order_date</p>

      {!uploadedFile ? (
        <div
          className={`drop-zone ${dragging ? 'dragging' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleUpload(e.dataTransfer.files[0]) }}
          onClick={() => document.getElementById('csv-input').click()}
        >
          <div className="drop-icon">↑</div>
          <p>Drop file here</p>
          <p>or <span className="browse-link">Select file</span></p>
          <input
            id="csv-input"
            type="file"
            accept=".csv"
            style={{ display: 'none' }}
            onChange={(e) => handleUpload(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="file-preview">
          <div className="file-icon">CSV</div>
          <div className="file-info">
            <p className="file-name">{uploadedFile.name}</p>
            <p className="file-size">{formatSize(uploadedFile.size)}</p>
            {loading && <p className="file-status uploading">Uploading...</p>}
            {result && <p className="file-status success">Successfully imported {result.inserted} records</p>}
            {error && <p className="file-status error">{error}</p>}
          </div>
          <button className="remove-btn" onClick={handleRemove}>x</button>
        </div>
      )}
    </div>
  )
}