## Getting Started

### Prerequisites
- Node.js v20+
- Python 3.9+
- PostgreSQL 15+

### 1. Clone the repo
```bash
git clone https://github.com/Ashvin-Shiyani/BI-Business-Intelligence--platform.git
cd BI-Business-Intelligence--platform
```

### 2. Set up the database
```bash
psql postgres -c "CREATE DATABASE bi_platform;"
psql bi_platform -f database/schema.sql
```

### 3. Start the backend
```bash
cd backend
npm install
node src/server.js &
```

### 4. Seed the database (optional)
```bash
node src/utils/seedData.js
```

### 5. Start the Python analytics engine
```bash
cd analytics
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --port 8000 --reload
```

### 6. Start the frontend
```bash
cd frontend
npm install
npm run dev
```

### 7. Open the app

## CSV Format

To upload your own data, use a CSV with these columns:
## Author
Ashvin Shiyani — [GitHub](https://github.com/Ashvin-Shiyani) 
[Portfolio](https://ashvin-shiyani.github.io/Portfolio)